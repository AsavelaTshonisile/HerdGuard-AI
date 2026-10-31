from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class Farm(Base):
    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    province = Column(String(100), nullable=False, index=True)
    municipality = Column(String(100), nullable=False)
    address = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=True, index=True)
    longitude = Column(Float, nullable=True, index=True)
    farm_type = Column(String(50), default="smallholder", nullable=False)  # smallholder, communal, commercial
    total_area_hectares = Column(Float, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    owner = relationship("User", back_populates="farms")
    animals = relationship("Animal", back_populates="farm", cascade="all, delete-orphan")
    health_reports = relationship("HealthReport", back_populates="farm")
    disease_incidents = relationship("DiseaseIncident", back_populates="farm")
    vaccinations = relationship("Vaccination", back_populates="farm")
