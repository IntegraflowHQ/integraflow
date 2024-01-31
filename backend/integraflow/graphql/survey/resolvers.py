from django.db.models import Q
from typing import cast

from integraflow.graphql.core.context import get_database_connection_name
from integraflow.graphql.core.utils import from_global_id_or_error
from integraflow.project.models import Project
from integraflow.survey import models


def resolve_channels(info, id: str):
    project = cast(Project, info.context.project)

    _, survey_id = from_global_id_or_error(id)

    return models.SurveyChannel.objects.using(
        get_database_connection_name(info.context)
    ).filter(
        survey_id=survey_id,
        survey__project_id=project.id
    )


def resolve_questions(info, id: str):
    project = cast(Project, info.context.project)

    _, survey_id = from_global_id_or_error(id)

    return models.SurveyQuestion.objects.using(
        get_database_connection_name(info.context)
    ).filter(
        survey_id=survey_id,
        survey__project_id=project.id
    )


def resolve_surveys(info):
    project = cast(Project, info.context.project)

    return models.Survey.objects.using(
        get_database_connection_name(info.context)
    ).filter(project_id=project.pk)


def resolve_active_surveys(info):
    project = cast(Project, info.context.project)

    return models.Survey.objects.using(
        get_database_connection_name(info.context)
    ).filter(project_id=project.pk, status=models.Survey.Status.ACTIVE)


def resolve_survey(info, id=None, slug=None):
    project = cast(Project, info.context.project)

    lookup = None

    if id:
        _, survey_id = from_global_id_or_error(id)
        lookup = Q(id=survey_id)

    if slug:
        lookup = Q(slug=slug)

    if not lookup:
        return None

    return (
        models.Survey.objects.using(
            get_database_connection_name(info.context)
        )
        .filter(lookup & Q(project_id=project.pk))
        .first()
    )
