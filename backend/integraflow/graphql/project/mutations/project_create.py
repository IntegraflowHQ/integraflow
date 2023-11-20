from django.utils.text import slugify
from typing import cast
import graphene

from integraflow.core.utils import (
    MAX_SLUG_LENGTH,
    generate_random_short_suffix
)
from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_PROJECTS
from integraflow.graphql.core.mutations import ModelMutation
from integraflow.graphql.core.types.base import BaseInputObjectType
from integraflow.graphql.core.types.common import ProjectError
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.project import models
from integraflow.user.models import User

from ..types import Project


class ProjectCreateInput(BaseInputObjectType):
    id = graphene.UUID(
        description="The identifier in UUID v4 format. If none is provided, "
        "the backend will generate one."
    )
    name = graphene.String(
        required=True,
        description="The name of the project."
    )
    timezone = graphene.String(
        description="The timezone of the project.",
    )
    private = graphene.Boolean(
        description="Whether the project is private or not."
    )

    class Meta:
        doc_category = DOC_CATEGORY_PROJECTS


class ProjectCreate(ModelMutation):
    """
    Mutation that creates a new project.
    The user who creates the project will automatically be added as a member
    to the newly created project.
    """

    class Arguments:
        input = ProjectCreateInput(
            description=(
                "The project object to create."
            ),
            required=True
        )

    class Meta:
        description = "Creates a new project"
        model = models.Project
        object_type = Project
        error_type_class = ProjectError
        error_type_field = "project_errors"
        doc_category = DOC_CATEGORY_PROJECTS

    @classmethod
    def get_type_for_model(cls):
        return Project

    @classmethod
    def clean_input(cls, info: ResolveInfo, instance, data, **kwargs):
        cleaned_input = super().clean_input(info, instance, data, **kwargs)

        name = cleaned_input.get("name")
        if name:
            cleaned_input["slug"] = (
                f"{slugify(name)[:MAX_SLUG_LENGTH - 7]}-"
                f"{generate_random_short_suffix(6).lower()}"
            )

        cleaned_input["access_control"] = cleaned_input.get("private")

        if info.context.user_permissions:
            current_organization = (
                info.context.user_permissions.current_organization
            )

            cleaned_input["organization"] = current_organization

        return cleaned_input

    @classmethod
    def check_permissions(cls, context, permissions=None, **data):
        permissions = [AuthorizationFilters.ORGANIZATION_MEMBER_ACCESS]

        input = data["data"]["input"]
        if input.get("private") is True:
            permissions.append(AuthorizationFilters.ORGANIZATION_ADMIN_ACCESS)

        return super().check_permissions(
            context,
            permissions,
            require_all_permissions=True,
            **data
        )

    @classmethod
    def post_save_action(
        cls, info: ResolveInfo, instance: models.Project, cleaned_input
    ):
        user = cast(User, info.context.user)
        user.current_project = instance
        user.project = user.current_project  # Update cached property
        user.save()
