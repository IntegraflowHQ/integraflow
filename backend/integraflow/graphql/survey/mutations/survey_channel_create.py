from typing import cast

import graphene
from django.core.exceptions import ValidationError
from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_SURVEYS
from integraflow.graphql.core.fields import JSONString
from integraflow.graphql.core.mutations import BaseMutation
from integraflow.graphql.core.scalars import UUID
from integraflow.graphql.core.types.base import BaseInputObjectType
from integraflow.graphql.core.types.common import SurveyError
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.project.models import Project
from integraflow.survey import models
from integraflow.survey.error_codes import SurveyErrorCode

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


class SurveyChannelCreate(BaseMutation):
    class Arguments:
        input = SurveyChannelCreateInput(
            required=True,
            description="The channel object to create."
        )

    surveyChannel = graphene.Field(
        SurveyChannel,
        description="The checkout with the added gift card or voucher."
    )

    class Meta:
        description = "Creates a new distibution channel"
        error_type_class = SurveyError
        error_type_field = "survey_errors"
        doc_category = DOC_CATEGORY_SURVEYS
        permissions = (AuthorizationFilters.PROJECT_MEMBER_ACCESS,)

    @classmethod
    def clean_input(cls, info: ResolveInfo, **data):
        project = cast(Project, info.context.project)

        survey_id = data.get("survey_id")
        survey = cls.get_node_or_error(
            info,
            survey_id
        )

        if survey is None or survey.project.pk != project.pk:  # type: ignore
            raise ValidationError(
                {
                    "survey_id": ValidationError(
                        f"Could not resolve survey with ID: {survey_id}",
                        code=SurveyErrorCode.NOT_FOUND.value,
                    )
                }
            )

        cleaned_input = {
            "survey_id": survey.pk,  # type: ignore
        }

        if data.get("id"):
            cleaned_input["id"] = data.get("id")

        if data.get("type"):
            cleaned_input["type"] = data.get("type")

        if data.get("triggers"):
            cleaned_input["triggers"] = data.get("triggers", {})

        if data.get("conditions"):
            cleaned_input["conditions"] = data.get("conditions", {})

        if data.get("settings"):
            cleaned_input["settings"] = data.get("settings", {})

        return cleaned_input

    @classmethod
    def perform_mutation(
        cls, _root, info: ResolveInfo, /, **data
    ):
        cleaned_input = cls.clean_input(info, **data["input"])
        instance = models.SurveyChannel.objects.create(**cleaned_input)

        return cls(
            errors=[],
            survey_errors=[],
            surveyChannel=instance,
        )
