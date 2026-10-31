from datetime import datetime, timezone, date
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.session import Base

class Vaccination(Base):
    __tablename__ = "vaccinations"

    id = Column(Integer, primary_key=True, index=True)
    animal_id = Column(Integer, ForeignKey("animals.id", ondelete="CASCADE"), nullable=False, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    vaccine_name = Column(String(200), nullable=False, index=True)
    batch_number = Column(String(100), nullable=True)
    vaccination_date = Column(Date, nullable=False, index=True)
    next_due_date = Column(Date, nullable=False, index=True)
    administering_professional = Column(String(200), nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(String(50), default="completed", nullable=False)  # completed, scheduled, overdue
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    animal = relationship("Animal", back_populates="vaccinations")
    farm = relationship("Farm", back_populates="vaccinations")
