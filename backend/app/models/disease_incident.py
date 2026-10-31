from datetime import datetime, timezone, date
from sqlalchemy import Column, Integer, String, Float, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.session import Base

class DiseaseIncident(Base):
    __tablename__ = "disease_incidents"

    id = Column(Integer, primary_key=True, index=True)
    disease_name = Column(String(200), nullable=False, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id", ondelete="SET NULL"), nullable=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    province = Column(String(100), nullable=False, index=True)
    municipality = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    reported_date = Column(Date, nullable=False, index=True)
    # Verification status: 'Suspected', 'Professionally Reviewed', 'Official Outbreak'
    verification_status = Column(String(50), default="Suspected", nullable=False, index=True)
    affected_count = Column(Integer, default=1, nullable=False)
    death_count = Column(Integer, default=0, nullable=False)
    description = Column(Text, nullable=True)
    # Status: 'Active', 'Contained', 'Resolved'
    status = Column(String(50), default="Active", nullable=False, index=True)
    official_notice_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    farm = relationship("Farm", back_populates="disease_incidents")
    reporter = relationship("User")
