from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, require_professional_or_admin, require_admin
from app.models.knowledge import KnowledgeResource
from app.models.user import User
from app.schemas.knowledge import KnowledgeResourceCreate, KnowledgeResourceUpdate, KnowledgeResourceOut

router = APIRouter(prefix="/knowledge-resources", tags=["Knowledge Resources"])

@router.get("", response_model=List[KnowledgeResourceOut])
def get_knowledge_resources(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(KnowledgeResource).filter(KnowledgeResource.is_active == True)
    if category:
        query = query.filter(KnowledgeResource.category == category)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (KnowledgeResource.title.ilike(s)) |
            (KnowledgeResource.summary.ilike(s)) |
            (KnowledgeResource.source_organization.ilike(s))
        )
    return query.order_by(KnowledgeResource.title.asc()).all()

@router.post("", response_model=KnowledgeResourceOut, status_code=status.HTTP_201_CREATED)
def create_knowledge_resource(
    res_in: KnowledgeResourceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_professional_or_admin)
):
    res = KnowledgeResource(
        title=res_in.title,
        source_organization=res_in.source_organization,
        category=res_in.category,
        content=res_in.content,
        summary=res_in.summary,
        source_url=res_in.source_url,
        publication_date=res_in.publication_date,
        verification_status=res_in.verification_status,
        is_active=res_in.is_active
    )
    db.add(res)
    db.commit()
    db.refresh(res)
    return res

@router.put("/{resource_id}", response_model=KnowledgeResourceOut)
def update_knowledge_resource(
    resource_id: int,
    res_in: KnowledgeResourceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    res = db.query(KnowledgeResource).filter(KnowledgeResource.id == resource_id).first()
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")

    update_data = res_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(res, field, val)

    db.commit()
    db.refresh(res)
    return res

@router.delete("/{resource_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_knowledge_resource(
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    res = db.query(KnowledgeResource).filter(KnowledgeResource.id == resource_id).first()
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")

    db.delete(res)
    db.commit()
    return None
