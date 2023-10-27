import pytz
from typing import TYPE_CHECKING, Any, Optional

from django.core.validators import MinLengthValidator
from django.db import models

from integraflow.core.models import UUIDModel
from integraflow.core.utils import generate_random_token_project, sane_repr

if TYPE_CHECKING:
    from integraflow.organization.models import OrganizationMembership

TIMEZONES = [(tz, tz) for tz in pytz.common_timezones]


class ProjectManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset()

    def create_with_data(self, user: Any = None, **kwargs) -> "Project":
        return Project.objects.create(**kwargs)

    def create(self, *args, **kwargs) -> "Project":
        if (
            kwargs.get("organization") is None and
            kwargs.get("organization_id") is None
        ):
            raise ValueError(
                "Creating organization-less projects is prohibited"
            )
        return super().create(*args, **kwargs)

    def get_project_from_token(
        self,
        token: Optional[str]
    ) -> Optional["Project"]:
        if not token:
            return None
        try:
            return Project.objects.get(api_token=token)
        except Project.DoesNotExist:
            return None


class Project(UUIDModel):
    """Project"""
    organization: models.ForeignKey = models.ForeignKey(
        "organization.Organization",
        on_delete=models.CASCADE,
        related_name="projects",
        related_query_name="project"
    )
    api_token: models.CharField = models.CharField(
        max_length=200,
        unique=True,
        default=generate_random_token_project,
        validators=[MinLengthValidator(
            10,
            "Project's API token must be at least 10 characters long!"
        )],
    )
    name: models.CharField = models.CharField(
        max_length=200,
        default="Default Project",
        validators=[MinLengthValidator(1, "Project must have a name!")]
    )
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)
    completed_snippet_onboarding: models.BooleanField = models.BooleanField(
        default=False
    )
    has_completed_onboarding_for: models.JSONField = models.JSONField(
        null=True,
        blank=True
    )
    ingested_event: models.BooleanField = models.BooleanField(default=False)
    access_control: models.BooleanField = models.BooleanField(default=False)
    timezone: models.CharField = models.CharField(
        max_length=240,
        choices=TIMEZONES,
        default="UTC"
    )
    # Generic field for storing any project-specific context that is more
    # temporary in nature and thus likely doesn't deserve a dedicated column.
    # Can be used for things like settings and overrides during feature
    # releases.
    extra_settings: models.JSONField = models.JSONField(null=True, blank=True)

    objects: ProjectManager = ProjectManager()

    class Meta:
        db_table = "projects"

    def __str__(self):
        if self.name:
            return self.name
        return str(self.pk)

    __repr__ = sane_repr("uuid", "name", "api_token")  # type: ignore


# We call models that grant a user access to some grouping of users a
# "membership"
class ProjectMembership(UUIDModel):
    class Level(models.IntegerChoices):
        """Keep in sync with OrganizationMembership.Level
        (only difference being organizations having an Owner).
        """

        MEMBER = 1, "member"
        ADMIN = 8, "administrator"

    project: models.ForeignKey = models.ForeignKey(
        "project.Project",
        on_delete=models.CASCADE,
        related_name="project_memberships",
        related_query_name="project_membership",
    )
    parent_membership: models.ForeignKey = models.ForeignKey(
        "organization.OrganizationMembership",
        on_delete=models.CASCADE,
        related_name="parent_memberships",
        related_query_name="parent_membership",
    )
    level: models.PositiveSmallIntegerField = models.PositiveSmallIntegerField(
        default=Level.MEMBER,
        choices=Level.choices
    )
    joined_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "project_memberships"
        constraints = [
            models.UniqueConstraint(
                fields=["project", "parent_membership"],
                name="unique_project_membership"
            )
        ]

    def __str__(self):
        return str(self.Level(self.level))

    @property
    def effective_level(self) -> "OrganizationMembership.Level":
        """If organization level is higher than project level,then that takes
        precedence over explicit project level.
        """
        return max(self.level, self.parent_membership.level)

    __repr__ = sane_repr(
        "project",
        "parent_membership",
        "level"
    )  # type: ignore
