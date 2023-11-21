import graphene

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.connection import CountableConnection
from integraflow.graphql.core.doc_category import DOC_CATEGORY_PROJECTS
from integraflow.graphql.core.fields import JSONString, PermissionsField
from integraflow.graphql.core.types.model import ModelObjectType
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
    organization = PermissionsField(
        "integraflow.graphql.organization.types.AuthOrganization",
        required=True,
        description="Organization the project belongs to."
    )

    class Meta:
        description = "Represents a project."
        model = models.Project
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_organization(root: models.Project, info: ResolveInfo):
        return root.organization


class ProjectCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_PROJECTS
        node = Project
