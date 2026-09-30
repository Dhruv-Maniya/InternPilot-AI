from fastapi import APIRouter, Query

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
    )
):
    """Return notifications for upcoming internship deadlines."""

    notifications = get_deadline_notifications(
        alert_days=alert_days
    )

    return NotificationResponse(
        notifications=notifications
    )