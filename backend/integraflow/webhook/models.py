from django.db import models

from integraflow.app.models import App
from integraflow.app.validators import AppURLValidator
from integraflow.core.utils.json_serializer import CustomJsonEncoder


class WebhookURLField(models.URLField):
    default_validators = [
        AppURLValidator(schemes=["http", "https", "awssqs", "gcpubsub"])
    ]


class Webhook(models.Model):
    name: models.CharField = models.CharField(
        max_length=255, null=True, blank=True
    )
    app: models.ForeignKey = models.ForeignKey(
        App,
        related_name="webhooks",
        on_delete=models.CASCADE
    )
    target_url: models.URLField = WebhookURLField(max_length=255)
    is_active: models.BooleanField = models.BooleanField(default=True)
    secret_key: models.CharField = models.CharField(
        max_length=255, null=True, blank=True
    )
    subscription_query: models.TextField = models.TextField(
        null=True,
        blank=True
    )
    custom_headers: models.JSONField = models.JSONField(
        blank=True,
        null=True,
        default=dict,
        encoder=CustomJsonEncoder
    )

    class Meta(object):
        db_table = "webhooks"
        ordering = ("pk",)

    def __str__(self):
        return self.name


class WebhookEvent(models.Model):
    webhook: models.ForeignKey = models.ForeignKey(
        Webhook, related_name="events", on_delete=models.CASCADE
    )
    event_type: models.CharField = models.CharField(
        "Event type", max_length=128, db_index=True
    )

    class Meta(object):
        db_table = "webhook_events"

    def __repr__(self):
        return self.event_type
