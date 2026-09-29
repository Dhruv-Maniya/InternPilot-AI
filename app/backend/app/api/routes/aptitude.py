from fastapi import APIRouter, HTTPException

from app.schemas.aptitude import (
    AptitudeQuestionRequest,
    AptitudeTestRequest,
    AptitudeQuestion,
    AptitudeTestResponse,
)
from app.services.aptitude_service import (
    get_questions,
    calculate_result,
)


router = APIRouter(
    prefix="/api/aptitude",
    tags=["Aptitude"]
)


@router.post(
    "/questions",
    response_model=list[AptitudeQuestion]
)
def get_aptitude_questions(
    request: AptitudeQuestionRequest
):
    """Return aptitude questions for a category and difficulty."""

    questions = get_questions(
        category=request.category,
        difficulty=request.difficulty
    )

    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No aptitude questions found for the selected category and difficulty."
        )

    return questions


@router.post(
    "/submit",
    response_model=AptitudeTestResponse
)
def submit_aptitude_test(
    request: AptitudeTestRequest
):
    """Evaluate submitted aptitude answers."""

    questions = get_questions(
        category=request.category,
        difficulty=request.difficulty
    )

    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No aptitude questions found for the selected category and difficulty."
        )

    result = calculate_result(
        questions=questions,
        answers=request.answers
    )

    return AptitudeTestResponse(
        result=result
    )