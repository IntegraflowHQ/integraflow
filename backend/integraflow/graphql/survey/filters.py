import django_filters

from integraflow.graphql.core.doc_category import DOC_CATEGORY_SURVEYS
from integraflow.graphql.core.filters import (
    EnumFilter,
    GlobalIDMultipleChoiceFilter,
    ObjectTypeFilter
)
from integraflow.graphql.core.types.common import (
    DateRangeInput,
    DateTimeRangeInput
)
from integraflow.graphql.core.types.filter_input import FilterInputObjectType
from integraflow.graphql.utils.filters import filter_range_field
from integraflow.survey.models import Survey, SurveyResponse

from .enums import SurveyStatusEnum, SurveyTypeEnum, SurveyResponseStatusEnum


def filter_survey_search(qs, _, value):
    if value:
        qs = qs.filter(name__ilike=value)
    return qs


def filter_type(qs, _, value):
    if value in [
        Survey.Type.SURVEY,
        Survey.Type.POLL,
        Survey.Type.QUIZ,
        Survey.Type.CUSTOM
    ]:
        qs = qs.filter(type=value)
    return qs


def filter_status(qs, _, value):
    if value in [
        Survey.Status.DRAFT,
        Survey.Status.IN_PROGRESS,
        Survey.Status.ACTIVE,
        Survey.Status.PAUSED,
        Survey.Status.ARCHIVED,
        Survey.Status.COMPLETED,
    ]:
        qs = qs.filter(type=value)
    return qs


def filter_start_date(qs, _, value):
    return filter_range_field(qs, "start_date", value)


def filter_end_date(qs, _, value):
    return filter_range_field(qs, "end_date", value)


def filter_created_at(qs, _, value):
    return filter_range_field(qs, "created_at", value)


def filter_updated_at(qs, _, value):
    return filter_range_field(qs, "updated_at", value)


def filter_response_status(qs, _, value):
    if value in [
        SurveyResponse.Status.IN_PROGRESS,
        SurveyResponse.Status.COMPLETED,
        SurveyResponse.Status.ARCHIVED,
    ]:
        qs = qs.filter(type=value)
    return qs


class SurveyFilter(django_filters.FilterSet):
    ids = GlobalIDMultipleChoiceFilter(
        field_name="id",
        help_text="Filter by ids."
    )
    search = django_filters.CharFilter(method=filter_survey_search)
    type = EnumFilter(
        input_class=SurveyTypeEnum,
        method=filter_type,
        help_text="Filter by type"
    )
    status = EnumFilter(
        input_class=SurveyStatusEnum,
        method=filter_status
    )
    start_date = ObjectTypeFilter(
        input_class=DateRangeInput, method=filter_start_date
    )
    end_date = ObjectTypeFilter(
        input_class=DateTimeRangeInput, method=filter_updated_at
    )
    created_at = ObjectTypeFilter(
        input_class=DateRangeInput, method=filter_created_at
    )
    updated_at = ObjectTypeFilter(
        input_class=DateTimeRangeInput, method=filter_updated_at
    )

    class Meta:
        model = Survey
        fields = [
            "search",
            "type",
            "status",
            "start_date",
            "end_date",
            "created_at",
            "updated_at",
        ]


class SurveyResponseFilter(django_filters.FilterSet):
    ids = GlobalIDMultipleChoiceFilter(
        field_name="id",
        help_text="Filter by ids."
    )
    status = EnumFilter(
        input_class=SurveyResponseStatusEnum,
        method=filter_status
    )
    created_at = ObjectTypeFilter(
        input_class=DateRangeInput, method=filter_created_at
    )

    class Meta:
        model = Survey
        fields = [
            "status",
            "created_at",
        ]


class SurveyFilterInput(FilterInputObjectType):
    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS
        filterset_class = SurveyFilter


class SurveyResponseFilterInput(FilterInputObjectType):
    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS
        filterset_class = SurveyResponseFilter
