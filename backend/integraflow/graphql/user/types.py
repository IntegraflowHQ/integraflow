import graphene
from django.contrib.auth import get_user_model
from graphene import relay

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.connection import (
    CountableConnection,
    create_connection_slice,
    filter_connection_queryset,
)
from integraflow.graphql.core.doc_category import (
    DOC_CATEGORY_ORGANIZATIONS,
    DOC_CATEGORY_PROJECTS,
    DOC_CATEGORY_USERS,
)
from integraflow.graphql.core.federation import federated_entity
from integraflow.graphql.core.fields import (
    FilterConnectionField,
    PermissionsField
)
from integraflow.graphql.core.types.model import ModelObjectType
from integraflow.graphql.organization.types import (
    AuthOrganization,
    OrganizationCountableConnection,
)
from integraflow.graphql.project.sorters import ProjectSortingInput
from integraflow.graphql.project.types import (
    Project,
    ProjectCountableConnection
)
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.user import models


@federated_entity("id")
@federated_entity("email")
class AuthUser(ModelObjectType[models.User]):
    id = graphene.GlobalID(required=True, description="The ID of the user.")
    email = graphene.String(
        required=True,
        description="The email address of the user."
    )
    first_name = graphene.String(
        required=True, description="The given name of the user."
    )
    last_name = graphene.String(
        required=True, description="The family name of the user."
    )
    is_staff = graphene.Boolean(
        required=True, description="Determine if the user is a staff admin."
    )
    is_active = graphene.Boolean(
        required=True, description="Determine if the user is active."
    )
    is_onboarded = graphene.Boolean(
        required=True,
        description="Determine if the user has finished onboarding.",
    )
    organization = PermissionsField(
        AuthOrganization,
        required=False,
        description="The current organization of the user.",
        permissions=[
            AuthorizationFilters.AUTHENTICATED_USER,
        ],
    )
    project = PermissionsField(
        Project,
        required=False,
        description="The current project of the user.",
        permissions=[
            AuthorizationFilters.AUTHENTICATED_USER,
        ],
    )

    class Meta:
        description = "Represents an authenticated user data."
        interfaces = [relay.Node]
        model = get_user_model()
        doc_category = DOC_CATEGORY_USERS

    @staticmethod
    def resolve_organization(root: models.User, info: ResolveInfo):
        return root.organization

    @staticmethod
    def resolve_project(root: models.User, info: ResolveInfo):
        return root.project


@federated_entity("id")
@federated_entity("email")
class User(AuthUser):
    organizations = FilterConnectionField(
        OrganizationCountableConnection,
        description="Organizations the user is part of.",
        permissions=[AuthorizationFilters.AUTHENTICATED_USER],
        doc_category=DOC_CATEGORY_ORGANIZATIONS,
    )

    projects = FilterConnectionField(
        ProjectCountableConnection,
        sort_by=ProjectSortingInput(
            description="By which field should the pagination order by."
        ),
        description="Projects the user has access to.",
        permissions=[AuthorizationFilters.AUTHENTICATED_USER],
        doc_category=DOC_CATEGORY_PROJECTS,
    )

    class Meta:
        description = "Represents user data."
        interfaces = [relay.Node]
        model = get_user_model()
        doc_category = DOC_CATEGORY_USERS

    @staticmethod
    def resolve_organizations(
        _root: models.User,
        info: ResolveInfo,
        **kwargs
    ):
        return create_connection_slice(
            _root.organizations,  # type: ignore
            info,
            kwargs,
            OrganizationCountableConnection
        )

    @staticmethod
    def resolve_projects(
        _root: models.User,
        info: ResolveInfo,
        **kwargs
    ):
        qs = filter_connection_queryset(_root.projects, kwargs)
        return create_connection_slice(
            qs,
            info,
            kwargs,
            ProjectCountableConnection
        )


class UserCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_USERS
        node = User
