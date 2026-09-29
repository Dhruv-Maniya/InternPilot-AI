from app.schemas.learning import LearningRecommendation


def normalize_skill(skill: str) -> str:
    """Normalize a skill for comparison."""
    return " ".join(skill.strip().lower().split())


def find_matching_skills(
    student_skills: list[str],
    target_skills: list[str]
) -> tuple[list[str], list[str]]:
    """
    Compare student skills with target skills.

    Returns:
        matched_skills, missing_skills
    """

    normalized_student_skills = {
        normalize_skill(skill)
        for skill in student_skills
    }

    matched_skills = []
    missing_skills = []

    for skill in target_skills:
        normalized_skill = normalize_skill(skill)

        if not normalized_skill:
            continue

        if normalized_skill in normalized_student_skills:
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)

    return matched_skills, missing_skills


def create_learning_recommendations(
    skills_to_learn: list[str]
) -> list[LearningRecommendation]:
    """Create basic learning recommendations for missing skills."""

    recommendations = []

    for skill in skills_to_learn:
        recommendations.append(
            LearningRecommendation(
                skill=skill,
                recommendation=f"Learn the fundamentals of {skill} and practice with small projects.",
                level="Beginner"
            )
        )

    return recommendations


def analyze_skill_gap(
    student_skills: list[str],
    required_skills: list[str],
    preferred_skills: list[str]
):
    """Analyze a student's skill gap for an internship."""

    matched_required_skills, missing_required_skills = (
        find_matching_skills(
            student_skills,
            required_skills
        )
    )

    matched_preferred_skills, missing_preferred_skills = (
        find_matching_skills(
            student_skills,
            preferred_skills
        )
    )

    skills_to_learn = list(
        dict.fromkeys(
            missing_required_skills +
            missing_preferred_skills
        )
    )

    recommendations = create_learning_recommendations(
        skills_to_learn
    )

    return {
        "matched_required_skills": matched_required_skills,
        "missing_required_skills": missing_required_skills,
        "matched_preferred_skills": matched_preferred_skills,
        "missing_preferred_skills": missing_preferred_skills,
        "skills_to_learn": skills_to_learn,
        "recommendations": recommendations
    }