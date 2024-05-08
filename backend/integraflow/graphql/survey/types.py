import graphene

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.connection import (
    CountableConnection,
    create_connection_slice,
)
from integraflow.graphql.core.doc_category import DOC_CATEGORY_SURVEYS
from integraflow.graphql.core.fields import (
    FilterConnectionField,
    JSONString,
    PermissionsField,
)
from integraflow.graphql.core.types.base import BaseObjectType
from integraflow.graphql.core.types.common import NonNullList
from integraflow.graphql.core.types.model import ModelObjectType
from integraflow.graphql.core.utils import to_global_ids_from_pks
from integraflow.graphql.survey.enums import (
    SurveyChannelTypeEnum,
    SurveyQuestionTypeEnum,
    SurveyStatusEnum,
    SurveyTypeEnum,
    SurveyResponseStatusEnum
)
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.survey import models

from .utils import replace_pks_to_global_ids


class BaseSurvey(ModelObjectType):
    id = graphene.GlobalID(
        required=True,
        description="The ID of the survey."
    )
    slug = graphene.String(
        required=True,
        description="Slug of the survey.",
    )
    name = graphene.String(
        required=False,
        description="Name of the survey.",
    )
    status = graphene.Field(
        SurveyStatusEnum,
        required=True,
        description="The status of the survey",
    )
    settings = JSONString(
        description="The settings of the survey."
    )
    theme = graphene.Field(
        "integraflow.graphql.project.types.BaseProjectTheme",
        description="The theme of the survey.",
    )
    questions = NonNullList(
        "integraflow.graphql.survey.types.BaseSurveyQuestion",
        required=True,
        description="The questions in the the survey"
    )
    channels = NonNullList(
        "integraflow.graphql.survey.types.BaseSurveyChannel",
        required=True,
        description="The distribution channels supported by the survey",
        channelType=graphene.Argument(
            SurveyChannelTypeEnum,
            description="The type of the distribution channel",
            required=False,
        ),
    )
    project = graphene.Field(
        "integraflow.graphql.project.types.BaseProject",
        description="The project the survey belongs to",
    )
    created_at = graphene.DateTime(
        required=True,
        description="The time at which the survey was created."
    )
    start_date = graphene.DateTime(
        required=False,
        description="The date at which the survey was started."
    )
    end_date = graphene.DateTime(
        required=False,
        description="The date at which the survey was ended."
    )

    class Meta:
        description = "Represents a survey from used by our sdk."
        doc_category = DOC_CATEGORY_SURVEYS
        model = models.Survey
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_theme(root: models.Survey, info: ResolveInfo):
        return root.theme

    @staticmethod
    def resolve_questions(root: models.Survey, info: ResolveInfo, **kwargs):
        return root.survey_questions.all()  # type: ignore

    @staticmethod
    def resolve_channels(
        root: models.Survey,
        info: ResolveInfo,
        channelType=None
    ):
        channels = root.survey_channels  # type: ignore
        if channelType:
            return channels.filter(type=channelType).all()

        return channels.all()

    @staticmethod
    def resolve_project(root: models.Survey, info: ResolveInfo):
        return root.project


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
    stats = JSONString(
        required=False,
        description="The statistics of the survey."
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

    @staticmethod
    def resolve_stats(root: models.Survey, info: ResolveInfo, **kwargs):
        response_count = root.analytics_metadata.get("response_count", 0)
        time_spent = root.analytics_metadata.get("time_spent", 0)
        completed_response_count = root.analytics_metadata.get(
            "completed_response_count", 0
        )

        stats = {
            "response_count": response_count,
            "avg_time_spent": (
                time_spent / completed_response_count
            ) if completed_response_count > 0 else 0,
            "completion_rate": (
                (completed_response_count / response_count) * 100
            ) if response_count > 0 else 0,
        }

        nps = root.analytics_metadata.get("nps", None)
        if nps is not None:
            promoters = nps.get("promoters", 0)
            detractors = nps.get("detractors", 0)
            passives = nps.get("passives", 0)
            total = promoters + detractors + passives

            if total > 0:
                promoters = (promoters / total) * 100
                detractors = (detractors / total) * 100
                stats["nps_score"] = promoters - detractors

        csat = root.analytics_metadata.get("csat", None)
        if csat is not None:
            positive = csat.get("positive", 0)
            count = csat.get("count", 0)

            if count > 0:
                stats["csat_score"] = (positive / count) * 100

        ces = root.analytics_metadata.get("ces", None)
        if ces is not None:
            score = ces.get("score", 0)
            count = ces.get("count", 0)

            if count > 0:
                stats["ces_score"] = score / count

        return stats


class BaseSurveyQuestion(ModelObjectType):
    id = graphene.GlobalID(
        required=True,
        description="The ID of the question."
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
    def resolve_label(root: models.SurveyQuestion, info: ResolveInfo):

        return replace_pks_to_global_ids(
            root.label or "",
            "BaseSurveyQuestion"
        )

    @staticmethod
    def resolve_description(root: models.SurveyQuestion, info: ResolveInfo):

        return replace_pks_to_global_ids(
            root.description or "",
            "BaseSurveyQuestion"
        )

    @staticmethod
    def resolve_settings(root: models.SurveyQuestion, info: ResolveInfo):
        settings = root.settings
        if settings:
            to_global_ids_from_pks(
                "BaseSurveyQuestion",
                settings.get("logic", []),
                "destination"
            )

        return settings


class SurveyQuestion(BaseSurveyQuestion):
    reference = graphene.ID(
        required=False,
        description="For internal purpose."
    )
    survey = PermissionsField(
        Survey,
        description="The project the survey belongs to",
        permissions=[
            AuthorizationFilters.PROJECT_MEMBER_ACCESS,
        ],
    )

    class Meta:
        description = "Represents a question."
        doc_category = DOC_CATEGORY_SURVEYS
        model = models.SurveyQuestion
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_label(root: models.SurveyQuestion, info: ResolveInfo):

        return replace_pks_to_global_ids(
            root.label or "",
            "SurveyQuestion"
        )

    @staticmethod
    def resolve_description(root: models.SurveyQuestion, info: ResolveInfo):

        return replace_pks_to_global_ids(
            root.description or "",
            "SurveyQuestion"
        )

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


class BaseSurveyChannel(ModelObjectType):
    id = graphene.GlobalID(
        required=True,
        description="The ID of the channel."
    )
    type = graphene.Field(
        SurveyChannelTypeEnum,
        required=True,
        description="The type of the survey channel",
    )
    link = graphene.String(
        required=True,
        description="Unique link to the channel.",
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

    class Meta:
        description = "Represents a survey channel."
        doc_category = DOC_CATEGORY_SURVEYS
        model = models.SurveyChannel
        interfaces = [graphene.relay.Node]


class SurveyChannel(BaseSurveyChannel):
    reference = graphene.ID(
        required=False,
        description="For internal purpose."
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


class SurveyResponse(ModelObjectType):
    id = graphene.GlobalID(
        required=True,
        description="The ID of the response."
    )
    survey = PermissionsField(
        Survey,
        description="The survey the response belongs to",
        permissions=[
            AuthorizationFilters.PROJECT_MEMBER_ACCESS,
        ],
    )
    title = graphene.String(
        required=True,
        description="The title of the response."
    )
    user_attributes = JSONString(
        description="The user attributes."
    )
    response = JSONString(
        description="The response.",
        required=True,
    )
    status = graphene.Field(
        SurveyResponseStatusEnum,
        required=True,
        description="The status of the survey response",
    )
    completed_at = graphene.DateTime(
        required=False,
        description="The time the survey completed."
    )
    created_at = graphene.DateTime(
        required=True,
        description="The time at which the response was created."
    )
    updated_at = graphene.DateTime(
        required=True,
        description="The last time at which the response was updated."
    )
    time_spent = graphene.Float(
        required=False,
        description="The time spent to complete the survey."
    )
    stats = JSONString(
        required=False,
        description="The statistics of the response."
    )

    class Meta:
        description = "Represents a survey response."
        doc_category = DOC_CATEGORY_SURVEYS
        model = models.SurveyResponse
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_survey(root: models.SurveyResponse, info: ResolveInfo):
        return root.survey

    @staticmethod
    def resolve_title(root: models.SurveyResponse, info: ResolveInfo):
        return root.analytics_metadata.get("title", "Untitled Response")

    @staticmethod
    def resolve_stats(root: models.SurveyResponse, info: ResolveInfo):
        stats = {}

        nps_score = root.analytics_metadata.get("nps_score", None)
        if nps_score is not None:
            stats["nps_score"] = nps_score

        ces_score = root.analytics_metadata.get("ces_score", None)
        if ces_score is not None:
            stats["ces_score"] = ces_score

        csat_score = root.analytics_metadata.get("csat_score", None)
        if csat_score is not None:
            stats["csat_score"] = csat_score

        return root.analytics_metadata


class SurveyResponseMetric(BaseObjectType):
    current = graphene.JSONString(
        required=False,
        description="The current value."
    )

    previous = graphene.JSONString(
        required=False,
        description="The previous value."
    )

    class Meta:
        description = (
            "Represents a survey response metric (e.g. total responses, nps)."
        )
        doc_category = DOC_CATEGORY_SURVEYS


class BaseSurveyCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS
        node = BaseSurvey


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


class SurveyResponseCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS
        node = SurveyResponse
