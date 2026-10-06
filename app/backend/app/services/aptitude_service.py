from agents import Runner

from app.schemas.aptitude import AptitudeQuestion
from app.agents.aptitude_agent import aptitude_agent

APTITUDE_QUESTIONS = [
    AptitudeQuestion(
        id=1,
        category="Quantitative Aptitude",
        difficulty="Beginner",
        question="What is 20% of 100?",
        options=["10", "20", "30", "40"],
        correct_answer="20"
    ),
    AptitudeQuestion(
        id=2,
        category="Quantitative Aptitude",
        difficulty="Beginner",
        question="What is 15 + 25?",
        options=["30", "35", "40", "45"],
        correct_answer="40"
    ),
    AptitudeQuestion(
        id=3,
        category="Logical Reasoning",
        difficulty="Beginner",
        question="Which number comes next: 2, 4, 6, 8, ?",
        options=["9", "10", "11", "12"],
        correct_answer="10"
    ),
    AptitudeQuestion(
        id=4,
        category="Logical Reasoning",
        difficulty="Beginner",
        question="If all cats are animals and Tom is a cat, what is Tom?",
        options=["Plant", "Animal", "Vehicle", "Object"],
        correct_answer="Animal"
    ),
    AptitudeQuestion(
        id=5,
        category="Verbal Ability",
        difficulty="Beginner",
        question="Choose the synonym of 'Happy'.",
        options=["Sad", "Joyful", "Angry", "Tired"],
        correct_answer="Joyful"
    ),
    AptitudeQuestion(
        id=6,
        category="Data Interpretation",
        difficulty="Beginner",
        question="A store sold 10 pens on Monday and 20 pens on Tuesday. How many pens were sold in total?",
        options=["20", "25", "30", "35"],
        correct_answer="30"
    ),
]


def get_questions(
    category: str,
    difficulty: str
) -> list[AptitudeQuestion]:
    """Return aptitude questions matching category and difficulty."""

    return [
        question
        for question in APTITUDE_QUESTIONS
        if question.category.lower() == category.strip().lower()
        and question.difficulty.lower() == difficulty.strip().lower()
    ]


def calculate_result(
    questions: list[AptitudeQuestion],
    answers: dict[int, str]
) -> dict:
    """Calculate aptitude test score and performance."""

    total_questions = len(questions)
    correct_answers = 0

    for question in questions:
        submitted_answer = answers.get(question.id)

        if submitted_answer is not None:
            if submitted_answer.strip().lower() == question.correct_answer.lower():
                correct_answers += 1

    incorrect_answers = total_questions - correct_answers

    if total_questions > 0:
        accuracy = round(
            (correct_answers / total_questions) * 100,
            2
        )
    else:
        accuracy = 0.0

    score = correct_answers

    if accuracy < 50:
        weak_area = questions[0].category if questions else None
    else:
        weak_area = None

    return {
        "total_questions": total_questions,
        "correct_answers": correct_answers,
        "incorrect_answers": incorrect_answers,
        "score": score,
        "accuracy": accuracy,
        "weak_area": weak_area
    }

async def analyze_aptitude_result(
    category: str,
    total_questions: int,
    correct_answers: int,
    score: int,
    accuracy: float,
    weak_area: str | None
) -> str:
    """Analyze a student's aptitude test performance using the AI agent."""

    user_message = f"""
Aptitude Test Performance:

Category:
{category}

Total Questions:
{total_questions}

Correct Answers:
{correct_answers}

Score:
{score}

Accuracy:
{accuracy}%

Weak Area:
{weak_area or "None"}

Analyze the student's aptitude performance according to your instructions.
"""

    result = await Runner.run(
        aptitude_agent,
        user_message
    )

    return result.final_output