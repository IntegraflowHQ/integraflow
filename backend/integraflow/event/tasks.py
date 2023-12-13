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


def _get_person(project_id: str, distinct_id: str):
    return Person.objects.get(
        project_id=project_id,
        persondistinctid__project_id=project_id,
        persondistinctid__distinct_id=distinct_id
    )


def _get_or_create_person(project_id: str, distinct_id: str):
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

    return person


def _alias(
    previous_distinct_id: str,
    distinct_id: str,
    project_id: str,
    retry_if_failed: bool = True
) -> None:
    old_person: Optional[Person] = None
    new_person: Optional[Person] = None

    try:
        old_person = _get_person(project_id, distinct_id=previous_distinct_id)
    except Person.DoesNotExist:
        pass

    try:
        new_person = _get_person(project_id, distinct_id)
    except Person.DoesNotExist:
        pass

    if old_person and not new_person:
        try:
            old_person.add_distinct_id(distinct_id)
        # Catch race case when somebody already added this distinct_id between
        # .get and .add_distinct_id
        except IntegrityError:
            # run everything again to merge the users if needed
            if retry_if_failed:
                _alias(previous_distinct_id, distinct_id, project_id, False)
        return

    if not old_person and new_person:
        try:
            new_person.add_distinct_id(previous_distinct_id)
        # Catch race case when somebody already added this distinct_id between
        # .get and .add_distinct_id
        except IntegrityError:
            # run everything again to merge the users if needed
            if retry_if_failed:
                _alias(previous_distinct_id, distinct_id, project_id, False)
        return

    if not old_person and not new_person:
        try:
            Person.objects.create(
                project_id=project_id,
                distinct_ids=[str(distinct_id), str(previous_distinct_id)],
            )
        # Catch race condition where in between getting and creating,
        # another request already created this user.
        except IntegrityError:
            if retry_if_failed:
                # try once more, probably one of the two persons exists now
                _alias(previous_distinct_id, distinct_id, project_id, False)
        return

    if old_person and new_person and old_person != new_person:
        new_person.merge_people([old_person])


def _set_is_identified(
    project_id: str,
    distinct_id: str,
    is_identified: bool = True
) -> Person:
    person = _get_or_create_person(project_id, distinct_id)
    if not person.is_identified:
        person.is_identified = is_identified
        person.save()

    return person


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


def handle_identify_or_alias(
    properties: dict,
    distinct_id: str,
    project_id: str
) -> Optional[Person]:
    if properties.get("$anon_distinct_id"):
        _alias(
            previous_distinct_id=properties["$anon_distinct_id"],
            distinct_id=distinct_id,
            project_id=project_id,
        )
        return _set_is_identified(
            project_id=project_id,
            distinct_id=distinct_id
        )


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
    uuid: str,
    distinct_id: str,
    properties: Dict,
    attributes: Dict,
    timestamp: Union[datetime, str],
    person: Optional[Person]
) -> None:
    project = Project.objects.get(pk=project_id)

    event = sanitize_event_name(event)

    if not person:
        person = _get_or_create_person(project_id, distinct_id)

    person_attributes = person.attributes or {}
    person_attributes.update(attributes)

    Event.objects.create(
        event=event,
        uuid=uuid,
        distinct_id=distinct_id,
        person_id=person.uuid,
        user_attributes=person_attributes,
        properties=properties or {},
        project=project,
        **({"timestamp": timestamp} if timestamp else {})
    )

    store_names_and_properties(
        project=project,
        event=event,
        properties=properties
    )

    if event == "$identify":
        person.attributes.update(properties)
    else:
        person.attributes = person_attributes

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
    attributes = data.get("attributes", {})

    person = None
    if data["event"] == "$identify":
        properties.update(attributes)
        person = handle_identify_or_alias(properties, distinct_id, project_id)

    _capture(
        project_id=project_id,
        uuid=event_uuid,
        event=data["event"],
        distinct_id=distinct_id,
        properties=properties,
        attributes=attributes,
        timestamp=handle_timestamp(data, now, sent_at),
        person=person
    )
