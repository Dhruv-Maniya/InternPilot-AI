from pydantic import BaseModel, Field


class ApplicationItem(BaseModel):
    application_id: str
    internship_id: str
    title: str
    company: str
    application_url: str
    status: str


class ApplicationCreateRequest(BaseModel):
    application_id: str = Field(
        ...,
        min_length=1,
        description="Unique application identifier"
    )

    internship_id: str = Field(
        ...,
        min_length=1,
        description="Internship identifier"
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

    application_url: str = Field(
        ...,
        min_length=1,
        description="Internship application URL"
    )

    status: str = Field(
        default="Applied",
        description="Current application status"
    )


class ApplicationStatusUpdateRequest(BaseModel):
    status: str = Field(
        ...,
        min_length=1,
        description="New application status"
    )


class ApplicationResponse(BaseModel):
    applications: list[ApplicationItem]