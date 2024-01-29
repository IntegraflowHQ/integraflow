import graphene

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.connection import CountableConnection
from integraflow.graphql.core.doc_category import DOC_CATEGORY_PROJECTS
from integraflow.graphql.core.fields import JSONString, PermissionsField
from integraflow.graphql.core.types.model import ModelObjectType
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.project import models


class Project(ModelObjectType):
    id = graphene.GlobalID(
        required=True,
        description="The ID of the project."
    )
    name = graphene.String(
        required=True,
        description="Name of the project.",
    )
    slug = graphene.String(
        required=True,
        description="Slug of the project.",
    )
    access_control = graphene.Boolean(
        required=False,
        description="Whether the project is private or not.",
    )
    has_completed_onboarding_for = JSONString(
        required=False,
        description="The data required for the onboarding process"
    )
    timezone = graphene.String(
        required=True,
        description="The timezone of the project.",
    )
    organization = graphene.Field(
        "integraflow.graphql.organization.types.AuthOrganization",
        required=True,
        description="Organization the project belongs to."
    )

    class Meta:
        description = "Represents a project."
        doc_category = DOC_CATEGORY_PROJECTS
        model = models.Project
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_organization(root: models.Project, info: ResolveInfo):
        return root.organization


class BaseProjectTheme(ModelObjectType):
    id = graphene.GlobalID(
        required=True,
        description="The ID of the theme."
    )
    name = graphene.String(
        required=True,
        description="Name of the theme.",
    )
    color_scheme = JSONString(
        description="The settings of the theme."
    )
    settings = JSONString(
        description="The settings of the theme."
    )

    class Meta:
        description = "Represents a theme."
        doc_category = DOC_CATEGORY_PROJECTS
        model = models.ProjectTheme
        interfaces = [graphene.relay.Node]


class ProjectTheme(BaseProjectTheme):
    reference = graphene.ID(
        required=False,
        description="For internal purpose."
    )
    project = PermissionsField(
        Project,
        required=True,
        description="The project the theme belongs to.",
        permissions=[
            AuthorizationFilters.PROJECT_MEMBER_ACCESS,
        ],
    )
    creator = PermissionsField(
        "integraflow.graphql.user.types.User",
        required=True,
        description="The user who created the theme.",
        permissions=[
            AuthorizationFilters.PROJECT_MEMBER_ACCESS,
        ],
    )
    created_at = graphene.DateTime(
        required=True,
        description="The time at which the invite was created."
    )
    updated_at = graphene.DateTime(
        required=True,
        description="The last time at which the invite was updated."
    )

    class Meta:
        description = "Represents a theme."
        doc_category = DOC_CATEGORY_PROJECTS
        model = models.ProjectTheme
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_reference(root: models.ProjectTheme, info: ResolveInfo):
        return root.pk

    @staticmethod
    def resolve_project(root: models.ProjectTheme, info: ResolveInfo):
        return root.project

    @staticmethod
    def resolve_creator(root: models.ProjectTheme, info: ResolveInfo):
        return root.created_by


class ProjectCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_PROJECTS
        node = Project


class ProjectThemeCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_PROJECTS
        node = ProjectTheme
