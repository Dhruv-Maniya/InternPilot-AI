from app.schemas.applications import ApplicationItem
from app.services.applications_service import (
    APPLICATIONS,
    add_application,
    get_applications,
    update_application_status,
    remove_application,
)


def create_test_application(
    application_id: str = "application-001"
) -> ApplicationItem:
    return ApplicationItem(
        application_id=application_id,
        internship_id="internship-001",
        title="Data Analyst Intern",
        company="ABC Technologies",
        application_url="https://example.com/apply",
        status="Applied",
    )


def test_add_application():
    APPLICATIONS.clear()

    application = create_test_application()

    result = add_application(application)

    assert result == application
    assert len(APPLICATIONS) == 1
    assert APPLICATIONS[0].application_id == "application-001"


def test_duplicate_application_is_not_added():
    APPLICATIONS.clear()

    application = create_test_application()

    add_application(application)
    add_application(application)

    assert len(APPLICATIONS) == 1


def test_get_applications_returns_saved_applications():
    APPLICATIONS.clear()

    application = create_test_application()

    add_application(application)

    result = get_applications()

    assert len(result) == 1
    assert result[0].title == "Data Analyst Intern"


def test_update_application_status():
    APPLICATIONS.clear()

    application = create_test_application()

    add_application(application)

    result = update_application_status(
        application_id="application-001",
        status="Interview"
    )

    assert result is not None
    assert result.status == "Interview"


def test_update_application_status_is_case_insensitive():
    APPLICATIONS.clear()

    application = create_test_application()

    add_application(application)

    result = update_application_status(
        application_id="application-001",
        status="interview"
    )

    assert result is not None
    assert result.status == "Interview"


def test_invalid_application_status_returns_none():
    APPLICATIONS.clear()

    application = create_test_application()

    add_application(application)

    result = update_application_status(
        application_id="application-001",
        status="Pending"
    )

    assert result is None
    assert APPLICATIONS[0].status == "Applied"


def test_update_nonexistent_application_returns_none():
    APPLICATIONS.clear()

    result = update_application_status(
        application_id="unknown-application",
        status="Interview"
    )

    assert result is None


def test_remove_application():
    APPLICATIONS.clear()

    application = create_test_application()

    add_application(application)

    result = remove_application("application-001")

    assert result is True
    assert len(APPLICATIONS) == 0


def test_remove_nonexistent_application():
    APPLICATIONS.clear()

    result = remove_application("unknown-application")

    assert result is False