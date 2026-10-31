from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

class AnimalBase(BaseModel):
    tag_number: str = Field(min_length=1, max_length=100)
    name: Optional[str] = None
    farm_id: int
    species: str = Field(default="cattle")
    breed: str
    sex: str = Field(default="female")
    date_of_birth: Optional[date] = None
    approximate_age_months: Optional[int] = None
    weight_kg: Optional[float] = None
    health_status: str = Field(default="healthy", pattern="^(healthy|monitoring|sick|quarantined)$")
    additional_notes: Optional[str] = None

class AnimalCreate(AnimalBase):
    pass

class AnimalUpdate(BaseModel):
    tag_number: Optional[str] = None
    name: Optional[str] = None
    farm_id: Optional[int] = None
    breed: Optional[str] = None
    sex: Optional[str] = None
    date_of_birth: Optional[date] = None
    approximate_age_months: Optional[int] = None
    weight_kg: Optional[float] = None
    health_status: Optional[str] = None
    additional_notes: Optional[str] = None
    is_active: Optional[bool] = None

class AnimalOut(AnimalBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    farm_name: Optional[str] = None

    class Config:
        from_attributes = True
