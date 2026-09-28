from typing import Optional

from pydantic import BaseModel, Field


class Internship(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    description: Optional[str] = None
    source: Optional[str] = None
    url: Optional[str] = None


class StudentProfile(BaseModel):
    name: str
    education: str

    skills: list[str] = Field(
        ...,
        min_length=1,
        description="Student's technical and professional skills"
    )

    interests: list[str] = Field(
        default_factory=list
    )

    preferred_location: str = "India"

class SkillAnalysis(BaseModel):
    required_skills: list[str] = Field(default_factory=list)
    matched_required_skills: list[str] = Field(default_factory=list)
    missing_required_skills: list[str] = Field(default_factory=list)

    preferred_skills: list[str] = Field(default_factory=list)
    skills_to_learn: list[str] = Field(default_factory=list)

    match_percentage: float = 0.0