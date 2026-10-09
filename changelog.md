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


## Unreleased

### Added
- Added automated matching tests for skill matching and internship eligibility.
- Added duplicate internship filtering based on company name and job title.

### Fixed
- Restored the SerpApi internship search method and corrected class indentation.
- Preserved internship and location filtering in the SerpApi service.

### Testing
- All 9 matching tests passed using pytest.
- Verified the internship matching API returns HTTP 200 OK.

## [Unreleased] - 2026-09-29

### Added
- Added automated tests for the Internship Discovery Agent service.
- Added mocked Runner.run() testing to verify agent output without making real Gemini/OpenAI API calls.

### Testing
- Verified internship search, filtering, and matching tests.
- Verified the AI service wrapper using a mocked Agents SDK Runner.
- Full backend test suite: 25 tests passed.

## [Unreleased] - 2026-09-29

### Added
- Added automated error-handling test for the Internship Discovery Agent service.
- Added mocked AI Runner failure testing to verify RuntimeError propagation.

### Testing
- Verified successful Internship Discovery Agent execution.
- Verified AI service error handling.
- Full backend test suite now contains 26 automated tests.
- All 26 backend tests passed successfully.

## 2026-09-29

### Added
- Added Skill Gap Analysis API at `POST /api/learning/skill-gap`.
- Added skill matching for required and preferred internship skills.
- Added missing-skill detection.
- Added beginner-level learning recommendations for missing skills.
- Added automated tests for skill normalization, skill matching, recommendations, and complete skill-gap analysis.

### Testing
- Focused learning tests: 5 passed.
- Full test suite: 31 passed.

## 2026-09-29

### Added
- Added Learning Resource Recommendation API at `POST /api/learning/resources`.
- Added curated learning resources for supported skills.
- Added resource lookup based on normalized skill names.
- Added learning resource schemas for API requests and responses.
- Added automated tests for skill normalization, known skills, multiple skills, unknown skills, and empty skills.

### Testing
- Focused learning resource tests: 5 passed.
- Full test suite: 36 passed.

## 2026-09-29

### Added
- Added Aptitude Practice backend functionality.
- Added aptitude question schemas for questions, test requests, and test results.
- Added a curated aptitude question bank for Quantitative Aptitude, Logical Reasoning, Verbal Ability, and Data Interpretation.
- Added category and difficulty-based question filtering.
- Added aptitude answer evaluation and score calculation.
- Added accuracy calculation and basic weak-area detection.
- Added `POST /api/aptitude/questions` endpoint.
- Added `POST /api/aptitude/submit` endpoint.
- Added automated tests for aptitude question retrieval and result calculation.

### Testing
- Focused aptitude tests: 6 passed.
- Full backend test suite: 42 passed.
- Swagger API testing completed for question retrieval and test submission.

## 2026-09-29

### Added
- Added Resume + Skills backend functionality.
- Added resume request and response schemas.
- Added curated technical skill detection from resume text.
- Added case-insensitive skill extraction.
- Added word-boundary matching to prevent false skill detection.
- Added `POST /api/resume/skills` endpoint.
- Added automated tests for resume skill extraction.
- Added regression test to prevent false detection of `C` inside other words.

### Testing
- Focused Resume tests: 5 passed.
- Full backend test suite: 47 passed.
- Swagger API testing completed successfully for resume skill extraction.

## 2026-09-29

### Added
- Added Interview Preparation backend functionality.
- Added interview request and response schemas.
- Added curated interview questions for Data Analyst and Data Scientist roles.
- Added Technical and HR interview question categories.
- Added role and interview-type filtering.
- Added case-insensitive interview question matching.
- Added `POST /api/interview/questions` endpoint.
- Added 5 automated tests for interview question retrieval.
- Added 404 handling when no matching interview questions are available.

### Testing
- Focused Interview tests: 5 passed.
- Full backend test suite: 52 passed.
- Swagger API testing completed successfully for valid and invalid interview requests.

## 2026-09-29

### Added
- Added Watchlist backend functionality.
- Added watchlist item and request/response schemas.
- Added in-memory watchlist storage.
- Added internship add functionality.
- Added duplicate internship prevention.
- Added watchlist retrieval functionality.
- Added internship removal functionality.
- Added application deadline support in watchlist items.
- Added `POST /api/watchlist` endpoint.
- Added `GET /api/watchlist` endpoint.
- Added `DELETE /api/watchlist/{internship_id}` endpoint.
- Added 5 automated tests for watchlist operations.
- Added 404 handling when removing an internship that is not in the watchlist.

### Testing
- Focused Watchlist tests: 5 passed.
- Full backend test suite: 57 passed.
- Swagger API testing completed successfully for add, retrieve, delete, and deletion verification.

## Applications Feature
- Added application tracking functionality.
- Added application schema with application ID, internship details, company, application URL, and status.
- Added application service for creating, viewing, updating, and removing applications.
- Added supported application statuses:
  - Applied
  - Shortlisted
  - Interview
  - Rejected
  - Selected
- Prevented duplicate applications using application ID.
- Added application status update functionality.
- Added Applications API routes:
  - `POST /api/applications`
  - `GET /api/applications`
  - `PATCH /api/applications/{application_id}/status`
  - `DELETE /api/applications/{application_id}`
- Added automated tests for application creation, duplicate prevention, retrieval, status updates, invalid statuses, and deletion.
- Full test suite: **66 tests passed**.

## 2026-09-30

### Added

- Added Deadline Alert and Notification backend functionality.
- Added notification schemas for deadline alerts and notification responses.
- Added deadline parsing and days-remaining calculation.
- Added configurable deadline alert window with a default of 3 days.
- Added notification messages for deadlines today, tomorrow, and upcoming deadlines.
- Added `GET /api/notifications/deadlines` endpoint.
- Added support for configurable alert windows using the `alert_days` query parameter.
- Added handling for missing, invalid, and expired deadlines.
- Added automated tests for deadline parsing, deadline calculations, notification generation, and API behavior.
- Registered the Notifications router in the FastAPI application.

### Fixed

- Corrected the Watchlist service source so `get_watchlist()` is explicitly defined.
- Preserved Watchlist test isolation when Notification tests manipulate temporary Watchlist data.

### Testing

- Focused Notification service tests: 11 passed.
- Notification API tests: 3 passed.
- Watchlist tests: 5 passed.
- Full backend test suite: 80 passed.
- Swagger API testing completed successfully for deadline notifications.

## 2026-09-30 — Database Schema Implementation

### Added
- Created the initial Supabase database schema for InternPilot AI.
- Added `profiles`, `skills`, `profile_skills`, and `learning_resources` tables.
- Added `internships` and `internship_requirements` tables.
- Added `aptitude_questions`, `aptitude_attempts`, and `aptitude_answers` tables.
- Added `applications` and `watchlist` tables.
- Added foreign-key relationships between related tables.
- Added `user_id` references to user-specific data tables.
- Added application status validation.
- Added unique constraint for user watchlist entries.

### Completed
- Migration 001: Initial schema
- Migration 002: Internship schema
- Migration 003: Aptitude schema
- Migration 004: Applications and watchlist schema

## 2026-09-30 — Row Level Security (RLS) in supabase

### Added
- Enabled Row Level Security on all user-specific tables.
- Added user ownership policies for `profiles`.
- Added user ownership policies for `profile_skills`.
- Added user ownership policies for `aptitude_attempts`.
- Added ownership-based policies for `aptitude_answers` through `aptitude_attempts`.
- Added user ownership policies for `applications`.
- Added user ownership policies for `watchlist`.

### Security
- Authenticated users can access only their own profile data.
- Authenticated users can access only their own aptitude attempts and answers.
- Authenticated users can access only their own applications.
- Authenticated users can access only their own watchlist.
- Verified all 24 RLS policies using `pg_policies`.

# Changelog

## 2026-10-01 — Watchlist Supabase Persistence

### Added
- Added authenticated user access-token dependency for backend routes.
- Added user-scoped Supabase client support.
- Added Supabase REST API helper for authenticated database requests.
- Migrated Watchlist persistence from in-memory storage to Supabase.
- Added authenticated Watchlist INSERT, SELECT, and DELETE operations.
- Preserved the existing Watchlist API response format.

### Security
- Watchlist records are stored with the authenticated user's `user_id`.
- Supabase Row Level Security remains enabled.
- Watchlist INSERT policy verifies `auth.uid() = user_id`.
- Watchlist SELECT, UPDATE, and DELETE policies remain user-scoped.
- Access tokens are never accepted as a frontend-supplied user ID.

### Verification
- Authentication `/api/auth/me` → 200
- Watchlist GET → 200
- Watchlist POST → 200
- Watchlist GET after POST → 200
- Watchlist DELETE → 200
- Direct Supabase REST INSERT with RLS → 201
- Temporary RLS test record → successfully deleted
- Watchlist RLS policies verified
- Database privileges verified
- Python syntax/import checks passed

### Technical Note
- The installed `supabase-py 2.31.0` PostgREST client was unable to perform the Watchlist INSERT correctly under RLS.
- Direct authenticated Supabase REST requests successfully passed the same RLS policy.

- Watchlist INSERT was therefore implemented through the authenticated Supabase REST API without weakening RLS.

- Watchlist INSERT was therefore implemented through the authenticated Supabase REST API without weakening RLS.

## 2026-10-02 — Applications Supabase Persistence

### Added
- Migrated Applications persistence from in-memory storage to Supabase.
- Added authenticated user access-token handling for Applications routes.
- Added user-scoped Applications database operations.
- Added authenticated Applications INSERT, SELECT, UPDATE, and DELETE operations.
- Preserved the existing Applications API response format.

### Security
- Application records are stored with the authenticated user's `user_id`.
- Supabase Row Level Security remains enabled.
- Applications INSERT policy verifies `auth.uid() = user_id`.
- Applications SELECT, UPDATE, and DELETE policies remain user-scoped.
- Access tokens are never accepted as a frontend-supplied user ID.

### Verification
- Applications RLS policies verified.
- Applications database privileges verified.
- Applications GET before insertion → 200
- Applications POST → 200
- Applications GET after POST → 200
- Applications PATCH status update → 200
- Applications GET after status update → 200
- Applications DELETE → 200
- Final Applications GET after deletion → 200 with empty result
- Temporary test application successfully removed.
- Python syntax checks passed.
- Applications router import verification passed.

### Technical Note
- Applications persistence now uses authenticated Supabase requests instead of the previous in-memory `APPLICATIONS` list.
- Existing Applications API endpoints and response structures were preserved.

## 2026-10-02 — Applications Duplicate Protection

### Added
- Added a database unique constraint on `(user_id, application_id)` for Applications.
- Prevented the same authenticated user from creating duplicate Applications with the same `application_id`.

### Data Integrity
- Existing duplicate Applications were checked before adding the constraint.
- No duplicate `(user_id, application_id)` records existed.
- The live Supabase database now enforces the unique constraint.
- The migration file `004_applications.sql` was updated to match the live database schema.

### Verification
- Live unique constraint creation verified successfully.
- First test Application insertion → 200
- Duplicate Application insertion → blocked by PostgreSQL unique constraint `23505`
- Temporary test Application deleted successfully → 200
- `git diff --check` passed.

### Technical Note
- Constraint name: `applications_user_application_unique`
- Constraint applies to `(user_id, application_id)`.
- Different users may still use the same `application_id`.

## 2026-10-05

### Changed

- Migrated deadline notification logic to use the Supabase-backed user watchlist.
- Updated deadline notification service to accept the authenticated user ID and Supabase access token.
- Updated the deadline notification API to require authenticated users.
- Connected notification requests to the existing Supabase authentication dependencies.
- Removed notification test dependency on the old in-memory `WATCHLIST`.
- Updated notification service and API tests to mock the Supabase-backed watchlist and authentication flow.

### Testing

- Notification service tests: 11 passed.
- Notification API tests: 3 passed.
- Full backend test suite: 81 passed.

## 2026-10-05

### Added

- Added automated API tests for the Learning feature.
- Added coverage for the skill-gap API endpoint.
- Added coverage for the learning resources API endpoint.
- Added handling tests for unknown learning skills.

### Fixed

- Fixed the Learning skill-gap API route so it correctly calls the skill-gap analysis service.
- Verified the Learning router and both Learning API endpoints are correctly registered and functional.

### Testing

- Learning service tests: 5 passed.
- Learning resource tests: 5 passed.
- Learning API tests: 3 passed.
- Full backend test suite: 84 passed.

## 2026-10-05

### Resume Assistance

- Added resume analysis functionality to the Resume service.
- Added `ResumeAnalysisRequest` and `ResumeAnalysisResponse` schemas.
- Added `POST /api/resume/analyze` endpoint.
- Added resume skill count analysis.
- Added basic resume improvement suggestions for missing projects, achievements, experience, and resume details.
- Preserved the existing `POST /api/resume/skills` endpoint.
- Added automated tests for resume analysis service logic.
- Added API tests for successful resume analysis and empty resume validation.
- Verified the new endpoint manually through Swagger.

### Testing

- Resume service tests: **9 passed**
- Resume API tests: **2 passed**
- Full backend test suite: **90 passed**

## 2026-10-05

### Interview Assistance

- Added Interview Assistance AI agent using Gemini through the OpenAI Agents SDK.
- Added AI-powered interview answer evaluation.
- Added `InterviewAnswerRequest` and `InterviewAnswerResponse` schemas.
- Added `POST /api/interview/evaluate` endpoint.
- Added AI service wrapper for interview answer evaluation.
- Preserved the existing `POST /api/interview/questions` endpoint.
- Added API tests for interview question retrieval and answer evaluation.
- Added tests for AI success and error handling.
- Added graceful handling for Gemini provider `503 Service Unavailable` errors.
- Verified the evaluation endpoint through Swagger.
- Gemini availability issue is handled gracefully with an HTTP 503 response.

### Testing

- Interview tests: **14 passed**
- Full backend test suite: **99 passed**

## 2026-10-06

### Aptitude AI

- Added Aptitude AI Agent using Gemini through the OpenAI Agents SDK.
- Added AI-powered aptitude performance analysis.
- Added `AptitudeAnalysisRequest` and `AptitudeAnalysisResponse` schemas.
- Added `analyze_aptitude_result()` service function.
- Added `POST /api/aptitude/analyze` endpoint.
- Added personalized performance analysis covering strengths, weak areas, recommendations, and overall feedback.
- Added automated tests for Aptitude AI service behavior.
- Added API tests for successful aptitude analysis and weak-area analysis.
- Added request validation tests for invalid accuracy values.
- Added graceful handling for Gemini `503 Service Unavailable` errors.
- Verified the Aptitude AI endpoint through Swagger with a real Gemini request.

### Testing

- Aptitude tests: **6 passed**
- Aptitude AI service tests: **2 passed**
- Aptitude API tests: **4 passed**
- Full backend test suite: **105 passed**
- Real Gemini Swagger test: **200 OK**

## 2026-10-06

### AI Service Configuration Cleanup

- Removed the obsolete `OPENAI_API_KEY` environment-variable setup from `app/services/ai_service.py`.
- Removed the unused `os` and `settings` imports from the legacy AI service.
- Preserved the existing `run_internship_agent()` behavior.
- Verified that the legacy AI service tests continue to pass.
- Confirmed that the current Internship Agent remains responsible for its Gemini configuration.

### Testing

- AI service tests: **2 passed**
- Full backend test suite: **105 passed**

## 2026-10-06

### Supabase Authentication Verification

- Verified Supabase authentication configuration and token validation flow.
- Verified that authentication dependencies compile and import successfully.
- Verified that protected authentication endpoints reject unauthenticated requests with HTTP 401.
- Added authentication API tests for unauthenticated requests and invalid authentication tokens.
- Verified invalid token handling through the authentication dependency layer.
- Confirmed that authentication testing does not require real Supabase credentials or tokens.

### Testing

- Authentication tests: **2 passed**
- Full backend test suite: **107 passed**

## 2026-10-09

### Frontend–Backend Integration: CORS Configuration

- Added FastAPI `CORSMiddleware` configuration in `app/backend/app/main.py`.
- Allowed the local Next.js frontend origins `http://localhost:3000` and `http://127.0.0.1:3000`.
- Configured cross-origin requests to support credentials, HTTP methods, and request headers.
- Added `tests/test_cors.py` with tests for an approved frontend origin and an unapproved origin.
- Verified that the approved origin receives the expected CORS headers.
- Confirmed that an unapproved origin is not granted CORS access.

### Testing

- Focused CORS tests: **2 passed**
- Full backend test suite: **109 passed**

## 2026-10-10

### Full-Stack Integration, Reliability, and Hackathon Readiness

#### Schema Alignment & Crash Fixes
- **Aptitude AI Response**: Aligned frontend `AptitudeAnalysisResponse` type with backend schema (`analysis: string` primary, optional structured fields). Fixed runtime crash on `/aptitude` when rendering AI diagnostic feedback.
- **Interview AI Evaluation**: Aligned frontend `InterviewEvaluationResponse` with backend schema (`feedback: string` primary, optional structured fields). Fixed runtime crash on `/interview` when evaluating candidate answers.
- **Resume Analysis**: Confirmed `skills` alignment in `ResumeAnalysisResponse` and `/resume` page, allowing seamless skill extraction and profile updates.

#### API Client & Authentication Hardening
- **URL Normalization**: Sanitized `API_BASE_URL` in `app/frontend/lib/api.ts` with trailing slash stripping to prevent invalid URL formats (e.g. `http://...//api/...`).
- **Token Handling**: Removed misleading `'demo-token-intern'` fallback from `getStoredToken()` in `app/frontend/lib/api.ts`. Unauthenticated users now gracefully send unauthenticated requests instead of triggering spurious 401s or false "session expired" notifications on public pages.
- **Strict Typing**: Eliminated `any` types in `api.ts` and page components, ensuring complete type safety across all frontend service calls.
- **Navbar Session Awareness**: Updated `Navbar.tsx` to dynamically render user profile and sign-in status based on real authentication state.

#### Database Migration Fix
- **Migration 004**: Removed duplicate `CHECK (status in ...)` constraint syntax error in `supabase/migrations/004_applications.sql` to ensure repeatable execution in Supabase SQL editor.
- **Database Documentation**: Added `supabase/README.md` documenting schema overview, foreign keys, RLS policies, and execution instructions.

#### Frontend Code Health & Production Build
- **ESLint Cleanup**: Resolved all ESLint errors and warnings across all 10 frontend pages (`/applications`, `/aptitude`, `/dashboard`, `/internships`, `/interview`, `/learning`, `/login`, `/resume`, `/skill-gap`, `/watchlist`) and components (unused variables, unescaped JSX quotes, missing `useEffect` dependency arrays via `useCallback`).
- **Production Verification**: Built Next.js 14 production bundle cleanly with standard lint and type checks enabled.

#### Curated Resources Expansion
- Added curated learning resources for `Python` and `SQL` in `app/backend/app/services/resource_service.py` to support core tech internship searches.

#### Environment & Architecture Documentation
- Created root `.env.example` and frontend `app/frontend/.env.local.example`.
- Created comprehensive `Agent.md` documenting OpenAI Agents SDK + Gemini 3.8 Flash architecture.
- Created `README.md` with complete installation, execution, testing, and demonstration guide.
- Created `projectcontext.md` with full architectural layout and route mapping.

### Testing & Verification
- **Live Server Testing**: Verified live FastAPI (`http://127.0.0.1:8000`) and Next.js (`http://localhost:3000`) responding with HTTP 200.
- **Frontend Page Routes**: Verified all 11 page routes (`/`, `/login`, `/dashboard`, `/internships`, `/resume`, `/skill-gap`, `/learning`, `/aptitude`, `/interview`, `/watchlist`, `/applications`) return HTTP 200.
- **Live Integration Tests**: Created `app/backend/tests/test_live_api_integration.py` containing 12 live HTTP tests covering root, skill-gap, learning resources, aptitude question retrieval, aptitude submission, resume skill detection, resume analysis, interview questions, and unauthenticated access rejection (401).
- **Backend Test Suite**: All 121 automated tests passed (`pytest` in `.venv`, 100% pass rate).
- **Frontend Typecheck**: TypeScript validation passed (`npx tsc --noEmit`) with 0 errors.
- **Frontend Linting**: Next.js lint passed (`npm run lint`) with 0 warnings and 0 errors.
- **Frontend Production Build**: Optimized production build passed (`npm run build`) generating 14 static pages.
