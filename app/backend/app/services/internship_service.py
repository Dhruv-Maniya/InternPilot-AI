
from app.schemas.internship import StudentProfile
from app.services.serpapi_service import serpapi_service


def match_internships(profile: StudentProfile):
    """
    Find internships and calculate their match
    percentage based on the student's profile.
    """

    # Combine student skills and interests
    search_query = " ".join(
        profile.skills + profile.interests
    )

    # Search internships using SerpApi
    internships = serpapi_service.search_internships(
        query=search_query,
        location=profile.preferred_location
    )

    matched_internships = []

    for internship in internships:

        # Combine internship title and description
        job_text = (
            internship.title + " " +
            (internship.description or "")
        ).lower()

        matched_skills = []
        missing_skills = []

        # Compare student skills with internship details
        for skill in profile.skills:

            if skill.lower() in job_text:
                matched_skills.append(skill)
            else:
                missing_skills.append(skill)

        # Calculate match percentage
        total_skills = len(profile.skills)

        match_percentage = round(
            (len(matched_skills) / total_skills) * 100,
            2
        )

        matched_internships.append({
            "internship": internship.model_dump(),
            "match_percentage": match_percentage,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills
        })

    # Sort internships by match percentage
    matched_internships.sort(
        key=lambda item: item["match_percentage"],
        reverse=True
    )

    return matched_internships