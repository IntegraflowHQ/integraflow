import graphene

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_ORGANIZATIONS
from integraflow.graphql.core.mutations import ModelMutation
from integraflow.graphql.core.types.common import OrganizationError
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.organization import models

from ..types import Organization
from .organization_create import OrganizationCreateInput


class OrganizationUpdateInput(OrganizationCreateInput):
    name = graphene.String(
        description="The name of the organization."
    )
    slug = graphene.String(
        description="The slug of the organization."
    )
    timezone = graphene.String(
        description="The timezone of the organization, passed in by client.",
    )

    class Meta:
        doc_category = DOC_CATEGORY_ORGANIZATIONS


class OrganizationUpdate(ModelMutation):
    """Mutation that updates an organization."""

    class Arguments:
        input = OrganizationUpdateInput(
            description=(
                "A partial object to update the organization with."
            ),
            required=True
        )

    class Meta:
        description = "Updates an organization."
        model = models.Organization
        object_type = Organization
        error_type_class = OrganizationError
        error_type_field = "organization_errors"
        doc_category = DOC_CATEGORY_ORGANIZATIONS
        permissions = (AuthorizationFilters.ORGANIZATION_ADMIN_ACCESS,)

    @classmethod
    def get_type_for_model(cls):
        return Organization

    @classmethod
    def perform_mutation(cls, _root, info: ResolveInfo, /, **data):
        user = info.context.user
        if user and user.organization:
            data["id"] = graphene.Node.to_global_id(
                "Organization",
                user.organization.pk
            )

            return super().perform_mutation(_root, info, **data)
