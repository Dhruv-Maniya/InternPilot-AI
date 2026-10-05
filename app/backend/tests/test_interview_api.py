from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_interview_questions_endpoint():
    response = client.post(
        "/api/interview/questions",
        json={
            "role": "Data Analyst",
            "interview_type": "Technical"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["role"] == "Data Analyst"
    assert data["interview_type"] == "Technical"
    assert len(data["questions"]) == 3


def test_interview_questions_endpoint_is_case_insensitive():
    response = client.post(
        "/api/interview/questions",
        json={
            "role": "data analyst",
            "interview_type": "technical"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data["questions"]) == 3


def test_interview_questions_returns_404_for_unknown_role():
    response = client.post(
        "/api/interview/questions",
        json={
            "role": "Cybersecurity Analyst",
            "interview_type": "Technical"
        }
    )

    assert response.status_code == 404

    data = response.json()

    assert data["detail"] == (
        "No interview questions found for the selected role "
        "and interview type."
    )


def test_interview_questions_rejects_empty_role():
    response = client.post(
        "/api/interview/questions",
        json={
            "role": "",
            "interview_type": "Technical"
        }
    )

    assert response.status_code == 422