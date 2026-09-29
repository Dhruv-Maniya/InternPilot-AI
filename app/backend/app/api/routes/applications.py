from fastapi import APIRouter, HTTPException

from app.schemas.applications import (
    ApplicationCreateRequest,
    ApplicationItem,
    ApplicationResponse,
    ApplicationStatusUpdateRequest,
)
from app.services.applications_service import (
    add_application,
    get_applications,
    update_application_status,
    remove_application,
)


router = APIRouter(
    prefix="/api/applications",
    tags=["Applications"]
)


@router.post(
    "",
    response_model=ApplicationItem
)
def create_application(
    request: ApplicationCreateRequest
):
    """Create an application record."""

    application = ApplicationItem(
        application_id=request.application_id,
        internship_id=request.internship_id,
        title=request.title,
        company=request.company,
        application_url=request.application_url,
        status=request.status,
    )

    return add_application(application)


@router.get(
    "",
    response_model=ApplicationResponse
)
def get_application_list():
    """Return all application records."""

    return ApplicationResponse(
        applications=get_applications()
    )


@router.patch(
    "/{application_id}/status",
    response_model=ApplicationItem
)
def update_application(
    application_id: str,
    request: ApplicationStatusUpdateRequest
):
    """Update the status of an application."""

    application = update_application_status(
        application_id=application_id,
        status=request.status
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found or invalid application status."
        )

    return application


@router.delete(
    "/{application_id}"
)
def delete_application(
    application_id: str
):
    """Remove an application record."""

    removed = remove_application(application_id)

    if not removed:
        raise HTTPException(
            status_code=404,
            detail="Application not found."
        )

    return {
        "message": "Application removed successfully."
    }