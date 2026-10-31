from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.ai import (
    HealthAssessmentRequest,
    HealthAssessmentResponse,
    AssistantQueryRequest,
    AssistantQueryResponse
)
from app.ai.risk_assessment_engine import RiskAssessmentEngine
from app.ai.assistant_rag import HerdGuardAssistant

router = APIRouter(prefix="/ai", tags=["AI & Agricultural Intelligence"])

@router.post("/health-assessment", response_model=HealthAssessmentResponse)
def assess_symptoms(
    req: HealthAssessmentRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Preliminary AI-assisted livestock health risk assessment based on structured symptoms.
    Does NOT produce confirmed diagnoses.
    """
    result = RiskAssessmentEngine.assess_health_risk(
        symptoms=req.symptoms,
        severity=req.severity,
        duration_days=req.duration_days,
        species=req.species,
        breed=req.breed,
        age_months=req.age_months,
        province=req.province
    )
    return HealthAssessmentResponse(**result)

@router.post("/assistant", response_model=AssistantQueryResponse)
def chat_with_assistant(
    req: AssistantQueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    HerdGuard AI Agricultural Assistant.
    Retrieves knowledge from validated South African agricultural institutions (DALRRD, ARC, etc.)
    and responds with clear explanations and citations.
    """
    result = HerdGuardAssistant.answer_query(
        query=req.query,
        db=db,
        category_filter=req.category
    )
    return AssistantQueryResponse(**result)
