from app.schemas.learning import LearningResource


LEARNING_RESOURCES = {
    "pandas": [
        LearningResource(
            skill="Pandas",
            title="Pandas Documentation",
            resource_type="Documentation",
            url="https://pandas.pydata.org/docs/",
            description="Official documentation for learning and using Pandas."
        )
    ],
    "machine learning": [
        LearningResource(
            skill="Machine Learning",
            title="Scikit-learn User Guide",
            resource_type="Documentation",
            url="https://scikit-learn.org/stable/user_guide.html",
            description="Official guide for learning machine learning with scikit-learn."
        )
    ],
    "power bi": [
        LearningResource(
            skill="Power BI",
            title="Microsoft Learn - Power BI",
            resource_type="Tutorial",
            url="https://learn.microsoft.com/power-bi/",
            description="Microsoft learning resources for Power BI."
        )
    ]
}


def normalize_skill(skill: str) -> str:
    """Normalize a skill name for resource lookup."""
    return " ".join(skill.strip().lower().split())


def get_learning_resources(
    skills: list[str]
) -> list[LearningResource]:
    """Return curated learning resources for the requested skills."""

    resources = []

    for skill in skills:
        normalized_skill = normalize_skill(skill)

        if not normalized_skill:
            continue

        skill_resources = LEARNING_RESOURCES.get(
            normalized_skill,
            []
        )

        resources.extend(skill_resources)

    return resources