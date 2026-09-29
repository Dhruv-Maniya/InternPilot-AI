from fastapi import APIRouter

from app.schemas.learning import SkillGapRequest
from app.services.learning_service import analyze_skill_gap
from app.schemas.learning import (
    SkillGapRequest,
    LearningResourceRequest,
    LearningResourceResponse,
)
from app.services.resource_service import get_learning_resources

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

@router.post(
    "/resources",
    response_model=LearningResourceResponse
)
def get_resources(request: LearningResourceRequest):
    """Return learning resources for requested skills."""

    resources = get_learning_resources(
        skills=request.skills
    )

    return LearningResourceResponse(
        resources=resources
    )