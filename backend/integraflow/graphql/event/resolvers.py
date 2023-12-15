from typing import cast

from django.db.models import Q

from integraflow.event import models
from integraflow.graphql.core.context import get_database_connection_name
from integraflow.project.models import Project


def resolve_events(info):
    project = cast(Project, info.context.user.project)

    return models.Event.objects.using(
        get_database_connection_name(info.context)
    ).filter(project_id=project.pk)


def resolve_event_definitions(info):
    project = cast(Project, info.context.user.project)

    return models.EventDefinition.objects.using(
        get_database_connection_name(info.context)
    ).filter(project_id=project.pk)


def resolve_event_properties(info, event=None):
    project = cast(Project, info.context.user.project)

    lookup = Q(project_id=project.pk)

    if event:
        lookup = lookup & Q(event=event)

    return models.EventProperty.objects.using(
        get_database_connection_name(info.context)
    ).filter(lookup)


def resolve_persons(info):
    project = cast(Project, info.context.user.project)

    return models.Person.objects.using(
        get_database_connection_name(info.context)
    ).filter(project_id=project.pk)


def resolve_property_definitions(info, type=None):
    project = cast(Project, info.context.user.project)

    lookup = Q(project_id=project.pk)

    if type:
        lookup = lookup & Q(type=type)

    return models.PropertyDefinition.objects.using(
        get_database_connection_name(info.context)
    ).filter(lookup)
