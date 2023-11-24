import pytz
from typing import (
    TYPE_CHECKING,
    Any,
    Dict,
    Optional,
    Tuple,
)

from django.conf import settings
from django.db import models, transaction
from django.db.models.query import QuerySet
from django.dispatch import receiver
from django.utils import timezone
from django.core.exceptions import ValidationError, PermissionDenied

from integraflow.core.utils import (
    create_with_slug,
    MAX_SLUG_LENGTH,
    sane_repr,
    absolute_uri
)
from integraflow.core.models import (
    LowercaseSlugField,
    UUIDModel
)
from integraflow.messaging.utils import is_email_available

if TYPE_CHECKING:
    from integraflow.project.models import Project
    from integraflow.user.models import User


TIMEZONES = [(tz, tz) for tz in pytz.common_timezones]

INVITE_DAYS_VALIDITY = settings.INVITE_DAYS_VALIDITY


class OrganizationManager(models.Manager):
    def create(self, *args: Any, **kwargs: Any):
        return create_with_slug(super().create, *args, **kwargs)

    def bootstrap(
        self,
        user: Optional["User"],
        *,
        project_fields: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> Tuple["Organization", Optional["User"], "Project"]:
        """Instead of doing the legwork of creating an organization yourself,
        delegate the details with bootstrap.
        """
        from integraflow.project.models import Project

        with transaction.atomic():
            organization = Organization.objects.create(**kwargs)
            project = Project.objects.create(
                organization=organization,
                **(project_fields or {})
            )

            if user is not None:
                OrganizationMembership.objects.create(
                    organization=organization,
                    user=user,
                    level=OrganizationMembership.Level.OWNER
                )

                user.current_organization = organization
                user.organization = (
                    user.current_organization  # Update cached property
                )
                user.current_project = project
                user.project = user.current_project  # Update cached property
                user.save()

        return organization, user, project


class Organization(UUIDModel):
    members: models.ManyToManyField = models.ManyToManyField(
        "user.User",
        through="organization.OrganizationMembership",
        related_name="organizations",
        related_query_name="organization",
    )
    name: models.CharField = models.CharField(max_length=64)
    slug: models.SlugField = LowercaseSlugField(
        unique=True,
        max_length=MAX_SLUG_LENGTH
    )

    logo: models.URLField = models.URLField(
        blank=True,
        null=True,
        max_length=800
    )

    timezone: models.CharField = models.CharField(
        max_length=240,
        choices=TIMEZONES,
        default="UTC"
    )

    is_member_join_email_enabled: models.BooleanField = models.BooleanField(
        default=True
    )

    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    objects: OrganizationManager = OrganizationManager()

    def __str__(self):
        return self.name

    __repr__ = sane_repr("name")  # type: ignore

    @property
    def active_invites(self) -> QuerySet:
        return self.invites.filter(
            created_at__gte=timezone.now() - timezone.timedelta(
                days=INVITE_DAYS_VALIDITY
            )
        )

    def get_analytics_metadata(self):
        return {
            "member_count": self.members.count(),
            "project_count": self.projects.count(),  # type: ignore
            "name": self.name,
        }

    class Meta:
        db_table = "organizations"


class OrganizationMembership(UUIDModel):
    class Level(models.IntegerChoices):
        """
        Keep in sync with ProjectMembership.Level (only difference being
        projects not having an Owner).
        """

        MEMBER = 1, "member"
        ADMIN = 8, "administrator"
        OWNER = 15, "owner"

    organization: models.ForeignKey = models.ForeignKey(
        "organization.Organization",
        on_delete=models.CASCADE,
        related_name="memberships",
        related_query_name="membership"
    )
    user: models.ForeignKey = models.ForeignKey(
        "user.User",
        on_delete=models.CASCADE,
        related_name="organization_memberships",
        related_query_name="organization_membership",
    )
    level: models.PositiveSmallIntegerField = models.PositiveSmallIntegerField(
        default=Level.MEMBER, choices=Level.choices
    )
    joined_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "organization_memberships"
        constraints = [
            models.UniqueConstraint(
                fields=["organization_id", "user_id"],
                name="unique_organization_membership"
            ),
            models.UniqueConstraint(
                fields=["organization_id"],
                condition=models.Q(level=15),
                name="only_one_owner_per_organization"
            ),
        ]

    def __str__(self):
        return str(self.Level(self.level))

    def validate_update(
        self,
        membership_being_updated: "OrganizationMembership",
        new_level: Optional[Level] = None
    ) -> None:
        if new_level is not None:
            if membership_being_updated.id == self.id:
                raise PermissionDenied(
                    "You can't change your own access level."
                )
            if new_level == OrganizationMembership.Level.OWNER:
                if self.level != OrganizationMembership.Level.OWNER:
                    raise PermissionDenied(
                        "You can only pass on organization ownership if you're"
                        " its owner."
                    )
                self.level = OrganizationMembership.Level.ADMIN
                self.save()
            elif new_level > self.level:
                raise PermissionDenied(
                    "You can only change access level of others to lower or"
                    " equal to your current one."
                )
        if membership_being_updated.id != self.id:
            if (
                membership_being_updated.organization_id !=
                self.organization_id
            ):
                raise PermissionDenied(
                    "You both need to belong to the same organization."
                )
            if self.level < OrganizationMembership.Level.ADMIN:
                raise PermissionDenied(
                    "You can only edit others if you are an admin."
                )
            if membership_being_updated.level > self.level:
                raise PermissionDenied(
                    "You can only edit others with level lower or equal to"
                    " you."
                )

    __repr__ = sane_repr("organization", "user", "level")  # type: ignore


class OrganizationInviteManager(models.Manager):
    def accept_invite(self, user: "User", invite_id: str):
        try:
            invite: OrganizationInvite = (
                OrganizationInvite.objects.select_related("organization").get(
                    id=invite_id
                )
            )
        except OrganizationInvite.DoesNotExist:
            raise ValidationError("The provided invite ID is not valid.")

        try:
            invite.use(user)
        except ValueError as e:
            raise ValidationError(str(e))


class OrganizationInvite(UUIDModel):
    class Level(models.IntegerChoices):
        MEMBER = 1, "member"
        ADMIN = 8, "administrator"

    organization: models.ForeignKey = models.ForeignKey(
        "organization.Organization",
        on_delete=models.CASCADE,
        related_name="invites",
        related_query_name="invite"
    )
    target_email: models.EmailField = models.EmailField(
        null=True,
        db_index=True
    )
    first_name: models.CharField = models.CharField(
        max_length=30,
        blank=True,
        default=""
    )
    level: models.PositiveSmallIntegerField = models.PositiveSmallIntegerField(
        default=Level.MEMBER,
        choices=Level.choices
    )
    created_by: models.ForeignKey = models.ForeignKey(
        "user.User",
        on_delete=models.SET_NULL,
        related_name="organization_invites",
        related_query_name="organization_invite",
        null=True,
    )
    emailing_attempt_made: models.BooleanField = models.BooleanField(
        default=False
    )
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)
    message: models.TextField = models.TextField(blank=True, null=True)

    objects: OrganizationInviteManager = OrganizationInviteManager()

    def validate(
        self,
        *,
        user: "User"
    ) -> bool:
        if user.email != self.target_email:
            return False

        if self.is_expired():
            return False

        if OrganizationMembership.objects.filter(
            organization=self.organization,
            user__email=self.target_email
        ).exists():
            return False

        return True

    def use(self, user: "User") -> None:
        validated = self.validate(user=user)
        if not validated:
            return

        user.join(
            organization=self.organization,
            level=self.level
        )
        if (
            is_email_available(with_absolute_urls=True) and
            self.organization.is_member_join_email_enabled
        ):
            from integraflow.messaging.tasks import send_member_join

            send_member_join.apply_async(kwargs={
                "invitee_uuid": user.uuid,
                "organization_id": self.organization_id  # type: ignore
            })
        self.delete()

    def is_expired(self) -> bool:
        """Check if invite is older than INVITE_DAYS_VALIDITY days."""
        return (
            self.created_at < (
                timezone.now() - timezone.timedelta(INVITE_DAYS_VALIDITY)
            )
        )

    class Meta:
        db_table = "organization_invites"

    def __str__(self):
        return absolute_uri(f"/signup/{self.id}")

    __repr__ = sane_repr(
        "organization",
        "target_email",
        "created_by"
    )  # type: ignore


@receiver(models.signals.pre_delete, sender=OrganizationMembership)
def ensure_organization_membership_consistency(
    sender,
    instance: OrganizationMembership,
    **kwargs
):
    save_user = False
    if instance.user.current_organization == instance.organization:
        # reset current_organization if it's the removed organization
        instance.user.current_organization = None
        save_user = True
    if (
        instance.user.current_project is not None and
        instance.user.current_project.organization == instance.organization
    ):
        # reset current_project if it belongs to the removed organization
        instance.user.current_project = None
        save_user = True
    if save_user:
        instance.user.save()
