from fastapi import APIRouter, HTTPException

from app.schemas.watchlist import (
    WatchlistAddRequest,
    WatchlistItem,
    WatchlistResponse,
)
from app.services.watchlist_service import (
    add_to_watchlist,
    get_watchlist,
    remove_from_watchlist,
)


router = APIRouter(
    prefix="/api/watchlist",
    tags=["Watchlist"]
)


@router.post(
    "",
    response_model=WatchlistItem
)
def add_watchlist_item(
    request: WatchlistAddRequest
):
    """Add an internship to the watchlist."""

    item = WatchlistItem(
        internship_id=request.internship_id,
        title=request.title,
        company=request.company,
        location=request.location,
        application_url=request.application_url,
        deadline=request.deadline,
    )

    return add_to_watchlist(item)


@router.get(
    "",
    response_model=WatchlistResponse
)
def get_watchlist_items():
    """Return all saved internships."""

    return WatchlistResponse(
        items=get_watchlist()
    )


@router.delete(
    "/{internship_id}"
)
def delete_watchlist_item(
    internship_id: str
):
    """Remove an internship from the watchlist."""

    removed = remove_from_watchlist(internship_id)

    if not removed:
        raise HTTPException(
            status_code=404,
            detail="Internship not found in watchlist."
        )

    return {
        "message": "Internship removed from watchlist."
    }