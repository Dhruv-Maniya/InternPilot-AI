import asyncio
import json

from fastapi.testclient import TestClient

from app.main import app
from app.api.routes.internships import serpapi_service
from app.services.serpapi_service import SerpApiService


client = TestClient(app)


def test_search_internships_success(monkeypatch):
    def mock_search_internships(query, location):
        return [
            {
                "title": "Data Science Intern",
                "company": "Test Company",
                "location": "Mumbai, India",
                "description": "Work on data analysis and machine learning.",
                "source": "Test Source",
                "url": "https://example.com/internship"
            }
        ]

    monkeypatch.setattr(
        serpapi_service,
        "search_internships",
        mock_search_internships
    )

    response = client.get(
        "/api/internships/",
        params={
            "query": "Data Science",
            "location": "India"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["count"] == 1
    assert len(data["results"]) == 1
    assert data["results"][0]["title"] == "Data Science Intern"
    assert data["results"][0]["company"] == "Test Company"


def test_search_internships_requires_query():
    response = client.get(
        "/api/internships/",
        params={
            "location": "India"
        }
    )

    assert response.status_code == 422


def test_search_internships_rejects_short_query():
    response = client.get(
        "/api/internships/",
        params={
            "query": "A",
            "location": "India"
        }
    )

    assert response.status_code == 422


def test_search_internships_default_location(monkeypatch):
    captured = {}

    def mock_search_internships(query, location):
        captured["query"] = query
        captured["location"] = location
        return []

    monkeypatch.setattr(
        serpapi_service,
        "search_internships",
        mock_search_internships
    )

    response = client.get(
        "/api/internships/",
        params={
            "query": "Python"
        }
    )

    assert response.status_code == 200
    assert captured["query"] == "Python"
    assert captured["location"] == "India"


def test_search_internships_serpapi_error(monkeypatch):
    def mock_search_internships(query, location):
        raise RuntimeError("SerpApi search failed")

    monkeypatch.setattr(
        serpapi_service,
        "search_internships",
        mock_search_internships
    )

    response = client.get(
        "/api/internships/",
        params={
            "query": "Python",
            "location": "India"
        }
    )

    assert response.status_code == 502
    assert response.json()["detail"] == "SerpApi search failed"


def test_match_internships_success(monkeypatch):
    def mock_match_internships(profile):
        return [
            {
                "title": "Data Science Intern",
                "company": "Test Company",
                "location": "Mumbai, India",
                "match_score": 85,
                "eligibility": "Likely Entry-Level"
            }
        ]

    monkeypatch.setattr(
        "app.api.routes.internships.match_internships",
        mock_match_internships
    )

    response = client.post(
        "/api/internships/match",
        json={
            "name": "Dhruv",
            "education": "B.Tech Data Science",
            "skills": ["Python", "SQL"],
            "interests": ["Data Science"],
            "preferred_location": "India"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["student"] == "Dhruv"
    assert data["count"] == 1
    assert len(data["results"]) == 1
    assert data["results"][0]["title"] == "Data Science Intern"


def test_match_internships_requires_skills():
    response = client.post(
        "/api/internships/match",
        json={
            "name": "Dhruv",
            "education": "B.Tech Data Science",
            "skills": [],
            "interests": ["Data Science"],
            "preferred_location": "India"
        }
    )

    assert response.status_code == 422


def test_match_internships_requires_name():
    response = client.post(
        "/api/internships/match",
        json={
            "education": "B.Tech Data Science",
            "skills": ["Python"],
            "interests": ["Data Science"],
            "preferred_location": "India"
        }
    )

    assert response.status_code == 422


def test_is_internship_detects_internship_title():
    service = SerpApiService()

    job = {
        "title": "Data Science Intern",
        "description": "Work with the data science team."
    }

    assert service.is_internship(job) is True


def test_is_internship_rejects_senior_role():
    service = SerpApiService()

    job = {
        "title": "Senior Data Scientist Intern",
        "description": "Work with the data science team."
    }

    assert service.is_internship(job) is False


def test_is_internship_detects_internship_from_description():
    service = SerpApiService()

    job = {
        "title": "Data Science Opportunity",
        "description": "This is an internship opportunity for students."
    }

    assert service.is_internship(job) is True


def test_is_internship_rejects_regular_job():
    service = SerpApiService()

    job = {
        "title": "Data Scientist",
        "description": "Work with machine learning models."
    }

    assert service.is_internship(job) is False


def test_search_internships_removes_duplicates(monkeypatch):
    service = SerpApiService()

    def mock_search_jobs(query, location):
        return {
            "jobs_results": [
                {
                    "title": "Data Science Intern",
                    "company_name": "Test Company",
                    "location": "Mumbai, India",
                    "description": "Internship opportunity."
                },
                {
                    "title": "Data Science Intern",
                    "company_name": "Test Company",
                    "location": "Mumbai, India",
                    "description": "Internship opportunity."
                }
            ]
        }

    monkeypatch.setattr(
        service,
        "search_jobs",
        mock_search_jobs
    )

    results = service.search_internships(
        query="Data Science",
        location="India"
    )

    assert len(results) == 1
    assert results[0].title == "Data Science Intern"
    assert results[0].company == "Test Company"


def test_search_internships_filters_location(monkeypatch):
    service = SerpApiService()

    def mock_search_jobs(query, location):
        return {
            "jobs_results": [
                {
                    "title": "Python Intern",
                    "company_name": "Mumbai Company",
                    "location": "Mumbai, India",
                    "description": "Internship opportunity."
                },
                {
                    "title": "Python Intern",
                    "company_name": "Delhi Company",
                    "location": "Delhi, India",
                    "description": "Internship opportunity."
                }
            ]
        }

    monkeypatch.setattr(
        service,
        "search_jobs",
        mock_search_jobs
    )

    results = service.search_internships(
        query="Python",
        location="Mumbai"
    )

    assert len(results) == 1
    assert results[0].company == "Mumbai Company"
    assert results[0].location == "Mumbai, India"


def test_agent_search_internships_tool(monkeypatch):
    from app.agents.internship_agent import _search_internships
    from app.schemas.internship import Internship

    def mock_search_internships(query, location):
        return [
            Internship(
                title="Python Intern",
                company="Test Company",
                location="Mumbai, India",
                description="Python internship opportunity.",
                source="Test Source",
                url="https://example.com/internship"
            )
        ]

    monkeypatch.setattr(
        "app.agents.internship_agent.serpapi_service.search_internships",
        mock_search_internships
    )

    result = _search_internships(
        query="Python",
        location="Mumbai"
    )

    data = json.loads(result)

    assert len(data) == 1
    assert data[0]["title"] == "Python Intern"
    assert data[0]["company"] == "Test Company"
    assert data[0]["location"] == "Mumbai, India"
    assert data[0]["url"] == "https://example.com/internship"