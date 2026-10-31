from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class StatusCount(BaseModel):
    name: str
    value: int
    color: Optional[str] = None

class TimeSeriesPoint(BaseModel):
    date: str
    count: int

class FarmerDashboardOut(BaseModel):
    total_livestock: int
    healthy_animals: int
    animals_requiring_attention: int
    sick_animals: int
    quarantined_animals: int
    submitted_reports: int
    pending_professional_reviews: int
    upcoming_vaccinations: int
    overdue_vaccinations: int
    health_status_distribution: List[StatusCount]
    breed_distribution: List[StatusCount]
    reports_timeline: List[TimeSeriesPoint]
    recent_activity: List[Dict[str, Any]]
    vaccination_completion_percentage: float

class ProfessionalDashboardOut(BaseModel):
    pending_reviews_count: int
    urgent_reports_count: int
    total_reviewed_count: int
    active_incidents_count: int
    recent_reports: List[Dict[str, Any]]
    incidents_by_province: List[StatusCount]
    reports_by_risk: List[StatusCount]

class AdminDashboardOut(BaseModel):
    total_users: int
    farmers_count: int
    professionals_count: int
    administrators_count: int
    total_farms: int
    total_livestock: int
    total_health_reports: int
    total_incidents: int
    active_incidents: int
    recent_activities: List[Dict[str, Any]]
