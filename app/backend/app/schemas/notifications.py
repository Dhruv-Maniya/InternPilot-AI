from pydantic import BaseModel


class DeadlineNotification(BaseModel):
    internship_id: str
    title: str
    company: str
    deadline: str
    days_remaining: int
    message: str


class NotificationResponse(BaseModel):
    notifications: list[DeadlineNotification]