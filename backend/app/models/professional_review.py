from datetime import datetime, timezone, date
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.session import Base

class ProfessionalReview(Base):
    __tablename__ = "professional_reviews"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("health_reports.id", ondelete="CASCADE"), nullable=False, index=True)
    reviewer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    observations = Column(Text, nullable=False)
    recommended_actions = Column(Text, nullable=False)
    follow_up_date = Column(Date, nullable=True)
    new_report_status = Column(String(50), nullable=False)
    official_case_reference = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    # Relationships
    report = relationship("HealthReport", back_populates="reviews")
    reviewer = relationship("User", back_populates="reviews")
