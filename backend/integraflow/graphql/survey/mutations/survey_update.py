import graphene

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_SURVEYS
from integraflow.graphql.core.mutations import ModelMutation
from integraflow.graphql.core.types.common import SurveyError
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.survey import models

from .survey_create import SurveyInput
from ..types import Survey


class SurveyUpdateInput(SurveyInput):
    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS


class SurveyUpdate(ModelMutation):
    class Arguments:
        id = graphene.ID(
            required=True,
            description="ID of a survey to update."
        )
        input = SurveyUpdateInput(
            required=True,
            description="A partial object to update the survey with."
        )

    class Meta:
        description = "Updates a survey"
        model = models.Survey
        object_type = Survey
        error_type_class = SurveyError
        error_type_field = "survey_errors"
        doc_category = DOC_CATEGORY_SURVEYS
        permissions = (AuthorizationFilters.PROJECT_MEMBER_ACCESS,)
        auto_verify_project = True

    @classmethod
    def clean_input(cls, info: ResolveInfo, instance, data, **kwargs):
        cleaned_input = super().clean_input(info, instance, data, **kwargs)

        theme = cleaned_input.get("theme_id")
        if theme:
            cleaned_input["theme"] = theme

        return cleaned_input
