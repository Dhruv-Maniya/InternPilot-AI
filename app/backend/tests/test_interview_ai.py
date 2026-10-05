import asyncio

from app.services import interview_service


def test_evaluate_interview_answer_success(monkeypatch):
    class MockResult:
        final_output = "Score: 9/10. Good explanation with clear reasoning."

    async def mock_runner_run(agent, user_message):
        assert agent is not None
        assert "What is the difference between WHERE and HAVING?" in user_message
        assert "WHERE filters rows" in user_message

        return MockResult()

    monkeypatch.setattr(
        interview_service.Runner,
        "run",
        mock_runner_run
    )

    result = asyncio.run(
        interview_service.evaluate_interview_answer(
            question="What is the difference between WHERE and HAVING?",
            answer="WHERE filters rows before grouping."
        )
    )

    assert result == "Score: 9/10. Good explanation with clear reasoning."


def test_evaluate_interview_answer_propagates_error(monkeypatch):
    async def mock_runner_run(agent, user_message):
        raise RuntimeError("AI service failed")

    monkeypatch.setattr(
        interview_service.Runner,
        "run",
        mock_runner_run
    )

    try:
        asyncio.run(
            interview_service.evaluate_interview_answer(
                question="What is overfitting?",
                answer="It happens when a model learns the training data too closely."
            )
        )

        assert False, "Expected RuntimeError was not raised"

    except RuntimeError as error:
        assert str(error) == "AI service failed"