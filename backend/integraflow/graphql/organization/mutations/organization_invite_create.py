import graphene

from django.core.exceptions import ValidationError
from django.utils import timezone

from integraflow.core.exceptions import PermissionDenied
from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_ORGANIZATIONS
from integraflow.graphql.core.enums import RoleLevel
from integraflow.graphql.core.types.base import BaseInputObjectType
from integraflow.graphql.core.types.common import OrganizationError
from integraflow.graphql.core.mutations import ModelMutation
from integraflow.graphql.core.scalars import UUID
from integraflow.graphql.organization.types import OrganizationInvite
from integraflow.messaging.tasks import send_invite
from integraflow.organization import models
from integraflow.organization.error_codes import OrganizationErrorCode
from integraflow.permission.auth_filters import AuthorizationFilters


class OrganizationInviteCreateInput(BaseInputObjectType):
    id = UUID(
        description="The identifier in UUID v4 format. If none is provided, "
        "the backend will generate one."
    )
    email = graphene.String(
        description="The email of the invitee.",
        required=True
    )
    message = graphene.String(
        description="The message to send to the invitee.",
        required=False
    )
    role = graphene.Field(
        RoleLevel,
        default_value=models.OrganizationMembership.Level.MEMBER,
        description="What member role the invite should grant.",
    )

    class Meta:
        doc_category = DOC_CATEGORY_ORGANIZATIONS


class OrganizationInviteCreate(ModelMutation):
    """Mutation that creates a new organization invite."""

    class Arguments:
        input = OrganizationInviteCreateInput(
            description=(
                "The organization invite object to create."
            ),
            required=True
        )

    class Meta:
        description = "Creates a new organization invite."
        permissions = (AuthorizationFilters.ORGANIZATION_MEMBER_ACCESS,)
        model = models.OrganizationInvite
        object_type = OrganizationInvite
        error_type_class = OrganizationError
        error_type_field = "organization_errors"
        doc_category = DOC_CATEGORY_ORGANIZATIONS

    @classmethod
    def clean_input(cls, info: ResolveInfo, instance, data, **kwargs):
        user = info.context.user
        if user is None or user.organization is None:
            raise PermissionDenied()

        if models.OrganizationMembership.objects.filter(
            organization_id=user.organization.pk,
            user__email=data.get("email"),
        ).exists():
            raise ValidationError(
                {
                    "email": ValidationError(
                        (
                            "A user with this email address already belongs to"
                            " the organization."
                        ),
                        code=OrganizationErrorCode.ALREADY_EXISTS.value,
                    )
                }
            )

        cleaned_input = super().clean_input(info, instance, data, **kwargs)

        email = cleaned_input.get("email")
        if email:
            cleaned_input["target_email"] = cleaned_input.get("email")

        role = cleaned_input.get("role")
        if role:
            cleaned_input["level"] = cleaned_input.get("role")

        current_organization = user.organization

        cleaned_input["organization"] = current_organization
        cleaned_input["created_by"] = user

        return cleaned_input

    @classmethod
    def save(
        cls,
        info: ResolveInfo,
        instance: models.OrganizationInvite,
        cleaned_input
    ):
        instance.emailing_attempt_made = True
        send_invite.delay(invite_id=instance.id)
        instance.save()

    @classmethod
    def perform_mutation(cls, _root, info: ResolveInfo, /, **data):
        user = info.context.user
        if user is None or user.organization is None:
            raise PermissionDenied()

        input = data["input"]

        try:
            instance = models.OrganizationInvite.objects.filter(
                organization_id=user.organization.pk,
                target_email=input.get("email"),
            ).get()

            if instance.is_expired():
                instance.created_at = timezone.now()
                cls.save(info, instance, cleaned_input=input)
                return cls.success_response(instance)

            raise ValidationError(
                    {
                        "email": ValidationError(
                            (
                                "A user with this email address has already "
                                "been invited to the organization."
                            ),
                            code=OrganizationErrorCode.ALREADY_EXISTS.value,
                        )
                    }
                )
        except models.OrganizationInvite.DoesNotExist:
            return super().perform_mutation(_root, info, **data)
