import json

from openai import AsyncOpenAI

from agents import (
    Agent,
    OpenAIChatCompletionsModel,
    set_tracing_disabled,
    function_tool,
)

from app.core.config import settings
from app.services.serpapi_service import serpapi_service


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


# Create a tool that searches internships using SerpApi
@function_tool
def search_internships(
    query: str,
    location: str = "India"
) -> str:
    """
    Search real internship and job listings using SerpApi.

    Args:
        query: Internship role or skills, such as Python Data Science Intern.
        location: Preferred city or region, such as Mumbai or India.

    Returns:
        A JSON string containing the internship search results.
    """

    internships = serpapi_service.search_internships(
        query=query,
        location=location
    )

    results = [
        internship.model_dump()
        for internship in internships
    ]

    return json.dumps(results, ensure_ascii=False)


# Create Internship Discovery Agent
internship_agent = Agent(
    name="Internship Discovery Agent",

    instructions="""
    You are InternPilot AI's Internship Discovery Agent.

    Your job is to help students discover suitable internship opportunities.

    When a student asks to find, search for, or discover internships:

    1. Understand their desired role, skills, and preferred location.
    2. Call the search_internships tool to search real listings.
    3. Use the returned search results to answer the student.
    4. Include company name, role, location, and source URL when available.
    5. If no listings are returned, clearly say no results were found.

    Never invent internship listings, companies, deadlines, or application links.
    Do not claim that an internship is guaranteed to be available.

    Be clear, practical, and concise.
    """,

    model=gemini_model,

    tools=[search_internships],
)