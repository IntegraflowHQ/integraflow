import graphene

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.connection import (
    CountableConnection,
    create_connection_slice
)
from integraflow.graphql.core.doc_category import DOC_CATEGORY_SURVEYS
from integraflow.graphql.core.fields import (
    FilterConnectionField,
    JSONString,
    PermissionsField
)
from integraflow.graphql.core.types.model import ModelObjectType
from integraflow.graphql.core.utils import to_global_ids_from_pks
from integraflow.graphql.survey.enums import (
    SurveyChannelTypeEnum,
    SurveyQuestionTypeEnum,
    SurveyStatusEnum,
    SurveyTypeEnum
)
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.survey import models


class Survey(ModelObjectType):
    id = graphene.GlobalID(
        required=True,
        description="The ID of the survey."
    )
    reference = graphene.ID(
        required=False,
        description="For internal purpose."
    )
    name = graphene.String(
        required=False,
        description="Name of the survey.",
    )
    slug = graphene.String(
        required=True,
        description="Slug of the survey.",
    )
    type = graphene.Field(
        SurveyTypeEnum,
        required=True,
        description="The type of the survey",
    )
    status = graphene.Field(
        SurveyStatusEnum,
        required=True,
        description="The status of the survey",
    )
    settings = JSONString(
        description="The settings of the survey."
    )
    project = PermissionsField(
        "integraflow.graphql.project.types.Project",
        description="The project the survey belongs to",
        permissions=[
            AuthorizationFilters.PROJECT_MEMBER_ACCESS,
        ],
    )
    theme = PermissionsField(
        "integraflow.graphql.project.types.ProjectTheme",
        description="The theme of the survey.",
        permissions=[
            AuthorizationFilters.PROJECT_MEMBER_ACCESS,
        ],
    )
    creator = PermissionsField(
        "integraflow.graphql.user.types.User",
        required=True,
        description="The user who created the theme.",
        permissions=[
            AuthorizationFilters.PROJECT_MEMBER_ACCESS,
        ],
    )
    questions = FilterConnectionField(
        "integraflow.graphql.survey.types.SurveyQuestionCountableConnection",
        required=True,
        description="The questions in the the survey",
        permissions=[AuthorizationFilters.PROJECT_MEMBER_ACCESS],
        doc_category=DOC_CATEGORY_SURVEYS,
    )
    channels = FilterConnectionField(
        "integraflow.graphql.survey.types.SurveyChannelCountableConnection",
        required=True,
        description="The distribution channels supported by the survey",
        permissions=[AuthorizationFilters.PROJECT_MEMBER_ACCESS],
        doc_category=DOC_CATEGORY_SURVEYS,
    )
    created_at = graphene.DateTime(
        required=True,
        description="The time at which the survey was created."
    )
    updated_at = graphene.DateTime(
        required=True,
        description="The last time at which the survey was updated."
    )

    class Meta:
        description = "Represents a survey."
        doc_category = DOC_CATEGORY_SURVEYS
        model = models.Survey
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_reference(root: models.Survey, info: ResolveInfo):
        return root.id

    @staticmethod
    def resolve_project(root: models.Survey, info: ResolveInfo):
        return root.project

    @staticmethod
    def resolve_theme(root: models.Survey, info: ResolveInfo):
        return root.theme

    @staticmethod
    def resolve_creator(root: models.Survey, info: ResolveInfo):
        return root.created_by

    @staticmethod
    def resolve_questions(root: models.Survey, info: ResolveInfo, **kwargs):
        return create_connection_slice(
            root.survey_questions,  # type: ignore
            info,
            kwargs,
            SurveyQuestionCountableConnection
        )

    @staticmethod
    def resolve_channels(root: models.Survey, info: ResolveInfo, **kwargs):
        return create_connection_slice(
            root.survey_channels,  # type: ignore
            info,
            kwargs,
            SurveyChannelCountableConnection
        )


class SurveyQuestion(ModelObjectType):
    id = graphene.GlobalID(
        required=True,
        description="The ID of the question."
    )
    reference = graphene.ID(
        required=False,
        description="For internal purpose."
    )
    label = graphene.String(
        required=True,
        description="Label of the question.",
    )
    description = graphene.String(
        required=True,
        description="Description of the question.",
    )
    type = graphene.Field(
        SurveyQuestionTypeEnum,
        required=True,
        description="The type of the question",
    )
    options = JSONString(
        description="The options of the question."
    )
    settings = JSONString(
        description="The settings of the question."
    )
    order_number = graphene.Int(
        required=True,
        description="The position of the question."
    )
    max_path = graphene.Int(
        required=True,
        description="The position of the question."
    )
    survey = PermissionsField(
        Survey,
        description="The project the survey belongs to",
        permissions=[
            AuthorizationFilters.PROJECT_MEMBER_ACCESS,
        ],
    )
    created_at = graphene.DateTime(
        required=True,
        description="The time at which the question was created."
    )

    class Meta:
        description = "Represents a question."
        doc_category = DOC_CATEGORY_SURVEYS
        model = models.SurveyQuestion
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_settings(root: models.SurveyQuestion, info: ResolveInfo):
        settings = root.settings
        if settings:
            to_global_ids_from_pks(
                "SurveyQuestion",
                settings.get("logic", []),
                "destination"
            )

        return settings

    @staticmethod
    def resolve_reference(root: models.SurveyQuestion, info: ResolveInfo):
        return root.pk

    @staticmethod
    def resolve_survey(root: models.SurveyQuestion, info: ResolveInfo):
        return root.survey


class SurveyChannel(ModelObjectType):
    id = graphene.GlobalID(
        required=True,
        description="The ID of the channel."
    )
    reference = graphene.ID(
        required=False,
        description="For internal purpose."
    )
    type = graphene.Field(
        SurveyChannelTypeEnum,
        required=True,
        description="The type of the survey channel",
    )
    triggers = JSONString(
        description="The options of the question."
    )
    conditions = JSONString(
        description="The settings of the question."
    )
    settings = JSONString(
        description="The settings of the question."
    )
    created_at = graphene.DateTime(
        required=True,
        description="The time at which the channel was created."
    )
    survey = PermissionsField(
        Survey,
        description="The project the survey belongs to",
        permissions=[
            AuthorizationFilters.PROJECT_MEMBER_ACCESS,
        ],
    )

    class Meta:
        description = "Represents a survey channel."
        doc_category = DOC_CATEGORY_SURVEYS
        model = models.SurveyChannel
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_reference(root: models.SurveyChannel, info: ResolveInfo):
        return root.pk

    @staticmethod
    def resolve_survey(root: models.SurveyChannel, info: ResolveInfo):
        return root.survey


class SurveyCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS
        node = Survey


class SurveyQuestionCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS
        node = SurveyQuestion


class SurveyChannelCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS
        node = SurveyChannel
