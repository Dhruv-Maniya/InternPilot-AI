import httpx
import openai
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_analyze_aptitude_success(monkeypatch):
    async def mock_analyze_aptitude_result(
        category,
        total_questions,
        correct_answers,
        score,
        accuracy,
        weak_area,
    ):
        assert category == "Quantitative Aptitude"
        assert total_questions == 10
        assert correct_answers == 7
        assert score == 7
        assert accuracy == 70.0
        assert weak_area is None

        return "Good performance. Keep practicing to improve further."

    monkeypatch.setattr(
        "app.api.routes.aptitude.analyze_aptitude_result",
        mock_analyze_aptitude_result
    )

    response = client.post(
        "/api/aptitude/analyze",
        json={
            "category": "Quantitative Aptitude",
            "total_questions": 10,
            "correct_answers": 7,
            "score": 7,
            "accuracy": 70.0,
            "weak_area": None,
        }
    )

    assert response.status_code == 200
    assert response.json() == {
        "analysis": "Good performance. Keep practicing to improve further."
    }


def test_analyze_aptitude_with_weak_area(monkeypatch):
    async def mock_analyze_aptitude_result(
        category,
        total_questions,
        correct_answers,
        score,
        accuracy,
        weak_area,
    ):
        assert weak_area == "Quantitative Aptitude"

        return "Focus more on percentages and arithmetic."

    monkeypatch.setattr(
        "app.api.routes.aptitude.analyze_aptitude_result",
        mock_analyze_aptitude_result
    )

    response = client.post(
        "/api/aptitude/analyze",
        json={
            "category": "Quantitative Aptitude",
            "total_questions": 10,
            "correct_answers": 3,
            "score": 3,
            "accuracy": 30.0,
            "weak_area": "Quantitative Aptitude",
        }
    )

    assert response.status_code == 200
    assert response.json() == {
        "analysis": "Focus more on percentages and arithmetic."
    }


def test_analyze_aptitude_rejects_invalid_accuracy():
    response = client.post(
        "/api/aptitude/analyze",
        json={
            "category": "Quantitative Aptitude",
            "total_questions": 10,
            "correct_answers": 7,
            "score": 7,
            "accuracy": 120.0,
            "weak_area": None,
        }
    )

    assert response.status_code == 422

def test_analyze_aptitude_handles_ai_unavailable(monkeypatch):
    async def mock_analyze_aptitude_result(
        category,
        total_questions,
        correct_answers,
        score,
        accuracy,
        weak_area,
    ):
        raise openai.InternalServerError(
            "Gemini temporarily unavailable",
            response=httpx.Response(
                status_code=503,
                request=httpx.Request(
                    "POST",
                    "https://example.com"
                ),
            ),
            body=None,
        )

    monkeypatch.setattr(
        "app.api.routes.aptitude.analyze_aptitude_result",
        mock_analyze_aptitude_result
    )

    response = client.post(
        "/api/aptitude/analyze",
        json={
            "category": "Quantitative Aptitude",
            "total_questions": 10,
            "correct_answers": 7,
            "score": 7,
            "accuracy": 70.0,
            "weak_area": None,
        }
    )

    assert response.status_code == 503
    assert response.json() == {
        "detail": "Aptitude AI is temporarily unavailable. Please try again later."
    }