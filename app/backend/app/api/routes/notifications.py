from fastapi import APIRouter, Depends, Query

from app.api.dependencies import (
    get_current_access_token,
    get_current_user,
)
from app.schemas.notifications import NotificationResponse
from app.services.notification_service import get_deadline_notifications


router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"]
)


@router.get(
    "/deadlines",
    response_model=NotificationResponse
)
def get_deadline_alerts(
    alert_days: int = Query(
        default=3,
        ge=0,
        description="Number of days before the deadline to generate an alert"
    ),
    current_user=Depends(get_current_user),
    access_token: str = Depends(get_current_access_token),
):
    """Return notifications for upcoming internship deadlines."""

    notifications = get_deadline_notifications(
        user_id=str(current_user.id),
        access_token=access_token,
        alert_days=alert_days,
    )

    return NotificationResponse(
        notifications=notifications
    )