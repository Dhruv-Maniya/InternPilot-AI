from fastapi import APIRouter

from app.schemas.resume import (
    ResumeRequest,
    ResumeResponse,
    ResumeAnalysisRequest,
    ResumeAnalysisResponse,
)

from app.services.resume_service import (
    extract_skills,
    analyze_resume,
)


router = APIRouter(
    prefix="/api/resume",
    tags=["Resume"]
)


@router.post(
    "/skills",
    response_model=ResumeResponse
)
def extract_resume_skills(
    request: ResumeRequest
):
    """Extract known skills from resume text."""

    skills = extract_skills(request.resume_text)

    return ResumeResponse(
        resume_text=request.resume_text,
        skills=skills
    )


@router.post(
    "/analyze",
    response_model=ResumeAnalysisResponse
)
def analyze_resume_endpoint(
    request: ResumeAnalysisRequest
):
    """Analyze resume and provide basic improvement suggestions."""

    result = analyze_resume(request.resume_text)

    return ResumeAnalysisResponse(**result)