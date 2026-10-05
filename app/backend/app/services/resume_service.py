import re


KNOWN_SKILLS = [
    "Python",
    "C++",
    "C",
    "Java",
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "FastAPI",
    "Django",
    "SQL",
    "MySQL",
    "MongoDB",
    "PostgreSQL",
    "Supabase",
    "Firebase",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "Machine Learning",
    "Deep Learning",
    "Artificial Intelligence",
    "Data Science",
    "Data Analysis",
    "Power BI",
    "Tableau",
    "Git",
    "GitHub",
    "AWS",
]


def extract_skills(resume_text: str) -> list[str]:
    """Extract known skills from resume text."""

    found_skills = []

    for skill in KNOWN_SKILLS:
        pattern = rf"(?<!\w){re.escape(skill)}(?!\w)"

        if re.search(pattern, resume_text, re.IGNORECASE):
            found_skills.append(skill)

    return found_skills


def analyze_resume(resume_text: str) -> dict:
    """Analyze a resume and provide basic improvement suggestions."""

    skills = extract_skills(resume_text)

    suggestions = []

    if len(resume_text.split()) < 50:
        suggestions.append(
            "Consider adding more details about your education, experience, projects, and achievements."
        )

    if not re.search(
        r"\b(project|projects)\b",
        resume_text,
        re.IGNORECASE
    ):
        suggestions.append(
            "Consider adding relevant projects to strengthen your resume."
        )

    if not re.search(
        r"\b(achievement|achievements|award|awards)\b",
        resume_text,
        re.IGNORECASE
    ):
        suggestions.append(
            "Consider adding measurable achievements or awards to your resume."
        )

    if not re.search(
        r"\b(experience|internship|internships)\b",
        resume_text,
        re.IGNORECASE
    ):
        suggestions.append(
            "Consider adding relevant work experience or internship experience."
        )

    return {
        "resume_text": resume_text,
        "skills": skills,
        "skill_count": len(skills),
        "suggestions": suggestions,
    }