from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.animal import Animal
from app.models.farm import Farm
from app.models.health_report import HealthReport
from app.models.vaccination import Vaccination
from app.models.user import User
from app.schemas.animal import AnimalCreate, AnimalUpdate, AnimalOut
from app.services.activity_service import log_activity

router = APIRouter(prefix="/animals", tags=["Livestock"])

@router.post("", response_model=AnimalOut, status_code=status.HTTP_201_CREATED)
def create_animal(
    animal_in: AnimalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check farm access
    farm = db.query(Farm).filter(Farm.id == animal_in.farm_id).first()
    if not farm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Specified farm does not exist.")

    if current_user.role == "farmer" and farm.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only register livestock to farms you own."
        )

    # Check unique tag number
    existing_tag = db.query(Animal).filter(Animal.tag_number == animal_in.tag_number.strip()).first()
    if existing_tag:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"An animal with tag number '{animal_in.tag_number}' is already registered."
        )

    new_animal = Animal(
        tag_number=animal_in.tag_number.strip(),
        name=animal_in.name,
        farm_id=animal_in.farm_id,
        species=animal_in.species.lower(),
        breed=animal_in.breed,
        sex=animal_in.sex,
        date_of_birth=animal_in.date_of_birth,
        approximate_age_months=animal_in.approximate_age_months,
        weight_kg=animal_in.weight_kg,
        health_status=animal_in.health_status,
        additional_notes=animal_in.additional_notes,
        is_active=True
    )
    db.add(new_animal)
    db.commit()
    db.refresh(new_animal)

    log_activity(db, user_id=current_user.id, action="CREATE_ANIMAL", entity_type="Animal", entity_id=str(new_animal.id), details=f"Registered cattle tag {new_animal.tag_number} ({new_animal.breed})")

    out = AnimalOut.model_validate(new_animal)
    out.farm_name = farm.name
    return out

@router.get("", response_model=List[AnimalOut])
def get_animals(
    farm_id: Optional[int] = None,
    species: Optional[str] = None,
    health_status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Animal).join(Farm, Animal.farm_id == Farm.id).filter(Animal.is_active == True)

    if current_user.role == "farmer":
        query = query.filter(Farm.owner_id == current_user.id)

    if farm_id:
        query = query.filter(Animal.farm_id == farm_id)
    if species:
        query = query.filter(Animal.species == species.lower())
    if health_status:
        query = query.filter(Animal.health_status == health_status)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Animal.tag_number.ilike(search_filter)) | 
            (Animal.name.ilike(search_filter)) | 
            (Animal.breed.ilike(search_filter))
        )

    animals = query.order_by(Animal.created_at.desc()).all()
    results = []
    for animal in animals:
        out = AnimalOut.model_validate(animal)
        out.farm_name = animal.farm.name if animal.farm else None
        results.append(out)
    return results

@router.get("/{animal_id}")
def get_animal_profile(
    animal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Animal not found")

    if current_user.role == "farmer" and animal.farm.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this animal's records."
        )

    # Fetch related history
    reports = db.query(HealthReport).filter(HealthReport.animal_id == animal.id).order_by(HealthReport.created_at.desc()).all()
    vaccines = db.query(Vaccination).filter(Vaccination.animal_id == animal.id).order_by(Vaccination.vaccination_date.desc()).all()

    import json
    reports_data = []
    for r in reports:
        try:
            syms = json.loads(r.symptoms)
        except Exception:
            syms = [r.symptoms]
        reports_data.append({
            "id": r.id,
            "reference_number": r.reference_number,
            "first_noticed_date": r.first_noticed_date.isoformat(),
            "severity": r.severity,
            "duration_days": r.duration_days,
            "symptoms": syms,
            "risk_category": r.risk_category,
            "status": r.status,
            "created_at": r.created_at.isoformat()
        })

    vaccines_data = [{
        "id": v.id,
        "vaccine_name": v.vaccine_name,
        "batch_number": v.batch_number,
        "vaccination_date": v.vaccination_date.isoformat(),
        "next_due_date": v.next_due_date.isoformat(),
        "administering_professional": v.administering_professional,
        "status": v.status
    } for v in vaccines]

    return {
        "animal": {
            "id": animal.id,
            "tag_number": animal.tag_number,
            "name": animal.name,
            "farm_id": animal.farm_id,
            "farm_name": animal.farm.name if animal.farm else "",
            "species": animal.species,
            "breed": animal.breed,
            "sex": animal.sex,
            "date_of_birth": animal.date_of_birth.isoformat() if animal.date_of_birth else None,
            "approximate_age_months": animal.approximate_age_months,
            "weight_kg": animal.weight_kg,
            "health_status": animal.health_status,
            "additional_notes": animal.additional_notes,
            "is_active": animal.is_active,
            "created_at": animal.created_at.isoformat()
        },
        "health_reports": reports_data,
        "vaccinations": vaccines_data
    }

@router.put("/{animal_id}", response_model=AnimalOut)
def update_animal(
    animal_id: int,
    animal_in: AnimalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Animal not found")

    if current_user.role == "farmer" and animal.farm.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this animal."
        )

    if animal_in.tag_number and animal_in.tag_number.strip() != animal.tag_number:
        existing = db.query(Animal).filter(Animal.tag_number == animal_in.tag_number.strip(), Animal.id != animal_id).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tag number is already in use by another animal.")
        animal.tag_number = animal_in.tag_number.strip()

    update_data = animal_in.model_dump(exclude_unset=True, exclude={"tag_number"})
    for field, val in update_data.items():
        setattr(animal, field, val)

    db.commit()
    db.refresh(animal)

    log_activity(db, user_id=current_user.id, action="UPDATE_ANIMAL", entity_type="Animal", entity_id=str(animal.id), details=f"Updated animal tag {animal.tag_number}")

    out = AnimalOut.model_validate(animal)
    out.farm_name = animal.farm.name if animal.farm else None
    return out

@router.delete("/{animal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_animal(
    animal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Animal not found")

    if current_user.role == "farmer" and animal.farm.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to remove this animal."
        )

    # Soft delete to preserve historical health reports & vaccination records
    animal.is_active = False
    db.commit()

    log_activity(db, user_id=current_user.id, action="DEACTIVATE_ANIMAL", entity_type="Animal", entity_id=str(animal.id), details=f"Soft-deleted animal tag {animal.tag_number}")
    return None
