# Python imports
from functools import cached_property, partial
from typing import (
    Any,
    Callable,
    Dict,
    List,
    Tuple,
    Optional,
    Type,
)

# Django imports
from django.contrib import auth
from django.db import models, transaction
from django.db.models import Q
from django.contrib.auth.models import (
    AbstractUser,
    BaseUserManager
)
from django.utils.crypto import get_random_string
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

from integraflow.core.models import UUIDClassicModel
from integraflow.core.utils import sane_repr
from integraflow.messaging.utils import is_email_available
from integraflow.organization.models import (
    Organization,
    OrganizationMembership
)
from integraflow.project.models import Project


def _user_get_permissions(user, from_name):
    permissions = None
    name = "get_%s_permissions" % from_name
    for backend in auth.get_backends():
        if hasattr(backend, name):
            permissions = getattr(backend, name)(user)
    return permissions


class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    def get_queryset(self):
        return super().get_queryset()

    model: Type["User"]

    use_in_migrations = True

    def create_user(
        self,
        email: str,
        first_name: str = "",
        **extra_fields
    ) -> "User":
        """Create and save a User with the given email and password."""
        if email is None:
            raise ValueError("Email must be provided!")
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            first_name=first_name,
            **extra_fields
        )

        user.save()
        return user

    def bootstrap(
        self,
        organization_name: str,
        email: str,
        first_name: str = "",
        organization_fields: Optional[Dict[str, Any]] = None,
        project_fields: Optional[Dict[str, Any]] = None,
        create_project: Optional[
            Callable[
                ["Organization", "User"],
                "Project"]
            ] = None,
        is_staff: bool = False,
        **user_fields,
    ) -> Tuple["Organization", "Project", "User"]:
        """
        Instead of doing the legwork of creating a user from scratch,
        delegate the details with bootstrap.
        """
        with transaction.atomic():
            organization_fields = organization_fields or {}
            organization_fields.setdefault("name", organization_name)
            organization = Organization.objects.create(**organization_fields)
            user = self.create_user(
                email=email,
                first_name=first_name,
                is_staff=is_staff,
                **user_fields
            )

            if create_project:
                project = create_project(organization, user)
            else:
                project = Project.objects.create_with_data(
                    user=user,
                    organization=organization,
                    **(project_fields or {})
                )
            user.join(
                organization=organization,
                level=OrganizationMembership.Level.OWNER
            )
            return organization, project, user

    def create_and_join(
        self,
        organization: Organization,
        email: str,
        first_name: str = "",
        level: OrganizationMembership.Level = (
            OrganizationMembership.Level.MEMBER
        ),
        **extra_fields,
    ) -> "User":
        with transaction.atomic():
            user = self.create_user(
                email=email,
                first_name=first_name,
                **extra_fields
            )
            user.join(organization=organization, level=level)
            return user


class User(
    AbstractUser,
    UUIDClassicModel
):
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: List[str] = []

    current_organization: models.ForeignKey = models.ForeignKey(
        "organization.Organization",
        models.SET_NULL,
        null=True,
        related_name="current_organization"
    )
    current_project: models.ForeignKey = models.ForeignKey(
        "project.Project",
        models.SET_NULL,
        null=True,
        related_name="current_project"
    )
    email: models.EmailField = models.EmailField(
        _("email address"),
        unique=True
    )
    password: models.CharField = models.CharField(
        _('password'),
        blank=True,
        null=True,
        max_length=128
    )
    avatar: models.URLField = models.URLField(
        blank=True,
        null=True,
        max_length=800
    )
    jwt_token_key: models.CharField = models.CharField(
        max_length=12, default=partial(get_random_string, length=12)
    )
    token_updated_at: models.DateTimeField = models.DateTimeField(null=True)

    # Remove unused attributes from `AbstractUser`
    username = None  # type: ignore

    objects: UserManager = UserManager()

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        db_table = "users"
        ordering = ("-date_joined",)

    @property
    def is_superuser(self) -> bool:  # type: ignore
        return self.is_staff

    @cached_property
    def projects(self):
        """
        All projects the user has access to in any organization
        """
        projects = Project.objects.filter(organization__members=self)

        if Organization.objects.filter(members=self).exists():
            try:
                from integraflow.project.models import ProjectMembership
            except ImportError:
                pass
            else:
                available_project_ids = ProjectMembership.objects.filter(
                    Q(parent_membership__user=self)
                ).values_list("project_id", flat=True)
                organizations_where_user_is_admin = (
                    OrganizationMembership.objects.filter(
                        user=self,
                        level__gte=OrganizationMembership.Level.ADMIN
                    ).values_list("organization_id", flat=True)
                )

                # If project access control IS applicable, make sure
                # - project doesn't have access control OR
                # - the user has explicit access OR
                # - the user is Admin or owner
                projects = projects.filter(
                    Q(access_control=False)
                    | Q(pk__in=available_project_ids)
                    | Q(organization__pk__in=organizations_where_user_is_admin)
                )

        return projects.order_by("access_control", "id")

    @cached_property
    def organization(self) -> Optional[Organization]:
        if self.current_organization is None:
            if self.current_project is not None:
                self.current_organization_id = (
                    self.current_project.organization_id
                )
            self.current_organization = self.organizations.first()
            self.save()
        return self.current_organization

    @cached_property
    def project(self) -> Optional[Project]:
        if self.current_project is None and self.organization is not None:
            self.current_project = self.projects.filter(
                organization=self.current_organization
            ).first()
            self.save()
        return self.current_project

    def get_permission(self):
        return _user_get_permissions(self, "user")

    def join(
        self, *,
        organization: Organization,
        level: OrganizationMembership.Level = (
            OrganizationMembership.Level.MEMBER
        )
    ) -> OrganizationMembership:
        membership = OrganizationMembership.objects.filter(
            organization=organization,
            user__email=self.email
        ).first()

        if membership:
            return membership

        with transaction.atomic():
            membership = OrganizationMembership.objects.create(
                user=self,
                organization=organization,
                level=level
            )

            self.current_organization = organization
            if (level >= OrganizationMembership.Level.ADMIN):
                self.current_project = organization.projects.order_by(
                    "access_control",
                    "id"
                ).first()
            else:
                # Make sure the user is assigned a project they have access to
                # We don't need to check for ProjectMembership as none can
                # exist for a completely new member
                self.current_project = organization.projects.order_by(
                    "id"
                ).filter(
                    access_control=False
                ).first()

            self.save()

            if (
                is_email_available(with_absolute_urls=True) and
                organization.is_member_join_email_enabled
            ):
                from integraflow.messaging.tasks import send_member_join

                send_member_join.apply_async(kwargs={
                    "invitee_uuid": self.uuid,
                    "organization_id": organization.pk  # type: ignore
                })

        return membership

    def leave(self, *, organization: Organization) -> None:
        try:
            membership: OrganizationMembership = (
                OrganizationMembership.objects.get(
                    user=self,
                    organization=organization
                )
            )
        except OrganizationMembership.DoesNotExist:
            raise ValidationError(
                "Membership doesn't exist!"
            )

        if membership.level == OrganizationMembership.Level.OWNER:
            raise ValidationError(
                "Cannot leave the organization as its owner!"
            )
        with transaction.atomic():
            membership.delete()
            if self.current_organization == organization:
                self.current_organization = (
                    self.organizations.first()  # type: ignore
                )
                self.current_project = (
                    None if self.current_organization is None
                    else self.current_organization.projects.first()
                )
                self.project = self.current_project  # Update cached property
                self.save()

    __repr__ = sane_repr("email", "first_name")  # type: ignore
