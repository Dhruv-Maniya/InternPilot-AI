from app.services.aptitude_service import (
    get_questions,
    calculate_result,
)


def test_get_questions_by_category_and_difficulty():
    questions = get_questions(
        category="Quantitative Aptitude",
        difficulty="Beginner"
    )

    assert len(questions) == 2
    assert questions[0].category == "Quantitative Aptitude"
    assert questions[1].category == "Quantitative Aptitude"


def test_get_questions_is_case_insensitive():
    questions = get_questions(
        category="quantitative aptitude",
        difficulty="beginner"
    )

    assert len(questions) == 2


def test_unknown_category_returns_empty_list():
    questions = get_questions(
        category="Computer Science",
        difficulty="Beginner"
    )

    assert questions == []


def test_calculate_result_all_answers_correct():
    questions = get_questions(
        category="Quantitative Aptitude",
        difficulty="Beginner"
    )

    answers = {
        1: "20",
        2: "40"
    }

    result = calculate_result(
        questions=questions,
        answers=answers
    )

    assert result["total_questions"] == 2
    assert result["correct_answers"] == 2
    assert result["incorrect_answers"] == 0
    assert result["score"] == 2
    assert result["accuracy"] == 100.0
    assert result["weak_area"] is None


def test_calculate_result_with_wrong_answer():
    questions = get_questions(
        category="Quantitative Aptitude",
        difficulty="Beginner"
    )

    answers = {
        1: "10",
        2: "40"
    }

    result = calculate_result(
        questions=questions,
        answers=answers
    )

    assert result["total_questions"] == 2
    assert result["correct_answers"] == 1
    assert result["incorrect_answers"] == 1
    assert result["score"] == 1
    assert result["accuracy"] == 50.0


def test_calculate_result_weak_area():
    questions = get_questions(
        category="Quantitative Aptitude",
        difficulty="Beginner"
    )

    answers = {
        1: "10",
        2: "35"
    }

    result = calculate_result(
        questions=questions,
        answers=answers
    )

    assert result["correct_answers"] == 0
    assert result["incorrect_answers"] == 2
    assert result["accuracy"] == 0.0
    assert result["weak_area"] == "Quantitative Aptitude"