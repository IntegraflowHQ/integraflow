import graphene

from integraflow.graphql.core.doc_category import DOC_CATEGORY_ORGANIZATIONS
from integraflow.graphql.core.mutations import ModelDeleteMutation
from integraflow.graphql.core.types.common import OrganizationError
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.organization import models

from ..types import OrganizationInvite


class OrganizationInviteDelete(ModelDeleteMutation):
    class Arguments:
        id = graphene.ID(
            required=True,
            description="The identifier of the invite to delete."
        )

    class Meta:
        description = "Deletes an organization invite."
        model = models.OrganizationInvite
        object_type = OrganizationInvite
        permissions = (AuthorizationFilters.ORGANIZATION_ADMIN_ACCESS,)
        error_type_class = OrganizationError
        error_type_field = "organization_errors"
        doc_category = DOC_CATEGORY_ORGANIZATIONS
        auto_verify_organization = True
