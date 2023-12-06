import graphene

from integraflow.core.exceptions import PermissionDenied
from integraflow.graphql.core.mutations import ModelDeleteMutation
from integraflow.graphql.core.types.common import SurveyError
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.survey import models

from ..types import Survey


class SurveyDelete(ModelDeleteMutation):
    class Arguments:
        id = graphene.ID(
            required=True,
            description="ID of a survey to delete."
        )

    class Meta:
        description = "Deletes a survey."
        model = models.Survey
        object_type = Survey
        permissions = (AuthorizationFilters.PROJECT_MEMBER_ACCESS,)
        error_type_class = SurveyError
        error_type_field = "survey_errors"
        auto_verify_project = True

    @classmethod
    def delete(cls, _info, instance: models.Survey):
        if instance.status != models.Survey.Status.DRAFT:
            permissions = [AuthorizationFilters.PROJECT_ADMIN_ACCESS]

            if not cls.check_permissions(
                _info.context,
                permissions,
                require_all_permissions=True
            ):
                raise PermissionDenied()

        instance.delete()
