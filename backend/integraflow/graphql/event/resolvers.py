from typing import cast

from django.db.models import Q

from integraflow.event import models
from integraflow.graphql.core.context import get_database_connection_name
from integraflow.graphql.event.types import EventPropertyWithDefinition
from integraflow.project.models import Project


def resolve_events(info):
    project = cast(Project, info.context.project)

    return models.Event.objects.using(
        get_database_connection_name(info.context)
    ).filter(project_id=project.pk)


def resolve_event_definitions(info):
    project = cast(Project, info.context.project)

    return models.EventDefinition.objects.using(
        get_database_connection_name(info.context)
    ).filter(project_id=project.pk)


def resolve_event_properties(info, event=None):
    project = cast(Project, info.context.project)

    lookup = Q(project_id=project.pk)

    if event:
        lookup = lookup & Q(event=event)

    return models.EventProperty.objects.using(
        get_database_connection_name(info.context)
    ).filter(lookup)


def resolve_properties_with_definition(info, event: str):
    project = cast(Project, info.context.project)

    event_property_field = """(
        SELECT count(1) > 0 FROM event_properties
        WHERE event_properties.project_id=property_definitions.project_id
        AND event_properties.event = %(event)s
        AND event_properties.property = property_definitions.name
    )"""
    params = {
        "event": event,
        "project_id": project.id,
        "type": models.PropertyDefinition.Type.EVENT,
    }

    results = models.PropertyDefinition.objects.using(
        get_database_connection_name(info.context)
    ).raw(
        f"""
        SELECT property_definitions.*,
        {event_property_field} AS is_event_property
        FROM property_definitions
        WHERE property_definitions.project_id = %(project_id)s
        AND property_definitions.type = %(type)s
        ORDER BY is_event_property DESC, name ASC
        """,
        params=params
    )

    properties = []

    for result in results:
        if result.is_event_property:
            properties.append(
                EventPropertyWithDefinition(
                    event=event,
                    property=result.name,
                    is_numerical=result.is_numerical,
                    property_type=result.property_type,
                )
            )

    return properties


def resolve_persons(info):
    project = cast(Project, info.context.project)

    return models.Person.objects.using(
        get_database_connection_name(info.context)
    ).filter(project_id=project.pk)


def resolve_property_definitions(info, type=None):
    project = cast(Project, info.context.project)

    lookup = Q(project_id=project.pk)

    if type:
        lookup = lookup & Q(type=type)

    return models.PropertyDefinition.objects.using(
        get_database_connection_name(info.context)
    ).filter(lookup)
