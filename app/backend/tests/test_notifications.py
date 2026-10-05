from datetime import date

from app.schemas.watchlist import WatchlistItem
from app.services import notification_service


def make_watchlist_item(
    internship_id: str,
    title: str,
    company: str,
    deadline: str | None,
) -> WatchlistItem:
    return WatchlistItem(
        internship_id=internship_id,
        title=title,
        company=company,
        location="Mumbai",
        application_url="https://example.com/apply",
        deadline=deadline,
    )


def test_parse_deadline_valid_date():
    result = notification_service.parse_deadline("2026-10-02")

    assert result == date(2026, 10, 2)


def test_parse_deadline_invalid_date():
    result = notification_service.parse_deadline("invalid-date")

    assert result is None


def test_calculate_days_remaining():
    result = notification_service.calculate_days_remaining(
        "2026-10-03",
        today=date(2026, 9, 30)
    )

    assert result == 3


def test_create_deadline_message_today():
    assert notification_service.create_deadline_message(0) == (
        "Application deadline is today."
    )


def test_create_deadline_message_tomorrow():
    assert notification_service.create_deadline_message(1) == (
        "Application deadline is tomorrow."
    )


def test_create_deadline_message_multiple_days():
    assert notification_service.create_deadline_message(3) == (
        "Application deadline is in 3 days."
    )


def test_get_deadline_notifications(monkeypatch):
    watchlist = [
        make_watchlist_item(
            internship_id="1",
            title="Data Science Intern",
            company="ABC",
            deadline="2026-10-02",
        )
    ]

    def fake_get_watchlist(user_id, access_token):
        assert user_id == "test-user"
        assert access_token == "test-token"
        return watchlist

    monkeypatch.setattr(
        notification_service.watchlist_service,
        "get_watchlist",
        fake_get_watchlist,
    )

    result = notification_service.get_deadline_notifications(
        user_id="test-user",
        access_token="test-token",
        today=date(2026, 9, 30),
    )

    assert len(result) == 1
    assert result[0].internship_id == "1"
    assert result[0].days_remaining == 2
    assert result[0].message == (
        "Application deadline is in 2 days."
    )


def test_deadline_outside_alert_window_is_ignored(monkeypatch):
    watchlist = [
        make_watchlist_item(
            internship_id="2",
            title="Python Intern",
            company="XYZ",
            deadline="2026-10-10",
        )
    ]

    monkeypatch.setattr(
        notification_service.watchlist_service,
        "get_watchlist",
        lambda user_id, access_token: watchlist,
    )

    result = notification_service.get_deadline_notifications(
        user_id="test-user",
        access_token="test-token",
        today=date(2026, 9, 30),
    )

    assert result == []


def test_past_deadline_is_ignored(monkeypatch):
    watchlist = [
        make_watchlist_item(
            internship_id="3",
            title="ML Intern",
            company="DEF",
            deadline="2026-09-28",
        )
    ]

    monkeypatch.setattr(
        notification_service.watchlist_service,
        "get_watchlist",
        lambda user_id, access_token: watchlist,
    )

    result = notification_service.get_deadline_notifications(
        user_id="test-user",
        access_token="test-token",
        today=date(2026, 9, 30),
    )

    assert result == []


def test_missing_deadline_is_ignored(monkeypatch):
    watchlist = [
        make_watchlist_item(
            internship_id="4",
            title="Data Analyst Intern",
            company="GHI",
            deadline=None,
        )
    ]

    monkeypatch.setattr(
        notification_service.watchlist_service,
        "get_watchlist",
        lambda user_id, access_token: watchlist,
    )

    result = notification_service.get_deadline_notifications(
        user_id="test-user",
        access_token="test-token",
        today=date(2026, 9, 30),
    )

    assert result == []


def test_invalid_deadline_is_ignored(monkeypatch):
    watchlist = [
        make_watchlist_item(
            internship_id="5",
            title="Software Intern",
            company="JKL",
            deadline="not-a-date",
        )
    ]

    monkeypatch.setattr(
        notification_service.watchlist_service,
        "get_watchlist",
        lambda user_id, access_token: watchlist,
    )

    result = notification_service.get_deadline_notifications(
        user_id="test-user",
        access_token="test-token",
        today=date(2026, 9, 30),
    )

    assert result == []