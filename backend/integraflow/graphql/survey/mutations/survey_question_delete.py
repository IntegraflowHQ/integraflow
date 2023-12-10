import graphene
from django.db import transaction

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.mutations import ModelDeleteMutation
from integraflow.graphql.core.types.common import SurveyError
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.survey import models
from integraflow.survey.utils import calculate_max_paths

from ..types import SurveyQuestion


class SurveyQuestionDelete(ModelDeleteMutation):
    class Arguments:
        id = graphene.ID(
            required=True,
            description="ID of a question to delete."
        )

    class Meta:
        description = "Deletes a question."
        model = models.SurveyQuestion
        object_type = SurveyQuestion
        permissions = (AuthorizationFilters.PROJECT_MEMBER_ACCESS,)
        error_type_class = SurveyError
        error_type_field = "survey_errors"

    @classmethod
    def clean_settings(cls, id):
        questions = models.SurveyQuestion.objects.filter(
            settings__logic__contains=[{"destination": f"{id}"}]
        )

        for question in questions:
            settings = question.settings

            filtered_logic = []
            for logic in settings.get("logic", []):
                if logic.get("destination") != id:
                    filtered_logic.append(logic)

            settings["logic"] = filtered_logic

        models.SurveyQuestion.objects.bulk_update(questions, ["settings"])

    @classmethod
    def post_save_action(cls, info, instance, cleaned_input):
        calculate_max_paths(instance.survey_id)

    @classmethod
    def clean_instance(cls, info: ResolveInfo, instance, /):
        cls.clean_settings(str(instance.id))

    @classmethod
    def perform_mutation(cls, _root, info: ResolveInfo, /, *, id=None):
        with transaction.atomic():
            return super().perform_mutation(_root, info, id=id)
