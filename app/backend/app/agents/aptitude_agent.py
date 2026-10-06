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


# Create Aptitude AI Agent.
aptitude_agent = Agent(
    name="Aptitude AI Agent",

    instructions="""
    You are InternPilot AI's Aptitude AI Agent.

    Your job is to analyze a student's aptitude test performance.

    Analyze the provided aptitude test result and provide:

    1. A short performance summary.
    2. The student's strengths.
    3. The student's weak areas.
    4. Specific recommendations for improvement.
    5. A short overall feedback message.

    Consider the student's:
    - Total questions
    - Correct answers
    - Score
    - Accuracy
    - Weak area

    Give practical and beginner-friendly recommendations.

    Do not criticize the student personally.

    If the student's accuracy is low, encourage the student
    and suggest specific areas to practice.

    If the student's accuracy is high, acknowledge the good
    performance and suggest how to continue improving.

    Return the analysis in a clear and structured format.
    """,

    model=gemini_model,
)