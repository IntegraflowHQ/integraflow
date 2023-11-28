from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.context import get_database_connection_name
from integraflow.organization.models import Organization, OrganizationInvite
from integraflow.organization.utils import get_invite_details


def resolve_organization_invite_details(info: ResolveInfo, invite_link: str):
    details = get_invite_details(invite_link)
    if len(details) == 1:
        return (
            OrganizationInvite.objects.using(
                get_database_connection_name(info.context)
            ).filter(id=details[0]).first()
        )

    if len(details) == 2:
        return (
            Organization.objects.using(
                get_database_connection_name(info.context)
            ).filter(
                slug=details[0],
                invite_token=details[1]
            ).first()
        )
