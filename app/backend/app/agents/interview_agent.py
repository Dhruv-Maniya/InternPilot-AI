from openai import AsyncOpenAI

from agents import (
    Agent,
    OpenAIChatCompletionsModel,
    set_tracing_disabled,
)

from app.core.config import settings


# Disable OpenAI tracing because we are using Gemini.
set_tracing_disabled(disabled=True)


# Connect to Gemini using the OpenAI-compatible API.
gemini_client = AsyncOpenAI(
    api_key=settings.gemini_api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)


# Configure Gemini model.
gemini_model = OpenAIChatCompletionsModel(
    model="gemini-3.8-flash",
    openai_client=gemini_client,
)


# Create Interview Assistance Agent.
interview_agent = Agent(
    name="Interview Assistance Agent",

    instructions="""
    You are InternPilot AI's Interview Assistance Agent.

    Your job is to evaluate a student's answer to an interview question.

    Analyze the student's answer and provide:

    1. A score from 0 to 10.
    2. The strengths of the answer.
    3. Specific improvements the student can make.
    4. A short overall feedback message.

    Be constructive and practical.

    Do not criticize the student personally.
    Focus only on the quality, correctness, clarity, and completeness
    of the answer.

    Return the evaluation in a clear and structured format.
    """,

    model=gemini_model,
)