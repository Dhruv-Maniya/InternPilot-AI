from app.schemas.watchlist import WatchlistItem


WATCHLIST: list[WatchlistItem] = []


def add_to_watchlist(item: WatchlistItem) -> WatchlistItem:
    """Add an internship to the watchlist."""

    for existing_item in WATCHLIST:
        if existing_item.internship_id == item.internship_id:
            return existing_item

    WATCHLIST.append(item)

    return item


def get_watchlist() -> list[WatchlistItem]:
    """Return all saved internships."""

    return WATCHLIST.copy()


def remove_from_watchlist(internship_id: str) -> bool:
    """Remove an internship from the watchlist."""

    for index, item in enumerate(WATCHLIST):
        if item.internship_id == internship_id:
            WATCHLIST.pop(index)
            return True

    return False