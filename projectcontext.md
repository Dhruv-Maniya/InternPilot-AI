# InternPilot AI — Project Context & System Architecture

## Project Overview

**InternPilot AI** is an AI-powered internship discovery and career preparation operating system for students. It unifies opportunities search, requirement extraction, skill-gap analysis, aptitude practice, mock AI interview feedback, and career application/deadline tracking into a single, cohesive workflow.

---

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Next.js 14 Frontend                  │
│       App Router (React 18, TypeScript, Vanilla CSS)   │
│                 http://localhost:3000                  │
└───────────────────────────┬────────────────────────────┘
                            │ REST / JSON (CORS enabled)
┌───────────────────────────▼────────────────────────────┐
│                   FastAPI Backend                      │
│            Uvicorn ASGI (Python 3.12, Pydantic)        │
│                 http://127.0.0.1:8000                  │
└────────────┬──────────────┬──────────────┬─────────────┘
             │              │              │
      ┌──────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
      │   SerpApi   │ │  Gemini   │ │  Supabase   │
      │ Google Jobs │ │ AI Agents │ │ PostgreSQL  │
      │ Search API  │ │  OpenAI   │ │  & Auth     │
      │             │ │ SDK layer │ │             │
      └─────────────┘ └───────────┘ └─────────────┘
```

---

## Directory Structure

```
InternPilot-AI/
├── .env.example                # Root environment variables template
├── README.md                   # Complete setup, startup, & user guide
├── projectcontext.md           # Architecture, system components, & routes
├── Agent.md                    # AI agent instructions & specifications
├── changelog.md                # Chronological history of additions & fixes
├── requirement.txt             # Backend production dependencies
├── requirement-dev.txt         # Backend testing dependencies (pytest, etc.)
├── package.json                # Root package configuration
├── app/
│   ├── backend/
│   │   ├── app/
│   │   │   ├── main.py         # FastAPI entry point & CORS configuration
│   │   │   ├── core/           # Configuration & security dependencies
│   │   │   ├── schemas/        # Pydantic schemas for all endpoints
│   │   │   ├── services/       # Service layer (SerpApi, AI, Supabase, matching)
│   │   │   ├── agents/         # AI Agents (Interview Agent, Aptitude Agent)
│   │   │   └── api/            # API route definitions
│   │   ├── tests/              # Comprehensive test suite (109+ tests)
│   │   └── .env.example        # Backend environment template
│   └── frontend/
│       ├── app/                # Next.js 14 App Router pages
│       │   ├── dashboard/      # Career OS dashboard & next best action
│       │   ├── internships/    # Discovery & student profile matching
│       │   ├── skill-gap/      # Skill comparison & missing skills
│       │   ├── learning/       # Curated learning resources
│       │   ├── resume/         # Resume plain-text analysis & skill extractor
│       │   ├── interview/      # Mock technical & HR interview practice
│       │   ├── aptitude/       # Timed aptitude test & AI analysis
│       │   ├── watchlist/      # Saved internships & deadline monitor
│       │   ├── applications/   # Kanban pipeline & status manager
│       │   └── login/          # Supabase token / quick demo candidate login
│       ├── components/         # Reusable UI (Sidebar, Navbar, AppShell)
│       ├── lib/                # API client (api.ts) & AuthContext (auth-context.tsx)
│       └── types/              # Aligned TypeScript interface definitions
└── supabase/
    ├── README.md               # Supabase database setup & migration guide
    └── migrations/             # SQL migrations (001 through 004)
```

---

## Complete API Surface (FastAPI)

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | No | Backend health & status check |
| `/api/internships/` | `GET` | No | Search internships with location via SerpApi |
| `/api/internships/match` | `POST` | No | Profile-based recommendation & skill matching |
| `/api/learning/skill-gap` | `POST` | No | Missing required/preferred skill comparison |
| `/api/learning/resources` | `POST` | No | Curated educational resources for target skills |
| `/api/resume/skills` | `POST` | No | Extract known technical skills from text |
| `/api/resume/analyze` | `POST` | No | Structural recommendations & skill counting |
| `/api/interview/questions` | `POST` | No | Questions by role and interview type |
| `/api/interview/evaluate` | `POST` | No | AI evaluation of interview response |
| `/api/aptitude/questions` | `POST` | No | Questions by category & difficulty |
| `/api/aptitude/submit` | `POST` | No | Automated grading & scoring calculation |
| `/api/aptitude/analyze` | `POST` | No | AI performance analysis and feedback |
| `/api/auth/me` | `GET` | Yes | Authenticated user verification |
| `/api/watchlist` | `GET` | Yes | User saved internship watchlist |
| `/api/watchlist` | `POST` | Yes | Add internship to watchlist |
| `/api/watchlist/{id}` | `DELETE` | Yes | Remove internship from watchlist |
| `/api/applications` | `GET` | Yes | User application pipeline items |
| `/api/applications` | `POST` | Yes | Track new job application |
| `/api/applications/{id}/status` | `PATCH` | Yes | Update application status stage |
| `/api/applications/{id}` | `DELETE` | Yes | Remove tracked application |
| `/api/notifications/deadlines` | `GET` | Yes | Upcoming deadline alerts (0-alert_days) |
