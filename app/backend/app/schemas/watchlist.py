from pydantic import BaseModel, Field


class WatchlistItem(BaseModel):
    internship_id: str
    title: str
    company: str
    location: str
    application_url: str
    deadline: str | None = None


class WatchlistAddRequest(BaseModel):
    internship_id: str = Field(
        ...,
        min_length=1,
        description="Unique internship identifier"
    )

    title: str = Field(
        ...,
        min_length=1,
        description="Internship title"
    )

    company: str = Field(
        ...,
        min_length=1,
        description="Company offering the internship"
    )

    location: str = Field(
        ...,
        min_length=1,
        description="Internship location"
    )

    application_url: str = Field(
        ...,
        min_length=1,
        description="Internship application URL"
    )

    deadline: str | None = Field(
        default=None,
        description="Application deadline"
    )


class WatchlistResponse(BaseModel):
    items: list[WatchlistItem]