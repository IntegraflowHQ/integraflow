from django.conf import settings
from django.utils import timezone

from .email import EmailMessage

from integraflow.celeryconf import app
from integraflow.core.utils import absolute_uri
from integraflow.organization.models import (
    INVITE_DAYS_VALIDITY,
    Organization,
    OrganizationInvite
)
from integraflow.user.models import User


@app.task(
    autoretry_for=(Exception,),
    max_retries=3,
    retry_backoff=True,
)
def send_magic_link(email: str, token: str) -> None:
    link = f"/auth/magic-sign-in/?email={email}&token={token}"

    message = EmailMessage(
        campaign_key=f"magic-link-{timezone.now().timestamp()}",
        subject="Login for Integraflow",
        template_name="magic_link",
        template_context={
            "magic_url": absolute_uri(link),
            "site_url": absolute_uri(),
            "code": token,
            "expires_in": settings.MAGIC_LINK_MINUTES_VALIDITY
        },
    )
    message.add_recipient(email)
    message.send()


@app.task(
    autoretry_for=(Exception,),
    max_retries=3,
    retry_backoff=True,
)
def send_invite(invite_id: str) -> None:
    campaign_key: str = f"invite_email_{invite_id}"
    invite: OrganizationInvite = OrganizationInvite.objects.select_related(
        "created_by",
        "organization"
    ).get(
        id=invite_id
    )

    if invite is None:
        return

    link = f"/invite/{invite.pk}/accept"
    message = EmailMessage(
        campaign_key=campaign_key,
        subject=(
            f"{invite.created_by.email or invite.created_by.first_name} "
            f"invited you to join {invite.organization.name} on Integraflow"
        ),
        template_name="invite",
        template_context={
            "invite": invite,
            "invite_url": absolute_uri(link),
            "site_url": absolute_uri(),
            "expiry_date": (
                timezone.now() + timezone.timedelta(days=INVITE_DAYS_VALIDITY)
            ).strftime("%b %d %Y"),
        },
        reply_to=(
            invite.created_by.email if invite.created_by and
            invite.created_by.email else ""
        ),
    )
    message.add_recipient(email=invite.target_email)
    message.send()


@app.task(
    autoretry_for=(Exception,),
    max_retries=3,
    retry_backoff=True,
)
def send_member_join(invitee_uuid: str, organization_id: str) -> None:
    invitee: User = User.objects.get(uuid=invitee_uuid)
    organization: Organization = Organization.objects.get(id=organization_id)
    campaign_key: str = (
        f"member_join_email_org_{organization_id}_user_{invitee_uuid}"
    )
    message = EmailMessage(
        campaign_key=campaign_key,
        subject=f"{invitee.first_name} joined you on Integraflow",
        template_name="member_join",
        template_context={
            "invitee": invitee,
            "organization": organization,
            "site_url": absolute_uri(),
        },
    )
    # Don't send this email to the new member themselves
    members_to_email = organization.members.exclude(email=invitee.email)
    if members_to_email:
        for user in members_to_email:
            message.add_recipient(email=user.email, name=user.first_name)
        message.send()
