from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

class DiseaseIncidentBase(BaseModel):
    disease_name: str = Field(min_length=2, max_length=200)
    farm_id: Optional[int] = None
    province: str
    municipality: str
    latitude: float
    longitude: float
    reported_date: date
    verification_status: str = Field(default="Suspected", pattern="^(Suspected|Professionally Reviewed|Official Outbreak)$")
    affected_count: int = Field(default=1, ge=0)
    death_count: int = Field(default=0, ge=0)
    description: Optional[str] = None
    status: str = Field(default="Active", pattern="^(Active|Contained|Resolved)$")
    official_notice_url: Optional[str] = None

class DiseaseIncidentCreate(DiseaseIncidentBase):
    pass

class DiseaseIncidentUpdate(BaseModel):
    disease_name: Optional[str] = None
    verification_status: Optional[str] = None
    affected_count: Optional[int] = None
    death_count: Optional[int] = None
    description: Optional[str] = None
    status: Optional[str] = None
    official_notice_url: Optional[str] = None

class DiseaseIncidentOut(DiseaseIncidentBase):
    id: int
    reporter_id: int
    reporter_name: Optional[str] = None
    farm_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
