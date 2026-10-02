from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import (
    get_current_access_token,
    get_current_user,
)
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
    request: ApplicationCreateRequest,
    user=Depends(get_current_user),
    access_token=Depends(get_current_access_token),
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

    try:
        return add_application(
            application=application,
            user_id=str(user.id),
            access_token=access_token,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save application: {exc}"
        )


@router.get(
    "",
    response_model=ApplicationResponse
)
def get_application_list(
    user=Depends(get_current_user),
    access_token=Depends(get_current_access_token),
):
    """Return the authenticated user's applications."""

    try:
        return ApplicationResponse(
            applications=get_applications(
                user_id=str(user.id),
                access_token=access_token,
            )
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load applications: {exc}"
        )


@router.patch(
    "/{application_id}/status",
    response_model=ApplicationItem
)
def update_application(
    application_id: str,
    request: ApplicationStatusUpdateRequest,
    user=Depends(get_current_user),
    access_token=Depends(get_current_access_token),
):
    """Update the status of an application."""

    try:
        application = update_application_status(
            application_id=application_id,
            status=request.status,
            user_id=str(user.id),
            access_token=access_token,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update application: {exc}"
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
    application_id: str,
    user=Depends(get_current_user),
    access_token=Depends(get_current_access_token),
):
    """Remove an application record."""

    try:
        removed = remove_application(
            application_id=application_id,
            user_id=str(user.id),
            access_token=access_token,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to remove application: {exc}"
        )

    if not removed:
        raise HTTPException(
            status_code=404,
            detail="Application not found."
        )

    return {
        "message": "Application removed successfully."
    }