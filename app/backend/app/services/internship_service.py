import re

from app.schemas.internship import StudentProfile
from app.services.serpapi_service import serpapi_service


# ============================================================
# 1. SKILL ALIASES
# ============================================================

SKILL_ALIASES = {
    "Python": ["python"],
    "SQL": ["sql", "structured query language"],
    "Statistics": ["statistics", "statistical analysis"],
    "Machine Learning": [
        "machine learning",
        "machine-learning",
        "ml"
    ],
    "Data Science": ["data science"],
    "Data Analytics": [
        "data analytics",
        "data analysis",
        "analytics"
    ],
    "Pandas": ["pandas"],
    "NumPy": ["numpy", "numerical python"],
    "Scikit-learn": [
        "scikit-learn",
        "scikit learn",
        "sklearn"
    ],
    "C++": ["c++", "cpp"],
    "C": ["c programming", "c language"],
    "Java": ["java"],
    "JavaScript": [
        "javascript",
        "java script"
    ],
    "HTML": ["html", "html5"],
    "CSS": ["css", "css3"],
    "R": ["r programming", "r language"],
    "Excel": [
        "excel",
        "microsoft excel",
        "ms excel"
    ],
    "Power BI": [
        "power bi",
        "powerbi"
    ],
    "Tableau": ["tableau"],
    "Deep Learning": ["deep learning"],
    "NLP": [
        "nlp",
        "natural language processing"
    ],
    "Data Visualization": [
        "data visualization",
        "data visualisation"
    ],
    "Probability": ["probability"],
    "MySQL": ["mysql"],
    "MongoDB": ["mongodb", "mongo db"]
}


# ============================================================
# 2. TEXT NORMALIZATION
# ============================================================

def normalize_text(text: str) -> str:
    """
    Convert text into lowercase and normalize spaces.
    """

    if not text:
        return ""

    text = text.lower()

    text = re.sub(
        r"[^a-z0-9+#.\s-]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# ============================================================
# 3. CHECK WHETHER A SKILL IS PRESENT
# ============================================================

def skill_is_present(
    skill: str,
    text: str
) -> bool:
    """
    Check whether a skill or its alias appears
    in the supplied text.
    """

    normalized_skill = normalize_text(skill)
    normalized_text = normalize_text(text)

    aliases = SKILL_ALIASES.get(
        skill,
        [skill]
    )

    for alias in aliases:

        normalized_alias = normalize_text(alias)

        if not normalized_alias:
            continue

        pattern = (
            r"(?<![a-z0-9])"
            + re.escape(normalized_alias)
            + r"(?![a-z0-9])"
        )

        if re.search(
            pattern,
            normalized_text
        ):
            return True

    # Fallback for skills not present in the alias list.
    if normalized_skill:

        pattern = (
            r"(?<![a-z0-9])"
            + re.escape(normalized_skill)
            + r"(?![a-z0-9])"
        )

        if re.search(
            pattern,
            normalized_text
        ):
            return True

    return False


# ============================================================
# 4. FIND SKILLS IN TEXT
# ============================================================

def find_skills(text: str) -> list[str]:
    """
    Extract recognized skills from a job description.
    """

    normalized_text = normalize_text(text)

    found_skills = []

    for skill in SKILL_ALIASES:

        if skill_is_present(
            skill,
            normalized_text
        ):
            found_skills.append(skill)

    return found_skills


# ============================================================
# 5. EXTRACT SKILL SECTIONS FROM JOB DESCRIPTION
# ============================================================

def extract_skill_sections(
    description: str
) -> dict:
    """
    Extract required skills, preferred skills,
    and skills mentioned in learning sections.
    """

    normalized_description = normalize_text(
        description
    )

    required_skills = []
    preferred_skills = []
    skills_to_learn = []

    requirements_found = False

    if not normalized_description:
        return {
            "required_skills": [],
            "preferred_skills": [],
            "skills_to_learn": [],
            "requirements_found": False
        }

    # --------------------------------------------------------
    # Required skill section headings
    # --------------------------------------------------------

    required_patterns = [
        r"requirements",
        r"required skills",
        r"minimum qualifications",
        r"basic qualifications",
        r"what you need",
        r"what we're looking for",
        r"what we are looking for",
        r"qualifications",
        r"must have"
    ]

    # --------------------------------------------------------
    # Preferred skill section headings
    # --------------------------------------------------------

    preferred_patterns = [
        r"preferred qualifications",
        r"preferred skills",
        r"good to have",
        r"nice to have",
        r"bonus points",
        r"desirable skills",
        r"additional qualifications"
    ]

    # --------------------------------------------------------
    # Learning-related section headings
    # --------------------------------------------------------

    learning_patterns = [
        r"you will learn",
        r"what you will learn",
        r"learning opportunities",
        r"skills you will develop",
        r"training provided",
        r"you'll learn"
    ]

    def extract_section(
        patterns: list[str]
    ) -> str:
        """
        Extract text following a section heading
        until another common heading is encountered.
        """

        for pattern in patterns:

            match = re.search(
                pattern,
                normalized_description
            )

            if match:

                start = match.end()

                section_text = (
                    normalized_description[start:]
                )

                stop_patterns = [
                    r"responsibilities",
                    r"about the role",
                    r"about us",
                    r"about the company",
                    r"benefits",
                    r"how to apply",
                    r"application process",
                    r"what you'll do",
                    r"what you will do",
                    r"preferred qualifications",
                    r"preferred skills",
                    r"requirements",
                    r"qualifications",
                    r"you will learn",
                    r"what you will learn"
                ]

                stop_positions = []

                for stop_pattern in stop_patterns:

                    stop_match = re.search(
                        stop_pattern,
                        section_text
                    )

                    if stop_match:
                        stop_positions.append(
                            stop_match.start()
                        )

                if stop_positions:

                    section_text = section_text[
                        :min(stop_positions)
                    ]

                return section_text

        return ""

    # --------------------------------------------------------
    # Extract required skills
    # --------------------------------------------------------

    required_section = extract_section(
        required_patterns
    )

    if required_section:

        required_skills = find_skills(
            required_section
        )

    # --------------------------------------------------------
    # Extract preferred skills
    # --------------------------------------------------------

    preferred_section = extract_section(
        preferred_patterns
    )

    if preferred_section:

        preferred_skills = find_skills(
            preferred_section
        )

    # --------------------------------------------------------
    # Extract learning skills
    # --------------------------------------------------------

    learning_section = extract_section(
        learning_patterns
    )

    if learning_section:

        skills_to_learn = find_skills(
            learning_section
        )

    # --------------------------------------------------------
    # Fallback: detect skills from full description
    # --------------------------------------------------------

    if not required_skills and not preferred_skills:

        all_detected_skills = find_skills(
            normalized_description
        )

        if all_detected_skills:

            required_skills = all_detected_skills

    # Remove duplicates while preserving order.

    required_skills = list(
        dict.fromkeys(required_skills)
    )

    preferred_skills = list(
        dict.fromkeys(preferred_skills)
    )

    skills_to_learn = list(
        dict.fromkeys(skills_to_learn)
    )

    requirements_found = bool(
        required_skills or preferred_skills
    )

    return {
        "required_skills": required_skills,
        "preferred_skills": preferred_skills,
        "skills_to_learn": skills_to_learn,
        "requirements_found": requirements_found
    }


# ============================================================
# 6. CHECK INTERNSHIP ELIGIBILITY
# ============================================================

def check_eligibility(
    title: str,
    description: str
) -> str:
    """
    Classify internships based on experience requirements.
    """

    title = (title or "").lower()
    description = (description or "").lower()

    full_text = title + " " + description

    # --------------------------------------------------------
    # Fresher and no-experience patterns
    # --------------------------------------------------------

    fresher_patterns = [
        r"freshers welcome",
        r"freshers eligible",
        r"freshers can apply",
        r"no experience required",
        r"no prior experience",
        r"without experience",
        r"entry level",
        r"entry-level",
        r"0 years of experience",
        r"zero years of experience"
    ]

    if any(
        re.search(pattern, full_text)
        for pattern in fresher_patterns
    ):
        return "Likely Entry-Level"

    # --------------------------------------------------------
    # Explicit experience requirements
    # --------------------------------------------------------

    experience_patterns = [
        r"\d+\+?\s*years? of experience",
        r"minimum of \d+ years",
        r"at least \d+ years",
        r"prior professional experience"
    ]

    if any(
        re.search(pattern, full_text)
        for pattern in experience_patterns
    ):
        return "Experience Required"

    # --------------------------------------------------------
    # Senior-level job titles
    # --------------------------------------------------------

    senior_keywords = [
        "senior",
        "manager",
        "team lead",
        "team leader",
        "head of",
        "director",
        "principal",
        "staff data scientist"
    ]

    if any(
        keyword in title
        for keyword in senior_keywords
    ):
        return "Experience Required"

    # --------------------------------------------------------
    # Generic entry-level indicators
    # --------------------------------------------------------

    entry_level_keywords = [
        "intern",
        "internship",
        "trainee",
        "apprentice",
        "co-op"
    ]

    if any(
        keyword in title
        for keyword in entry_level_keywords
    ):
        return "Likely Entry-Level"

    return "Review Requirements"


# ============================================================
# 7. MATCH AND RANK INTERNSHIPS
# ============================================================

def match_internships(
    profile: StudentProfile
) -> list[dict]:
    """
    Search internships, match student skills,
    calculate skill gaps, and rank results.
    """

    # --------------------------------------------------------
    # A. Build the SerpApi search query
    # --------------------------------------------------------

    search_query = " ".join(
        profile.skills + profile.interests
    )

    internships = serpapi_service.search_internships(
        query=search_query,
        location=profile.preferred_location
    )

    matched_internships = []

    student_skills = profile.skills

    # --------------------------------------------------------
    # B. Process every internship
    # --------------------------------------------------------

    for internship in internships:

        description = internship.description or ""
        title = internship.title or ""

        # ----------------------------------------------------
        # Extract required, preferred, and learning skills
        # ----------------------------------------------------

        skill_analysis = extract_skill_sections(
            description
        )

        required_skills = skill_analysis[
            "required_skills"
        ]

        preferred_skills = skill_analysis[
            "preferred_skills"
        ]

        skills_to_learn = skill_analysis[
            "skills_to_learn"
        ]

        # ----------------------------------------------------
        # C. Match required skills
        # ----------------------------------------------------

        matched_required_skills = []
        missing_required_skills = []

        for required_skill in required_skills:

            is_matched = any(
                skill_is_present(
                    required_skill,
                    normalize_text(student_skill)
                )
                for student_skill in student_skills
            )

            if is_matched:

                matched_required_skills.append(
                    required_skill
                )

            else:

                missing_required_skills.append(
                    required_skill
                )

        # ----------------------------------------------------
        # D. Find missing preferred skills
        # ----------------------------------------------------

        missing_preferred_skills = []

        for preferred_skill in preferred_skills:

            is_matched = any(
                skill_is_present(
                    preferred_skill,
                    normalize_text(student_skill)
                )
                for student_skill in student_skills
            )

            if not is_matched:

                missing_preferred_skills.append(
                    preferred_skill
                )


        # ----------------------------------------------------
        # E. Build an accurate skill-gap list
        # ----------------------------------------------------

        # Combine missing required and preferred skills.
        candidate_skills_to_learn = (
            missing_required_skills
            + missing_preferred_skills
            + skills_to_learn
        )

        # Remove duplicate skills while preserving order.
        candidate_skills_to_learn = list(
            dict.fromkeys(candidate_skills_to_learn)
        )

        # Keep only skills the student does not know.
        final_skills_to_learn = []

        for skill in candidate_skills_to_learn:

            already_knows_skill = any(
                skill_is_present(
                    skill,
                    normalize_text(student_skill)
                )
                for student_skill in student_skills
            )

            if not already_knows_skill:
                final_skills_to_learn.append(skill)

        skills_to_learn = final_skills_to_learn

        # ----------------------------------------------------
        # F. Calculate skill match percentage
        # ----------------------------------------------------

        if required_skills:

            match_percentage = round(
                (
                    len(matched_required_skills)
                    / len(required_skills)
                ) * 100,
                2
            )

        else:

            match_percentage = None

        # ----------------------------------------------------
        # G. Determine eligibility
        # ----------------------------------------------------

        eligibility = check_eligibility(
            title,
            description
        )

        # ----------------------------------------------------
        # H. Assign recommendation priority
        # ----------------------------------------------------

        if eligibility == "Likely Entry-Level":

            recommendation_priority = 0

        elif eligibility == "Review Requirements":

            recommendation_priority = 1

        else:

            recommendation_priority = 2

        # ----------------------------------------------------
        # I. Append processed internship
        # ----------------------------------------------------

        matched_internships.append({

            "title": internship.title,
            "company": internship.company,
            "location": internship.location,
            "description": internship.description,
            "source": internship.source,
            "url": internship.url,

            "required_skills": required_skills,
            "preferred_skills": preferred_skills,

            "matched_skills": matched_required_skills,
            "missing_skills": missing_required_skills,

            "skills_to_learn": skills_to_learn,

            "match_percentage": match_percentage,

            "requirements_found": skill_analysis[
                "requirements_found"
            ],

            "eligibility": eligibility,

            "recommendation_priority": (
                recommendation_priority
            )
        })

    # --------------------------------------------------------
    # J. Sort internship recommendations
    # --------------------------------------------------------

    matched_internships.sort(
        key=lambda item: (
            item["recommendation_priority"],
            -(
                item["match_percentage"]
                if item["match_percentage"] is not None
                else -1
            )
        )
    )

    # --------------------------------------------------------
    # K. Return final results
    # --------------------------------------------------------

    return matched_internships