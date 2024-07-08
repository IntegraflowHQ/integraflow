import graphene

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_PROJECTS
from integraflow.graphql.core.mutations import BaseMutation
from integraflow.graphql.core.types.common import ProjectError
from integraflow.permission.auth_filters import AuthorizationFilters

from ..types import Project


class ProjectTokenReset(BaseMutation):
    """Mutation that updates the project token."""

    project = graphene.Field(
        Project,
        required=True,
        description=(
            "The project the token belongs to"
        )
    )

    class Meta:
        description = "Updates a project token."
        object_type = Project
        error_type_class = ProjectError
        error_type_field = "project_errors"
        doc_category = DOC_CATEGORY_PROJECTS
        permissions = (AuthorizationFilters.PROJECT_MEMBER_ACCESS,)

    @classmethod
    def perform_mutation(cls, _root, info: ResolveInfo):
        user = info.context.user
        if user and user.project:
            user.project.reset_api_token()

            return cls(project=user.project)
