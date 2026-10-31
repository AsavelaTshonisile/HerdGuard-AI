from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

class VaccinationBase(BaseModel):
    animal_id: int
    farm_id: int
    vaccine_name: str = Field(min_length=2, max_length=200)
    batch_number: Optional[str] = None
    vaccination_date: date
    next_due_date: date
    administering_professional: Optional[str] = None
    notes: Optional[str] = None
    status: str = Field(default="completed", pattern="^(completed|scheduled|overdue)$")

class VaccinationCreate(VaccinationBase):
    pass

class VaccinationUpdate(BaseModel):
    vaccine_name: Optional[str] = None
    batch_number: Optional[str] = None
    vaccination_date: Optional[date] = None
    next_due_date: Optional[date] = None
    administering_professional: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None

class VaccinationOut(VaccinationBase):
    id: int
    created_at: datetime
    animal_tag: Optional[str] = None
    farm_name: Optional[str] = None

    class Config:
        from_attributes = True
