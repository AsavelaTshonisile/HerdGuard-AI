from datetime import datetime, timezone, date
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.session import Base

class HealthReport(Base):
    __tablename__ = "health_reports"

    id = Column(Integer, primary_key=True, index=True)
    reference_number = Column(String(50), unique=True, index=True, nullable=False)
    farm_id = Column(Integer, ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    animal_id = Column(Integer, ForeignKey("animals.id", ondelete="SET NULL"), nullable=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Symptom Details
    symptoms = Column(Text, nullable=False)  # JSON-encoded array of symptom keys/names
    first_noticed_date = Column(Date, nullable=False)
    severity = Column(String(20), default="moderate", nullable=False)  # mild, moderate, severe
    duration_days = Column(Integer, default=1, nullable=False)
    additional_observations = Column(Text, nullable=True)
    photo_url = Column(String(500), nullable=True)
    
    # AI-assisted Assessment Output
    risk_category = Column(String(50), default="Moderate Risk", nullable=False, index=True)
    ai_assessment_json = Column(Text, nullable=True)  # Detailed JSON payload with triggers, recommendations & disclaimers
    
    # Workflow Status
    # Submitted, Under Review, Professional Review Required, Action Recommended, Resolved, Closed
    status = Column(String(50), default="Submitted", nullable=False, index=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    farm = relationship("Farm", back_populates="health_reports")
    animal = relationship("Animal", back_populates="health_reports")
    reporter = relationship("User", back_populates="health_reports")
    reviews = relationship("ProfessionalReview", back_populates="report", cascade="all, delete-orphan")
