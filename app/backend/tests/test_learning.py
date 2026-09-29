from app.services.learning_service import (
    normalize_skill,
    find_matching_skills,
    create_learning_recommendations,
    analyze_skill_gap,
)


def test_normalize_skill():
    result = normalize_skill("  Machine   Learning  ")

    assert result == "machine learning"


def test_find_matching_skills():
    student_skills = ["Python", "SQL", "Statistics"]
    target_skills = ["Python", "SQL", "Pandas", "Machine Learning"]

    matched, missing = find_matching_skills(
        student_skills,
        target_skills
    )

    assert matched == ["Python", "SQL"]
    assert missing == ["Pandas", "Machine Learning"]


def test_find_matching_skills_is_case_insensitive():
    student_skills = ["python", "SQL"]
    target_skills = ["Python", "sql", "Pandas"]

    matched, missing = find_matching_skills(
        student_skills,
        target_skills
    )

    assert matched == ["Python", "sql"]
    assert missing == ["Pandas"]


def test_create_learning_recommendations():
    skills_to_learn = ["Pandas", "Machine Learning"]

    recommendations = create_learning_recommendations(
        skills_to_learn
    )

    assert len(recommendations) == 2

    assert recommendations[0].skill == "Pandas"
    assert recommendations[0].level == "Beginner"

    assert recommendations[1].skill == "Machine Learning"
    assert recommendations[1].level == "Beginner"


def test_analyze_skill_gap():
    student_skills = ["Python", "SQL", "Statistics"]
    required_skills = [
        "Python",
        "SQL",
        "Pandas",
        "Machine Learning"
    ]
    preferred_skills = ["Power BI", "Statistics"]

    result = analyze_skill_gap(
        student_skills=student_skills,
        required_skills=required_skills,
        preferred_skills=preferred_skills
    )

    assert result["matched_required_skills"] == [
        "Python",
        "SQL"
    ]

    assert result["missing_required_skills"] == [
        "Pandas",
        "Machine Learning"
    ]

    assert result["matched_preferred_skills"] == [
        "Statistics"
    ]

    assert result["missing_preferred_skills"] == [
        "Power BI"
    ]

    assert result["skills_to_learn"] == [
        "Pandas",
        "Machine Learning",
        "Power BI"
    ]

    assert len(result["recommendations"]) == 3

    assert result["recommendations"][0].skill == "Pandas"
    assert result["recommendations"][1].skill == "Machine Learning"
    assert result["recommendations"][2].skill == "Power BI"