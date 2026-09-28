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

#### Student Profile Matching API
- Added StudentProfile schema for student information.
- Implemented keyword-based internship matching.
- Added match percentages and matched/missing skill analysis.
- Added POST /api/internships/match endpoint.
- Tested profile-based internship recommendations using SerpApi.


## [Unreleased] - Internship Recommendation Ranking

### Added
- Eligibility-based internship ranking.
- Recommendation priority for entry-level, unclear, and experience-required listings.
- Skill match percentage as a secondary sorting criterion.

### Maintained
- Existing SerpApi integration.
- Existing student skill matching and eligibility checker.


## [Unreleased] - Internship Filtering

### Added
- Internship-specific keywords in SerpApi searches.
- Filtering for internship, trainee, apprentice, and co-op listings.
- Exclusion of clearly senior and unrelated job titles.

### Maintained
- Existing SerpApi client and configuration.
- Internship matching, eligibility checking, and ranking.s

### Fixed
- Corrected eligibility detection for fresher-friendly internships.
- Prioritized explicit no-experience and fresher indicators.
- Improved skill matching using aliases and word boundaries.
- Added safe handling for empty student skill lists.
- Preserved internship recommendation priority and sorting.

### In Progress
- Separating required, preferred, and learning skills in internship matching.
- Improving match percentage accuracy.
- Adding safer handling for internship descriptions with unclear requirements.

### Fixed
- Separated required, preferred, and learning skills.
- Updated internship matching to calculate percentage using extracted required skills.
- Added review handling for descriptions without clear requirements.
- Preserved existing eligibility and recommendation sorting.


## Fixed — Internship Skill Matching

- Corrected matching of student skills against job-required skills.
- Fixed the match percentage denominator.
- Matched and missing skills now use the job's required skill list.
- Preserved the existing API response structure and recommendation sorting.


## Improved — Internship Skill Extraction

- Added support for inline skill-section headings.
- Improved handling of bullet points and multiline descriptions.
- Distinguished required, preferred, and learning skills.
- Corrected requirements_found to track required-section headings.

## Internship Matching API — Completed

- Fixed undefined eligibility and recommendation_priority variables.
- Successfully tested POST /api/internships/match in Swagger.
- Confirmed HTTP 200 OK.
- Verified internship results include skill matching,
  eligibility status, and recommendation priority.

### Internship Location Filtering
- Added strict location filtering for city-specific internship searches.
- Verified Mumbai filtering through POST /api/internships/match.
- Confirmed HTTP 200 OK with 6 matching location results.
- Confirmed unrelated locations were excluded from the response.

### India-Wide Internship Search
- Verified India-wide search through POST /api/internships/match.
- Confirmed HTTP 200 OK with 10 results.
- Confirmed nationwide and remote listings are not excluded by city filtering.
- Verified skill-match percentages against extracted requirements.

### Multi-Skill Matching Test
- Verified matching with multiple student skills.
- Confirmed matched and missing skills are returned correctly.
- Verified match percentages against extracted requirements.
- Confirmed HTTP 200 OK with 10 internship results.

### Internship Sorting and Recommendation Priority
- Verified internship sorting through POST /api/internships/match.
- Confirmed internships are grouped by recommendation priority.
- Confirmed numerical match percentages are sorted in descending order within priority groups.
- Confirmed listings without extracted requirements appear after scored listings within the same priority group.
- Verified HTTP 200 OK with 10 internship results.

### SerpApi Integration and Eligibility Verification
- Fixed SerpApi client initialization for the installed serpapi package.
- Verified live Google Jobs search through POST /api/internships/match.
- Confirmed HTTP 200 OK with 10 internship results.
- Verified eligibility classification for entry-level, review-required, and experience-required cases.
- Confirmed skill matching, match percentages, and recommendation priority in the API response.