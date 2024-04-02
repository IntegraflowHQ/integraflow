import graphene

from integraflow.graphql.core.doc_category import DOC_CATEGORY_SURVEYS
from integraflow.graphql.core.mutations import ModelMutation
from integraflow.graphql.core.types.common import SurveyError
from integraflow.graphql.core.utils import from_global_ids_to_pks
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.survey import models
from integraflow.survey.utils import calculate_max_paths

from .survey_question_create import SurveyQuestionInput
from ..types import SurveyQuestion

from ..utils import replace_global_ids_to_pks


class SurveyQuestionUpdateInput(SurveyQuestionInput):
    order_number = graphene.Int(
        required=False,
        description="The settings of the question."
    )

    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS


class SurveyQuestionUpdate(ModelMutation):
    class Arguments:
        id = graphene.ID(
            required=True,
            description="ID of a question to update."
        )
        input = SurveyQuestionUpdateInput(
            required=True,
            description="A partial object to update the question with."
        )

    class Meta:
        description = "Updates a question"
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
    def clean_input(cls, info, instance, data, **kwargs):
        cleaned_input = super().clean_input(info, instance, data, **kwargs)

        label = cleaned_input.get("label", None)
        description = cleaned_input.get("description", None)

        if label is not None:
            cleaned_input["label"] = replace_global_ids_to_pks(label)

        if description is not None:
            cleaned_input["description"] = replace_global_ids_to_pks(
                description
            )

        settings = cleaned_input.get("settings")
        if settings:
            from_global_ids_to_pks(settings.get("logic", []), "destination")
            cleaned_input["settings"] = settings

        return cleaned_input

    @classmethod
    def post_save_action(cls, info, instance, cleaned_input):
        calculate_max_paths(instance.survey_id)
