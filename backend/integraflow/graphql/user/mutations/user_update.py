import graphene

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_AUTH
from integraflow.graphql.core.mutations import ModelMutation
from integraflow.graphql.core.types.base import BaseInputObjectType
from integraflow.graphql.core.types.common import UserError
from integraflow.graphql.user.types import User
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.user import models


class UserInput(BaseInputObjectType):
    first_name = graphene.String(
        description="The given name of the user."
    )
    last_name = graphene.String(
        description="The family name of the user."
    )
    is_onboarded = graphene.Boolean(
        description="Determine if the user has finished onboarding.",
    )
    avatar = graphene.String(
        description="The avatar of the user."
    )

    class Meta:
        doc_category = DOC_CATEGORY_AUTH


class UserUpdate(ModelMutation):
    """Mutation that updates a project."""

    class Arguments:
        input = UserInput(
            description=(
                "A partial object to update the user with."
            ),
            required=True
        )

    class Meta:
        description = "Updates a user."
        model = models.User
        object_type = User
        error_type_class = UserError
        error_type_field = "user_errors"
        doc_category = DOC_CATEGORY_AUTH
        permissions = (AuthorizationFilters.AUTHENTICATED_USER,)

    @classmethod
    def get_type_for_model(cls):
        return User

    @classmethod
    def perform_mutation(cls, _root, info: ResolveInfo, /, **data):
        user = info.context.user
        if user and user.project:
            data["id"] = graphene.Node.to_global_id("User", user.pk)
            return super().perform_mutation(_root, info, **data)
