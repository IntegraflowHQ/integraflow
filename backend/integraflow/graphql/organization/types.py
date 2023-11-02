import graphene

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.connection import (
    CountableConnection,
    create_connection_slice,
    filter_connection_queryset
)
from integraflow.graphql.core.doc_category import (
    DOC_CATEGORY_ORGANIZATIONS,
    DOC_CATEGORY_PROJECTS,
    DOC_CATEGORY_USERS
)
from integraflow.graphql.core.fields import (
    FilterConnectionField,
    PermissionsField
)
from integraflow.graphql.core.types.model import ModelObjectType
from integraflow.graphql.project.types import ProjectCountableConnection
from integraflow.graphql.user.sorters import UserSortingInput
from integraflow.organization import models
from integraflow.permission.auth_filters import AuthorizationFilters

from integraflow.graphql.project.dataloaders import (
    ProjectByOrganizationIdLoader
)


class AuthOrganization(ModelObjectType):
    id = graphene.GlobalID(
        required=True,
        description="The ID of the organization."
    )
    slug = graphene.String(
        required=True,
        description="Slug of the organization.",
    )

    name = PermissionsField(
        graphene.String,
        description="Name of the organization.",
        required=True,
        permissions=[
            AuthorizationFilters.AUTHENTICATED_USER,
        ],
    )
    member_count = PermissionsField(
        graphene.Int,
        description="Member count",
        required=True,
        permissions=[
            AuthorizationFilters.AUTHENTICATED_USER,
        ],
    )

    class Meta:
        description = "Represents an organization."
        model = models.Organization
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_member_count(root: models.Organization, info: ResolveInfo):
        return root.members.count()


class Organization(AuthOrganization):
    members = FilterConnectionField(
        'integraflow.graphql.user.types.UserCountableConnection',
        order_by=UserSortingInput(
            description="By which field should the pagination order by."
        ),
        description="Users associated with the organization.",
        permissions=[AuthorizationFilters.AUTHENTICATED_USER],
        doc_category=DOC_CATEGORY_USERS,
    )

    projects = FilterConnectionField(
        ProjectCountableConnection,
        order_by=UserSortingInput(
            description="By which field should the pagination order by."
        ),
        description="Projects associated with the organization.",
        permissions=[AuthorizationFilters.AUTHENTICATED_USER],
        doc_category=DOC_CATEGORY_PROJECTS,
    )

    class Meta:
        description = "Represents an organization."
        model = models.Organization
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_members(
        _root: models.Organization,
        info: ResolveInfo,
        **kwargs
    ):
        from integraflow.graphql.user.types import UserCountableConnection

        qs = filter_connection_queryset(_root.members, kwargs)
        return create_connection_slice(
            qs,
            info,
            kwargs,
            UserCountableConnection
        )

    @staticmethod
    def resolve_projects(
        _root: models.Organization,
        info: ResolveInfo,
        **kwargs
    ):
        def _resolve_projects(projects):
            qs = filter_connection_queryset(projects, kwargs)
            return create_connection_slice(
                qs,
                info,
                kwargs,
                ProjectCountableConnection
            )

        return ProjectByOrganizationIdLoader(info.context).load(
            _root.id
        ).then(_resolve_projects)


class OrganizationCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_ORGANIZATIONS
        node = Organization
