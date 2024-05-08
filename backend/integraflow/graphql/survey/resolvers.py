from datetime import datetime
from dateutil import parser
from django.db.models import Q
from typing import Union, cast

import pytz

from integraflow.graphql.core.context import get_database_connection_name
from integraflow.graphql.core.types.common import DateRangeInput
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


def resolve_survey_by_channel(info, id=None, link=None):
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


def resolve_survey_responses(info, id: str):
    project = cast(Project, info.context.project)

    _, survey_id = from_global_id_or_error(id)

    return models.SurveyResponse.objects.using(
        get_database_connection_name(info.context)
    ).filter(
        survey_id=survey_id,
        survey__project_id=project.id
    )


def resolve_response_count(
    info,
    survey_id: str,
    date: Union[DateRangeInput, None] = None,
    prev_date: Union[DateRangeInput, None] = None
):
    project = cast(Project, info.context.project)

    _, survey_id = from_global_id_or_error(survey_id)

    surveyResponseManager = models.SurveyResponse.objects.using(
        get_database_connection_name(info.context)
    )

    query = Q(survey_id=survey_id, survey__project_id=project.id)

    current = {
        "value": 0
    }
    previous = {
        "value": 0
    }

    if date:
        current["value"] = (
            surveyResponseManager.count_responses(  # type: ignore
                query & Q(created_at__range=(date.gte, date.lte))
            )
        )

    if prev_date:
        previous["value"] = (
            surveyResponseManager.count_responses(  # type: ignore
                query & Q(created_at__range=(prev_date.gte, prev_date.lte))
            )
        )

    return current, previous


def resolve_completion_rate(
    info,
    survey_id: str,
    date: Union[DateRangeInput, None] = None,
    prev_date: Union[DateRangeInput, None] = None
):
    project = cast(Project, info.context.project)

    _, survey_id = from_global_id_or_error(survey_id)

    surveyResponseManager = models.SurveyResponse.objects.using(
        get_database_connection_name(info.context)
    )

    query = Q(survey_id=survey_id, survey__project_id=project.id)

    current = {
        "value": 0
    }
    previous = {
        "value": 0
    }

    if date:
        current["value"] = (
            surveyResponseManager.completion_rate(  # type: ignore
                query & Q(created_at__range=(date.gte, date.lte))
            )
        )

    if prev_date:
        previous["value"] = (
            surveyResponseManager.completion_rate(  # type: ignore
                query & Q(created_at__range=(prev_date.gte, prev_date.lte))
            )
        )

    return current, previous


def resolve_avg_completion_time(
    info,
    survey_id: str,
    date: Union[DateRangeInput, None] = None,
    prev_date: Union[DateRangeInput, None] = None
):
    project = cast(Project, info.context.project)

    _, survey_id = from_global_id_or_error(survey_id)

    surveyResponseManager = models.SurveyResponse.objects.using(
        get_database_connection_name(info.context)
    )

    query = Q(
        survey_id=survey_id,
        survey__project_id=project.id,
        completed_at__isnull=False
    )

    current = {
        "value": 0
    }
    previous = {
        "value": 0
    }

    if date:
        current["value"] = surveyResponseManager.average(  # type: ignore
            field="time_spent",
            query=(query & Q(created_at__range=(date.gte, date.lte)))
        )

    if prev_date:
        previous["value"] = surveyResponseManager.average(  # type: ignore
            field="time_spent",
            query=(
                query & Q(created_at__range=(prev_date.gte, prev_date.lte))
            )
        )

    return current, previous


def resolve_nps_scores(
    info,
    survey_id: str,
    date: Union[DateRangeInput, None] = None,
    prev_date: Union[DateRangeInput, None] = None
):
    project = cast(Project, info.context.project)

    _, survey_id = from_global_id_or_error(survey_id)

    surveyResponseManager = models.SurveyResponse.objects.using(
        get_database_connection_name(info.context)
    )

    query = Q(
        survey_id=survey_id,
        survey__project_id=project.id,
        completed_at__isnull=False
    )

    current = {}
    previous = {}

    if date:
        current = surveyResponseManager.calculate_nps_scores(  # type: ignore
            query & Q(created_at__range=(date.gte, date.lte))
        )

    if prev_date:
        previous = surveyResponseManager.calculate_nps_scores(  # type: ignore
            query & Q(created_at__range=(prev_date.gte, prev_date.lte))
        )

    return current, previous


def resolve_ces_scores(
    info,
    survey_id: str,
    date: Union[DateRangeInput, None] = None,
    prev_date: Union[DateRangeInput, None] = None
):
    project = cast(Project, info.context.project)

    _, survey_id = from_global_id_or_error(survey_id)

    surveyResponseManager = models.SurveyResponse.objects.using(
        get_database_connection_name(info.context)
    )

    query = Q(
        survey_id=survey_id,
        survey__project_id=project.id,
        completed_at__isnull=False
    )

    current = {}
    previous = {}

    if date:
        current = surveyResponseManager.calculate_ces_scores(  # type: ignore
            query & Q(created_at__range=(date.gte, date.lte))
        )

    if prev_date:
        previous = surveyResponseManager.calculate_ces_scores(  # type: ignore
            query & Q(created_at__range=(prev_date.gte, prev_date.lte))
        )

    return current, previous


def resolve_csat_scores(
    info,
    survey_id: str,
    date: Union[DateRangeInput, None] = None,
    prev_date: Union[DateRangeInput, None] = None
):
    project = cast(Project, info.context.project)

    _, survey_id = from_global_id_or_error(survey_id)

    surveyResponseManager = models.SurveyResponse.objects.using(
        get_database_connection_name(info.context)
    )

    query = Q(
        survey_id=survey_id,
        survey__project_id=project.id,
        completed_at__isnull=False
    )

    current = {}
    previous = {}

    if date:
        current = surveyResponseManager.calculate_csat_scores(  # type: ignore
            query & Q(created_at__range=(date.gte, date.lte))
        )

    if prev_date:
        previous = surveyResponseManager.calculate_csat_scores(  # type: ignore
            query & Q(created_at__range=(prev_date.gte, prev_date.lte))
        )

    return current, previous
