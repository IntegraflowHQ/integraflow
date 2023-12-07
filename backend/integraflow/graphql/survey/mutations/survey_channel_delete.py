import graphene

from integraflow.graphql.core.mutations import ModelDeleteMutation
from integraflow.graphql.core.types.common import SurveyError
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.survey import models

from ..types import SurveyChannel


class SurveyChannelDelete(ModelDeleteMutation):
    class Arguments:
        id = graphene.ID(
            required=True,
            description="ID of a channel to delete."
        )

    class Meta:
        description = "Deletes a channel."
        model = models.SurveyChannel
        object_type = SurveyChannel
        permissions = (AuthorizationFilters.PROJECT_MEMBER_ACCESS,)
        error_type_class = SurveyError
        error_type_field = "survey_errors"
