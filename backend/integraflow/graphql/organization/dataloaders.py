from collections import defaultdict

from integraflow.graphql.core.dataloaders import DataLoader
from integraflow.organization.models import (
    Organization,
    OrganizationInvite,
    OrganizationMembership
)


class OrganizationByIdLoader(DataLoader):
    context_key = "organization_by_id"

    def batch_load(self, keys):
        organizations = Organization.objects.using(
            self.database_connection_name
        ).in_bulk(keys)
        return [organizations.get(organization_id) for organization_id in keys]


class MembersByOrganizationIdLoader(DataLoader):
    context_key = "members_by_organization_id"

    def batch_load(self, keys):
        members = OrganizationMembership.objects.using(
            self.database_connection_name
        ).filter(organization_id__in=keys)

        members_map = defaultdict(list)
        for member in members:
            members_map[member.organization_id].append(member)

        return [
            members_map.get(organization_id, []) for organization_id in keys
        ]


class InvitesByOrganizationIdLoader(DataLoader):
    context_key = "invites_by_organization_id"

    def batch_load(self, keys):
        invites = OrganizationInvite.objects.using(
            self.database_connection_name
        ).filter(
            organization_id__in=keys
        )

        invites_map = defaultdict(list)
        for invite in invites:
            invites_map[invite.organization_id].append(invite)

        return [invites_map.get(organization_id) for organization_id in keys]
