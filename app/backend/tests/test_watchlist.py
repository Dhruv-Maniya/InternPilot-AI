from app.schemas.watchlist import WatchlistItem
from app.services import watchlist_service


class FakeResponse:
    def __init__(self, data=None, status_code=200, text=""):
        self.data = data or []
        self.status_code = status_code
        self.text = text

    def json(self):
        return self.data


class FakeQuery:
    def __init__(self, data=None):
        self.data = data or []

    def select(self, *args, **kwargs):
        return self

    def eq(self, *args, **kwargs):
        return self

    def order(self, *args, **kwargs):
        return self

    def execute(self):
        return FakeResponse(self.data)


class FakeClient:
    def __init__(self, data=None):
        self.data = data or []

    def table(self, table_name):
        assert table_name == "watchlist"
        return FakeQuery(self.data)


def create_test_item(
    internship_id: str = "internship-001",
) -> WatchlistItem:
    return WatchlistItem(
        internship_id=internship_id,
        title="Data Analyst Intern",
        company="ABC Technologies",
        location="Mumbai",
        application_url="https://example.com/apply",
        deadline="2026-10-15",
    )


def test_add_to_watchlist(monkeypatch):
    item = create_test_item()

    response_data = [
        {
            "internship_id": "internship-001",
            "title": "Data Analyst Intern",
            "company": "ABC Technologies",
            "location": "Mumbai",
            "application_url": "https://example.com/apply",
            "deadline": "2026-10-15",
        }
    ]

    class FakePostResponse:
        status_code = 201
        text = ""

        def json(self):
            return response_data

    def fake_post(*args, **kwargs):
        return FakePostResponse()

    monkeypatch.setattr(
        watchlist_service.httpx,
        "post",
        fake_post,
    )

    result = watchlist_service.add_to_watchlist(
        item,
        "user-001",
        "token-001",
    )

    assert result == item


def test_get_watchlist_returns_saved_items(monkeypatch):
    item = create_test_item()

    fake_client = FakeClient(
        [
            {
                "internship_id": item.internship_id,
                "title": item.title,
                "company": item.company,
                "location": item.location,
                "application_url": item.application_url,
                "deadline": item.deadline,
            }
        ]
    )

    monkeypatch.setattr(
        watchlist_service.supabase_service,
        "get_user_client",
        lambda access_token: fake_client,
    )

    result = watchlist_service.get_watchlist(
        "user-001",
        "token-001",
    )

    assert len(result) == 1
    assert result[0].internship_id == "internship-001"
    assert result[0].title == "Data Analyst Intern"


def test_get_watchlist_returns_empty_list(monkeypatch):
    fake_client = FakeClient([])

    monkeypatch.setattr(
        watchlist_service.supabase_service,
        "get_user_client",
        lambda access_token: fake_client,
    )

    result = watchlist_service.get_watchlist(
        "user-001",
        "token-001",
    )

    assert result == []


def test_remove_from_watchlist(monkeypatch):
    class FakeDeleteQuery:
        def delete(self):
            return self

        def eq(self, *args, **kwargs):
            return self

        def execute(self):
            return FakeResponse(
                [
                    {
                        "internship_id": "internship-001",
                    }
                ]
            )

    class FakeDeleteClient:
        def table(self, table_name):
            assert table_name == "watchlist"
            return FakeDeleteQuery()

    monkeypatch.setattr(
        watchlist_service.supabase_service,
        "get_user_client",
        lambda access_token: FakeDeleteClient(),
    )

    result = watchlist_service.remove_from_watchlist(
        "internship-001",
        "user-001",
        "token-001",
    )

    assert result is True


def test_remove_nonexistent_internship(monkeypatch):
    class FakeDeleteQuery:
        def delete(self):
            return self

        def eq(self, *args, **kwargs):
            return self

        def execute(self):
            return FakeResponse([])

    class FakeDeleteClient:
        def table(self, table_name):
            assert table_name == "watchlist"
            return FakeDeleteQuery()

    monkeypatch.setattr(
        watchlist_service.supabase_service,
        "get_user_client",
        lambda access_token: FakeDeleteClient(),
    )

    result = watchlist_service.remove_from_watchlist(
        "unknown-internship",
        "user-001",
        "token-001",
    )

    assert result is False