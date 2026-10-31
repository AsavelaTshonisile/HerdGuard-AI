from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, require_professional_or_admin
from app.models.disease_incident import DiseaseIncident
from app.models.farm import Farm
from app.models.user import User
from app.schemas.disease_incident import DiseaseIncidentCreate, DiseaseIncidentUpdate, DiseaseIncidentOut
from app.services.activity_service import log_activity
from app.services.notification_service import create_notification

router = APIRouter(prefix="/disease-incidents", tags=["Disease Incidents"])

def _format_incident_out(inc: DiseaseIncident) -> DiseaseIncidentOut:
    out = DiseaseIncidentOut.model_validate(inc)
    out.reporter_name = inc.reporter.full_name if inc.reporter else None
    out.farm_name = inc.farm.name if inc.farm else None
    return out

@router.post("", response_model=DiseaseIncidentOut, status_code=status.HTTP_201_CREATED)
def report_disease_incident(
    inc_in: DiseaseIncidentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # If farmer reports, default verification status is 'Suspected'
    verification = inc_in.verification_status
    if current_user.role == "farmer":
        verification = "Suspected"

    new_inc = DiseaseIncident(
        disease_name=inc_in.disease_name,
        farm_id=inc_in.farm_id,
        reporter_id=current_user.id,
        province=inc_in.province,
        municipality=inc_in.municipality,
        latitude=inc_in.latitude,
        longitude=inc_in.longitude,
        reported_date=inc_in.reported_date,
        verification_status=verification,
        affected_count=inc_in.affected_count,
        death_count=inc_in.death_count,
        description=inc_in.description,
        status=inc_in.status,
        official_notice_url=inc_in.official_notice_url
    )
    db.add(new_inc)
    db.commit()
    db.refresh(new_inc)

    log_activity(db, user_id=current_user.id, action="CREATE_INCIDENT", entity_type="DiseaseIncident", entity_id=str(new_inc.id), details=f"Logged incident {new_inc.disease_name} in {new_inc.municipality}")

    # Notify users in same province about disease awareness
    nearby_users = db.query(User).filter(User.province == inc_in.province, User.id != current_user.id).all()
    for u in nearby_users:
        create_notification(
            db,
            user_id=u.id,
            title=f"Biosecurity Alert: {new_inc.disease_name}",
            message=f"A {verification} incident of {new_inc.disease_name} was reported in {new_inc.municipality}, {new_inc.province}. Monitor your livestock for symptoms.",
            category="disease_alert",
            reference_id=str(new_inc.id)
        )

    return _format_incident_out(new_inc)

@router.get("", response_model=List[DiseaseIncidentOut])
def get_disease_incidents(
    province: Optional[str] = None,
    verification_status: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(DiseaseIncident)
    if province:
        query = query.filter(DiseaseIncident.province == province)
    if verification_status:
        query = query.filter(DiseaseIncident.verification_status == verification_status)
    if status:
        query = query.filter(DiseaseIncident.status == status)

    incidents = query.order_by(DiseaseIncident.reported_date.desc()).all()
    return [_format_incident_out(inc) for inc in incidents]

@router.get("/map")
def get_disease_map_data(
    province: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(DiseaseIncident)
    if province:
        query = query.filter(DiseaseIncident.province == province)

    incidents = query.order_by(DiseaseIncident.reported_date.desc()).all()
    farms = db.query(Farm).filter(Farm.latitude.isnot(None), Farm.longitude.isnot(None)).all()

    incidents_data = [{
        "id": i.id,
        "disease_name": i.disease_name,
        "province": i.province,
        "municipality": i.municipality,
        "latitude": i.latitude,
        "longitude": i.longitude,
        "reported_date": i.reported_date.isoformat(),
        "verification_status": i.verification_status,
        "status": i.status,
        "affected_count": i.affected_count,
        "death_count": i.death_count,
        "description": i.description,
        "official_notice_url": i.official_notice_url
    } for i in incidents]

    farms_data = [{
        "id": f.id,
        "name": f.name,
        "province": f.province,
        "municipality": f.municipality,
        "latitude": f.latitude,
        "longitude": f.longitude,
        "farm_type": f.farm_type
    } for f in farms]

    return {
        "incidents": incidents_data,
        "farms": farms_data
    }

@router.put("/{incident_id}", response_model=DiseaseIncidentOut)
def update_disease_incident(
    incident_id: int,
    inc_in: DiseaseIncidentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_professional_or_admin)
):
    inc = db.query(DiseaseIncident).filter(DiseaseIncident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Disease incident not found")

    update_data = inc_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(inc, field, val)

    db.commit()
    db.refresh(inc)

    log_activity(db, user_id=current_user.id, action="UPDATE_INCIDENT", entity_type="DiseaseIncident", entity_id=str(inc.id), details=f"Updated incident {inc.disease_name}")
    return _format_incident_out(inc)
