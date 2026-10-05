from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_skill_gap_api():
    response = client.post(
        "/api/learning/skill-gap",
        json={
            "student_skills": [
                "Python",
                "SQL"
            ],
            "required_skills": [
                "Python",
                "Pandas",
                "Machine Learning"
            ],
            "preferred_skills": [
                "Power BI"
            ]
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["matched_required_skills"] == [
        "Python"
    ]

    assert data["missing_required_skills"] == [
        "Pandas",
        "Machine Learning"
    ]

    assert data["matched_preferred_skills"] == []

    assert data["missing_preferred_skills"] == [
        "Power BI"
    ]

    assert data["skills_to_learn"] == [
        "Pandas",
        "Machine Learning",
        "Power BI"
    ]

    assert len(data["recommendations"]) == 3


def test_learning_resources_api():
    response = client.post(
        "/api/learning/resources",
        json={
            "skills": [
                "Pandas",
                "Machine Learning",
                "Power BI"
            ]
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data["resources"]) == 3

    assert data["resources"][0]["skill"] == "Pandas"
    assert data["resources"][1]["skill"] == "Machine Learning"
    assert data["resources"][2]["skill"] == "Power BI"


def test_learning_resources_api_unknown_skill():
    response = client.post(
        "/api/learning/resources",
        json={
            "skills": [
                "Blockchain"
            ]
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["resources"] == []