from fastapi import APIRouter, HTTPException, Query

from app.services.serpapi_service import serpapi_service


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