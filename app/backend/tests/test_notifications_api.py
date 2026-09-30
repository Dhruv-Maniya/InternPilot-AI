from datetime import date, timedelta

from fastapi.testclient import TestClient

from app.main import app
from app.services import watchlist_service


client = TestClient(app)


def clear_watchlist():
    watchlist_service.WATCHLIST.clear()


def test_get_deadline_notifications():
    clear_watchlist()

    deadline = (
        date.today() + timedelta(days=2)
    ).isoformat()

    response = client.post(
        "/api/watchlist",
        json={
            "internship_id": "api-test-001",
            "title": "Data Science Intern",
            "company": "ABC Technologies",
            "location": "Mumbai",
            "application_url": "https://example.com/apply",
            "deadline": deadline,
        }
    )

    assert response.status_code == 200

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

    clear_watchlist()


def test_deadline_outside_alert_window_is_not_returned():
    clear_watchlist()

    deadline = (
        date.today() + timedelta(days=5)
    ).isoformat()

    response = client.post(
        "/api/watchlist",
        json={
            "internship_id": "api-test-002",
            "title": "Python Intern",
            "company": "XYZ Technologies",
            "location": "Pune",
            "application_url": "https://example.com/apply",
            "deadline": deadline,
        }
    )

    assert response.status_code == 200

    response = client.get(
        "/api/notifications/deadlines"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["notifications"] == []

    clear_watchlist()


def test_custom_alert_window():
    clear_watchlist()

    deadline = (
        date.today() + timedelta(days=5)
    ).isoformat()

    response = client.post(
        "/api/watchlist",
        json={
            "internship_id": "api-test-003",
            "title": "Machine Learning Intern",
            "company": "DEF Technologies",
            "location": "Bangalore",
            "application_url": "https://example.com/apply",
            "deadline": deadline,
        }
    )

    assert response.status_code == 200

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

    clear_watchlist()