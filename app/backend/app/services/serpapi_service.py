import serpapi

from app.core.config import settings
from app.schemas.internship import Internship


class SerpApiService:
    """Service responsible for communicating with SerpApi."""

    def __init__(self):
        self.client = serpapi.Client(
            api_key=settings.serpapi_api_key
        )

    def search_jobs(
        self,
        query: str,
        location: str = "India"
    ):
        """Search for jobs/internships using SerpApi Google Jobs."""

        try:
            results = self.client.search({
                "engine": "google_jobs",
                "q": query,
                "location": location,
                "hl": "en",
                "gl": "in"
            })

            return results

        except Exception as error:
            raise RuntimeError(
                f"SerpApi search failed: {error}"
            ) from error

    def search_internships(
        self,
        query: str,
        location: str = "India"
    ) -> list[Internship]:
        """Search and convert SerpApi results into clean internship data."""

        results = self.search_jobs(query, location)

        internships = []

        for job in results.get("jobs_results", []):
            internship = Internship(
                title=job.get("title", "Unknown"),
                company=job.get("company_name", "Unknown"),
                location=job.get("location"),
                description=job.get("description"),
                source=job.get("via"),
                url=job.get("share_link")
            )

            internships.append(internship)

        return internships


serpapi_service = SerpApiService()