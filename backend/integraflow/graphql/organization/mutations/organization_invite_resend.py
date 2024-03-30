import graphene

from django.utils import timezone

from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_ORGANIZATIONS
from integraflow.graphql.core.types.common import OrganizationError
from integraflow.graphql.core.mutations import ModelMutation
from integraflow.messaging.tasks import send_invite
from integraflow.organization import models
from integraflow.permission.auth_filters import AuthorizationFilters

from ..types import OrganizationInvite


class OrganizationInviteResend(ModelMutation):
    class Arguments:
        id = graphene.ID(
            required=True,
            description="ID of a invite to resend."
        )

    class Meta:
        description = "Resend an existing invite"
        model = models.OrganizationInvite
        object_type = OrganizationInvite
        error_type_class = OrganizationError
        error_type_field = "organization_errors"
        doc_category = DOC_CATEGORY_ORGANIZATIONS
        permissions = (AuthorizationFilters.ORGANIZATION_MEMBER_ACCESS,)
        auto_verify_organization = True

    @classmethod
    def get_type_for_model(cls):
        return OrganizationInvite

    @classmethod
    def save(
        cls,
        _info: ResolveInfo,
        instance: models.OrganizationInvite,
        _cleaned_input,
        /
    ):
        instance.created_at = timezone.now()
        instance.emailing_attempt_made = True
        instance.save()

        send_invite.delay(invite_id=instance.id)
