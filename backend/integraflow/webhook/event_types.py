from typing import Any


class WebhookEventAsyncType:
    ANY = "any_events"

    APP_INSTALLED = "app_installed"
    APP_UPDATED = "app_updated"
    APP_DELETED = "app_deleted"
    APP_STATUS_CHANGED = "app_status_changed"

    AUDIENCE_UPDATED = "audience_updated"
    EVENT_TRACKED = "event_tracked"

    SURVEY_CREATED = "survey_created"
    SURVEY_UPDATED = "survey_updated"
    SURVEY_DELETED = "survey_deleted"
    SURVEY_STATUS_CHANGED = "survey_status_changed"
    SURVEY_COMPLETED = "survey_completed"
    SURVEY_CLOSED = "survey_closed"

    QUESTION_ANSWERED = "question_answered"

    OBSERVABILITY = "observability"

    EVENT_MAP: dict[str, dict[str, Any]] = {
        APP_INSTALLED: {
            "name": "App created"
        },
        APP_UPDATED: {
            "name": "App updated"
        },
        APP_DELETED: {
            "name": "App deleted"
        },
        APP_STATUS_CHANGED: {
            "name": "App status changed"
        },
        AUDIENCE_UPDATED: {
            "name": "Audience updated"
        },
        EVENT_TRACKED: {
            "name": "Event tracked"
        },
        SURVEY_CREATED: {
            "name": "Survey created"
        },
        SURVEY_UPDATED: {
            "name": "Survey updated"
        },
        SURVEY_DELETED: {
            "name": "Survey deleted"
        },
        SURVEY_STATUS_CHANGED: {
            "name": "Survey status changed"
        },
        SURVEY_COMPLETED: {
            "name": "Survey completed"
        },
        SURVEY_CLOSED: {
            "name": "Survey closed"
        },
        QUESTION_ANSWERED: {
            "name": "Question answered"
        },
        OBSERVABILITY: {
            "name": "Observability"
        },
    }

    CHOICES = [
        (ANY, "Any events"),
    ] + [
        (
            event_name, event_data["name"]
        ) for event_name, event_data in EVENT_MAP.items()
    ]

    ALL = [event[0] for event in CHOICES]


class WebhookEventSyncType:
    ANY = "any_events"

    EVENT_MAP: dict[str, dict[str, Any]] = {}

    CHOICES = [
        (
            event_name, event_data["name"]
        ) for event_name, event_data in EVENT_MAP.items()
    ]

    ALL = [event[0] for event in CHOICES]
