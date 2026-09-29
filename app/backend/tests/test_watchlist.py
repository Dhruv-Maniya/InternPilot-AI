from app.schemas.watchlist import WatchlistItem
from app.services.watchlist_service import (
    WATCHLIST,
    add_to_watchlist,
    get_watchlist,
    remove_from_watchlist,
)


def create_test_item(
    internship_id: str = "internship-001"
) -> WatchlistItem:
    return WatchlistItem(
        internship_id=internship_id,
        title="Data Analyst Intern",
        company="ABC Technologies",
        location="Mumbai",
        application_url="https://example.com/apply",
        deadline="2026-10-15",
    )


def test_add_to_watchlist():
    WATCHLIST.clear()

    item = create_test_item()

    result = add_to_watchlist(item)

    assert result == item
    assert len(WATCHLIST) == 1
    assert WATCHLIST[0].internship_id == "internship-001"


def test_duplicate_internship_is_not_added():
    WATCHLIST.clear()

    item = create_test_item()

    add_to_watchlist(item)
    add_to_watchlist(item)

    assert len(WATCHLIST) == 1


def test_get_watchlist_returns_saved_items():
    WATCHLIST.clear()

    item = create_test_item()

    add_to_watchlist(item)

    result = get_watchlist()

    assert len(result) == 1
    assert result[0].title == "Data Analyst Intern"


def test_remove_from_watchlist():
    WATCHLIST.clear()

    item = create_test_item()

    add_to_watchlist(item)

    result = remove_from_watchlist("internship-001")

    assert result is True
    assert len(WATCHLIST) == 0


def test_remove_nonexistent_internship():
    WATCHLIST.clear()

    result = remove_from_watchlist("unknown-internship")

    assert result is False