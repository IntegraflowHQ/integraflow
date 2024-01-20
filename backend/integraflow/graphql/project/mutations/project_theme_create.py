import graphene

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_PROJECTS
from integraflow.graphql.core.fields import JSONString
from integraflow.graphql.core.mutations import ModelMutation
from integraflow.graphql.core.scalars import UUID
from integraflow.graphql.core.types.base import BaseInputObjectType
from integraflow.graphql.core.types.common import ProjectError
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.project import models

from ..types import ProjectTheme


class ProjectThemeInput(BaseInputObjectType):
    name = graphene.String(
        description="The name of the theme."
    )
    color_scheme = JSONString(
        description="The color scheme of the theme."
    )

    class Meta:
        doc_category = DOC_CATEGORY_PROJECTS


class ProjectThemeCreateInput(ProjectThemeInput):
    id = UUID(
        description="The id of the theme."
    )
    name = graphene.String(
        required=True,
        description="The name of the theme."
    )

    class Meta:
        doc_category = DOC_CATEGORY_PROJECTS


class ProjectThemeCreate(ModelMutation):
    class Arguments:
        input = ProjectThemeCreateInput(
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

    @classmethod
    def get_type_for_model(cls):
        return ProjectTheme

    @classmethod
    def clean_input(cls, info: ResolveInfo, instance, data, **kwargs):
        cleaned_input = super().clean_input(info, instance, data, **kwargs)

        if info.context.user:
            cleaned_input["project"] = info.context.user.project
            cleaned_input["created_by"] = info.context.user

        return cleaned_input
