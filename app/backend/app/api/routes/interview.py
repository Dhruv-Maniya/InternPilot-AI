from fastapi import APIRouter, HTTPException

from app.schemas.interview import (
    InterviewQuestionRequest,
    InterviewQuestionResponse,
)
from app.services.interview_service import get_interview_questions


router = APIRouter(
    prefix="/api/interview",
    tags=["Interview"]
)


@router.post(
    "/questions",
    response_model=InterviewQuestionResponse
)
def get_interview_question_list(
    request: InterviewQuestionRequest
):
    """Return interview questions for a role and interview type."""

    questions = get_interview_questions(
        role=request.role,
        interview_type=request.interview_type
    )

    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No interview questions found for the selected role and interview type."
        )

    return InterviewQuestionResponse(
        role=request.role,
        interview_type=request.interview_type,
        questions=questions
    )