from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, require_admin
from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate, VetProvisionRequest
from app.services.activity_service import log_activity
from app.services.notification_service import create_notification

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/professional", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def provision_veterinary_professional(
    vet_in: VetProvisionRequest,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    """
    Administrator endpoint to provision veterinary professionals with admin-assigned login credentials.
    """
    existing_user = db.query(User).filter(User.email == vet_in.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    hashed_pw = get_password_hash(vet_in.password)
    new_vet = User(
        email=vet_in.email.lower(),
        hashed_password=hashed_pw,
        full_name=vet_in.full_name,
        phone_number=vet_in.phone_number,
        role="professional",
        organization_or_practice=vet_in.organization_or_practice,
        province=vet_in.province,
        is_active=True
    )
    db.add(new_vet)
    db.commit()
    db.refresh(new_vet)

    # Log admin provisioning activity
    log_activity(
        db,
        user_id=admin_user.id,
        action="PROVISION_VET",
        entity_type="User",
        entity_id=str(new_vet.id),
        details=f"Admin {admin_user.email} provisioned veterinary professional {new_vet.email} with assigned credentials"
    )

    # Create notification for new veterinary user
    create_notification(
        db,
        user_id=new_vet.id,
        title="Veterinary Account Provisioned",
        message="Your veterinary professional account has been provisioned by the system administrator.",
        category="system"
    )

    return new_vet

@router.get("", response_model=List[UserOut])
def get_users(
    role: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    if search:
        query = query.filter(
            (User.full_name.ilike(f"%{search}%")) | (User.email.ilike(f"%{search}%"))
        )
    return query.order_by(User.created_at.desc()).all()

@router.get("/{user_id}", response_model=UserOut)
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this user profile."
        )
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to edit this user profile."
        )
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user_in.full_name is not None:
        user.full_name = user_in.full_name
    if user_in.phone_number is not None:
        user.phone_number = user_in.phone_number
    if user_in.organization_or_practice is not None:
        user.organization_or_practice = user_in.organization_or_practice
    if user_in.province is not None:
        user.province = user_in.province
    if user_in.is_active is not None and current_user.role == "admin":
        user.is_active = user_in.is_active
    if user_in.password:
        user.hashed_password = get_password_hash(user_in.password)

    db.commit()
    db.refresh(user)
    log_activity(db, user_id=current_user.id, action="UPDATE_USER", entity_type="User", entity_id=str(user.id), details="User profile updated")
    return user
