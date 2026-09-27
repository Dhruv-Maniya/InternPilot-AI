import serpapi

from app.core.config import settings


class SerpApiService:
    """Service responsible for communicating with SerpApi."""

    def __init__(self):
        self.client = serpapi.Client(
            api_key=settings.serpapi_api_key
        )

    def search_jobs(self, query: str, location: str = "India"):
        """Search for jobs/internships using SerpApi Google Jobs."""

        results = self.client.search({
            "engine": "google_jobs",
            "q": query,
            "location": location,
            "hl": "en",
            "gl": "in"
        })

        return results


serpapi_service = SerpApiService()