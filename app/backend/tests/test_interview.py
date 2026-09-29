from app.services.interview_service import get_interview_questions


def test_get_technical_questions_for_data_analyst():
    questions = get_interview_questions(
        role="Data Analyst",
        interview_type="Technical"
    )

    assert len(questions) == 3
    assert questions[0].role == "Data Analyst"
    assert questions[0].interview_type == "Technical"


def test_get_hr_questions_for_data_analyst():
    questions = get_interview_questions(
        role="Data Analyst",
        interview_type="HR"
    )

    assert len(questions) == 2
    assert questions[0].interview_type == "HR"


def test_get_questions_is_case_insensitive():
    questions = get_interview_questions(
        role="data analyst",
        interview_type="technical"
    )

    assert len(questions) == 3


def test_unknown_role_returns_empty_list():
    questions = get_interview_questions(
        role="Cybersecurity Analyst",
        interview_type="Technical"
    )

    assert questions == []


def test_unknown_interview_type_returns_empty_list():
    questions = get_interview_questions(
        role="Data Analyst",
        interview_type="Coding"
    )

    assert questions == []