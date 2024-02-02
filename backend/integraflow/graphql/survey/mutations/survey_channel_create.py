import graphene

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_SURVEYS
from integraflow.graphql.core.fields import JSONString
from integraflow.graphql.core.mutations import ModelMutation
from integraflow.graphql.core.scalars import UUID
from integraflow.graphql.core.types.base import BaseInputObjectType
from integraflow.graphql.core.types.common import SurveyError
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.survey import models

from ..enums import SurveyChannelTypeEnum
from ..types import SurveyChannel


class SurveyChannelInput(BaseInputObjectType):
    type = SurveyChannelTypeEnum(
        description="The type of the distribution channel",
    )
    triggers = JSONString(
        description="The triggers for the channel."
    )
    conditions = JSONString(
        description="The conditions for the channel."
    )
    settings = JSONString(
        description="The settings of the channel."
    )

    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS


class SurveyChannelCreateInput(SurveyChannelInput):
    id = UUID(
        description="The id of the channel."
    )
    survey_id = graphene.ID(
        required=True,
        description="The survey ID the channel belongs to."
    )

    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS


class SurveyChannelCreate(ModelMutation):
    class Arguments:
        input = SurveyChannelCreateInput(
            required=True,
            description="The channel object to create."
        )

    class Meta:
        description = "Creates a new distibution channel"
        model = models.SurveyChannel
        object_type = SurveyChannel
        error_type_class = SurveyError
        error_type_field = "survey_errors"
        doc_category = DOC_CATEGORY_SURVEYS
        permissions = (AuthorizationFilters.PROJECT_MEMBER_ACCESS,)

    @classmethod
    def get_type_for_model(cls):
        return SurveyChannel

    @classmethod
    def clean_input(cls, info: ResolveInfo, instance, data, **kwargs):
        cleaned_input = super().clean_input(info, instance, data, **kwargs)

        survey = cleaned_input.get("survey_id")
        if survey:
            cleaned_input["survey"] = survey

        return cleaned_input

    @classmethod
    def save(cls, _info: ResolveInfo, instance, _cleaned_input, /):
        models.SurveyChannel.objects.create(**_cleaned_input)
