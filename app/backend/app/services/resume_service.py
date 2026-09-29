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
    "Docker",
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