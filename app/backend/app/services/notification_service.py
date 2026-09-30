from datetime import date, datetime

from app.schemas.notifications import DeadlineNotification
from app.services import watchlist_service


DEFAULT_ALERT_DAYS = 3


def parse_deadline(deadline: str) -> date | None:
    """Convert a deadline string into a date."""

    try:
        return datetime.strptime(
            deadline.strip(),
            "%Y-%m-%d"
        ).date()
    except (ValueError, AttributeError):
        return None


def calculate_days_remaining(
    deadline: str,
    today: date | None = None
) -> int | None:
    """Calculate the number of days remaining until a deadline."""

    deadline_date = parse_deadline(deadline)

    if deadline_date is None:
        return None

    current_date = today or date.today()

    return (deadline_date - current_date).days


def create_deadline_message(days_remaining: int) -> str:
    """Create a user-friendly deadline message."""

    if days_remaining == 0:
        return "Application deadline is today."

    if days_remaining == 1:
        return "Application deadline is tomorrow."

    return (
        f"Application deadline is in "
        f"{days_remaining} days."
    )


def get_deadline_notifications(
    alert_days: int = DEFAULT_ALERT_DAYS,
    today: date | None = None
) -> list[DeadlineNotification]:
    """Return notifications for upcoming internship deadlines."""

    notifications = []

    current_date = today or date.today()

    for internship in watchlist_service.get_watchlist():

        if not internship.deadline:
            continue

        days_remaining = calculate_days_remaining(
            internship.deadline,
            current_date
        )

        if days_remaining is None:
            continue

        if 0 <= days_remaining <= alert_days:
            notifications.append(
                DeadlineNotification(
                    internship_id=internship.internship_id,
                    title=internship.title,
                    company=internship.company,
                    deadline=internship.deadline,
                    days_remaining=days_remaining,
                    message=create_deadline_message(
                        days_remaining
                    )
                )
            )

    return notifications