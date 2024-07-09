import graphene

from integraflow.graphql.core.connection import create_connection_slice
from integraflow.graphql.core.doc_category import DOC_CATEGORY_PROJECTS
from integraflow.graphql.core.fields import FilterConnectionField
from integraflow.graphql.project.mutations import (
    ProjectCreate,
    ProjectThemeCreate,
    ProjectThemeDelete,
    ProjectThemeUpdate,
    ProjectTokenReset,
    ProjectUpdate
)
from integraflow.permission.auth_filters import AuthorizationFilters

from .resolvers import resolve_themes
from .types import ProjectThemeCountableConnection


class ProjectQueries(graphene.ObjectType):
    themes = FilterConnectionField(
        ProjectThemeCountableConnection,
        description="List of the project's themes.",
        permissions=[AuthorizationFilters.PROJECT_MEMBER_ACCESS],
        doc_category=DOC_CATEGORY_PROJECTS,
    )

    @staticmethod
    def resolve_themes(_root, info, **kwargs):
        qs = resolve_themes(info)
        return create_connection_slice(
            qs,
            info,
            kwargs,
            ProjectThemeCountableConnection
        )


class ProjectMutations(graphene.ObjectType):
    # Base mutations
    project_create = ProjectCreate.Field()
    project_theme_create = ProjectThemeCreate.Field()
    project_theme_delete = ProjectThemeDelete.Field()
    project_theme_update = ProjectThemeUpdate.Field()
    project_token_reset = ProjectTokenReset.Field()
    project_update = ProjectUpdate.Field()
