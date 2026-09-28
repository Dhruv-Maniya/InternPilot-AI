
from serpapi import GoogleSearch

from app.core.config import settings
from app.schemas.internship import Internship


class SerpApiService:

    def __init__(self):
        self.api_key = settings.serpapi_api_key

    def search_jobs(
        self,
        query: str,
        location: str = "India"
    ):
        """Search Google Jobs using SerpApi."""

        try:
            params = {
                "engine": "google_jobs",
                "q": f"{query} internship intern",
                "location": location,
                "hl": "en",
                "gl": "in",
                "api_key": self.api_key
            }

            search = GoogleSearch(params)
            results = search.get_dict()

            return results

        except Exception as error:
            raise RuntimeError(
                f"SerpApi search failed: {error}"
            ) from error

    def is_internship(self, job: dict) -> bool:
        """Check whether a listing appears to be an internship."""

        title = job.get("title", "").lower()
        description = job.get("description", "").lower()

        excluded_titles = [
            "senior",
            "manager",
            "team lead",
            "team leader",
            "head of",
            "director",
            "principal",
            "specialist",
            "trainer",
            "staff data scientist"
        ]

        if any(
            keyword in title
            for keyword in excluded_titles
        ):
            return False

        internship_title_keywords = [
            "intern",
            "internship",
            "trainee",
            "apprentice",
            "co-op"
        ]

        if any(
            keyword in title
            for keyword in internship_title_keywords
        ):
            return True

        internship_description_keywords = [
            "internship opportunity",
            "intern position",
            "intern role",
            "interns will",
            "as an intern",
            "internship program",
            "internship duration"
        ]

        if any(
            keyword in description
            for keyword in internship_description_keywords
        ):
            return True

        return False

    def search_internships(
        self,
        query: str,
        location: str = "India"
    ) -> list[Internship]:
        """Search, filter, and remove duplicate internships."""

        results = self.search_jobs(query, location)

        internships = []

        preferred_location = (
            (location or "").strip().lower()
        )

        # Track unique company-title combinations
        seen_internships = set()

        for job in results.get("jobs_results", []):

            if not self.is_internship(job):
                continue

            internship = Internship(
                title=job.get("title", "Unknown"),
                company=job.get("company_name", "Unknown"),
                location=job.get("location"),
                description=job.get("description"),
                source=job.get("via"),
                url=job.get("share_link")
            )

            job_location = (
                internship.location or ""
            ).strip().lower()

            # Apply location filtering
            if preferred_location not in ["india", ""]:
                if preferred_location not in job_location:
                    continue

            # Create a unique key
            unique_key = (
                (internship.company or "Unknown").strip().lower(),
                (internship.title or "Unknown").strip().lower()
            )

            # Skip duplicate company-title combinations
            if unique_key in seen_internships:
                continue

            seen_internships.add(unique_key)

            internships.append(internship)

        return internships


# Create the service instance
serpapi_service = SerpApiService()