from datetime import date, timedelta, datetime
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api.deps import get_db, get_current_user, require_professional_or_admin, require_admin
from app.models.user import User
from app.models.farm import Farm
from app.models.animal import Animal
from app.models.health_report import HealthReport
from app.models.vaccination import Vaccination
from app.models.disease_incident import DiseaseIncident
from app.models.professional_review import ProfessionalReview
from app.models.activity_log import ActivityLog
from app.schemas.dashboard import FarmerDashboardOut, ProfessionalDashboardOut, AdminDashboardOut

router = APIRouter(prefix="/dashboard", tags=["Dashboard Analytics"])

@router.get("/farmer", response_model=FarmerDashboardOut)
def get_farmer_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    in_30_days = today + timedelta(days=30)

    # Farmer's farm IDs
    farm_ids = [f.id for f in db.query(Farm.id).filter(Farm.owner_id == current_user.id).all()]

    if not farm_ids:
        return FarmerDashboardOut(
            total_livestock=0,
            healthy_animals=0,
            animals_requiring_attention=0,
            sick_animals=0,
            quarantined_animals=0,
            submitted_reports=0,
            pending_professional_reviews=0,
            upcoming_vaccinations=0,
            overdue_vaccinations=0,
            health_status_distribution=[],
            breed_distribution=[],
            reports_timeline=[],
            recent_activity=[],
            vaccination_completion_percentage=100.0
        )

    # Animal counts
    total_livestock = db.query(Animal).filter(Animal.farm_id.in_(farm_ids), Animal.is_active == True).count()
    healthy_animals = db.query(Animal).filter(Animal.farm_id.in_(farm_ids), Animal.is_active == True, Animal.health_status == "healthy").count()
    monitoring = db.query(Animal).filter(Animal.farm_id.in_(farm_ids), Animal.is_active == True, Animal.health_status == "monitoring").count()
    sick_animals = db.query(Animal).filter(Animal.farm_id.in_(farm_ids), Animal.is_active == True, Animal.health_status == "sick").count()
    quarantined = db.query(Animal).filter(Animal.farm_id.in_(farm_ids), Animal.is_active == True, Animal.health_status == "quarantined").count()
    requiring_attention = monitoring + sick_animals + quarantined

    # Health status distribution
    health_status_distribution = [
        {"name": "Healthy", "value": healthy_animals, "color": "#10B981"},
        {"name": "Monitoring", "value": monitoring, "color": "#F59E0B"},
        {"name": "Sick", "value": sick_animals, "color": "#EF4444"},
        {"name": "Quarantined", "value": quarantined, "color": "#8B5CF6"}
    ]

    # Breed distribution
    breeds_query = db.query(Animal.breed, func.count(Animal.id)).filter(
        Animal.farm_id.in_(farm_ids),
        Animal.is_active == True
    ).group_by(Animal.breed).all()
    breed_colors = ["#1B4332", "#2D6A4F", "#40916C", "#52B788", "#74C69D", "#B7E4C7"]
    breed_distribution = [
        {"name": b[0], "value": b[1], "color": breed_colors[i % len(breed_colors)]}
        for i, b in enumerate(breeds_query)
    ]

    # Reports counts
    submitted_reports = db.query(HealthReport).filter(HealthReport.farm_id.in_(farm_ids)).count()
    pending_reviews = db.query(HealthReport).filter(
        HealthReport.farm_id.in_(farm_ids),
        HealthReport.status.in_(["Submitted", "Professional Review Required", "Under Review"])
    ).count()

    # Vaccinations counts
    upcoming_vacs = db.query(Vaccination).filter(
        Vaccination.farm_id.in_(farm_ids),
        Vaccination.next_due_date >= today,
        Vaccination.next_due_date <= in_30_days
    ).count()

    overdue_vacs = db.query(Vaccination).filter(
        Vaccination.farm_id.in_(farm_ids),
        Vaccination.next_due_date < today,
        Vaccination.status != "completed"
    ).count()

    total_vacs = db.query(Vaccination).filter(Vaccination.farm_id.in_(farm_ids)).count()
    completed_vacs = db.query(Vaccination).filter(Vaccination.farm_id.in_(farm_ids), Vaccination.status == "completed").count()
    vac_completion_rate = round((completed_vacs / total_vacs * 100), 1) if total_vacs > 0 else 100.0

    # Reports timeline (last 7 days)
    timeline_days = 7
    reports_timeline = []
    for i in range(timeline_days - 1, -1, -1):
        day_date = today - timedelta(days=i)
        next_day = day_date + timedelta(days=1)
        count = db.query(HealthReport).filter(
            HealthReport.farm_id.in_(farm_ids),
            HealthReport.created_at >= datetime.combine(day_date, datetime.min.time()),
            HealthReport.created_at < datetime.combine(next_day, datetime.min.time())
        ).count()
        reports_timeline.append({"date": day_date.strftime("%d %b"), "count": count})

    # Recent activity
    activities = db.query(ActivityLog).filter(
        ActivityLog.user_id == current_user.id
    ).order_by(ActivityLog.created_at.desc()).limit(8).all()
    recent_activity = [{
        "action": a.action,
        "details": a.details,
        "created_at": a.created_at.strftime("%Y-%m-%d %H:%M")
    } for a in activities]

    return FarmerDashboardOut(
        total_livestock=total_livestock,
        healthy_animals=healthy_animals,
        animals_requiring_attention=requiring_attention,
        sick_animals=sick_animals,
        quarantined_animals=quarantined,
        submitted_reports=submitted_reports,
        pending_professional_reviews=pending_reviews,
        upcoming_vaccinations=upcoming_vacs,
        overdue_vaccinations=overdue_vacs,
        health_status_distribution=health_status_distribution,
        breed_distribution=breed_distribution,
        reports_timeline=reports_timeline,
        recent_activity=recent_activity,
        vaccination_completion_percentage=vac_completion_rate
    )

@router.get("/professional", response_model=ProfessionalDashboardOut)
def get_professional_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_professional_or_admin)
):
    pending_reviews_count = db.query(HealthReport).filter(
        HealthReport.status.in_(["Submitted", "Professional Review Required", "Under Review"])
    ).count()

    urgent_reports_count = db.query(HealthReport).filter(
        HealthReport.risk_category.in_(["Urgent Attention Required", "High Risk"]),
        HealthReport.status.in_(["Submitted", "Professional Review Required", "Under Review"])
    ).count()

    total_reviewed_count = db.query(ProfessionalReview).filter(
        ProfessionalReview.reviewer_id == current_user.id
    ).count()

    active_incidents_count = db.query(DiseaseIncident).filter(
        DiseaseIncident.status == "Active"
    ).count()

    # Recent reports requiring attention
    reports = db.query(HealthReport).order_by(HealthReport.created_at.desc()).limit(6).all()
    recent_reports = [{
        "id": r.id,
        "reference_number": r.reference_number,
        "farm_name": r.farm.name if r.farm else "Unknown Farm",
        "province": r.farm.province if r.farm else "Unknown",
        "animal_tag": r.animal.tag_number if r.animal else "Herd observation",
        "risk_category": r.risk_category,
        "status": r.status,
        "created_at": r.created_at.strftime("%Y-%m-%d %H:%M")
    } for r in reports]

    # Incidents by province
    prov_query = db.query(DiseaseIncident.province, func.count(DiseaseIncident.id)).group_by(DiseaseIncident.province).all()
    incidents_by_province = [{"name": p[0], "value": p[1]} for p in prov_query]

    # Reports by risk
    risk_query = db.query(HealthReport.risk_category, func.count(HealthReport.id)).group_by(HealthReport.risk_category).all()
    risk_colors = {
        "Low Risk": "#10B981",
        "Moderate Risk": "#F59E0B",
        "High Risk": "#F97316",
        "Urgent Attention Required": "#EF4444"
    }
    reports_by_risk = [
        {"name": r[0], "value": r[1], "color": risk_colors.get(r[0], "#6B7280")}
        for r in risk_query
    ]

    return ProfessionalDashboardOut(
        pending_reviews_count=pending_reviews_count,
        urgent_reports_count=urgent_reports_count,
        total_reviewed_count=total_reviewed_count,
        active_incidents_count=active_incidents_count,
        recent_reports=recent_reports,
        incidents_by_province=incidents_by_province,
        reports_by_risk=reports_by_risk
    )

@router.get("/admin", response_model=AdminDashboardOut)
def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    total_users = db.query(User).count()
    farmers_count = db.query(User).filter(User.role == "farmer").count()
    professionals_count = db.query(User).filter(User.role == "professional").count()
    admins_count = db.query(User).filter(User.role == "admin").count()

    total_farms = db.query(Farm).count()
    total_livestock = db.query(Animal).filter(Animal.is_active == True).count()
    total_reports = db.query(HealthReport).count()
    total_incidents = db.query(DiseaseIncident).count()
    active_incidents = db.query(DiseaseIncident).filter(DiseaseIncident.status == "Active").count()

    activities = db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(10).all()
    recent_activities = [{
        "action": a.action,
        "entity_type": a.entity_type,
        "details": a.details,
        "created_at": a.created_at.strftime("%Y-%m-%d %H:%M")
    } for a in activities]

    return AdminDashboardOut(
        total_users=total_users,
        farmers_count=farmers_count,
        professionals_count=professionals_count,
        administrators_count=admins_count,
        total_farms=total_farms,
        total_livestock=total_livestock,
        total_health_reports=total_reports,
        total_incidents=total_incidents,
        active_incidents=active_incidents,
        recent_activities=recent_activities
    )
