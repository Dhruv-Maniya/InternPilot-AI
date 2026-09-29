from fastapi import APIRouter

from app.schemas.learning import SkillGapRequest
from app.services.learning_service import analyze_skill_gap


router = APIRouter(
    prefix="/api/learning",
    tags=["Learning"]
)


@router.post("/skill-gap")
def get_skill_gap(request: SkillGapRequest):
    """Analyze missing skills and generate learning recommendations."""

    result = analyze_skill_gap(
        student_skills=request.student_skills,
        required_skills=request.required_skills,
        preferred_skills=request.preferred_skills
    )

    return result