from datetime import datetime, timezone, date
from sqlalchemy import Column, Integer, String, Float, DateTime, Date, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.database.session import Base

class Animal(Base):
    __tablename__ = "animals"

    id = Column(Integer, primary_key=True, index=True)
    tag_number = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=True)
    farm_id = Column(Integer, ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    species = Column(String(50), default="cattle", nullable=False, index=True)  # cattle, sheep, goats
    breed = Column(String(100), nullable=False)  # e.g., Bonsmara, Nguni, Brahman, etc.
    sex = Column(String(20), nullable=False)  # Male, Female, Steer, Heifer, Bull, Cow
    date_of_birth = Column(Date, nullable=True)
    approximate_age_months = Column(Integer, nullable=True)
    weight_kg = Column(Float, nullable=True)
    health_status = Column(String(50), default="healthy", nullable=False, index=True)  # healthy, monitoring, sick, quarantined
    additional_notes = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    farm = relationship("Farm", back_populates="animals")
    health_reports = relationship("HealthReport", back_populates="animal")
    vaccinations = relationship("Vaccination", back_populates="animal", cascade="all, delete-orphan")
