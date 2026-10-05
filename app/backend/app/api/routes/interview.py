from fastapi import APIRouter, HTTPException
from openai import InternalServerError

from app.schemas.interview import (
    InterviewQuestionRequest,
    InterviewQuestionResponse,
    InterviewAnswerRequest,
    InterviewAnswerResponse,
)

from app.services.interview_service import (
    get_interview_questions,
    evaluate_interview_answer,
)


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


@router.post(
    "/evaluate",
    response_model=InterviewAnswerResponse
)
async def evaluate_interview_answer_endpoint(
    request: InterviewAnswerRequest
):
    """Evaluate a student's interview answer using AI."""

    try:
        feedback = await evaluate_interview_answer(
            question=request.question,
            answer=request.answer
        )

    except InternalServerError:
        raise HTTPException(
            status_code=503,
            detail="Interview AI is temporarily unavailable. Please try again later."
        )

    return InterviewAnswerResponse(
        question=request.question,
        answer=request.answer,
        feedback=feedback
    )