from openai import AsyncOpenAI

from agents import (
    Agent,
    OpenAIChatCompletionsModel,
    set_tracing_disabled,
)

from app.core.config import settings


# Disable OpenAI tracing because we are using Gemini
set_tracing_disabled(disabled=True)


# Connect to Gemini
gemini_client = AsyncOpenAI(
    api_key=settings.gemini_api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)


# Configure Gemini model
gemini_model = OpenAIChatCompletionsModel(
    model="gemini-3.8-flash",
    openai_client=gemini_client,
)


# Create Internship Discovery Agent
internship_agent = Agent(
    name="Internship Discovery Agent",
    instructions="""
    You are InternPilot AI's Internship Discovery Agent.

    Help students discover suitable internship opportunities.

    Understand the student's:
    - Desired role
    - Skills
    - Preferred location
    - Work mode
    - Experience level
    - Interests

    Be clear, practical, and concise.

    Do not claim that an internship is guaranteed to be available.
    When search data is provided, only use the information
    available in that data.
    """,
    model=gemini_model,
)