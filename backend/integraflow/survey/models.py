from functools import partial
from typing import Any
from django.db import models
from django.utils.crypto import get_random_string

from integraflow.core.models import UUIDModel
from integraflow.core.utils import (
    MAX_SLUG_LENGTH,
    create_with_unique_string
)


class Survey(UUIDModel):
    class Type(models.TextChoices):
        SURVEY = "survey", "survey"
        QUIZ = "quiz", "quiz"
        POLL = "poll", "poll"
        CUSTOM = "custom", "custom"

    class Status(models.TextChoices):
        DRAFT = "draft", "draft"
        IN_PROGRESS = "in_progress", "in progress"
        ACTIVE = "active", "active"
        PAUSED = "paused", "paused"
        ARCHIVED = "archived", "archived"
        COMPLETED = "completed", "completed"

    class Meta:
        verbose_name = "Survey"
        verbose_name_plural = "Surveys"
        db_table = "surveys"
        constraints = [
            models.UniqueConstraint(
                fields=["project", "slug"],
                name="unique survey slug for project"
            )
        ]

    project: models.ForeignKey = models.ForeignKey(
        "project.Project",
        on_delete=models.CASCADE,
        related_name="surveys",
        related_query_name="survey",
    )
    name: models.CharField = models.CharField(max_length=400, blank=True)
    slug: models.CharField = models.CharField(
        max_length=MAX_SLUG_LENGTH,
        default=partial(get_random_string, length=16)
    )
    type: models.CharField = models.CharField(
        max_length=40,
        choices=Type.choices,
        default=Type.SURVEY
    )
    status: models.CharField = models.CharField(
        max_length=40,
        choices=Status.choices,
        default=Status.DRAFT
    )
    settings: models.JSONField = models.JSONField(blank=True, null=True)
    theme: models.ForeignKey = models.ForeignKey(
        "project.ProjectTheme",
        on_delete=models.SET_NULL,
        related_name="surveys",
        related_query_name="survey",
        null=True,
        blank=True
    )
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    created_by: models.ForeignKey = models.ForeignKey(
        "user.User",
        on_delete=models.SET_NULL,
        related_name="surveys",
        related_query_name="survey",
        null=True,
    )
    start_date: models.DateTimeField = models.DateTimeField(
        null=True,
        blank=True
    )
    end_date: models.DateTimeField = models.DateTimeField(
        null=True,
        blank=True
    )
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)


class SurveyQuestion(UUIDModel):
    class Type(models.TextChoices):
        SINGLE = "single", "single"
        MULTIPLE = "multiple", "multiple"
        TEXT = "text", "text"
        DATE = "date", "date"
        CSAT = "csat", "csat"
        SMILEY_SCALE = "smiley_scale", "smiley scale"
        NUMERICAL_SCALE = "numerical_scale", "numerical scale"
        RATING = "rating", "rating"
        NPS = "nps", "nps"
        FORM = "form", "form"
        BOOLEAN = "boolean", "boolean"
        CTA = "cta", "cta"
        DROPDOWN = "dropdown", "dropdown"
        INTEGRATION = "integration", "integration"
        CUSTOM = "custom", "custom"

    class Meta:
        verbose_name = "SurveyQuestion"
        verbose_name_plural = "SurveyQuestions"
        db_table = "survey_questions"

    survey: models.ForeignKey = models.ForeignKey(
        Survey,
        on_delete=models.CASCADE,
        related_name="survey_questions",
        related_query_name="survey_question",
    )
    type: models.CharField = models.CharField(
        max_length=40,
        choices=Type.choices,
        default=Type.TEXT
    )
    label: models.CharField = models.CharField(max_length=400, blank=True)
    description: models.CharField = models.CharField(
        max_length=1000,
        blank=True
    )
    max_path: models.IntegerField = models.IntegerField(null=True)
    order_number: models.IntegerField = models.IntegerField(default=0)
    options: models.JSONField = models.JSONField(blank=True, null=True)
    settings: models.JSONField = models.JSONField(blank=True, null=True)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)


class SurveyChannelManager(models.Manager):
    def create(self, *args: Any, **kwargs: Any):
        return create_with_unique_string(
            super().create,
            'link',
            *args,
            **kwargs
        )


class SurveyChannel(UUIDModel):
    class Type(models.TextChoices):
        EMAIL = "email", "email"
        LINK = "link", "link"
        API = "api", "api"
        CUSTOM = "custom", "custom"
        MOBILE_SDK = "mobile_sdk", "mobile sdk"
        WEB_SDK = "web_sdk", "web sdk"

    class Meta:
        verbose_name = "SurveyChannel"
        verbose_name_plural = "SurveyChannels"
        db_table = "survey_channels"
        constraints = [
            models.UniqueConstraint(
                fields=["link"],
                name="unique_link_for_survey_channel"
            ),
        ]

    survey: models.ForeignKey = models.ForeignKey(
        Survey,
        on_delete=models.CASCADE,
        related_name="survey_channels",
        related_query_name="survey_channel",
    )
    type: models.CharField = models.CharField(
        max_length=40,
        choices=Type.choices,
        default=Type.LINK
    )
    link: models.CharField = models.CharField(
        max_length=MAX_SLUG_LENGTH,
        default=partial(get_random_string, length=6)
    )
    triggers: models.JSONField = models.JSONField(blank=True, null=True)
    conditions: models.JSONField = models.JSONField(blank=True, null=True)
    settings: models.JSONField = models.JSONField(blank=True, null=True)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)

    objects: SurveyChannelManager = SurveyChannelManager()


class SurveyResponse(UUIDModel):
    class Status(models.TextChoices):
        IN_PROGRESS = "in_progress" "in progress"
        COMPLETED = "completed" "completed"
        ARCHIVED = "archived" "archived"

    class Meta:
        verbose_name = "SurveyResponse"
        verbose_name_plural = "SurveyResponses"
        db_table = "survey_responses"

    survey: models.ForeignKey = models.ForeignKey(
        Survey,
        on_delete=models.CASCADE,
        related_name="survey_responses",
        related_query_name="survey_response",
    )
    response: models.JSONField = models.JSONField(default=dict)
    status: models.CharField = models.CharField(
        max_length=40,
        choices=Status.choices,
        default=Status.IN_PROGRESS
    )
    distinct_id: models.CharField = models.CharField(max_length=200)
    person_id: models.UUIDField = models.UUIDField(
        db_index=True,
        blank=True,
        null=True
    )
    metadata: models.JSONField = models.JSONField(default=dict)
    user_attributes: models.JSONField = models.JSONField(default=dict)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)
    completed_at: models.DateTimeField = models.DateTimeField(
        blank=True,
        null=True
    )
    time_taken: models.DateTimeField = models.DateTimeField(
        blank=True,
        null=True
    )


class ResponseNote(UUIDModel):
    class Meta:
        verbose_name = "SurveyResponseNote"
        verbose_name_plural = "SurveyResponseNotes"
        db_table = "response_notes"

    response: models.ForeignKey = models.ForeignKey(
        SurveyResponse,
        on_delete=models.CASCADE,
        related_name="response_notes",
        related_query_name="response_note",
    )
    description: models.CharField = models.CharField(
        max_length=400,
        blank=True
    )
    is_resolved: models.BooleanField = models.BooleanField(default=False)
    is_completed: models.BooleanField = models.BooleanField(default=False)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)


class Tag(UUIDModel):
    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Tags"
        db_table = "tags"
        constraints = [
            models.UniqueConstraint(
                fields=["project", "name"],
                name="unique tag name for project"
            )
        ]

    project: models.ForeignKey = models.ForeignKey(
        "project.Project",
        on_delete=models.CASCADE,
        related_name="tags",
        related_query_name="tag",
    )
    name: models.CharField = models.CharField(
        max_length=400,
        blank=True
    )
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)


class ResponseTag(UUIDModel):
    class Meta:
        verbose_name = "ResponseTag"
        verbose_name_plural = "ResponseTags"
        db_table = "response_tags"
        constraints = [
            models.UniqueConstraint(
                fields=["response", "tag"],
                name="unique tag for response"
            )
        ]

    response: models.ForeignKey = models.ForeignKey(
        SurveyResponse,
        on_delete=models.CASCADE,
        related_name="response_tags",
        related_query_name="response_tag",
    )
    tag: models.ForeignKey = models.ForeignKey(
        Tag,
        on_delete=models.CASCADE
    )
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)
