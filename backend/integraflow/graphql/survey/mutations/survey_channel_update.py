import graphene

from integraflow.graphql.core.doc_category import DOC_CATEGORY_SURVEYS
from integraflow.graphql.core.mutations import ModelMutation
from integraflow.graphql.core.types.common import SurveyError
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.survey import models

from .survey_channel_create import SurveyChannelInput
from ..types import SurveyChannel


class SurveyChannelUpdateInput(SurveyChannelInput):
    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS


class SurveyChannelUpdate(ModelMutation):
    class Arguments:
        id = graphene.ID(
            required=True,
            description="ID of a channel to update."
        )
        input = SurveyChannelUpdateInput(
            required=True,
            description="A partial object to update the channel with."
        )

    class Meta:
        description = "Updates a channel"
        model = models.SurveyChannel
        object_type = SurveyChannel
        error_type_class = SurveyError
        error_type_field = "survey_errors"
        doc_category = DOC_CATEGORY_SURVEYS
        permissions = (AuthorizationFilters.PROJECT_MEMBER_ACCESS,)
