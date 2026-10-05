from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_resume_analyze_endpoint():
    response = client.post(
        "/api/resume/analyze",
        json={
            "resume_text": (
                "I am a Python developer with experience in SQL and Pandas. "
                "I worked on several projects during my internship."
            )
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["resume_text"].startswith("I am a Python developer")
    assert "Python" in data["skills"]
    assert "SQL" in data["skills"]
    assert "Pandas" in data["skills"]
    assert data["skill_count"] == 3
    assert isinstance(data["suggestions"], list)


def test_resume_analyze_rejects_empty_resume():
    response = client.post(
        "/api/resume/analyze",
        json={
            "resume_text": ""
        }
    )

    assert response.status_code == 422