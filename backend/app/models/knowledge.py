from datetime import datetime, timezone, date
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Text
from app.database.session import Base

class KnowledgeResource(Base):
    __tablename__ = "knowledge_resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    source_organization = Column(String(255), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    content = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    source_url = Column(String(500), nullable=True)
    publication_date = Column(Date, nullable=True)
    verification_status = Column(String(50), default="Verified Official", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
