import json
import urllib.request
import urllib.error
import pytest

BASE_URL = "http://127.0.0.1:8000"


def make_request(method, path, data=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {}
    body = None
    if data is not None:
        headers["Content-Type"] = "application/json"
        body = json.dumps(data).encode("utf-8")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        try:
            parsed = json.loads(content)
        except Exception:
            parsed = {"raw": content}
        return e.code, parsed


def test_live_root_endpoint():
    status, body = make_request("GET", "/")
    assert status == 200
    assert body["status"] == "Backend is running"


def test_live_learning_skill_gap():
    status, body = make_request("POST", "/api/learning/skill-gap", {
        "student_skills": ["Python", "Pandas"],
        "required_skills": ["Python", "SQL", "Data Analytics"],
        "preferred_skills": ["Power BI"]
    })
    assert status == 200
    assert "matched_required_skills" in body
    assert "missing_required_skills" in body
    assert "SQL" in body["missing_required_skills"]
    assert "recommendations" in body


def test_live_learning_resources():
    status, body = make_request("POST", "/api/learning/resources", {
        "skills": ["Python", "SQL", "Pandas"]
    })
    assert status == 200
    assert "resources" in body
    assert len(body["resources"]) >= 3


def test_live_aptitude_questions():
    status, body = make_request("POST", "/api/aptitude/questions", {
        "category": "Quantitative Aptitude",
        "difficulty": "Beginner"
    })
    assert status == 200
    assert isinstance(body, list)
    assert len(body) > 0
    assert body[0]["category"] == "Quantitative Aptitude"


def test_live_aptitude_submit():
    status, body = make_request("POST", "/api/aptitude/submit", {
        "category": "Quantitative Aptitude",
        "difficulty": "Beginner",
        "answers": {1: "20"}
    })
    assert status == 200
    assert "result" in body
    assert body["result"]["total_questions"] >= 1
    assert "accuracy" in body["result"]


def test_live_resume_skills():
    status, body = make_request("POST", "/api/resume/skills", {
        "resume_text": "Experienced Python engineer with React, SQL, and Git."
    })
    assert status == 200
    assert "Python" in body["skills"]
    assert "React" in body["skills"]


def test_live_resume_analyze():
    status, body = make_request("POST", "/api/resume/analyze", {
        "resume_text": "Experienced Python engineer with React, SQL, and Git."
    })
    assert status == 200
    assert "skills" in body
    assert "suggestions" in body
    assert body["skill_count"] >= 3


def test_live_interview_questions():
    status, body = make_request("POST", "/api/interview/questions", {
        "role": "Data Analyst",
        "interview_type": "Technical"
    })
    assert status == 200
    assert "questions" in body
    assert len(body["questions"]) > 0


def test_live_auth_me_unauthenticated():
    status, body = make_request("GET", "/api/auth/me")
    assert status == 401


def test_live_watchlist_unauthenticated():
    status, body = make_request("GET", "/api/watchlist")
    assert status == 401


def test_live_applications_unauthenticated():
    status, body = make_request("GET", "/api/applications")
    assert status == 401


def test_live_deadlines_unauthenticated():
    status, body = make_request("GET", "/api/notifications/deadlines")
    assert status == 401
