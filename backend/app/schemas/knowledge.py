from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

class KnowledgeResourceBase(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    source_organization: str = Field(min_length=2, max_length=255)
    category: str = Field(min_length=2, max_length=100)
    content: str = Field(min_length=10)
    summary: str = Field(min_length=10)
    source_url: Optional[str] = None
    publication_date: Optional[date] = None
    verification_status: str = Field(default="Verified Official")
    is_active: bool = True

class KnowledgeResourceCreate(KnowledgeResourceBase):
    pass

class KnowledgeResourceUpdate(BaseModel):
    title: Optional[str] = None
    source_organization: Optional[str] = None
    category: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    source_url: Optional[str] = None
    publication_date: Optional[date] = None
    verification_status: Optional[str] = None
    is_active: Optional[bool] = None

class KnowledgeResourceOut(KnowledgeResourceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
