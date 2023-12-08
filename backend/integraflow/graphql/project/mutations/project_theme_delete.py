import graphene

from integraflow.graphql.core.mutations import ModelDeleteMutation
from integraflow.graphql.core.types.common import ProjectError
from integraflow.graphql.project.types import ProjectTheme
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.project import models


class ProjectThemeDelete(ModelDeleteMutation):
    class Arguments:
        id = graphene.ID(required=True, description="ID of a theme to delete.")

    class Meta:
        description = "Deletes a theme."
        model = models.ProjectTheme
        object_type = ProjectTheme
        permissions = (AuthorizationFilters.PROJECT_ADMIN_ACCESS,)
        error_type_class = ProjectError
        error_type_field = "project_errors"
        auto_verify_project = True
