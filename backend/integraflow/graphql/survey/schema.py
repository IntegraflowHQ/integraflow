import graphene

from integraflow.graphql.core.connection import (
    create_connection_slice,
    filter_connection_queryset,
)
from integraflow.graphql.core.doc_category import DOC_CATEGORY_SURVEYS
from integraflow.graphql.core.fields import FilterConnectionField, PermissionsField
from integraflow.permission.auth_filters import AuthorizationFilters

from .filters import SurveyFilterInput
from .mutations import (
    SurveyChannelCreate,
    SurveyChannelDelete,
    SurveyChannelUpdate,
    SurveyCreate,
    SurveyDelete,
    SurveyQuestionCreate,
    SurveyQuestionDelete,
    SurveyQuestionUpdate,
    SurveyResponseCreate,
    SurveyResponseUpdate,
    SurveyUpdate,
)
from .resolvers import (
    resolve_active_surveys,
    resolve_channels,
    resolve_questions,
    resolve_survey,
    resolve_survey_by_channel,
    resolve_surveys,
)
from .sorters import SurveySortingInput
from .types import (
    BaseSurvey,
    BaseSurveyCountableConnection,
    Survey,
    SurveyChannelCountableConnection,
    SurveyCountableConnection,
    SurveyQuestionCountableConnection,
)


class SurveyQueries(graphene.ObjectType):
    channels = FilterConnectionField(
        SurveyChannelCountableConnection,
        id=graphene.Argument(
            graphene.ID,
            description="The ID of the survey.",
            required=True
        ),
        description="List of channels for a specific survey.",
        permissions=[AuthorizationFilters.PROJECT_MEMBER_ACCESS],
        doc_category=DOC_CATEGORY_SURVEYS,
    )
    questions = FilterConnectionField(
        SurveyQuestionCountableConnection,
        id=graphene.Argument(
            graphene.ID,
            description="The ID of the survey.",
            required=True
        ),
        description="List of questions for a specific survey.",
        permissions=[AuthorizationFilters.PROJECT_MEMBER_ACCESS],
        doc_category=DOC_CATEGORY_SURVEYS,
    )
    surveys = FilterConnectionField(
        SurveyCountableConnection,
        filter=SurveyFilterInput(description="Filtering options for surveys."),
        sort_by=SurveySortingInput(description="Sort surveys."),
        description="List of the project's surveys.",
        permissions=[AuthorizationFilters.PROJECT_MEMBER_ACCESS],
        doc_category=DOC_CATEGORY_SURVEYS,
    )
    active_surveys = FilterConnectionField(
        BaseSurveyCountableConnection,
        filter=SurveyFilterInput(description="Filtering options for surveys."),
        sort_by=SurveySortingInput(description="Sort surveys."),
        description="List of the project's surveys.",
        permissions=[AuthorizationFilters.AUTHENTICATED_API],
        doc_category=DOC_CATEGORY_SURVEYS,
    )
    survey = PermissionsField(
        Survey,
        id=graphene.Argument(
            graphene.ID,
            description="The ID of the survey.",
            required=False
        ),
        slug=graphene.Argument(
            graphene.String,
            description="Slug of the survey.",
            required=False
        ),
        description="Look up a survey by ID or slug.",
        permissions=[
            AuthorizationFilters.PROJECT_MEMBER_ACCESS,
            AuthorizationFilters.AUTHENTICATED_API
        ],
        doc_category=DOC_CATEGORY_SURVEYS,
    )
    survey_by_channel = PermissionsField(
        BaseSurvey,
        id=graphene.Argument(
            graphene.ID,
            description="The ID of the channel.",
            required=False
        ),
        link=graphene.Argument(
            graphene.String,
            description="Unique link of the channel.",
            required=False
        ),
        description="Look up a survey by channel ID or link.",
        permissions=[AuthorizationFilters.AUTHENTICATED_API],
        doc_category=DOC_CATEGORY_SURVEYS,
    )

    @staticmethod
    def resolve_channels(_root, info, **kwargs):
        qs = resolve_channels(info, id=kwargs["id"])
        return create_connection_slice(
            qs,
            info,
            kwargs,
            SurveyChannelCountableConnection
        )

    @staticmethod
    def resolve_questions(_root, info, **kwargs):
        qs = resolve_questions(info, id=kwargs["id"])
        return create_connection_slice(
            qs,
            info,
            kwargs,
            SurveyCountableConnection
        )

    @staticmethod
    def resolve_surveys(_root, info, **kwargs):
        qs = resolve_surveys(info)
        qs = filter_connection_queryset(qs, kwargs)
        return create_connection_slice(
            qs,
            info,
            kwargs,
            SurveyQuestionCountableConnection
        )

    @staticmethod
    def resolve_active_surveys(_root, info, **kwargs):
        qs = resolve_active_surveys(info)
        qs = filter_connection_queryset(qs, kwargs)
        return create_connection_slice(
            qs,
            info,
            kwargs,
            SurveyQuestionCountableConnection
        )

    @staticmethod
    def resolve_survey(_root, info, *, id=None, slug=None):
        return resolve_survey(info, id, slug)

    @staticmethod
    def resolve_survey_by_channel(_root, info, *, id=None, link=None):
        return resolve_survey_by_channel(info, id, link)


class SurveyMutations(graphene.ObjectType):
    survey_channel_create = SurveyChannelCreate.Field()
    survey_channel_delete = SurveyChannelDelete.Field()
    survey_channel_update = SurveyChannelUpdate.Field()
    survey_create = SurveyCreate.Field()
    survey_delete = SurveyDelete.Field()
    survey_question_create = SurveyQuestionCreate.Field()
    survey_question_delete = SurveyQuestionDelete.Field()
    survey_question_update = SurveyQuestionUpdate.Field()
    survey_response_create = SurveyResponseCreate.Field()
    survey_response_update = SurveyResponseUpdate.Field()
    survey_update = SurveyUpdate.Field()
