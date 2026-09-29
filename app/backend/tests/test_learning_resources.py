from app.services.resource_service import (
    normalize_skill,
    get_learning_resources,
)


def test_normalize_skill():
    result = normalize_skill("  Machine   Learning  ")

    assert result == "machine learning"


def test_get_learning_resources_for_known_skill():
    resources = get_learning_resources(["Pandas"])

    assert len(resources) == 1
    assert resources[0].skill == "Pandas"
    assert resources[0].title == "Pandas Documentation"
    assert resources[0].resource_type == "Documentation"


def test_get_learning_resources_for_multiple_skills():
    resources = get_learning_resources(
        [
            "Pandas",
            "Machine Learning",
            "Power BI",
        ]
    )

    assert len(resources) == 3

    assert resources[0].skill == "Pandas"
    assert resources[1].skill == "Machine Learning"
    assert resources[2].skill == "Power BI"


def test_unknown_skill_returns_empty_list():
    resources = get_learning_resources(
        ["Blockchain"]
    )

    assert resources == []


def test_empty_skill_is_ignored():
    resources = get_learning_resources(
        ["  ", "Pandas"]
    )

    assert len(resources) == 1
    assert resources[0].skill == "Pandas"