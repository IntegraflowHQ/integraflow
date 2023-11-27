import graphene
from typing import cast

from integraflow.graphql.core.mutations import BaseMutation
from integraflow.graphql.core.doc_category import DOC_CATEGORY_ORGANIZATIONS
from integraflow.graphql.core.types.common import OrganizationError
from integraflow.graphql.core import ResolveInfo

from integraflow.user.models import User
from integraflow.permission.auth_filters import AuthorizationFilters


class OrganizationInviteLinkReset(BaseMutation):
    invite_link = graphene.String(
        description="The current organization invite link."
    )
    success = graphene.Boolean(
        description="Whether the operation was successful."
    )

    class Meta:
        description = (
            "Reset the current organization invite link.."
        )
        doc_category = DOC_CATEGORY_ORGANIZATIONS
        error_type_class = OrganizationError
        error_type_field = "organization_errors"
        permissions = (AuthorizationFilters.ORGANIZATION_MEMBER_ACCESS,)

    @classmethod
    def perform_mutation(cls, _root, info: ResolveInfo, /):
        user = cast(User, info.context.user)

        if user.organization:
            user.organization.reset_invite_token()

            return cls(
                errors=[],
                success=True,
                invite_link=(
                    f"/{user.organization.slug}/join"
                    f"/{user.organization.invite_token}"
                )
            )
