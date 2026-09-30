from datetime import date

from app.schemas.watchlist import WatchlistItem
from app.services import notification_service
from app.services.notification_service import (
    parse_deadline,
    calculate_days_remaining,
    create_deadline_message,
    get_deadline_notifications,
)
from app.services import watchlist_service

def test_parse_deadline_valid_date():
    result = parse_deadline("2026-10-02")

    assert result == date(2026, 10, 2)


def test_parse_deadline_invalid_date():
    result = parse_deadline("invalid-date")

    assert result is None


def test_calculate_days_remaining():
    result = calculate_days_remaining(
        "2026-10-03",
        today=date(2026, 9, 30)
    )

    assert result == 3


def test_create_deadline_message_today():
    assert create_deadline_message(0) == (
        "Application deadline is today."
    )


def test_create_deadline_message_tomorrow():
    assert create_deadline_message(1) == (
        "Application deadline is tomorrow."
    )


def test_create_deadline_message_multiple_days():
    assert create_deadline_message(3) == (
        "Application deadline is in 3 days."
    )


def test_get_deadline_notifications():
    watchlist = [
        WatchlistItem(
            internship_id="1",
            title="Data Science Intern",
            company="ABC",
            location="Mumbai",
            application_url="https://example.com/1",
            deadline="2026-10-02",
        )
    ]

    watchlist_service.WATCHLIST.clear()
    watchlist_service.WATCHLIST.extend(watchlist)

    result = get_deadline_notifications(
        today=date(2026, 9, 30)
    )

    assert len(result) == 1
    assert result[0].internship_id == "1"
    assert result[0].days_remaining == 2
    assert result[0].message == (
        "Application deadline is in 2 days."
    )

    watchlist_service.WATCHLIST.clear()


def test_deadline_outside_alert_window_is_ignored():
    watchlist = [
        WatchlistItem(
            internship_id="2",
            title="Python Intern",
            company="XYZ",
            location="Pune",
            application_url="https://example.com/2",
            deadline="2026-10-10",
        )
    ]

    watchlist_service.WATCHLIST.clear()
    watchlist_service.WATCHLIST.extend(watchlist)

    result = get_deadline_notifications(
        today=date(2026, 9, 30)
    )

    assert result == []

    watchlist_service.WATCHLIST.clear()


def test_past_deadline_is_ignored():
    watchlist = [
        WatchlistItem(
            internship_id="3",
            title="ML Intern",
            company="DEF",
            location="Bangalore",
            application_url="https://example.com/3",
            deadline="2026-09-28",
        )
    ]

    watchlist_service.WATCHLIST.clear()
    watchlist_service.WATCHLIST.extend(watchlist)

    result = get_deadline_notifications(
        today=date(2026, 9, 30)
    )

    assert result == []

    watchlist_service.WATCHLIST.clear()


def test_missing_deadline_is_ignored():
    watchlist = [
        WatchlistItem(
            internship_id="4",
            title="Data Analyst Intern",
            company="GHI",
            location="Delhi",
            application_url="https://example.com/4",
            deadline=None,
        )
    ]

    watchlist_service.WATCHLIST.clear()
    watchlist_service.WATCHLIST.extend(watchlist)

    result = get_deadline_notifications(
        today=date(2026, 9, 30)
    )

    assert result == []

    watchlist_service.WATCHLIST.clear()


def test_invalid_deadline_is_ignored():
    watchlist = [
        WatchlistItem(
            internship_id="5",
            title="Software Intern",
            company="JKL",
            location="Remote",
            application_url="https://example.com/5",
            deadline="not-a-date",
        )
    ]

    watchlist_service.WATCHLIST.clear()
    watchlist_service.WATCHLIST.extend(watchlist)

    result = get_deadline_notifications(
        today=date(2026, 9, 30)
    )

    assert result == []

    watchlist_service.WATCHLIST.clear()