import graphene

from integraflow.graphql.organization.mutations import (
    OrganizationCreate,
    OrganizationInviteCreate
)


class OrganizationQueries(graphene.ObjectType):
    pass


class OrganizationMutations(graphene.ObjectType):
    # Base mutations
    organization_create = OrganizationCreate.Field()
    organization__invite_create = OrganizationInviteCreate.Field()
