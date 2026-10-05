from agents import Runner

from app.agents.interview_agent import interview_agent
from app.schemas.interview import InterviewQuestion


INTERVIEW_QUESTIONS = [
    InterviewQuestion(
        id=1,
        role="Data Analyst",
        interview_type="Technical",
        question="What is the difference between WHERE and HAVING in SQL?"
    ),
    InterviewQuestion(
        id=2,
        role="Data Analyst",
        interview_type="Technical",
        question="What is the difference between INNER JOIN and LEFT JOIN?"
    ),
    InterviewQuestion(
        id=3,
        role="Data Analyst",
        interview_type="Technical",
        question="What is data cleaning and why is it important?"
    ),
    InterviewQuestion(
        id=4,
        role="Data Analyst",
        interview_type="HR",
        question="Tell me about yourself."
    ),
    InterviewQuestion(
        id=5,
        role="Data Analyst",
        interview_type="HR",
        question="Why do you want to work as a Data Analyst?"
    ),
    InterviewQuestion(
        id=6,
        role="Data Scientist",
        interview_type="Technical",
        question="What is the difference between supervised and unsupervised learning?"
    ),
    InterviewQuestion(
        id=7,
        role="Data Scientist",
        interview_type="Technical",
        question="What is overfitting in machine learning?"
    ),
    InterviewQuestion(
        id=8,
        role="Data Scientist",
        interview_type="HR",
        question="Why are you interested in Data Science?"
    ),
]


def get_interview_questions(
    role: str,
    interview_type: str
) -> list[InterviewQuestion]:
    """Return interview questions matching role and interview type."""

    normalized_role = role.strip().lower()
    normalized_type = interview_type.strip().lower()

    return [
        question
        for question in INTERVIEW_QUESTIONS
        if question.role.lower() == normalized_role
        and question.interview_type.lower() == normalized_type
    ]


async def evaluate_interview_answer(
    question: str,
    answer: str
) -> str:
    """Evaluate a student's interview answer using the AI agent."""

    user_message = f"""
Interview Question:
{question}

Student Answer:
{answer}

Evaluate the student's answer according to your instructions.
"""

    result = await Runner.run(
        interview_agent,
        user_message
    )

    return result.final_output