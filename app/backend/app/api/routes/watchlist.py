from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import get_current_access_token, get_current_user
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

router = APIRouter(prefix="/api/watchlist", tags=["Watchlist"])


@router.post("", response_model=WatchlistItem)
def add_watchlist_item(
    request: WatchlistAddRequest,
    user=Depends(get_current_user),
    access_token=Depends(get_current_access_token),
):
    item = WatchlistItem(
        internship_id=request.internship_id,
        title=request.title,
        company=request.company,
        location=request.location,
        application_url=request.application_url,
        deadline=request.deadline,
    )

    try:
        return add_to_watchlist(
            item,
            str(user.id),
            access_token,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save internship to watchlist: {exc}",
        )


@router.get("", response_model=WatchlistResponse)
def get_watchlist_items(
    user=Depends(get_current_user),
    access_token=Depends(get_current_access_token),
):
    try:
        return WatchlistResponse(
            items=get_watchlist(
                str(user.id),
                access_token,
            )
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load watchlist: {exc}",
        )


@router.delete("/{internship_id}")
def delete_watchlist_item(
    internship_id: str,
    user=Depends(get_current_user),
    access_token=Depends(get_current_access_token),
):
    try:
        removed = remove_from_watchlist(
            internship_id,
            str(user.id),
            access_token,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to remove internship from watchlist: {exc}",
        )

    if not removed:
        raise HTTPException(
            status_code=404,
            detail="Internship not found in watchlist.",
        )

    return {"message": "Internship removed from watchlist."}