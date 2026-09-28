# Changelog

All notable changes to InternPilot AI will be documented in this file.

## [Unreleased]

### Added

#### Backend Setup
- Set up the Python virtual environment for the backend.
- Added FastAPI for backend API development.
- Added Uvicorn as the ASGI server.
- Created the initial FastAPI application.
- Added the basic health/welcome endpoint.

#### Configuration
- Added environment-based configuration using `.env`.
- Added Pydantic Settings for managing application configuration.
- Added `python-dotenv` for environment variable support.
- Added configuration for SerpApi, AI services, and Supabase.

#### SerpApi Integration
- Added the SerpApi Python SDK.
- Configured SerpApi API authentication through environment variables.
- Integrated Google Jobs search through SerpApi.
- Created the SerpApi service for communicating with SerpApi.
- Tested live internship/job search successfully.

#### Internship Discovery API
- Added the Internship Pydantic schema.
- Added the internship search service.
- Added `GET /api/internships/` endpoint.
- Added support for internship search queries and locations.
- Added query validation using FastAPI and Pydantic.
- Added error handling for SerpApi failures.
- Added structured internship responses for frontend consumption.
- Tested the Internship Discovery API using FastAPI Swagger UI.

#### AI Agent Preparation
- Started integration of the AI Agent layer.
- Selected the OpenAI Agents SDK for implementing AI agents.

#### Gemini AI Integration

* Added Gemini API key configuration through environment variables.
* Integrated Gemini with the OpenAI Agents SDK using Google's OpenAI-compatible API.
* Configured Gemini 3.8 Flash as the Internship Discovery Agent model.
* Added Gemini model configuration to the Internship Discovery Agent.
* Disabled OpenAI tracing for the Gemini integration.
* Successfully tested natural-language internship guidance using Gemini.
* Restored compatible OpenAI SDK dependencies after removing LiteLLM.

#### SerpApi Agent Tool
- Added a SerpApi search function tool to the Internship Discovery Agent.
- Enabled Gemini to invoke SerpApi for internship search requests.
- Added structured search result handling for agent responses.
- Tested agent tool invocation with real SerpApi internship results.