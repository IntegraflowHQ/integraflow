import graphene

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_AUTH
from integraflow.graphql.core.mutations import BaseMutation
from integraflow.graphql.core.types.common import UserError
from integraflow.graphql.user.types import AuthUser
from integraflow.permission.auth_filters import AuthorizationFilters


class OnboardUser(BaseMutation):

    class Arguments:
        pass

    user = graphene.Field(
        AuthUser,
        description=(
            "A user that is being onboarded."
        )
    )

    class Meta:
        description = "Marks user as onboarded."
        permissions = (AuthorizationFilters.AUTHENTICATED_USER,)
        doc_category = DOC_CATEGORY_AUTH
        error_type_class = UserError
        error_type_field = "user_errors"

    @classmethod
    def perform_mutation(
        cls, _root, info: ResolveInfo
    ):
        if info.context.user is not None:
            info.context.user.is_onboarded = True
            info.context.user.save()
        return cls(user=info.context.user)
