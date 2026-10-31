from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.vaccination import Vaccination
from app.models.animal import Animal
from app.models.farm import Farm
from app.models.user import User
from app.schemas.vaccination import VaccinationCreate, VaccinationUpdate, VaccinationOut
from app.services.activity_service import log_activity
from app.services.notification_service import create_notification

router = APIRouter(prefix="/vaccinations", tags=["Vaccinations"])

def _format_vaccination_out(v: Vaccination) -> VaccinationOut:
    out = VaccinationOut.model_validate(v)
    out.animal_tag = v.animal.tag_number if v.animal else None
    out.farm_name = v.farm.name if v.farm else None
    return out

@router.post("", response_model=VaccinationOut, status_code=status.HTTP_201_CREATED)
def create_vaccination(
    vac_in: VaccinationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    farm = db.query(Farm).filter(Farm.id == vac_in.farm_id).first()
    if not farm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Specified farm does not exist.")

    if current_user.role == "farmer" and farm.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only manage vaccinations for your own farms.")

    animal = db.query(Animal).filter(Animal.id == vac_in.animal_id).first()
    if not animal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Specified animal does not exist.")
    if animal.farm_id != farm.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Animal does not belong to the selected farm.")

    # Compute status
    today = date.today()
    current_status = vac_in.status
    if vac_in.next_due_date < today and current_status != "completed":
        current_status = "overdue"

    new_vac = Vaccination(
        animal_id=vac_in.animal_id,
        farm_id=vac_in.farm_id,
        vaccine_name=vac_in.vaccine_name,
        batch_number=vac_in.batch_number,
        vaccination_date=vac_in.vaccination_date,
        next_due_date=vac_in.next_due_date,
        administering_professional=vac_in.administering_professional or (current_user.full_name if current_user.role == "professional" else None),
        notes=vac_in.notes,
        status=current_status
    )
    db.add(new_vac)
    db.commit()
    db.refresh(new_vac)

    log_activity(db, user_id=current_user.id, action="CREATE_VACCINATION", entity_type="Vaccination", entity_id=str(new_vac.id), details=f"Logged vaccine {new_vac.vaccine_name} for tag {animal.tag_number}")

    # Set up reminder notification
    create_notification(
        db,
        user_id=farm.owner_id,
        title=f"Vaccination Recorded: {new_vac.vaccine_name}",
        message=f"Vaccine {new_vac.vaccine_name} administered to animal {animal.tag_number}. Next dose due on {new_vac.next_due_date}.",
        category="vaccination",
        reference_id=str(new_vac.id)
    )

    return _format_vaccination_out(new_vac)

@router.get("", response_model=List[VaccinationOut])
def get_vaccinations(
    farm_id: Optional[int] = None,
    animal_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Vaccination).join(Farm, Vaccination.farm_id == Farm.id)

    if current_user.role == "farmer":
        query = query.filter(Farm.owner_id == current_user.id)

    if farm_id:
        query = query.filter(Vaccination.farm_id == farm_id)
    if animal_id:
        query = query.filter(Vaccination.animal_id == animal_id)
    if status:
        query = query.filter(Vaccination.status == status)

    records = query.order_by(Vaccination.vaccination_date.desc()).all()
    return [_format_vaccination_out(v) for v in records]

@router.put("/{vaccination_id}", response_model=VaccinationOut)
def update_vaccination(
    vaccination_id: int,
    vac_in: VaccinationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    v = db.query(Vaccination).filter(Vaccination.id == vaccination_id).first()
    if not v:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vaccination record not found")

    if current_user.role == "farmer" and v.farm.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to edit this vaccination record.")

    update_data = vac_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(v, field, val)

    db.commit()
    db.refresh(v)
    return _format_vaccination_out(v)

@router.delete("/{vaccination_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vaccination(
    vaccination_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    v = db.query(Vaccination).filter(Vaccination.id == vaccination_id).first()
    if not v:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vaccination record not found")

    if current_user.role == "farmer" and v.farm.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized to delete this record.")

    db.delete(v)
    db.commit()
    return None
