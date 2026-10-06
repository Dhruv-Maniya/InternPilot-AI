from pydantic import BaseModel, Field


class AptitudeQuestion(BaseModel):
    id: int
    category: str
    difficulty: str
    question: str
    options: list[str]
    correct_answer: str


class AptitudeQuestionRequest(BaseModel):
    category: str = Field(
        ...,
        description="Aptitude category"
    )

    difficulty: str = Field(
        ...,
        description="Difficulty level"
    )


class AptitudeTestRequest(BaseModel):
    category: str = Field(
        ...,
        description="Aptitude category"
    )

    difficulty: str = Field(
        ...,
        description="Difficulty level"
    )

    answers: dict[int, str] = Field(
        ...,
        description="Question ID mapped to selected answer"
    )


class AptitudeResult(BaseModel):
    total_questions: int
    correct_answers: int
    incorrect_answers: int
    score: int
    accuracy: float
    weak_area: str | None


class AptitudeTestResponse(BaseModel):
    result: AptitudeResult

class AptitudeAnalysisRequest(BaseModel):
    category: str = Field(
        ...,
        description="Aptitude category"
    )
    total_questions: int = Field(
        ...,
        ge=0,
        description="Total number of questions"
    )
    correct_answers: int = Field(
        ...,
        ge=0,
        description="Number of correctly answered questions"
    )
    score: int = Field(
        ...,
        ge=0,
        description="Aptitude test score"
    )
    accuracy: float = Field(
        ...,
        ge=0,
        le=100,
        description="Aptitude test accuracy percentage"
    )
    weak_area: str | None = Field(
        default=None,
        description="Identified weak area"
    )


class AptitudeAnalysisResponse(BaseModel):
    analysis: str