import graphene

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_ORGANIZATIONS
from integraflow.graphql.core.enums import RoleLevel
from integraflow.graphql.core.mutations import ModelMutation
from integraflow.graphql.core.types.base import BaseInputObjectType
from integraflow.graphql.core.types.common import OrganizationError
from integraflow.graphql.core.utils import raise_validation_error
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.organization import models

from ..types import OrganizationMember


class OrganizationMemberUpdateInput(BaseInputObjectType):
    role = graphene.Field(
        RoleLevel,
        default_value=models.OrganizationMembership.Level.MEMBER,
        description="What member role to grant.",
    )

    class Meta:
        doc_category = DOC_CATEGORY_ORGANIZATIONS


class OrganizationMemberUpdate(ModelMutation):
    """Mutation that updates an organization memeber."""

    class Arguments:
        id = graphene.ID(
            required=True,
            description="ID of the member to update."
        )
        input = OrganizationMemberUpdateInput(
            description=(
                "A partial object to update the organization member with."
            ),
            required=True
        )

    class Meta:
        description = "Updates an organization member."
        model = models.OrganizationMembership
        object_type = OrganizationMember
        error_type_class = OrganizationError
        error_type_field = "organization_errors"
        doc_category = DOC_CATEGORY_ORGANIZATIONS
        permissions = (AuthorizationFilters.ORGANIZATION_ADMIN_ACCESS,)

    @classmethod
    def get_type_for_model(cls):
        return OrganizationMember

    @classmethod
    def clean_input(cls, info: ResolveInfo, instance, data, **kwargs):
        cleaned_input = super().clean_input(info, instance, data, **kwargs)

        role = cleaned_input.get("role")
        if role:
            if (role == models.OrganizationMembership.Level.OWNER):
                raise_validation_error(
                    field="role",
                    message="You cannot grant a member an ownership role.",
                    code="invalid"
                )

            cleaned_input["level"] = role

        return cleaned_input
