
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_frontend_origin_is_allowed():
    response = client.options(
        "/api/auth/me",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization",
        },
    )

    assert response.status_code == 200
    assert (
        response.headers["access-control-allow-origin"]
        == "http://localhost:3000"
    )
    assert response.headers["access-control-allow-credentials"] == "true"


def test_unapproved_origin_is_not_allowed():
    response = client.options(
        "/api/auth/me",
        headers={
            "Origin": "http://example.com",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert "access-control-allow-origin" not in response.headers
