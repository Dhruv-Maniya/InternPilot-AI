from pydantic import BaseModel, Field


class ResumeRequest(BaseModel):
    resume_text: str = Field(
        ...,
        min_length=1,
        description="Resume content provided as text"
    )


class SkillProfile(BaseModel):
    skills: list[str]


class ResumeResponse(BaseModel):
    resume_text: str
    skills: list[str]


class ResumeAnalysisRequest(BaseModel):
    resume_text: str = Field(
        ...,
        min_length=1,
        description="Resume content to analyze"
    )


class ResumeAnalysisResponse(BaseModel):
    resume_text: str
    skills: list[str]
    skill_count: int
    suggestions: list[str]