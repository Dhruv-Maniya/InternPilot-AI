# InternPilot AI — Supabase Database Architecture & Setup

This directory contains database schemas and migration scripts for InternPilot AI.

## Architecture Overview

InternPilot AI leverages Supabase PostgreSQL for user profiles, internship listings, career tracking, assessment history, and user-specific watchlists and applications.

| Table | Purpose | Auth / Ownership |
| :--- | :--- | :--- |
| `public.profiles` | Student career profile & preferred location | References `auth.users(id)` |
| `public.skills` | Canonical tech skill catalog | Public catalog |
| `public.profile_skills` | Join table for student skills | References `profiles.id`, `skills.id` |
| `public.learning_resources` | Curated tutorials, docs, & courses | Public resource bank |
| `public.internships` | Persisted internship opportunities | Unique by application URL |
| `public.internship_requirements` | Extracted required/preferred skills | References `internships.id` |
| `public.aptitude_questions` | Question bank by category & difficulty | Curated question bank |
| `public.aptitude_attempts` | Student test records & scores | References `auth.users(id)` |
| `public.aptitude_answers` | Student question answers per attempt | References `aptitude_attempts.id` |
| `public.applications` | Pipeline tracker (Applied, Interview, etc.) | User-specific (`user_id = auth.users.id`) |
| `public.watchlist` | Saved internships & monitored deadlines | User-specific (`user_id = auth.users.id`) |

---

## Migration Execution Order

To set up a fresh Supabase project:

1. Open your [Supabase Project Dashboard](https://supabase.com/dashboard).
2. Navigate to the **SQL Editor**.
3. Run the migrations in sequential order:
   - `migrations/001_initial_schema.sql` — Profiles, skills, and learning resources.
   - `migrations/002_internships.sql` — Internship repository and extracted requirements.
   - `migrations/003_aptitude.sql` — Aptitude questions, student attempts, and answer submissions.
   - `migrations/004_applications.sql` — Application tracking and watchlist with status constraints.

---

## Row-Level Security (RLS) Guidelines

Ensure RLS is enabled on tables containing user-specific records:
- `applications`: Users may only select, insert, update, or delete records matching `auth.uid() = user_id`.
- `watchlist`: Users may only select, insert, or delete records matching `auth.uid() = user_id`.
- The FastAPI backend validates user access tokens via `get_current_user` before interacting with the database.
