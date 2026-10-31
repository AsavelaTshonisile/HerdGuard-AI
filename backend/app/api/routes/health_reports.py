import json
import random
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, require_professional_or_admin
from app.models.health_report import HealthReport
from app.models.professional_review import ProfessionalReview
from app.models.farm import Farm
from app.models.animal import Animal
from app.models.user import User
from app.schemas.health_report import (
    HealthReportCreate,
    HealthReportUpdate,
    HealthReportOut,
    HealthReportReviewCreate,
    ProfessionalReviewOut,
    AIAssessmentDetail
)
from app.ai.risk_assessment_engine import RiskAssessmentEngine
from app.services.activity_service import log_activity
from app.services.notification_service import create_notification

router = APIRouter(prefix="/health-reports", tags=["Health Reports"])

def _format_report_out(report: HealthReport) -> HealthReportOut:
    try:
        symptoms_list = json.loads(report.symptoms) if report.symptoms else []
    except Exception:
        symptoms_list = [report.symptoms] if report.symptoms else []

    ai_detail = None
    if report.ai_assessment_json:
        try:
            ai_data = json.loads(report.ai_assessment_json)
            ai_detail = AIAssessmentDetail(**ai_data)
        except Exception:
            pass

    reviews_out = []
    if report.reviews:
        for rev in report.reviews:
            r_out = ProfessionalReviewOut.model_validate(rev)
            r_out.reviewer_name = rev.reviewer.full_name if rev.reviewer else "Officer"
            reviews_out.append(r_out)

    return HealthReportOut(
        id=report.id,
        reference_number=report.reference_number,
        farm_id=report.farm_id,
        farm_name=report.farm.name if report.farm else None,
        animal_id=report.animal_id,
        animal_tag=report.animal.tag_number if report.animal else None,
        reporter_id=report.reporter_id,
        reporter_name=report.reporter.full_name if report.reporter else None,
        symptoms=symptoms_list,
        first_noticed_date=report.first_noticed_date,
        severity=report.severity,
        duration_days=report.duration_days,
        additional_observations=report.additional_observations,
        photo_url=report.photo_url,
        risk_category=report.risk_category,
        ai_assessment=ai_detail,
        status=report.status,
        created_at=report.created_at,
        updated_at=report.updated_at,
        reviews=reviews_out
    )

@router.post("", response_model=HealthReportOut, status_code=status.HTTP_201_CREATED)
def create_health_report(
    report_in: HealthReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify farm exists
    farm = db.query(Farm).filter(Farm.id == report_in.farm_id).first()
    if not farm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Specified farm does not exist.")

    if current_user.role == "farmer" and farm.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only submit health reports for your own registered farms."
        )

    animal = None
    if report_in.animal_id:
        animal = db.query(Animal).filter(Animal.id == report_in.animal_id).first()
        if not animal:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Specified animal does not exist.")
        if animal.farm_id != farm.id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Selected animal does not belong to the specified farm.")

    # Execute AI Risk Assessment Engine
    assessment = RiskAssessmentEngine.assess_health_risk(
        symptoms=report_in.symptoms,
        severity=report_in.severity,
        duration_days=report_in.duration_days,
        species=animal.species if animal else "cattle",
        breed=animal.breed if animal else None,
        age_months=animal.approximate_age_months if animal else None,
        province=farm.province
    )

    risk_category = assessment["risk_category"]
    
    # Generate unique reference number: HG-REP-YYYY-XXXX
    year = datetime.now(timezone.utc).year
    rand_num = random.randint(1000, 9999)
    ref_num = f"HG-{year}-{rand_num}"
    while db.query(HealthReport).filter(HealthReport.reference_number == ref_num).first():
        rand_num = random.randint(1000, 9999)
        ref_num = f"HG-{year}-{rand_num}"

    initial_status = "Professional Review Required" if risk_category in ["High Risk", "Urgent Attention Required"] else "Submitted"

    new_report = HealthReport(
        reference_number=ref_num,
        farm_id=farm.id,
        animal_id=animal.id if animal else None,
        reporter_id=current_user.id,
        symptoms=json.dumps(report_in.symptoms),
        first_noticed_date=report_in.first_noticed_date,
        severity=report_in.severity,
        duration_days=report_in.duration_days,
        additional_observations=report_in.additional_observations,
        photo_url=report_in.photo_url,
        risk_category=risk_category,
        ai_assessment_json=json.dumps(assessment),
        status=initial_status
    )
    db.add(new_report)

    # Update animal status if linked
    if animal:
        if risk_category in ["Urgent Attention Required", "High Risk"]:
            animal.health_status = "sick"
        elif risk_category == "Moderate Risk":
            animal.health_status = "monitoring"

    db.commit()
    db.refresh(new_report)

    # Log activity
    log_activity(
        db,
        user_id=current_user.id,
        action="SUBMIT_HEALTH_REPORT",
        entity_type="HealthReport",
        entity_id=str(new_report.id),
        details=f"Submitted report {new_report.reference_number} with assessment {risk_category}"
    )

    # Notification for reporter
    create_notification(
        db,
        user_id=current_user.id,
        title=f"Health Report {new_report.reference_number} Submitted",
        message=f"Preliminary AI risk assessment: {risk_category}. Status is now '{initial_status}'.",
        category="health_report",
        reference_id=str(new_report.id)
    )

    # If urgent, notify all agricultural professionals
    if risk_category in ["Urgent Attention Required", "High Risk"]:
        professionals = db.query(User).filter(User.role.in_(["professional", "admin"]), User.is_active == True).all()
        for prof in professionals:
            create_notification(
                db,
                user_id=prof.id,
                title=f"ALERT: {risk_category} Report ({farm.province})",
                message=f"Urgent livestock health report submitted for {farm.name} ({farm.municipality}, {farm.province}). Ref: {new_report.reference_number}.",
                category="disease_alert",
                reference_id=str(new_report.id)
            )

    return _format_report_out(new_report)

@router.get("", response_model=List[HealthReportOut])
def get_health_reports(
    farm_id: Optional[int] = None,
    risk_category: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(HealthReport).join(Farm, HealthReport.farm_id == Farm.id)

    if current_user.role == "farmer":
        query = query.filter(Farm.owner_id == current_user.id)

    if farm_id:
        query = query.filter(HealthReport.farm_id == farm_id)
    if risk_category:
        query = query.filter(HealthReport.risk_category == risk_category)
    if status:
        query = query.filter(HealthReport.status == status)

    reports = query.order_by(HealthReport.created_at.desc()).all()
    return [_format_report_out(r) for r in reports]

@router.get("/{report_id}", response_model=HealthReportOut)
def get_health_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = db.query(HealthReport).filter(HealthReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Health report not found")

    if current_user.role == "farmer" and report.farm.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to access this health report."
        )

    return _format_report_out(report)

@router.put("/{report_id}", response_model=HealthReportOut)
def update_health_report(
    report_id: int,
    report_in: HealthReportUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = db.query(HealthReport).filter(HealthReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Health report not found")

    if current_user.role == "farmer" and report.farm.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this health report."
        )

    if report_in.status:
        report.status = report_in.status
    if report_in.severity:
        report.severity = report_in.severity
    if report_in.duration_days is not None:
        report.duration_days = report_in.duration_days
    if report_in.additional_observations is not None:
        report.additional_observations = report_in.additional_observations

    db.commit()
    db.refresh(report)

    log_activity(db, user_id=current_user.id, action="UPDATE_HEALTH_REPORT", entity_type="HealthReport", entity_id=str(report.id), details=f"Updated report {report.reference_number}")
    return _format_report_out(report)

@router.post("/{report_id}/review", response_model=HealthReportOut)
def review_health_report(
    report_id: int,
    review_in: HealthReportReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_professional_or_admin)
):
    report = db.query(HealthReport).filter(HealthReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Health report not found")

    review = ProfessionalReview(
        report_id=report.id,
        reviewer_id=current_user.id,
        observations=review_in.observations,
        recommended_actions=review_in.recommended_actions,
        follow_up_date=review_in.follow_up_date,
        new_report_status=review_in.new_report_status,
        official_case_reference=review_in.official_case_reference
    )
    db.add(review)

    # Update report status
    report.status = review_in.new_report_status
    if review_in.new_report_status == "Resolved" and report.animal:
        report.animal.health_status = "healthy"

    db.commit()
    db.refresh(report)

    log_activity(
        db,
        user_id=current_user.id,
        action="REVIEW_HEALTH_REPORT",
        entity_type="HealthReport",
        entity_id=str(report.id),
        details=f"Reviewed report {report.reference_number}, status set to {review_in.new_report_status}"
    )

    # Notify the farmer who reported it
    create_notification(
        db,
        user_id=report.reporter_id,
        title=f"Professional Review for Report {report.reference_number}",
        message=f"{current_user.full_name} reviewed your report. Recommendations added. Status: '{review_in.new_report_status}'.",
        category="health_report",
        reference_id=str(report.id)
    )

    return _format_report_out(report)
