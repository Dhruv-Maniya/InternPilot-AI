from pydantic import BaseModel, Field


class SkillGapRequest(BaseModel):
    student_skills: list[str] = Field(
        ...,
        min_length=1,
        description="Skills currently known by the student"
    )

    required_skills: list[str] = Field(
        ...,
        min_length=1,
        description="Skills required by the internship"
    )

    preferred_skills: list[str] = Field(
        default_factory=list,
        description="Skills preferred but not mandatory for the internship"
    )


class LearningRecommendation(BaseModel):
    skill: str
    recommendation: str
    level: str


class SkillGapResponse(BaseModel):
    matched_required_skills: list[str]
    missing_required_skills: list[str]
    matched_preferred_skills: list[str]
    missing_preferred_skills: list[str]
    skills_to_learn: list[str]
    recommendations: list[LearningRecommendation]