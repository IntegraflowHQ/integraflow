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
from integraflow.graphql.core.enums import RoleLevel
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
        permissions=[AuthorizationFilters.AUTHENTICATED_USER],
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
        permissions=[AuthorizationFilters.ORGANIZATION_MEMBER_ACCESS],
        doc_category=DOC_CATEGORY_USERS,
    )

    projects = FilterConnectionField(
        ProjectCountableConnection,
        order_by=UserSortingInput(
            description="By which field should the pagination order by."
        ),
        description="Projects associated with the organization.",
        permissions=[AuthorizationFilters.ORGANIZATION_MEMBER_ACCESS],
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


class BaseOrganizationInvite(ModelObjectType):
    id = graphene.GlobalID(
        required=True,
        description="The unique identifier of the invite."
    )
    email = graphene.String(
        required=True,
        description="The invitees email address.",
    )
    first_name = graphene.String(
        description="First name of the invite.",
        required=False
    )
    role = graphene.Field(
        RoleLevel,
        description=(
            "The user role that the invitee will receive upon accepting the "
            "invite."
        ),
        required=True
    )
    created_at = graphene.DateTime(
        required=True,
        description="The time at which the invite was created."
    )
    updated_at = graphene.DateTime(
        required=True,
        description="The last time at which the invite was updated."
    )
    expired = graphene.Boolean(
        required=True,
        description="If the invite has expired."
    )

    class Meta:
        description = "The organization invite that was created or updated."
        model = models.OrganizationInvite
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_email(_root: models.OrganizationInvite, info: ResolveInfo):
        return _root.target_email

    @staticmethod
    def resolve_role(_root: models.OrganizationInvite, info: ResolveInfo):
        return _root.level

    @staticmethod
    def resolve_expired(
        _root: models.OrganizationInvite,
        info: ResolveInfo
    ):
        return _root.is_expired()


class OrganizationInviteDetails(BaseOrganizationInvite):
    inviter = graphene.String(
        required=True,
        description="The name/email of the inviter.",
    )
    organization_id = graphene.GlobalID(
        required=True,
        description="The ID of the organization the invite is for.",
    )
    organization_name = graphene.String(
        required=True,
        description="The name of the organization the invite is for.",
    )
    organization_logo = graphene.String(
        required=False,
        description="The logo of the organization the invite is for.",
    )

    class Meta:
        description = "The organization invite that was created or updated."
        model = models.OrganizationInvite
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_inviter(_root: models.OrganizationInvite, info: ResolveInfo):
        if _root.created_by.first_name:
            return (
                f"{_root.created_by.first_name} {_root.created_by.last_name}"
            )
        return _root.created_by.email

    @staticmethod
    def resolve_organization_id(
        _root: models.OrganizationInvite,
        info: ResolveInfo
    ):
        return _root.organization.id

    @staticmethod
    def resolve_organization_name(
        _root: models.OrganizationInvite,
        info: ResolveInfo
    ):
        return _root.organization.name

    @staticmethod
    def resolve_organization_logo(
        _root: models.OrganizationInvite,
        info: ResolveInfo
    ):
        return _root.organization.logo


class OrganizationInvite(BaseOrganizationInvite):
    inviter = PermissionsField(
        "integraflow.graphql.user.types.User",
        required=True,
        description="The user who created the invitation.",
        permissions=[
            AuthorizationFilters.ORGANIZATION_MEMBER_ACCESS,
        ],
    )
    organization = PermissionsField(
        Organization,
        required=True,
        description="The current project of the user.",
        permissions=[
            AuthorizationFilters.ORGANIZATION_MEMBER_ACCESS,
        ],
    )

    class Meta:
        description = "The organization invite that was created or updated."
        model = models.OrganizationInvite
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_inviter(_root: models.OrganizationInvite, info: ResolveInfo):
        return _root.created_by

    @staticmethod
    def resolve_organization(
        _root: models.OrganizationInvite,
        info: ResolveInfo
    ):
        return _root.organization


class OrganizationCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_ORGANIZATIONS
        node = Organization
