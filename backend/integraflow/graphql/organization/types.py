import graphene

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.connection import (
    CountableConnection,
    create_connection_slice,
    filter_connection_queryset
)
from integraflow.graphql.core.doc_category import (
    DOC_CATEGORY_ORGANIZATIONS,
    DOC_CATEGORY_PROJECTS
)
from integraflow.graphql.core.enums import RoleLevel
from integraflow.graphql.core.fields import (
    FilterConnectionField,
    JSONString,
    PermissionsField
)
from integraflow.graphql.core.types.base import BaseObjectType
from integraflow.graphql.core.types.model import ModelObjectType
from integraflow.graphql.project.types import ProjectCountableConnection
from integraflow.organization import models
from integraflow.permission.auth_filters import AuthorizationFilters

from integraflow.graphql.project.dataloaders import (
    ProjectsByOrganizationIdLoader
)
from .dataloaders import MembersByOrganizationIdLoader


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
        doc_category = DOC_CATEGORY_ORGANIZATIONS

    @staticmethod
    def resolve_member_count(root: models.Organization, info: ResolveInfo):
        return root.members.count()


class OrganizationMember(ModelObjectType):
    id = graphene.GlobalID(required=True, description="The ID of the member.")
    email = graphene.String(
        required=True,
        description="The email address of the member."
    )
    first_name = graphene.String(
        required=True, description="The given name of the member."
    )
    last_name = graphene.String(
        required=True, description="The family name of the member."
    )
    role = graphene.Field(
        RoleLevel,
        description=(
            "The member role"
        ),
        required=True
    )
    created_at = graphene.DateTime(
        required=True,
        description="The time at which the member was created."
    )
    updated_at = graphene.DateTime(
        required=True,
        description="The last time at which the member was updated."
    )

    class Meta:
        description = "Represents an organization member."
        model = models.OrganizationMembership
        interfaces = [graphene.relay.Node]
        doc_category = DOC_CATEGORY_ORGANIZATIONS

    @staticmethod
    def resolve_email(
        root: models.OrganizationMembership,
        info: ResolveInfo
    ):
        return root.user.email

    @staticmethod
    def resolve_first_name(
        root: models.OrganizationMembership,
        info: ResolveInfo
    ):
        return root.user.first_name

    @staticmethod
    def resolve_last_name(
        root: models.OrganizationMembership,
        info: ResolveInfo
    ):
        return root.user.last_name

    @staticmethod
    def resolve_role(
        root: models.OrganizationMembership,
        info: ResolveInfo
    ):
        return root.level

    @staticmethod
    def resolve_created_at(
        root: models.OrganizationMembership,
        info: ResolveInfo
    ):
        return root.joined_at


class Organization(AuthOrganization):
    members = FilterConnectionField(
        'integraflow.graphql.organization.types.OrganizationMemberCountableConnection',
        description="Users associated with the organization.",
        permissions=[AuthorizationFilters.ORGANIZATION_MEMBER_ACCESS],
        doc_category=DOC_CATEGORY_ORGANIZATIONS,
    )

    projects = FilterConnectionField(
        ProjectCountableConnection,
        description="Projects associated with the organization.",
        permissions=[AuthorizationFilters.ORGANIZATION_MEMBER_ACCESS],
        doc_category=DOC_CATEGORY_PROJECTS,
    )

    invites = FilterConnectionField(
        'integraflow.graphql.organization.types.OrganizationInviteCountableConnection',
        description="Invites associated with the organization.",
        permissions=[AuthorizationFilters.ORGANIZATION_MEMBER_ACCESS],
        doc_category=DOC_CATEGORY_ORGANIZATIONS,
    )

    billing_usage = FilterConnectionField(
        JSONString,
        description="Billing usage of the organization.",
        permissions=[AuthorizationFilters.ORGANIZATION_MEMBER_ACCESS],
        doc_category=DOC_CATEGORY_ORGANIZATIONS,
    )

    class Meta:
        description = "Represents an organization."
        model = models.Organization
        interfaces = [graphene.relay.Node]
        doc_category = DOC_CATEGORY_ORGANIZATIONS

    @staticmethod
    def resolve_members(
        _root: models.Organization,
        info: ResolveInfo,
        **kwargs
    ):
        def _resolve_members(members):
            qs = filter_connection_queryset(members, kwargs)
            return create_connection_slice(
                qs,
                info,
                kwargs,
                OrganizationMemberCountableConnection
            )

        return MembersByOrganizationIdLoader(info.context).load(
            _root.id
        ).then(_resolve_members)

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

        return ProjectsByOrganizationIdLoader(info.context).load(
            _root.id
        ).then(_resolve_projects)

    @staticmethod
    def resolve_invites(
        _root: models.Organization,
        info: ResolveInfo,
        **kwargs
    ):
        qs = filter_connection_queryset(_root.invites, kwargs)
        return create_connection_slice(
            qs,
            info,
            kwargs,
            OrganizationInviteCountableConnection
        )

    @staticmethod
    def resolve_billing_usage(
        _root: models.Organization,
        info: ResolveInfo,
        **kwargs
    ):
        return _root.usage_metadata


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
        doc_category = DOC_CATEGORY_ORGANIZATIONS

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
        doc_category = DOC_CATEGORY_ORGANIZATIONS

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


class OrganizationInviteLink(BaseObjectType):
    invite_link = PermissionsField(
        graphene.String,
        required=True,
        description="The link of the organization the invite is for.",
        permissions=[
            AuthorizationFilters.ORGANIZATION_MEMBER_ACCESS,
        ],
    )

    class Meta:
        description = "The organization invite link."
        doc_category = DOC_CATEGORY_ORGANIZATIONS

    @staticmethod
    def resolve_invite_link(root, info: ResolveInfo):
        return f"/{root.slug}/join/{root.invite_token}"


class OrganizationInviteLinkDetails(ModelObjectType):
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
        model = models.Organization
        interfaces = [graphene.relay.Node]
        doc_category = DOC_CATEGORY_ORGANIZATIONS

    @staticmethod
    def resolve_organization_id(
        _root: models.Organization,
        info: ResolveInfo
    ):
        return _root.id

    @staticmethod
    def resolve_organization_name(
        _root: models.Organization,
        info: ResolveInfo
    ):
        return _root.name

    @staticmethod
    def resolve_organization_logo(
        _root: models.Organization,
        info: ResolveInfo
    ):
        return _root.logo


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
        doc_category = DOC_CATEGORY_ORGANIZATIONS

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


class OrganizationMemberCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_ORGANIZATIONS
        node = OrganizationMember


class OrganizationInviteCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_ORGANIZATIONS
        node = OrganizationInvite
