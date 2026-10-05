from datetime import date, timedelta

from fastapi.testclient import TestClient

from app.main import app
from app.api.dependencies import get_current_access_token, get_current_user
from app.services import notification_service


client = TestClient(app)


class FakeUser:
    id = "test-user"


def fake_current_user():
    return FakeUser()


def fake_current_access_token():
    return "test-token"


def make_watchlist_item(
    internship_id: str,
    title: str,
    company: str,
    deadline: str | None,
):
    from app.schemas.watchlist import WatchlistItem

    return WatchlistItem(
        internship_id=internship_id,
        title=title,
        company=company,
        location="Mumbai",
        application_url="https://example.com/apply",
        deadline=deadline,
    )


def setup_authentication():
    app.dependency_overrides[get_current_user] = fake_current_user
    app.dependency_overrides[get_current_access_token] = (
        fake_current_access_token
    )


def clear_authentication():
    app.dependency_overrides.clear()


def test_get_deadline_notifications(monkeypatch):
    setup_authentication()

    deadline = (
        date.today() + timedelta(days=2)
    ).isoformat()

    watchlist = [
        make_watchlist_item(
            internship_id="api-test-001",
            title="Data Science Intern",
            company="ABC Technologies",
            deadline=deadline,
        )
    ]

    monkeypatch.setattr(
        notification_service.watchlist_service,
        "get_watchlist",
        lambda user_id, access_token: watchlist,
    )

    try:
        response = client.get(
            "/api/notifications/deadlines"
        )

        assert response.status_code == 200

        data = response.json()

        assert len(data["notifications"]) == 1
        assert data["notifications"][0]["internship_id"] == (
            "api-test-001"
        )
        assert data["notifications"][0]["days_remaining"] == 2

    finally:
        clear_authentication()


def test_deadline_outside_alert_window_is_not_returned(
    monkeypatch
):
    setup_authentication()

    deadline = (
        date.today() + timedelta(days=5)
    ).isoformat()

    watchlist = [
        make_watchlist_item(
            internship_id="api-test-002",
            title="Python Intern",
            company="XYZ Technologies",
            deadline=deadline,
        )
    ]

    monkeypatch.setattr(
        notification_service.watchlist_service,
        "get_watchlist",
        lambda user_id, access_token: watchlist,
    )

    try:
        response = client.get(
            "/api/notifications/deadlines"
        )

        assert response.status_code == 200

        data = response.json()

        assert data["notifications"] == []

    finally:
        clear_authentication()


def test_custom_alert_window(monkeypatch):
    setup_authentication()

    deadline = (
        date.today() + timedelta(days=5)
    ).isoformat()

    watchlist = [
        make_watchlist_item(
            internship_id="api-test-003",
            title="Machine Learning Intern",
            company="DEF Technologies",
            deadline=deadline,
        )
    ]

    monkeypatch.setattr(
        notification_service.watchlist_service,
        "get_watchlist",
        lambda user_id, access_token: watchlist,
    )

    try:
        response = client.get(
            "/api/notifications/deadlines?alert_days=7"
        )

        assert response.status_code == 200

        data = response.json()

        assert len(data["notifications"]) == 1
        assert data["notifications"][0]["internship_id"] == (
            "api-test-003"
        )
        assert data["notifications"][0]["days_remaining"] == 5

    finally:
        clear_authentication()