from agents import Runner

from app.agents.internship_agent import internship_agent

async def run_internship_agent(user_message: str):
    """Run the Internship Discovery Agent."""

    result = await Runner.run(
        internship_agent,
        user_message
    )

    return result.final_output