from functools import partial
from typing import Any

from django.contrib.postgres.indexes import GinIndex
from django.db import models
from django.db.models.fields.json import KeyTextTransform
from django.db.models.functions import Cast
from django.utils.crypto import get_random_string
from integraflow.core.models import UUIDModel
from integraflow.core.utils import MAX_SLUG_LENGTH, create_with_unique_string


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
    analytics_metadata: models.JSONField = models.JSONField(
        default=dict,
        null=True,
        blank=True
    )
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
        CES = "ces", "ces"
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


class SurveyResponseQueryset(models.QuerySet["SurveyResponse"]):
    def count_responses(self, filters: models.Q):
        return self.filter(filters).count()

    def completion_rate(self, filters: models.Q):
        total_responses = self.count_responses(filters)
        if total_responses == 0:
            return 0

        completed_responses = self.count_responses(
            filters & models.Q(completed_at__isnull=False)
        )

        return (completed_responses / total_responses) * 100

    def average(self, field: str, filters: models.Q):
        return self.filter(filters).aggregate(
            average=models.Avg(field, default=0)
        )["average"]

    def calculate_nps_scores(self, filters: models.Q):
        completed_responses = self.filter(filters)

        # Define conditions for Promoters (scores 9-10), Passives
        # (scores 7-8), and Detractors (scores 0-6)
        promoter_condition = models.Case(
            models.When(analytics_metadata__nps_score__gte=9, then=1),
            default=0,
            output_field=models.IntegerField()
        )

        passive_condition = models.Case(
            models.When(
                analytics_metadata__nps_score__gte=7,
                analytics_metadata__nps_score__lte=8,
                then=1
            ),
            default=0,
            output_field=models.IntegerField()
        )

        detractor_condition = models.Case(
            models.When(
                analytics_metadata__nps_score__gte=0,
                analytics_metadata__nps_score__lte=6,
                then=1
            ),
            default=0,
            output_field=models.IntegerField()
        )

        # Annotate responses with Promoter, Passive, and Detractor counts
        nps_scores = completed_responses.annotate(
            promoter=promoter_condition,
            passive=passive_condition,
            detractor=detractor_condition
        ).aggregate(
            promoters=models.Sum('promoter', default=0),
            passives=models.Sum('passive', default=0),
            detractors=models.Sum('detractor', default=0)
        )

        promoters = nps_scores.get("promoters", 0) or 0
        passives = nps_scores.get("passives", 0) or 0
        detractors = nps_scores.get("detractors", 0) or 0

        total_responses = promoters + passives + detractors
        if total_responses == 0:
            return {
                "promoters": 0,
                "passives": 0,
                "detractors": 0,
                "score": 0
            }

        # Calculate NPS score
        return {
            "promoters": promoters,
            "passives": passives,
            "detractors": detractors,
            "score": ((promoters - detractors) / total_responses) * 100
        }

    def calculate_csat_scores(self, filters: models.Q):
        completed_responses = self.filter(filters)

        # Define conditions for Positive (scores 4-5), Neutral (score 3),
        # and Negative (scores 1-2)
        positive_condition = models.Case(
            models.When(analytics_metadata__csat_score__gte=4, then=1),
            default=0,
            output_field=models.IntegerField()
        )

        neutral_condition = models.Case(
            models.When(analytics_metadata__csat_score__exact=3, then=1),
            default=0,
            output_field=models.IntegerField()
        )

        negative_condition = models.Case(
            models.When(
                analytics_metadata__csat_score__gte=1,
                analytics_metadata__csat_score__lte=2,
                then=1
            ),
            default=0,
            output_field=models.IntegerField()
        )

        # Annotate responses with Satisfied and Unsatisfied counts
        csat_scores = completed_responses.annotate(
            positive=positive_condition,
            neutral=neutral_condition,
            negative=negative_condition
        ).aggregate(
            total_positive=models.Sum('positive', default=0),
            total_neutral=models.Sum('neutral', default=0),
            total_negative=models.Sum('negative', default=0)
        )

        positive = csat_scores.get("total_positive", 0) or 0
        neutral = csat_scores.get("total_neutral", 0) or 0
        negative = csat_scores.get("total_negative", 0) or 0

        total_responses = positive + neutral + negative
        if total_responses == 0:
            return {
                "positive": 0,
                "neutral": 0,
                "negative": 0,
                "score": 0
            }

        # Calculate CSAT score
        return {
            "positive": positive,
            "neutral": neutral,
            "negative": negative,
            "score": (positive / total_responses) * 100
        }

    def calculate_ces_scores(self, filters: models.Q):
        # Filter SurveyResponse instances for the specified survey with
        # completed_at not null
        completed_responses = self.filter(filters)

        # Define conditions for Low efforts (scores 5-7), Medium efforts
        # (scores 4), and High efforts (scores 1-3)
        low_effort_condition = models.Case(
            models.When(analytics_metadata__ces_score__gte=5, then=1),
            default=0,
            output_field=models.IntegerField()
        )

        medium_effort_condition = models.Case(
            models.When(analytics_metadata__ces_score__exact=4, then=1),
            default=0,
            output_field=models.IntegerField()
        )

        high_effort_condition = models.Case(
            models.When(
                analytics_metadata__ces_score__gte=1,
                analytics_metadata__ces_score__lte=3,
                then=1
            ),
            default=0,
            output_field=models.IntegerField()
        )

        # Annotate responses with Low effort, Medium effort, and High effort
        # counts
        ces_scores = completed_responses.annotate(
            low_effort=low_effort_condition,
            medium_effort=medium_effort_condition,
            high_effort=high_effort_condition,
            ces_score=KeyTextTransform('ces_score', 'analytics_metadata')
        ).aggregate(
            low_efforts=models.Sum('low_effort', default=0),
            medium_efforts=models.Sum('medium_effort', default=0),
            high_efforts=models.Sum('high_effort', default=0),
            total_ces_score=models.Sum(
                Cast('ces_score', output_field=models.FloatField()),
                default=0
            )
        )

        low_efforts = ces_scores.get("low_efforts", 0) or 0
        medium_efforts = ces_scores.get("medium_efforts", 0) or 0
        high_efforts = ces_scores.get("high_efforts", 0) or 0
        total_ces_score = ces_scores.get("total_ces_score", 0) or 0

        total_responses = low_efforts + medium_efforts + high_efforts
        if total_responses == 0:
            return {
                "low": 0,
                "medium": 0,
                "high": 0,
                "score": 0
            }

        # Calculate CES score
        return {
            "low": low_efforts,
            "medium": medium_efforts,
            "high": high_efforts,
            "score": total_ces_score / total_responses
        }


SurveyResponseManager = models.Manager.from_queryset(SurveyResponseQueryset)


class SurveyResponse(UUIDModel):
    class Status(models.TextChoices):
        IN_PROGRESS = "in_progress" "in progress"
        COMPLETED = "completed" "completed"
        ARCHIVED = "archived" "archived"

    class Meta:
        verbose_name = "SurveyResponse"
        verbose_name_plural = "SurveyResponses"
        db_table = "survey_responses"
        ordering = ["-created_at"]
        indexes = [
            GinIndex(fields=["response"], name="%(class)s_p_meta_idx"),
            GinIndex(fields=["analytics_metadata"], name="%(class)s_meta_idx"),
        ]

    objects = SurveyResponseManager()

    survey: models.ForeignKey = models.ForeignKey(
        Survey,
        on_delete=models.CASCADE,
        related_name="survey_responses",
        related_query_name="survey_response",
    )
    channel: models.ForeignKey = models.ForeignKey(
        SurveyChannel,
        on_delete=models.SET_NULL,
        related_name="survey_channels",
        related_query_name="survey_channel",
        null=True,
        blank=True
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
    event_id: models.UUIDField = models.UUIDField(
        db_index=True,
        blank=True,
        null=True
    )
    metadata: models.JSONField = models.JSONField(default=dict)
    analytics_metadata: models.JSONField = models.JSONField(
        default=dict,
        null=True,
        blank=True
    )
    user_attributes: models.JSONField = models.JSONField(default=dict)
    is_processed: models.BooleanField = models.BooleanField(default=False)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)
    completed_at: models.DateTimeField = models.DateTimeField(
        blank=True,
        null=True
    )
    time_spent: models.FloatField = models.FloatField(
        blank=True,
        null=True,
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
