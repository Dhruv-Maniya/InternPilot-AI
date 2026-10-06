import openai
from fastapi import APIRouter, HTTPException

from app.schemas.aptitude import (
    AptitudeQuestionRequest,
    AptitudeTestRequest,
    AptitudeQuestion,
    AptitudeTestResponse,
    AptitudeAnalysisRequest,
    AptitudeAnalysisResponse,
)
from app.services.aptitude_service import (
    get_questions,
    calculate_result,
    analyze_aptitude_result,
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

@router.post(
    "/analyze",
    response_model=AptitudeAnalysisResponse
)
async def analyze_aptitude(
    request: AptitudeAnalysisRequest
):
    """Analyze aptitude test performance using AI."""

    try:
        analysis = await analyze_aptitude_result(
            category=request.category,
            total_questions=request.total_questions,
            correct_answers=request.correct_answers,
            score=request.score,
            accuracy=request.accuracy,
            weak_area=request.weak_area,
        )

        return AptitudeAnalysisResponse(
            analysis=analysis
        )

    except openai.InternalServerError:
        raise HTTPException(
            status_code=503,
            detail="Aptitude AI is temporarily unavailable. Please try again later."
        )