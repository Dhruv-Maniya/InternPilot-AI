import httpx
from app.schemas.watchlist import WatchlistItem
from app.services.supabase_service import supabase_service


def add_to_watchlist(
    item: WatchlistItem,
    user_id: str,
    access_token: str
) -> WatchlistItem:
    data = {
        "user_id": user_id,
        "internship_id": item.internship_id,
        "title": item.title,
        "company": item.company,
        "location": item.location,
        "application_url": item.application_url,
        "deadline": item.deadline,
    }

    headers = supabase_service.get_user_rest_headers(access_token)
    headers["Prefer"] = "return=representation"

    response = httpx.post(
        supabase_service.get_rest_url("watchlist"),
        headers=headers,
        json=data,
        timeout=30,
    )

    if response.status_code not in (200, 201):
        raise RuntimeError(
            f"Failed to save internship to watchlist: {response.text}"
        )

    saved = response.json()[0]

    return WatchlistItem(
        internship_id=saved["internship_id"],
        title=saved["title"],
        company=saved["company"],
        location=saved["location"],
        application_url=saved["application_url"],
        deadline=str(saved["deadline"]) if saved["deadline"] else None,
    )


def get_watchlist(
    user_id: str,
    access_token: str
) -> list[WatchlistItem]:
    client = supabase_service.get_user_client(access_token)

    response = (
        client
        .table("watchlist")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    return [
        WatchlistItem(
            internship_id=row["internship_id"],
            title=row["title"],
            company=row["company"],
            location=row["location"],
            application_url=row["application_url"],
            deadline=str(row["deadline"]) if row["deadline"] else None,
        )
        for row in response.data
    ]


def remove_from_watchlist(
    internship_id: str,
    user_id: str,
    access_token: str
) -> bool:
    client = supabase_service.get_user_client(access_token)

    response = (
        client
        .table("watchlist")
        .delete()
        .eq("internship_id", internship_id)
        .eq("user_id", user_id)
        .execute()
    )

    return bool(response.data)