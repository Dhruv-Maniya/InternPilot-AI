from app.services.resume_service import analyze_resume, extract_skills


def test_extract_skills_from_resume():
    resume_text = """
    I am a Python developer with experience in SQL,
    Pandas and Machine Learning.
    """

    skills = extract_skills(resume_text)

    assert "Python" in skills
    assert "SQL" in skills
    assert "Pandas" in skills
    assert "Machine Learning" in skills


def test_extract_skills_is_case_insensitive():
    resume_text = "Experienced in PYTHON, sql and pandas."

    skills = extract_skills(resume_text)

    assert "Python" in skills
    assert "SQL" in skills
    assert "Pandas" in skills


def test_extract_skills_returns_empty_for_no_known_skills():
    resume_text = "I am interested in photography and travelling."

    skills = extract_skills(resume_text)

    assert skills == []


def test_extract_skills_does_not_duplicate_skills():
    resume_text = "Python Python PYTHON developer using Python."

    skills = extract_skills(resume_text)

    assert skills.count("Python") == 1


def test_extract_skills_does_not_match_c_inside_other_words():
    resume_text = (
        "I am a Python developer with experience in SQL, "
        "Pandas and Machine Learning."
    )

    skills = extract_skills(resume_text)

    assert "Python" in skills
    assert "SQL" in skills
    assert "Pandas" in skills
    assert "Machine Learning" in skills
    assert "C" not in skills


def test_analyze_resume_extracts_skills_and_counts_them():
    resume_text = (
        "I am a Python developer with experience in SQL, "
        "Pandas and Machine Learning. "
        "I worked on several projects."
    )

    result = analyze_resume(resume_text)

    assert result["skills"] == [
        "Python",
        "SQL",
        "Pandas",
        "Machine Learning",
    ]

    assert result["skill_count"] == 4


def test_analyze_resume_suggests_projects_when_missing():
    resume_text = (
        "I am a Python developer with experience in SQL and Pandas. "
        "I have internship experience."
    )

    result = analyze_resume(resume_text)

    assert (
        "Consider adding relevant projects to strengthen your resume."
        in result["suggestions"]
    )


def test_analyze_resume_suggests_achievements_when_missing():
    resume_text = (
        "I am a Python developer with experience in SQL and Pandas. "
        "I worked on projects during my internship."
    )

    result = analyze_resume(resume_text)

    assert (
        "Consider adding measurable achievements or awards to your resume."
        in result["suggestions"]
    )


def test_analyze_resume_returns_resume_text():
    resume_text = "Python developer with experience in SQL."

    result = analyze_resume(resume_text)

    assert result["resume_text"] == resume_text