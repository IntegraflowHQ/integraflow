# Python imports
import uuid
import random
import string
from functools import partial
from typing import (
    Type,
)

# Django imports
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin
)
from django.utils.crypto import get_random_string
from django.utils import timezone

from ..core.models import ModelWithMetadata, ModelWithExternalReference


class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    def get_queryset(self):
        return super().get_queryset()

    model: Type["User"]


class User(
    PermissionsMixin,
    ModelWithMetadata,
    AbstractBaseUser,
    ModelWithExternalReference
):
    id: models.UUIDField = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        db_index=True,
        primary_key=True
    )
    username: models.CharField = models.CharField(max_length=128, unique=True)
    email: models.EmailField = models.EmailField(max_length=255, unique=True)
    mobile_number: models.CharField = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )
    first_name: models.CharField = models.CharField(
        max_length=255,
        blank=True
    )
    last_name: models.CharField = models.CharField(max_length=255, blank=True)
    avatar: models.URLField = models.URLField(
        blank=True,
        null=True,
        max_length=800
    )

    jwt_token_key: models.CharField = models.CharField(
        max_length=12, default=partial(get_random_string, length=12)
    )
    token_updated_at: models.DateTimeField = models.DateTimeField(null=True)

    is_superuser: models.BooleanField = models.BooleanField(default=False)
    is_managed: models.BooleanField = models.BooleanField(default=False)
    is_active: models.BooleanField = models.BooleanField(default=True)
    is_staff: models.BooleanField = models.BooleanField(default=False)
    is_email_verified: models.BooleanField = models.BooleanField(default=False)
    is_password_autoset: models.BooleanField = models.BooleanField(
        default=False
    )
    is_onboarded: models.BooleanField = models.BooleanField(default=False)

    # tracking metrics
    date_joined: models.DateTimeField = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At"
    )
    created_at: models.DateTimeField = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At"
    )
    updated_at: models.DateTimeField = models.DateTimeField(
        auto_now=True,
        verbose_name="Last Modified At"
    )

    display_name: models.CharField = models.CharField(
        max_length=255,
        default=""
    )

    objects: UserManager = UserManager()

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        db_table = "users"
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.username} <{self.email}>"

    def save(self, *args, **kwargs):
        self.email = self.email.lower().strip()
        self.mobile_number = self.mobile_number

        if self.token_updated_at is not None:
            self.jwt_token_key = uuid.uuid4().hex + uuid.uuid4().hex
            self.token_updated_at = timezone.now()

        if not self.display_name:
            self.display_name = (
                self.email.split("@")[0]
                if len(self.email.split("@"))
                else "".join(
                    random.choice(string.ascii_letters) for _ in range(6)
                )
            )

        if self.is_superuser:
            self.is_staff = True

        super(User, self).save(*args, **kwargs)
