from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_auth_me_requires_authentication():
    response = client.get("/api/auth/me")

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Not authenticated"
    }


def test_auth_me_rejects_invalid_token(monkeypatch):
    def mock_get_user_from_token(token):
        from fastapi import HTTPException, status

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token."
        )

    monkeypatch.setattr(
        "app.api.dependencies.get_user_from_token",
        mock_get_user_from_token
    )

    response = client.get(
        "/api/auth/me",
        headers={
            "Authorization": "Bearer invalid-token"
        }
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Invalid authentication token."
    }