import pytest

from app.services.aptitude_service import analyze_aptitude_result


@pytest.mark.anyio
async def test_analyze_aptitude_result_success(monkeypatch):
    class MockResult:
        final_output = "Good performance. Focus more on quantitative aptitude."

    async def mock_runner_run(agent, user_message):
        assert "Quantitative Aptitude" in user_message
        assert "Accuracy:" in user_message
        return MockResult()

    monkeypatch.setattr(
        "app.services.aptitude_service.Runner.run",
        mock_runner_run
    )

    result = await analyze_aptitude_result(
        category="Quantitative Aptitude",
        total_questions=10,
        correct_answers=7,
        score=7,
        accuracy=70.0,
        weak_area=None
    )

    assert result == "Good performance. Focus more on quantitative aptitude."


@pytest.mark.anyio
async def test_analyze_aptitude_result_with_weak_area(monkeypatch):
    class MockResult:
        final_output = "Practice percentages and arithmetic."

    async def mock_runner_run(agent, user_message):
        assert "Quantitative Aptitude" in user_message
        assert "Weak Area:" in user_message
        assert "Quantitative Aptitude" in user_message
        return MockResult()

    monkeypatch.setattr(
        "app.services.aptitude_service.Runner.run",
        mock_runner_run
    )

    result = await analyze_aptitude_result(
        category="Quantitative Aptitude",
        total_questions=10,
        correct_answers=3,
        score=3,
        accuracy=30.0,
        weak_area="Quantitative Aptitude"
    )

    assert result == "Practice percentages and arithmetic."