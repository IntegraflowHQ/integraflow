import graphene

from integraflow.graphql.core.doc_category import DOC_CATEGORY_ORGANIZATIONS
from integraflow.graphql.core.fields import BaseField

from .mutations import (
    OrganizationCreate,
    OrganizationInviteCreate,
    OrganizationJoin
)
from .resolvers import resolve_organization_invite_details
from .types import OrganizationInviteDetails


class OrganizationQueries(graphene.ObjectType):
    organization_invite_details = BaseField(
        OrganizationInviteDetails,
        id=graphene.Argument(
            graphene.ID,
            description="ID of the group.",
            required=True
        ),
        description="One specific organization invite.",
        doc_category=DOC_CATEGORY_ORGANIZATIONS,
    )

    @staticmethod
    def resolve_organization_invite_details(_root, info, *, id):
        return resolve_organization_invite_details(info, id)


class OrganizationMutations(graphene.ObjectType):
    organization_create = OrganizationCreate.Field()
    organization_invite_create = OrganizationInviteCreate.Field()
    organization_join = OrganizationJoin.Field()
