from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.context import get_database_connection_name
from integraflow.organization.models import OrganizationInvite


def resolve_organization_invite_details(info: ResolveInfo, id):
    return (
        OrganizationInvite.objects.using(
            get_database_connection_name(info.context)
        ).filter(id=id).first()
    )
