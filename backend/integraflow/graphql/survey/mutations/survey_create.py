import graphene

from django.utils.text import slugify

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_SURVEYS
from integraflow.graphql.core.fields import JSONString
from integraflow.graphql.core.mutations import ModelMutation
from integraflow.graphql.core.types.base import BaseInputObjectType
from integraflow.graphql.core.types.common import SurveyError
from integraflow.core.utils import (
    MAX_SLUG_LENGTH,
    generate_random_short_suffix
)
from integraflow.graphql.survey.enums import SurveyStatusEnum, SurveyTypeEnum
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.survey import models

from ..types import Survey


class SurveyInput(BaseInputObjectType):
    name = graphene.String(
        description="The name of the survey."
    )
    slug = graphene.String(
        description="The slug of the survey.",
    )
    type = SurveyTypeEnum(
        description="The type of the survey",
    )
    status = SurveyStatusEnum(
        description="The status of the survey",
    )
    settings = JSONString(
        description="The settings of the survey."
    )
    theme_id = graphene.ID(
        description="The theme of the survey."
    )

    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS


class SurveyCreateInput(SurveyInput):
    id = graphene.UUID(
        description="The id of the survey."
    )

    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS


class SurveyCreate(ModelMutation):
    class Arguments:
        input = SurveyCreateInput(
            required=True,
            description="The survey object to create."
        )

    class Meta:
        description = "Creates a new survey"
        model = models.Survey
        object_type = Survey
        error_type_class = SurveyError
        error_type_field = "survey_errors"
        doc_category = DOC_CATEGORY_SURVEYS
        permissions = (AuthorizationFilters.PROJECT_MEMBER_ACCESS,)

    @classmethod
    def get_type_for_model(cls):
        return Survey

    @classmethod
    def clean_input(cls, info: ResolveInfo, instance, data, **kwargs):
        cleaned_input = super().clean_input(info, instance, data, **kwargs)

        name = cleaned_input.get("name")
        slug = cleaned_input.get("slug")
        if name and not slug:
            cleaned_input["slug"] = (
                f"{slugify(name)[:MAX_SLUG_LENGTH - 7]}-"
                f"{generate_random_short_suffix(6).lower()}"
            )

        theme = cleaned_input.get("theme_id")
        if theme:
            cleaned_input["theme"] = theme

        if info.context.user:
            cleaned_input["created_by"] = info.context.user
            cleaned_input["project"] = info.context.user.project

        print(cleaned_input)

        return cleaned_input
