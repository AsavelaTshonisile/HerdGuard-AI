from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, require_admin
from app.models.activity_log import ActivityLog
from app.models.user import User

router = APIRouter(prefix="/activity-logs", tags=["Activity Logs"])

@router.get("")
def get_activity_logs(
    action: Optional[str] = None,
    limit: int = Query(default=50, le=200),
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    query = db.query(ActivityLog).join(User, ActivityLog.user_id == User.id, isouter=True)
    if action:
        query = query.filter(ActivityLog.action == action)

    logs = query.order_by(ActivityLog.created_at.desc()).limit(limit).all()
    return [{
        "id": l.id,
        "user_id": l.user_id,
        "user_name": l.user.full_name if l.user else "System",
        "user_email": l.user.email if l.user else None,
        "action": l.action,
        "entity_type": l.entity_type,
        "entity_id": l.entity_id,
        "details": l.details,
        "ip_address": l.ip_address,
        "created_at": l.created_at.isoformat()
    } for l in logs]
