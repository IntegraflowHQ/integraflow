from typing import cast

import graphene
from django.core.exceptions import ValidationError
from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_ORGANIZATIONS
from integraflow.graphql.core.mutations import BaseMutation
from integraflow.graphql.core.types.base import BaseInputObjectType
from integraflow.graphql.core.types.common import OrganizationError
from integraflow.graphql.user.types import AuthUser
from integraflow.organization import models
from integraflow.organization.error_codes import OrganizationErrorCode
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.user.models import User

from ..types import Organization


class OrganizationCreateInput(BaseInputObjectType):
    name = graphene.String(
        description="The name of the organization.",
        required=True
    )
    slug = graphene.String(
        description="The slug of the organization.",
        required=True
    )
    timezone = graphene.String(
        required=True,
        description="The timezone of the organization, passed in by client.",
    )

    class Meta:
        doc_category = DOC_CATEGORY_ORGANIZATIONS


class OnboardingCustomerSurvey(BaseInputObjectType):
    companyRole = graphene.String(
        description="Your role in your company",
        required=False
    )
    companySize = graphene.String(
        description="Size of your company",
        required=False
    )

    class Meta:
        doc_category = DOC_CATEGORY_ORGANIZATIONS


class OrganizationCreate(BaseMutation):
    class Arguments:
        input = OrganizationCreateInput(
            required=True,
            description="Organization details for the new organization."
        )
        survey = OnboardingCustomerSurvey(
            required=False,
            description="Onboarding survey."
        )

    organization = graphene.Field(
        Organization,
        description=(
            "An organization. Organizations are root-level objects that "
            "contain users and projects."
        )
    )
    user = graphene.Field(
        AuthUser,
        description=(
            "A user that has access to the the resources of an organization."
        )
    )

    class Meta:
        description = "Creates new organization."
        permissions = (AuthorizationFilters.AUTHENTICATED_USER,)
        error_type_class = OrganizationError
        error_type_field = "organization_errors"
        doc_category = DOC_CATEGORY_ORGANIZATIONS

    @classmethod
    def clean_slug(cls, slug):
        slugExists = models.Organization.objects.filter(slug=slug).exists()
        if slugExists:
            raise ValidationError(
                {
                    "slug": ValidationError(
                        "The organization URL is already reserved.",
                        code=OrganizationErrorCode.UNIQUE.value
                    )
                }
            )
        return slug

    @classmethod
    def perform_mutation(
        cls, _root, info: ResolveInfo, /, **data
    ):
        input = data["input"]
        # survey = data["survey"]
        input["slug"] = cls.clean_slug(input["slug"])

        project_fields = {}
        project_fields["timezone"] = input["timezone"]

        organization, user, _ = models.Organization.objects.bootstrap(
            cast(User, info.context.user),
            **input,
            project_fields=project_fields
        )

        return cls(organization=organization, user=user)
