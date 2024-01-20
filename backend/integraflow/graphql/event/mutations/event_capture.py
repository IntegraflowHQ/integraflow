from datetime import datetime
from typing import Any, Dict, Iterator, List, Optional, Tuple, cast
import graphene

from dateutil import parser
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone

from integraflow.celeryconf import app as celery_app
from integraflow.core.exceptions import PermissionDenied
from integraflow.core.utils.uuidt import UUIDT
from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_EVENTS
from integraflow.graphql.core.fields import JSONString
from integraflow.graphql.core.mutations import BaseMutation
from integraflow.graphql.core.scalars import UUID
from integraflow.graphql.core.types.base import BaseInputObjectType
from integraflow.graphql.core.types.common import EventError, NonNullList
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.project.models import Project
from integraflow.event.error_codes import EventErrorCode


class EventCaptureInput(BaseInputObjectType):
    event = graphene.String(
        description="The name of the event.",
        required=True
    )
    uuid = UUID(
        description="The event payload ID.",
        required=False
    )
    user_id = graphene.ID(
        description="The user distinct ID.",
        required=False
    )
    properties = JSONString(
        description="The event properties.",
        required=False
    )
    attributes = JSONString(
        description="The user attributes.",
        required=False
    )
    timestamp = graphene.DateTime(
        required=True,
        description="The time the event happened",
    )

    class Meta:
        doc_category = DOC_CATEGORY_EVENTS


class EventCapture(BaseMutation):
    class Arguments:
        input = EventCaptureInput(
            required=False,
            description="Organization details for the new organization."
        )
        batch = NonNullList(
            EventCaptureInput,
            required=False,
            description="Onboarding survey."
        )
        sent_at = graphene.DateTime(
            required=False,
            description="The time the event(s) is/are sent.",
        )

    status = graphene.Boolean(
        description="Whether the operation was successful.",
        default_value=False
    )

    class Meta:
        description = "Captures event."
        error_type_class = EventError
        error_type_field = "event_errors"
        doc_category = DOC_CATEGORY_EVENTS

    @classmethod
    def _datetime_from_seconds_or_millis(cls, timestamp: str) -> datetime:
        if len(timestamp) > 11:
            timestamp_number = float(timestamp) / 1000
        else:
            timestamp_number = int(timestamp)

        return datetime.fromtimestamp(timestamp_number, timezone.utc)

    @classmethod
    def _get_sent_at(cls, data) -> Optional[str]:
        if isinstance(data, dict) and data.get("sent_at"):
            return parser.isoparse(str(data["sent_at"])).isoformat()
        else:
            return None

    @classmethod
    def parse_event(cls, event: Dict):
        if not event.get("event"):
            return

        if not event.get("properties"):
            event["properties"] = {}

        return event

    @classmethod
    def preprocess_events(
        cls,
        events: List[Dict[str, Any]]
    ) -> Iterator[Tuple[Dict[str, Any], UUIDT, str]]:
        for event in events:
            event_uuid = UUIDT()
            distinct_id = event.get("user_id", None)
            payload_uuid = str(event.get("uuid", ""))
            if payload_uuid:
                if UUIDT.is_valid_uuid(payload_uuid):
                    event_uuid = UUIDT(uuid_str=payload_uuid)
                else:
                    raise ValueError('Event field "uuid" is not a valid UUID!')

            event = cls.parse_event(event)
            if not event:
                continue

            yield event, event_uuid, distinct_id

    @classmethod
    def perform_mutation(
        cls, _root, info: ResolveInfo, /, **data
    ):
        if not cls.check_permissions(
            info.context,
            [
                AuthorizationFilters.AUTHENTICATED_API,
                AuthorizationFilters.ORGANIZATION_MEMBER_ACCESS
            ],
            require_all_permissions=False
        ):
            raise PermissionDenied(
                "API key not provided. You can find your project API key "
                "in Integraflow project settings."
            )

        project = cast(Project, info.context.project)

        now = timezone.now()
        sent_at = cls._get_sent_at(data)  # data.get("sent_at", None)

        if data.get("batch"):
            events = data["batch"]
        else:
            events = [data.get("input", {})]

        try:
            processed_events = list(cls.preprocess_events(events))
        except ValueError as e:
            raise ValidationError(
                f"Invalid payload: {e}",
                code=EventErrorCode.INVALID.value
            )

        for event, event_uuid, distinct_id in processed_events:
            task_name = "integraflow.event.task.process_event"
            celery_app.send_task(
                name=task_name,
                queue=settings.CELERY_DEFAULT_QUEUE,
                args=[
                    distinct_id,
                    event_uuid,
                    event,
                    project.id,
                    now.isoformat(),
                    sent_at,
                ],
            )
        return cls(status=True)
