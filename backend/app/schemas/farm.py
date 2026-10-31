from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class FarmBase(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    province: str = Field(min_length=2, max_length=100)
    municipality: str = Field(min_length=2, max_length=100)
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    farm_type: str = Field(default="smallholder", pattern="^(smallholder|communal|commercial)$")
    total_area_hectares: Optional[float] = None

class FarmCreate(FarmBase):
    pass

class FarmUpdate(BaseModel):
    name: Optional[str] = None
    province: Optional[str] = None
    municipality: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    farm_type: Optional[str] = None
    total_area_hectares: Optional[float] = None

class FarmOut(FarmBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime
    animals_count: Optional[int] = 0

    class Config:
        from_attributes = True
