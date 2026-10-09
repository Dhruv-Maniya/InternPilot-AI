# AI Agents Architecture — InternPilot AI

InternPilot AI utilizes specialized AI agents built with the **OpenAI Agents SDK** and Google's **Gemini 3.8 Flash** model via Google's OpenAI-compatible API endpoint (`https://generativelanguage.googleapis.com/v1beta/openai/`).

---

## 1. Overview of Agents

| Agent Name | Module | Model | Tools | Responsibility |
| :--- | :--- | :--- | :--- | :--- |
| **Internship Discovery Agent** | `app/agents/internship_agent.py` | `gemini-3.8-flash` | `search_internships` (SerpApi) | Discovers real internships based on natural language queries, locations, and student preferences. Never fabricates listings. |
| **Interview Assistance Agent** | `app/agents/interview_agent.py` | `gemini-3.8-flash` | None (Direct evaluation) | Evaluates student answers to technical and HR interview questions, providing scores (0–10), strengths, and improvement suggestions. |
| **Aptitude AI Agent** | `app/agents/aptitude_agent.py` | `gemini-3.8-flash` | None (Performance analysis) | Analyzes aptitude test submissions, calculating accuracy, strengths, weak areas, and actionable improvement recommendations. |

---

## 2. Technical Stack & Configuration

- **SDK**: `openai-agents` (OpenAI Agents SDK)
- **Engine**: Google Gemini (`gemini-3.8-flash`) via `AsyncOpenAI`
- **Tracing**: Tracing is explicitly disabled via `set_tracing_disabled(disabled=True)` to prevent extraneous OpenAI API calls when running on non-OpenAI endpoints.
- **Provider URL**: `https://generativelanguage.googleapis.com/v1beta/openai/`
- **Authentication**: `GEMINI_API_KEY` configured in `app/backend/.env`.

---

## 3. Agent Specifications

### A. Internship Discovery Agent (`internship_agent.py`)

- **Role**: Natural language internship search assistant.
- **Tool**: `search_internships`
  - Calls `serpapi_service.search_internships(query, location)`
  - Queries Google Jobs via SerpApi in real-time.
  - Converts results to structured JSON for the agent context.
- **Guardrails**:
  - Grounded in real SerpApi data.
  - Never hallucinates fake companies, listings, or application links.
  - Returns clear empty state if no matching jobs are found.

### B. Interview Assistance Agent (`interview_agent.py`)

- **Role**: Technical and behavioral interview evaluator.
- **Input**:
  - `question`: The interview question asked.
  - `answer`: The student's recorded answer.
- **Output**:
  - Score (0 to 10)
  - Key strengths
  - Actionable areas for improvement
  - Summary feedback
- **Fallback**:
  - Handled via `try/except` in `app/services/interview_service.py` catching `RuntimeError` or upstream 503 errors and returning structured error responses with HTTP 503.

### C. Aptitude AI Agent (`aptitude_agent.py`)

- **Role**: Aptitude exam diagnostics and coaching.
- **Input**:
  - `total_questions`, `correct_answers`, `score`, `accuracy`, `weak_area`.
- **Output**:
  - Performance summary
  - Identified strengths and weak areas
  - Category-specific study recommendations
- **Fallback**:
  - Handled gracefully in `app/services/aptitude_service.py` with standard error wrapping.

---

## 4. Integration with FastAPI Services

Each agent is wrapped within a robust service layer that provides:
1. Input validation via Pydantic schemas.
2. Async execution using `Runner.run()`.
3. Upstream API timeout handling and service availability checks.
4. Clean response parsing into standard API response models.
