from fastapi import APIRouter

from app.schemas.resume import ResumeRequest, ResumeResponse
from app.services.resume_service import extract_skills


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