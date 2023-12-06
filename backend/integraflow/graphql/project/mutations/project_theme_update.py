import graphene

from integraflow.graphql.core.doc_category import DOC_CATEGORY_PROJECTS
from integraflow.graphql.core.mutations import ModelMutation
from integraflow.graphql.core.types.common import ProjectError
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.project import models

from .project_theme_create import ProjectThemeInput
from ..types import ProjectTheme


class ProjectThemeUpdateInput(ProjectThemeInput):
    class Meta:
        doc_category = DOC_CATEGORY_PROJECTS


class ProjectThemeUpdate(ModelMutation):
    class Arguments:
        id = graphene.ID(
            required=True,
            description="ID of a theme to update."
        )
        input = ProjectThemeUpdateInput(
            required=True,
            description="The theme object to create."
        )

    class Meta:
        description = "Creates a new theme"
        model = models.ProjectTheme
        object_type = ProjectTheme
        error_type_class = ProjectError
        error_type_field = "project_errors"
        doc_category = DOC_CATEGORY_PROJECTS
        permissions = (AuthorizationFilters.PROJECT_MEMBER_ACCESS,)
        auto_verify_project = True

    @classmethod
    def get_type_for_model(cls):
        return ProjectTheme
