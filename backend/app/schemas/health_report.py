from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import date, datetime

class AIAssessmentDetail(BaseModel):
    risk_category: str
    triggering_symptoms: List[str]
    possible_concerns: List[str]
    recommended_steps: List[str]
    veterinary_referral_advisable: bool
    explanation: str
    safety_disclaimer: str

    model_config = {"extra": "ignore"}

class HealthReportCreate(BaseModel):
    farm_id: int
    animal_id: Optional[int] = None
    symptoms: List[str]
    first_noticed_date: date
    severity: str = Field(default="moderate", pattern="^(mild|moderate|severe)$")
    duration_days: int = Field(default=1, ge=1)
    additional_observations: Optional[str] = None
    photo_url: Optional[str] = None

class HealthReportUpdate(BaseModel):
    status: Optional[str] = None
    severity: Optional[str] = None
    duration_days: Optional[int] = None
    additional_observations: Optional[str] = None

class HealthReportReviewCreate(BaseModel):
    observations: str = Field(min_length=5)
    recommended_actions: str = Field(min_length=5)
    follow_up_date: Optional[date] = None
    new_report_status: str = Field(default="Action Recommended", pattern="^(Under Review|Professional Review Required|Action Recommended|Resolved|Closed)$")
    official_case_reference: Optional[str] = None

class ProfessionalReviewOut(BaseModel):
    id: int
    report_id: int
    reviewer_id: int
    reviewer_name: Optional[str] = None
    observations: str
    recommended_actions: str
    follow_up_date: Optional[date] = None
    new_report_status: str
    official_case_reference: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class HealthReportOut(BaseModel):
    id: int
    reference_number: str
    farm_id: int
    farm_name: Optional[str] = None
    animal_id: Optional[int] = None
    animal_tag: Optional[str] = None
    reporter_id: int
    reporter_name: Optional[str] = None
    symptoms: List[str]
    first_noticed_date: date
    severity: str
    duration_days: int
    additional_observations: Optional[str] = None
    photo_url: Optional[str] = None
    risk_category: str
    ai_assessment: Optional[AIAssessmentDetail] = None
    status: str
    created_at: datetime
    updated_at: datetime
    reviews: Optional[List[ProfessionalReviewOut]] = []

    class Config:
        from_attributes = True
