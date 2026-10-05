import pytest

from app.schemas.applications import ApplicationItem
from app.services import applications_service


USER_ID = "user-001"
ACCESS_TOKEN = "test-access-token"


def create_test_application(
    application_id: str = "application-001"
) -> ApplicationItem:
    return ApplicationItem(
        application_id=application_id,
        internship_id="internship-001",
        title="Data Analyst Intern",
        company="ABC Technologies",
        application_url="https://example.com/apply",
        status="Applied",
    )


class FakeResponse:
    def __init__(self, data=None, status_code=200, text=""):
        self._data = data or []
        self.status_code = status_code
        self.text = text

    def json(self):
        return self._data


class FakeQuery:
    def __init__(self, data=None):
        self.data = data or []
        self.filters = []
        self.updated_data = None
        self.deleted = False

    def select(self, *_args):
        return self

    def update(self, data):
        self.updated_data = data
        return self

    def delete(self):
        self.deleted = True
        return self

    def eq(self, field, value):
        self.filters.append((field, value))
        return self

    def order(self, *_args, **_kwargs):
        return self

    def execute(self):
        return type("Response", (), {"data": self.data})()


class FakeClient:
    def __init__(self, data=None):
        self.query = FakeQuery(data)

    def table(self, table_name):
        assert table_name == "applications"
        return self.query


def test_add_application(monkeypatch):
    application = create_test_application()

    response_data = [{
        "application_id": "application-001",
        "internship_id": "internship-001",
        "title": "Data Analyst Intern",
        "company": "ABC Technologies",
        "application_url": "https://example.com/apply",
        "status": "Applied",
    }]

    monkeypatch.setattr(
        applications_service.supabase_service,
        "get_user_rest_headers",
        lambda token: {
            "apikey": "test-key",
            "Authorization": f"Bearer {token}",
        },
    )

    monkeypatch.setattr(
        applications_service.supabase_service,
        "get_rest_url",
        lambda table: f"https://test.supabase.co/rest/v1/{table}",
    )

    def fake_post(url, headers, json, timeout):
        assert url.endswith("/applications")
        assert json["user_id"] == USER_ID
        assert json["application_id"] == "application-001"
        assert json["status"] == "Applied"
        assert headers["Authorization"] == f"Bearer {ACCESS_TOKEN}"
        return FakeResponse(response_data, 201)

    monkeypatch.setattr(
        applications_service.httpx,
        "post",
        fake_post,
    )

    result = applications_service.add_application(
        application,
        USER_ID,
        ACCESS_TOKEN,
    )

    assert result == application


def test_add_application_normalizes_status(monkeypatch):
    application = create_test_application()
    application.status = "interview"

    response_data = [{
        "application_id": "application-001",
        "internship_id": "internship-001",
        "title": "Data Analyst Intern",
        "company": "ABC Technologies",
        "application_url": "https://example.com/apply",
        "status": "Interview",
    }]

    monkeypatch.setattr(
        applications_service.supabase_service,
        "get_user_rest_headers",
        lambda token: {},
    )

    monkeypatch.setattr(
        applications_service.supabase_service,
        "get_rest_url",
        lambda table: f"https://test.supabase.co/rest/v1/{table}",
    )

    def fake_post(url, headers, json, timeout):
        assert json["status"] == "Interview"
        return FakeResponse(response_data, 201)

    monkeypatch.setattr(
        applications_service.httpx,
        "post",
        fake_post,
    )

    result = applications_service.add_application(
        application,
        USER_ID,
        ACCESS_TOKEN,
    )

    assert result.status == "Interview"


def test_invalid_application_status_raises_error():
    application = create_test_application()
    application.status = "Pending"

    with pytest.raises(ValueError, match="Invalid application status"):
        applications_service.add_application(
            application,
            USER_ID,
            ACCESS_TOKEN,
        )


def test_get_applications(monkeypatch):
    rows = [{
        "application_id": "application-001",
        "internship_id": "internship-001",
        "title": "Data Analyst Intern",
        "company": "ABC Technologies",
        "application_url": "https://example.com/apply",
        "status": "Applied",
    }]

    client = FakeClient(rows)

    monkeypatch.setattr(
        applications_service.supabase_service,
        "get_user_client",
        lambda token: client,
    )

    result = applications_service.get_applications(
        USER_ID,
        ACCESS_TOKEN,
    )

    assert len(result) == 1
    assert result[0].application_id == "application-001"
    assert result[0].title == "Data Analyst Intern"
    assert ("user_id", USER_ID) in client.query.filters


def test_get_applications_returns_empty_list(monkeypatch):
    client = FakeClient([])

    monkeypatch.setattr(
        applications_service.supabase_service,
        "get_user_client",
        lambda token: client,
    )

    result = applications_service.get_applications(
        USER_ID,
        ACCESS_TOKEN,
    )

    assert result == []


def test_update_application_status(monkeypatch):
    rows = [{
        "application_id": "application-001",
        "internship_id": "internship-001",
        "title": "Data Analyst Intern",
        "company": "ABC Technologies",
        "application_url": "https://example.com/apply",
        "status": "Interview",
    }]

    client = FakeClient(rows)

    monkeypatch.setattr(
        applications_service.supabase_service,
        "get_user_client",
        lambda token: client,
    )

    result = applications_service.update_application_status(
        application_id="application-001",
        status="interview",
        user_id=USER_ID,
        access_token=ACCESS_TOKEN,
    )

    assert result is not None
    assert result.status == "Interview"
    assert client.query.updated_data == {"status": "Interview"}
    assert ("application_id", "application-001") in client.query.filters
    assert ("user_id", USER_ID) in client.query.filters


def test_invalid_application_status_returns_none(monkeypatch):
    result = applications_service.update_application_status(
        application_id="application-001",
        status="Pending",
        user_id=USER_ID,
        access_token=ACCESS_TOKEN,
    )

    assert result is None


def test_update_nonexistent_application_returns_none(monkeypatch):
    client = FakeClient([])

    monkeypatch.setattr(
        applications_service.supabase_service,
        "get_user_client",
        lambda token: client,
    )

    result = applications_service.update_application_status(
        application_id="unknown-application",
        status="Interview",
        user_id=USER_ID,
        access_token=ACCESS_TOKEN,
    )

    assert result is None


def test_remove_application(monkeypatch):
    client = FakeClient([{"application_id": "application-001"}])

    monkeypatch.setattr(
        applications_service.supabase_service,
        "get_user_client",
        lambda token: client,
    )

    result = applications_service.remove_application(
        "application-001",
        USER_ID,
        ACCESS_TOKEN,
    )

    assert result is True
    assert client.query.deleted is True
    assert ("application_id", "application-001") in client.query.filters
    assert ("user_id", USER_ID) in client.query.filters


def test_remove_nonexistent_application(monkeypatch):
    client = FakeClient([])

    monkeypatch.setattr(
        applications_service.supabase_service,
        "get_user_client",
        lambda token: client,
    )

    result = applications_service.remove_application(
        "unknown-application",
        USER_ID,
        ACCESS_TOKEN,
    )

    assert result is False
