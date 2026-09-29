from app.schemas.applications import ApplicationItem


APPLICATIONS: list[ApplicationItem] = []


VALID_STATUSES = {
    "Applied",
    "Shortlisted",
    "Interview",
    "Rejected",
    "Selected",
}


def add_application(
    application: ApplicationItem
) -> ApplicationItem:
    """Add an application to the application tracker."""

    for existing_application in APPLICATIONS:
        if existing_application.application_id == application.application_id:
            return existing_application

    APPLICATIONS.append(application)

    return application


def get_applications() -> list[ApplicationItem]:
    """Return all applications."""

    return APPLICATIONS.copy()


def update_application_status(
    application_id: str,
    status: str
) -> ApplicationItem | None:
    """Update the status of an existing application."""
    
    normalized_status = status.strip().title()

    if normalized_status not in VALID_STATUSES:
        return None

    for application in APPLICATIONS:
        if application.application_id == application_id:
            application.status = normalized_status
            return application

    return None


def remove_application(
    application_id: str
) -> bool:
    """Remove an application."""

    for index, application in enumerate(APPLICATIONS):
        if application.application_id == application_id:
            APPLICATIONS.pop(index)
            return True

    return False