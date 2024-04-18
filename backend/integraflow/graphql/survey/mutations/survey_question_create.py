import graphene

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_SURVEYS
from integraflow.graphql.core.fields import JSONString
from integraflow.graphql.core.mutations import ModelMutation
from integraflow.graphql.core.scalars import UUID
from integraflow.graphql.core.types.base import BaseInputObjectType
from integraflow.graphql.core.types.common import SurveyError
from integraflow.graphql.core.utils import from_global_ids_to_pks
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.survey import models
from integraflow.survey.utils import calculate_max_paths

from ..enums import SurveyQuestionTypeEnum
from ..types import SurveyQuestion
from ..utils import replace_global_ids_to_pks


class SurveyQuestionInput(BaseInputObjectType):
    label = graphene.String(
        description="The label of the question."
    )
    description = graphene.String(
        description="The description of the question."
    )
    type = SurveyQuestionTypeEnum(
        description="The type of the question",
    )
    settings = JSONString(
        description="The settings of the question."
    )
    options = JSONString(
        description="The options of the question. "
    )
    order_number = graphene.Int(
        required=True,
        description="The settings of the question."
    )

    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS


class SurveyQuestionCreateInput(SurveyQuestionInput):
    id = UUID(
        description="The id of the question."
    )
    survey_id = graphene.ID(
        required=True,
        description="The survey ID the question belongs to."
    )

    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS


class SurveyQuestionCreate(ModelMutation):
    class Arguments:
        input = SurveyQuestionCreateInput(
            required=True,
            description="The question object to create."
        )

    class Meta:
        description = "Creates a new question"
        model = models.SurveyQuestion
        object_type = SurveyQuestion
        error_type_class = SurveyError
        error_type_field = "survey_errors"
        doc_category = DOC_CATEGORY_SURVEYS
        permissions = (AuthorizationFilters.PROJECT_MEMBER_ACCESS,)

    @classmethod
    def get_type_for_model(cls):
        return SurveyQuestion

    @classmethod
    def clean_input(cls, info: ResolveInfo, instance, data, **kwargs):
        cleaned_input = super().clean_input(info, instance, data, **kwargs)

        label = cleaned_input.get("label", None)
        description = cleaned_input.get("description", None)

        if label is not None:
            cleaned_input["label"] = replace_global_ids_to_pks(label)

        if description is not None:
            cleaned_input["description"] = replace_global_ids_to_pks(
                description
            )

        settings = cleaned_input.get("settings", {})
        from_global_ids_to_pks(settings.get("logic", []), "destination")
        cleaned_input["settings"] = settings

        cleaned_input["max_path"] = 0

        survey = cleaned_input.get("survey_id")
        if survey:
            cleaned_input["survey"] = survey

        return cleaned_input

    @classmethod
    def post_save_action(cls, info: ResolveInfo, instance, cleaned_input):
        calculate_max_paths(instance.survey_id)
