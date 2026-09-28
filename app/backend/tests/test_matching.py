
from app.services.internship_service import (
    skill_is_present,
    check_eligibility
)


# ============================================================
# 1. TEST SKILL MATCHING
# ============================================================

def test_skill_is_present_when_skill_exists():
    assert skill_is_present(
        "Python",
        "Experience with Python programming"
    ) is True


def test_skill_is_present_when_skill_is_missing():
    assert skill_is_present(
        "Python",
        "Experience with Java programming"
    ) is False


def test_skill_matching_does_not_match_partial_words():
    assert skill_is_present(
        "Python",
        "Experience with Pythonista tools"
    ) is False


def test_skill_matching_is_case_insensitive():
    assert skill_is_present(
        "Python",
        "PYTHON programming experience"
    ) is True


# ============================================================
# 2. TEST INTERNSHIP ELIGIBILITY
# ============================================================

def test_fresher_internship_is_entry_level():
    result = check_eligibility(
        "Data Science Intern",
        "Freshers welcome. No prior experience required."
    )

    assert result == "Likely Entry-Level"


def test_internship_without_experience_requirement():
    result = check_eligibility(
        "Software Intern",
        "Work with the development team on projects."
    )

    assert result == "Likely Entry-Level"


def test_experience_requirement_is_detected():
    result = check_eligibility(
        "Data Analyst",
        "Minimum of 2 years of experience required."
    )

    assert result == "Experience Required"


def test_senior_title_requires_experience():
    result = check_eligibility(
        "Senior Data Analyst",
        "Work with the analytics team."
    )

    assert result == "Experience Required"


def test_unknown_role_needs_review():
    result = check_eligibility(
        "Data Analyst",
        "Work with datasets and prepare reports."
    )

    assert result == "Review Requirements"