from pydantic import BaseModel, Field


class InterviewQuestionRequest(BaseModel):
    role: str = Field(
        ...,
        min_length=1,
        description="Target job or internship role"
    )

    interview_type: str = Field(
        ...,
        min_length=1,
        description="Type of interview"
    )


class InterviewQuestion(BaseModel):
    id: int
    role: str
    interview_type: str
    question: str


class InterviewQuestionResponse(BaseModel):
    role: str
    interview_type: str
    questions: list[InterviewQuestion]


class InterviewAnswerRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=1,
        description="Interview question"
    )

    answer: str = Field(
        ...,
        min_length=1,
        description="Student's interview answer"
    )


class InterviewAnswerResponse(BaseModel):
    question: str
    answer: str
    feedback: str