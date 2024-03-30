import graphene
from graphene import Union

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_ORGANIZATIONS
from integraflow.graphql.core.fields import BaseField, PermissionsField
from integraflow.organization.models import OrganizationInvite
from integraflow.permission.auth_filters import AuthorizationFilters

from .mutations import (
    OrganizationCreate,
    OrganizationInviteCreate,
    OrganizationInviteDelete,
    OrganizationInviteLinkReset,
    OrganizationInviteResend,
    OrganizationJoin,
    OrganizationLeave,
    OrganizationMemberLeave,
    OrganizationUpdate
)
from .resolvers import resolve_organization_invite_details
from .types import (
    OrganizationInviteDetails,
    OrganizationInviteLink,
    OrganizationInviteLinkDetails
)


class InviteDetails(Union):
    class Meta:
        types = (OrganizationInviteDetails, OrganizationInviteLinkDetails)

    @classmethod
    def resolve_type(cls, instance, info: ResolveInfo):
        if isinstance(instance, OrganizationInvite):
            return OrganizationInviteDetails
        return OrganizationInviteLinkDetails


class OrganizationQueries(graphene.ObjectType):
    organization_invite_details = BaseField(
        InviteDetails,
        invite_link=graphene.Argument(
            graphene.String,
            description="An invite link for an organization.",
            required=True
        ),
        description="One specific organization invite.",
        doc_category=DOC_CATEGORY_ORGANIZATIONS,
    )

    organization_invite_link = PermissionsField(
        OrganizationInviteLink,
        description="The current organization invite link.",
        doc_category=DOC_CATEGORY_ORGANIZATIONS,
        permissions=[
            AuthorizationFilters.ORGANIZATION_MEMBER_ACCESS,
        ],
    )

    @staticmethod
    def resolve_organization_invite_details(_root, info, *, invite_link):
        return resolve_organization_invite_details(info, invite_link)

    @staticmethod
    def resolve_organization_invite_link(_root, info):
        user = info.context.user
        return user.organization if user else None


class OrganizationMutations(graphene.ObjectType):
    organization_create = OrganizationCreate.Field()
    organization_invite_create = OrganizationInviteCreate.Field(),
    organization_invite_delete = OrganizationInviteDelete.Field()
    organization_invite_link_reset = OrganizationInviteLinkReset.Field()
    organization_invite_resend = OrganizationInviteResend.Field()
    organization_join = OrganizationJoin.Field(),
    organization_leave = OrganizationLeave.Field(),
    organization_member_leave = OrganizationMemberLeave.Field(),
    organization_update = OrganizationUpdate.Field()
