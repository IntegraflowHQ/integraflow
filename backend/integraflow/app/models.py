from typing import Tuple
from uuid import uuid4

from django.contrib.auth.hashers import make_password
from django.db import models
from django.utils.text import Truncator
from oauthlib.common import generate_token

from ..core.models import Job, ModelWithMetadata
from .types import AppExtensionMount, AppExtensionTarget, AppType


class AppQueryset(models.QuerySet["App"]):
    def for_event_type(self, event_type: str):
        return self.filter(
            is_active=True,
            webhooks__is_active=True,
            webhooks__events__event_type=event_type
        )


AppManager = models.Manager.from_queryset(AppQueryset)


class App(ModelWithMetadata):
    uuid: models.UUIDField = models.UUIDField(unique=True, default=uuid4)
    name: models.CharField = models.CharField(max_length=60)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    is_active: models.BooleanField = models.BooleanField(default=True)
    type: models.CharField = models.CharField(
        choices=AppType.CHOICES, default=AppType.LOCAL, max_length=60
    )
    identifier: models.CharField = models.CharField(
        blank=True, null=True, max_length=256
    )
    about_app: models.TextField = models.TextField(blank=True, null=True)
    data_privacy: models.TextField = models.TextField(blank=True, null=True)
    data_privacy_url: models.URLField = models.URLField(blank=True, null=True)
    homepage_url: models.URLField = models.URLField(blank=True, null=True)
    support_url: models.URLField = models.URLField(blank=True, null=True)
    configuration_url: models.URLField = models.URLField(blank=True, null=True)
    app_url: models.URLField = models.URLField(blank=True, null=True)
    manifest_url: models.URLField = models.URLField(blank=True, null=True)
    version: models.CharField = models.CharField(
        max_length=60, blank=True, null=True
    )
    audience: models.CharField = models.CharField(
        blank=True, null=True, max_length=256
    )
    is_installed: models.BooleanField = models.BooleanField(default=True)
    author: models.CharField = models.CharField(
        blank=True, null=True, max_length=60
    )
    brand_logo_default: models.ImageField = models.ImageField(
        upload_to="app-brand-data", blank=True, null=True
    )
    objects = AppManager()

    class Meta(ModelWithMetadata.Meta):
        ordering = ("name", "pk")

    def __str__(self):
        return self.name


class AppTokenManager(models.Manager["AppToken"]):
    def create(self, app, name="", auth_token=None, **extra_fields):
        """Create an app token with the given name."""
        if not auth_token:
            auth_token = generate_token()
        app_token = self.model(app=app, name=name, **extra_fields)
        app_token.set_auth_token(auth_token)
        app_token.save()
        return app_token, auth_token

    def create_with_token(self, *args, **kwargs) -> Tuple["AppToken", str]:
        # As `create` is waiting to be fixed, I'm using this proper method
        # from future to get both AppToken and auth_token.
        return self.create(*args, **kwargs)


class AppToken(models.Model):
    app: models.ForeignKey = models.ForeignKey(
        App, on_delete=models.CASCADE, related_name="tokens"
    )
    name: models.CharField = models.CharField(
        blank=True, default="", max_length=128
    )
    auth_token: models.CharField = models.CharField(
        unique=True, max_length=128
    )
    token_last_4: models.CharField = models.CharField(max_length=4)

    objects = AppTokenManager()

    def set_auth_token(self, raw_token=None):
        self.auth_token = make_password(raw_token)

        if raw_token is not None:
            self.token_last_4 = raw_token[-4:]


class AppExtension(models.Model):
    app: models.ForeignKey = models.ForeignKey(
        App,
        on_delete=models.CASCADE,
        related_name="extensions"
    )
    label: models.CharField = models.CharField(max_length=256)
    url: models.URLField = models.URLField()
    mount: models.CharField = models.CharField(
        choices=AppExtensionMount.CHOICES, max_length=256
    )
    target: models.CharField = models.CharField(
        choices=AppExtensionTarget.CHOICES,
        max_length=128,
        default=AppExtensionTarget.POPUP,
    )


class AppInstallation(Job):
    uuid: models.UUIDField = models.UUIDField(unique=True, default=uuid4)
    app_name: models.CharField = models.CharField(max_length=60)
    manifest_url: models.URLField = models.URLField()
    brand_logo_default: models.ImageField = models.ImageField(
        upload_to="app-installation-brand-data", blank=True, null=True
    )

    def set_message(self, message: str, truncate=True):
        if truncate:
            max_length = self._meta.get_field(
                "message"
            ).max_length  # type: ignore

            if max_length is None:
                raise ValueError("Cannot truncate message without max_length")
            message = Truncator(message).chars(max_length)
        self.message = message
