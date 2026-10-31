from typing import Optional
from sqlalchemy.orm import Session
from app.models.activity_log import ActivityLog

def log_activity(
    db: Session,
    user_id: Optional[int],
    action: str,
    entity_type: Optional[str] = None,
    entity_id: Optional[str] = None,
    details: Optional[str] = None,
    ip_address: Optional[str] = None
) -> ActivityLog:
    log_entry = ActivityLog(
        user_id=user_id,
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id) if entity_id is not None else None,
        details=details,
        ip_address=ip_address
    )
    db.add(log_entry)
    db.commit()
    return log_entry
