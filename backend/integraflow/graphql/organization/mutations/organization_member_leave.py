import graphene

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_ORGANIZATIONS
from integraflow.graphql.core.types.common import OrganizationError
from integraflow.graphql.core.mutations import ModelDeleteMutation
from integraflow.graphql.core.utils import raise_validation_error
from integraflow.organization import models
from integraflow.permission.auth_filters import AuthorizationFilters

from ..types import OrganizationMember


class OrganizationMemberLeave(ModelDeleteMutation):
    class Arguments:
        id = graphene.ID(
            required=True,
            description="ID of the member to leave an organization."
        )

    class Meta:
        description = "Deletes a member from an organization."
        model = models.OrganizationMembership
        object_type = OrganizationMember
        error_type_class = OrganizationError
        error_type_field = "organization_errors"
        doc_category = DOC_CATEGORY_ORGANIZATIONS
        permissions = (AuthorizationFilters.ORGANIZATION_ADMIN_ACCESS,)
        auto_verify_organization = True

    @classmethod
    def get_type_for_model(cls):
        return OrganizationMember

    @classmethod
    def delete(
        cls,
        _info: ResolveInfo,
        instance: models.OrganizationMembership
    ):
        if instance.level == models.OrganizationMembership.Level.OWNER:
            raise_validation_error(
                field="id",
                message="An organization owner cannot leave an organization.",
                code="invalid"
            )

        instance.user.leave(organization=instance.organization)
