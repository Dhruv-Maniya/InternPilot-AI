from fastapi.testclient import TestClient
from openai import InternalServerError
from httpx import Request, Response

from app.main import app
from app.api.routes import interview as interview_route


client = TestClient(app)


def test_interview_evaluate_endpoint(monkeypatch):
    async def mock_evaluate_interview_answer(
        question: str,
        answer: str
    ):
        assert question == "What is overfitting?"
        assert answer == "Overfitting happens when a model learns the training data too closely."

        return "Score: 9/10. Good explanation."

    monkeypatch.setattr(
        interview_route,
        "evaluate_interview_answer",
        mock_evaluate_interview_answer
    )

    response = client.post(
        "/api/interview/evaluate",
        json={
            "question": "What is overfitting?",
            "answer": "Overfitting happens when a model learns the training data too closely."
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["question"] == "What is overfitting?"
    assert data["answer"].startswith("Overfitting happens")
    assert data["feedback"] == "Score: 9/10. Good explanation."


def test_interview_evaluate_rejects_empty_answer():
    response = client.post(
        "/api/interview/evaluate",
        json={
            "question": "What is overfitting?",
            "answer": ""
        }
    )

    assert response.status_code == 422

def test_interview_evaluate_returns_503_when_ai_is_unavailable(monkeypatch):
    async def mock_evaluate_interview_answer(
        question: str,
        answer: str
    ):
        request = Request(
            "POST",
            "https://generativelanguage.googleapis.com/"
        )

        response = Response(
            503,
            request=request
        )

        raise InternalServerError(
            "Gemini temporarily unavailable",
            response=response,
            body=None
        )

    monkeypatch.setattr(
        interview_route,
        "evaluate_interview_answer",
        mock_evaluate_interview_answer
    )

    response = client.post(
        "/api/interview/evaluate",
        json={
            "question": "What is overfitting?",
            "answer": "It happens when a model learns the training data too closely."
        }
    )

    assert response.status_code == 503

    data = response.json()

    assert data["detail"] == (
        "Interview AI is temporarily unavailable. "
        "Please try again later."
    )