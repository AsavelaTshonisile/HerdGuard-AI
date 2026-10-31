from pydantic import BaseModel, Field
from typing import List, Optional

class HealthAssessmentRequest(BaseModel):
    symptoms: List[str]
    severity: str = Field(default="moderate", pattern="^(mild|moderate|severe)$")
    duration_days: int = Field(default=1, ge=1)
    species: str = "cattle"
    breed: Optional[str] = None
    age_months: Optional[int] = None
    province: Optional[str] = None

class HealthAssessmentResponse(BaseModel):
    risk_category: str  # Low Risk, Moderate Risk, High Risk, Urgent Attention Required
    triggering_symptoms: List[str]
    possible_concerns: List[str]
    recommended_steps: List[str]
    veterinary_referral_advisable: bool
    explanation: str
    safety_disclaimer: str

class AssistantQueryRequest(BaseModel):
    query: str = Field(min_length=2)
    conversation_history: Optional[List[dict]] = None
    category: Optional[str] = None

class AssistantCitation(BaseModel):
    title: str
    source_organization: str
    source_url: Optional[str] = None

class AssistantQueryResponse(BaseModel):
    answer: str
    citations: List[AssistantCitation] = []
    advisory_notice: str
    suggested_followups: List[str] = []
