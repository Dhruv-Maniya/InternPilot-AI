import httpx

from app.schemas.applications import ApplicationItem
from app.services.supabase_service import supabase_service


VALID_STATUSES = {
    "Applied",
    "Shortlisted",
    "Interview",
    "Rejected",
    "Selected",
}


def add_application(
    application: ApplicationItem,
    user_id: str,
    access_token: str
) -> ApplicationItem:
    normalized_status = application.status.strip().title()

    if normalized_status not in VALID_STATUSES:
        raise ValueError("Invalid application status.")

    data = {
        "user_id": user_id,
        "application_id": application.application_id,
        "internship_id": application.internship_id,
        "title": application.title,
        "company": application.company,
        "application_url": application.application_url,
        "status": normalized_status,
    }

    headers = supabase_service.get_user_rest_headers(access_token)
    headers["Prefer"] = "return=representation"

    response = httpx.post(
        supabase_service.get_rest_url("applications"),
        headers=headers,
        json=data,
        timeout=30,
    )

    if response.status_code not in (200, 201):
        raise RuntimeError(
            f"Failed to save application: {response.text}"
        )

    saved = response.json()[0]

    return ApplicationItem(
        application_id=saved["application_id"],
        internship_id=saved["internship_id"],
        title=saved["title"],
        company=saved["company"],
        application_url=saved["application_url"],
        status=saved["status"],
    )


def get_applications(
    user_id: str,
    access_token: str
) -> list[ApplicationItem]:
    client = supabase_service.get_user_client(access_token)

    response = (
        client
        .table("applications")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    return [
        ApplicationItem(
            application_id=row["application_id"],
            internship_id=row["internship_id"],
            title=row["title"],
            company=row["company"],
            application_url=row["application_url"],
            status=row["status"],
        )
        for row in response.data
    ]


def update_application_status(
    application_id: str,
    status: str,
    user_id: str,
    access_token: str
) -> ApplicationItem | None:
    normalized_status = status.strip().title()

    if normalized_status not in VALID_STATUSES:
        return None

    client = supabase_service.get_user_client(access_token)

    response = (
        client
        .table("applications")
        .update({"status": normalized_status})
        .eq("application_id", application_id)
        .eq("user_id", user_id)
        .execute()
    )

    if not response.data:
        return None

    row = response.data[0]

    return ApplicationItem(
        application_id=row["application_id"],
        internship_id=row["internship_id"],
        title=row["title"],
        company=row["company"],
        application_url=row["application_url"],
        status=row["status"],
    )


def remove_application(
    application_id: str,
    user_id: str,
    access_token: str
) -> bool:
    client = supabase_service.get_user_client(access_token)

    response = (
        client
        .table("applications")
        .delete()
        .eq("application_id", application_id)
        .eq("user_id", user_id)
        .execute()
    )

    return bool(response.data)