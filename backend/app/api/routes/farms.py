from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.farm import Farm
from app.models.animal import Animal
from app.models.user import User
from app.schemas.farm import FarmCreate, FarmUpdate, FarmOut
from app.services.activity_service import log_activity

router = APIRouter(prefix="/farms", tags=["Farms"])

@router.post("", response_model=FarmOut, status_code=status.HTTP_201_CREATED)
def create_farm(
    farm_in: FarmCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_farm = Farm(
        name=farm_in.name,
        owner_id=current_user.id,
        province=farm_in.province,
        municipality=farm_in.municipality,
        address=farm_in.address,
        latitude=farm_in.latitude,
        longitude=farm_in.longitude,
        farm_type=farm_in.farm_type,
        total_area_hectares=farm_in.total_area_hectares
    )
    db.add(new_farm)
    db.commit()
    db.refresh(new_farm)

    log_activity(db, user_id=current_user.id, action="CREATE_FARM", entity_type="Farm", entity_id=str(new_farm.id), details=f"Created farm {new_farm.name}")

    out = FarmOut.model_validate(new_farm)
    out.animals_count = 0
    return out

@router.get("", response_model=List[FarmOut])
def get_farms(
    province: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Farm)
    if current_user.role == "farmer":
        query = query.filter(Farm.owner_id == current_user.id)
    if province:
        query = query.filter(Farm.province == province)

    farms = query.order_by(Farm.name.asc()).all()
    results = []
    for farm in farms:
        count = db.query(Animal).filter(Animal.farm_id == farm.id, Animal.is_active == True).count()
        f_out = FarmOut.model_validate(farm)
        f_out.animals_count = count
        results.append(f_out)
    return results

@router.get("/{farm_id}", response_model=FarmOut)
def get_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")

    if current_user.role == "farmer" and farm.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this farm record."
        )

    count = db.query(Animal).filter(Animal.farm_id == farm.id, Animal.is_active == True).count()
    f_out = FarmOut.model_validate(farm)
    f_out.animals_count = count
    return f_out

@router.put("/{farm_id}", response_model=FarmOut)
def update_farm(
    farm_id: int,
    farm_in: FarmUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")

    if current_user.role == "farmer" and farm.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this farm."
        )

    update_data = farm_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(farm, field, val)

    db.commit()
    db.refresh(farm)
    log_activity(db, user_id=current_user.id, action="UPDATE_FARM", entity_type="Farm", entity_id=str(farm.id), details=f"Updated farm {farm.name}")

    count = db.query(Animal).filter(Animal.farm_id == farm.id, Animal.is_active == True).count()
    f_out = FarmOut.model_validate(farm)
    f_out.animals_count = count
    return f_out

@router.delete("/{farm_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")

    if current_user.role == "farmer" and farm.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this farm."
        )

    log_activity(db, user_id=current_user.id, action="DELETE_FARM", entity_type="Farm", entity_id=str(farm.id), details=f"Deleted farm {farm.name}")
    db.delete(farm)
    db.commit()
    return None
