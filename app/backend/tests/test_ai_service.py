import asyncio

from app.services import ai_service


def test_run_internship_agent_success(monkeypatch):
    class MockResult:
        final_output = "Found 3 suitable Python internships."

    async def mock_runner_run(agent, user_message):
        assert agent is not None
        assert user_message == "Find Python internships in Mumbai"

        return MockResult()

    monkeypatch.setattr(
        ai_service.Runner,
        "run",
        mock_runner_run
    )

    result = asyncio.run(
        ai_service.run_internship_agent(
            "Find Python internships in Mumbai"
        )
    )

    assert result == "Found 3 suitable Python internships."

def test_run_internship_agent_error(monkeypatch):
    async def mock_runner_run(agent, user_message):
        raise RuntimeError("AI service failed")

    monkeypatch.setattr(
        ai_service.Runner,
        "run",
        mock_runner_run
    )

    try:
        asyncio.run(
            ai_service.run_internship_agent(
                "Find Python internships in Mumbai"
            )
        )
        assert False, "Expected RuntimeError was not raised"

    except RuntimeError as error:
        assert str(error) == "AI service failed"