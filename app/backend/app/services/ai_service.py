import os

from agents import Runner

from app.agents.internship_agent import internship_agent
from app.core.config import settings


# Make the OpenAI API key available to the Agents SDK.
os.environ["OPENAI_API_KEY"] = settings.openai_api_key


async def run_internship_agent(user_message: str):
    """Run the Internship Discovery Agent."""

    result = await Runner.run(
        internship_agent,
        user_message
    )

    return result.final_output