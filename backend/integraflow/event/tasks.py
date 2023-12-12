from datetime import datetime
import json
from numbers import Number
from typing import Any, Dict, Optional, Union

from celery import shared_task
from dateutil import parser
from dateutil.relativedelta import relativedelta
from django.db import IntegrityError
from django.utils import timezone
from sentry_sdk import capture_exception

from integraflow.event.models import (
    Event,
    EventDefinition,
    EventProperty,
    Person,
    PropertyDefinition,
    PropertyType
)
from integraflow.project.models import Project


def _identify_user(
    project_id: str,
    distinct_id: str,
    is_identified: bool = True
) -> None:
    try:
        person = Person.objects.get(
            project_id=project_id,
            persondistinctid__project_id=project_id,
            persondistinctid__distinct_id=str(distinct_id)
        )
    except Person.DoesNotExist:
        try:
            person = Person.objects.create(
                project_id=project_id,
                distinct_ids=[str(distinct_id)]
            )
            # Catch race condition where in between getting and creating,
            # another request already created this person
        except IntegrityError:
            person = Person.objects.get(
                project_id=project_id,
                persondistinctid__project_id=project_id,
                persondistinctid__distinct_id=str(distinct_id)
            )
    if not person.is_identified:
        person.is_identified = is_identified
        person.save()


def handle_timestamp(data: dict, now: str, sent_at: Optional[str]) -> datetime:
    if data.get("timestamp"):
        if sent_at:
            # sent_at - timestamp == now - x
            # x = now + (timestamp - sent_at)
            try:
                # timestamp and sent_at must both be in the same format:
                # either both with or both without timezones
                # otherwise we can't get a diff to add to now
                return (
                    parser.isoparse(now) + (
                        parser.isoparse(data["timestamp"]) -
                        parser.isoparse(sent_at)
                    )
                )
            except TypeError as e:
                capture_exception(e)
        return parser.isoparse(str(data["timestamp"]))
    now_datetime = parser.parse(now)
    if data.get("offset"):
        return now_datetime - relativedelta(microseconds=data["offset"] * 1000)
    return now_datetime


def sanitize_event_name(event: Any) -> str:
    if isinstance(event, str):
        return event[0:200]
    else:
        try:
            return json.dumps(event)[0:200]
        except TypeError:
            return str(event)[0:200]


def _from_value_get_property_type(value):
    if isinstance(value, bool):
        return PropertyType.Boolean

    if isinstance(value, Number):
        return PropertyType.Numeric

    if isinstance(value, datetime):
        return PropertyType.Datetime

    return PropertyType.String


def store_names_and_properties(
    project: Project,
    event: str,
    properties: Dict
) -> None:
    # In _capture we only prefetch a couple of fields in Team to avoid
    # fetching too much data
    save = False

    event_property_names = []
    definition_type = PropertyDefinition.Type.PERSON

    if event != "$identify":
        definition, is_created = EventDefinition.objects.get_or_create(
            name=event,
            project=project
        )

        if not is_created:
            definition.last_seen_at = timezone.now()

        event_properties = EventProperty.objects.only("property").filter(
            project_id=project.id,
            event=event
        )
        event_property_names = (
            ep.property for ep in event_properties
        )
        definition_type = PropertyDefinition.Type.EVENT

    property_definitions = PropertyDefinition.objects.only("name").filter(
        project_id=project.id,
        type=definition_type
    )
    property_names = (
        pd.name for pd in property_definitions
    )

    event_properties_to_create = []
    properties_to_create = []

    for key, value in properties.items():
        if event != "$identify" and key not in event_property_names:
            event_properties_to_create.append(
                EventProperty(
                    project_id=project.id,
                    event=event,
                    property=key
                )
            )

        if key not in property_names:
            property_type = _from_value_get_property_type(value)
            properties_to_create.append(
                PropertyDefinition(
                    project_id=project.id,
                    name=key,
                    type=definition_type,
                    property_type=property_type,
                    is_numerical=property_type == PropertyType.Numeric
                )
            )

    if len(event_properties_to_create) > 0:
        EventProperty.objects.bulk_create(event_properties_to_create)

    if len(properties_to_create) > 0:
        PropertyDefinition.objects.bulk_create(properties_to_create)

    if not project.ingested_event:
        # First event for the team captured
        project.ingested_event = True
        save = True

    if event == "$identify" and not project.identified_user:
        project.identified_user = True
        save = True

    if save:
        project.save()


def _capture(
    project_id: str,
    event: str,
    distinct_id: str,
    properties: Dict,
    timestamp: Union[datetime, str],
) -> None:
    project = Project.objects.get(pk=project_id)

    event = sanitize_event_name(event)

    Event.objects.create(
        event=event,
        distinct_id=distinct_id,
        properties=properties,
        project=project,
        **({"timestamp": timestamp} if timestamp else {})
    )

    store_names_and_properties(
        project=project,
        event=event,
        properties=properties
    )

    if not Person.objects.distinct_ids_exist(  # type: ignore
        project_id=project_id,
        distinct_ids=[str(distinct_id)]
    ):
        # Catch race condition where in between getting and creating,
        # another request already created this user
        try:
            Person.objects.create(
                project_id=project_id,
                distinct_ids=[str(distinct_id)]
            )
        except IntegrityError:
            pass

    if event == "$identify":
        update_person_properties(
            project_id=project_id,
            distinct_id=distinct_id,
            attributes=properties
        )


def update_person_properties(
    project_id: str,
    distinct_id: str,
    attributes: Dict
) -> None:
    if not isinstance(attributes, dict):
        return

    try:
        person = Person.objects.get(
            project_id=project_id,
            persondistinctid__project_id=project_id,
            persondistinctid__distinct_id=str(distinct_id)
        )
    except Person.DoesNotExist:
        try:
            person = Person.objects.create(
                project_id=project_id,
                distinct_ids=[str(distinct_id)]
            )
        # Catch race condition where in between getting and creating,
        # another request already created this person
        except Exception:
            person = Person.objects.get(
                project_id=project_id,
                persondistinctid__project_id=project_id,
                persondistinctid__distinct_id=str(distinct_id)
            )

    person.attributes.update(attributes)
    person.save()


@shared_task(name="integraflow.event.task.process_event", ignore_result=True)
def process_event(
    distinct_id: str,
    event_uuid: str,
    data: dict,
    project_id: str,
    now: str,
    sent_at: Optional[str],
) -> None:
    properties = data.get("properties", {})

    if data["event"] == "$identify":
        _identify_user(project_id=project_id, distinct_id=distinct_id)

    _capture(
        project_id=project_id,
        event=data["event"],
        distinct_id=distinct_id,
        properties=properties,
        timestamp=handle_timestamp(data, now, sent_at),
    )
