from datetime import datetime
from dateutil import parser
from django.db.models import Q
from typing import cast

import pytz

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


def resolve_survey_by_channel(info, id=None, link=None):
    project = cast(Project, info.context.project)

    lookup = None

    if id:
        _, channel_id = from_global_id_or_error(id)
        lookup = Q(id=channel_id)

    if link:
        lookup = Q(link=link)

    if not lookup:
        return None

    now = datetime.now(pytz.UTC)

    instance = (
        models.SurveyChannel.objects.using(
            get_database_connection_name(info.context)
        )
        .filter(
            lookup &
            Q(survey__project_id=project.pk) &
            Q(survey__status=models.Survey.Status.ACTIVE) &
            Q(
                Q(survey__start_date__isnull=True) |
                Q(survey__start_date__lte=now)
            ) &
            Q(
                Q(survey__end_date__isnull=True) |
                Q(survey__end_date__gte=now)
            )
        )
        .first()
    )

    if instance is None:
        return None

    start_date = None
    end_date = None

    try:
        start_date = parser.isoparse(
            str(instance.settings.get("startDate"))
        )
    except ValueError:
        start_date = None

    try:
        end_date = parser.isoparse(
            str(instance.settings.get("endDate"))
        )
    except ValueError:
        end_date = None

    if not start_date and not end_date:
        return instance.survey

    if (
        (start_date and (start_date <= now)) and
        (not end_date or not (end_date <= now))
    ):
        return instance.survey
