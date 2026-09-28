
from fastapi import APIRouter, HTTPException, Query

from app.schemas.internship import StudentProfile
from app.services.serpapi_service import serpapi_service
from app.services.internship_service import match_internships


router = APIRouter(
    prefix="/api/internships",
    tags=["Internships"]
)


@router.get("/")
def search_internships(
    query: str = Query(
        ...,
        min_length=2,
        description="Internship search query"
    ),
    location: str = Query(
        "India",
        min_length=2,
        description="Internship location"
    )
):
    """
    Search for internships using SerpApi.
    """

    try:
        internships = serpapi_service.search_internships(
            query=query,
            location=location
        )

        return {
            "count": len(internships),
            "results": internships
        }

    except RuntimeError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error)
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while searching internships."
        ) from error


@router.post("/match")
def get_matched_internships(
    profile: StudentProfile
):
    """
    Recommend internships based on a student's profile.
    """

    try:
        results = match_internships(profile)

        return {
            "student": profile.name,
            "count": len(results),
            "results": results
        }

    except RuntimeError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error)
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while matching internships."
        ) from error