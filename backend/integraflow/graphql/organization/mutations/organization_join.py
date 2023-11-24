from typing import cast

import graphene

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_ORGANIZATIONS
from integraflow.graphql.core.mutations import BaseMutation
from integraflow.graphql.core.types.base import BaseInputObjectType
from integraflow.graphql.core.types.common import OrganizationError
from integraflow.graphql.user.types import AuthUser
from integraflow.graphql.core.utils import from_global_id_or_error
from integraflow.organization.models import OrganizationInvite
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.user.models import User


class OrganizationJoinInput(BaseInputObjectType):
    invite_id = graphene.ID(
        description="The ID of the invite.",
        required=True
    )

    class Meta:
        doc_category = DOC_CATEGORY_ORGANIZATIONS


class OrganizationJoin(BaseMutation):
    class Arguments:
        input = OrganizationJoinInput(
            required=True,
            description="Organization details for the new organization."
        )

    user = graphene.Field(
        AuthUser,
        required=True,
        description=(
            "A user that has access to the the resources of an organization."
        )
    )

    class Meta:
        description = "Joins an organization"
        permissions = (AuthorizationFilters.AUTHENTICATED_USER,)
        error_type_class = OrganizationError
        error_type_field = "organization_errors"
        doc_category = DOC_CATEGORY_ORGANIZATIONS

    @classmethod
    def perform_mutation(
        cls, _root, info: ResolveInfo, /, **data
    ):
        input = data["input"]

        user = cast(User, info.context.user)

        _, invite_id = from_global_id_or_error(input.get("invite_id"))
        OrganizationInvite.objects.accept_invite(
            user,
            invite_id
        )

        return cls(user=user)
