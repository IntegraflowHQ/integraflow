from typing import Any, List, Optional

from django.contrib.postgres.indexes import GinIndex
from django.db import models, transaction
from django.db.models.expressions import F
from django.utils import timezone
from integraflow.core.models import UUIDModel

from integraflow.core.utils import (
    UniqueConstraintByExpression,
    sane_repr,
    uuidt
)


class Event(models.Model):
    class Meta:
        verbose_name = "Event"
        verbose_name_plural = "Events"
        db_table = "events"
        indexes = [
            models.Index(fields=["timestamp", "project_id", "event"]),
            models.Index(fields=["distinct_id"], name="idx_distinct_id"),
        ]

    created_at: models.DateTimeField = models.DateTimeField(
        auto_now_add=True,
        null=True,
        blank=True
    )
    project: models.ForeignKey = models.ForeignKey(
        "project.Project",
        on_delete=models.CASCADE
    )
    event: models.CharField = models.CharField(
        max_length=200,
        null=True,
        blank=True
    )
    distinct_id: models.CharField = models.CharField(max_length=200)
    properties: models.JSONField = models.JSONField(default=dict)
    timestamp: models.DateTimeField = models.DateTimeField(
        default=timezone.now,
        blank=True
    )
    site_url: models.CharField = models.CharField(
        max_length=200,
        null=True,
        blank=True
    )


class EventProperty(models.Model):
    project: models.ForeignKey = models.ForeignKey(
        "project.Project",
        on_delete=models.CASCADE
    )
    event: models.CharField = models.CharField(max_length=400, null=False)
    property: models.CharField = models.CharField(max_length=400, null=False)

    class Meta:
        verbose_name = "EventProperty"
        verbose_name_plural = "EventProperties"
        db_table = "event_properties"
        constraints = [
            models.UniqueConstraint(
                fields=["project", "event", "property"],
                name=(
                    "integraflow_event_property_unique_project_event_property"
                ),
            )
        ]
        indexes = [
            models.Index(fields=["project", "event"]),
            models.Index(fields=["project", "property"]),
        ]

    __repr__ = sane_repr("event", "property", "project_id")  # type: ignore


class PersonManager(models.Manager):
    def create(self, *args: Any, **kwargs: Any):
        with transaction.atomic():
            if not kwargs.get("distinct_ids"):
                return super().create(*args, **kwargs)
            distinct_ids = kwargs.pop("distinct_ids")
            person = super().create(*args, **kwargs)
            person._add_distinct_ids(distinct_ids)
            return person

    @staticmethod
    def distinct_ids_exist(project_id: int, distinct_ids: List[str]) -> bool:
        return PersonDistinctId.objects.filter(
            project_id=project_id,
            distinct_id__in=distinct_ids
        ).exists()


class Person(models.Model):
    _distinct_ids: Optional[List[str]]

    @property
    def distinct_ids(self) -> List[str]:
        if hasattr(self, "distinct_ids_cache"):
            return [
                id.distinct_id for id in self.distinct_ids_cache  # type: ignore
            ]
        if hasattr(self, "_distinct_ids") and self._distinct_ids:
            return self._distinct_ids
        return [
            id[0]
            for id in PersonDistinctId.objects.filter(
                person=self,
                project_id=self.project_id
            )
            .order_by("id")
            .values_list("distinct_id")
        ]

    def add_distinct_id(self, distinct_id: str) -> None:
        PersonDistinctId.objects.create(
            person=self,
            distinct_id=distinct_id,
            project_id=self.project_id
        )

    def _add_distinct_ids(self, distinct_ids: List[str]) -> None:
        for distinct_id in distinct_ids:
            self.add_distinct_id(distinct_id)

    objects = PersonManager()
    created_at: models.DateTimeField = models.DateTimeField(
        auto_now_add=True,
        blank=True
    )

    # used to prevent race conditions with set and set_once
    attributes_last_updated_at: models.JSONField = models.JSONField(
        default=dict,
        null=True,
        blank=True
    )

    # used for evaluating if we need to override the value or not
    # (value: set or set_once)
    attributes_last_operation: models.JSONField = models.JSONField(
        null=True,
        blank=True
    )

    project: models.ForeignKey = models.ForeignKey(
        "project.Project",
        on_delete=models.CASCADE
    )
    attributes: models.JSONField = models.JSONField(default=dict)
    is_user: models.ForeignKey = models.ForeignKey(
        "user.User",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    is_identified: models.BooleanField = models.BooleanField(default=False)
    uuid: models.UUIDField = models.UUIDField(
        db_index=True,
        default=uuidt.UUIDT,
        editable=False
    )

    class Meta:
        verbose_name = "Person"
        verbose_name_plural = "Persons"
        db_table = "persons"


class PersonDistinctId(models.Model):
    class Meta:
        verbose_name = "PersonDistinctId"
        verbose_name_plural = "PersonDistinctIds"
        db_table = "person_distinct_ids"
        constraints = [
            models.UniqueConstraint(
                fields=["project", "distinct_id"],
                name="unique distinct_id for project"
            )
        ]

    project: models.ForeignKey = models.ForeignKey(
        "project.Project",
        on_delete=models.CASCADE,
        db_index=False
    )
    person: models.ForeignKey = models.ForeignKey(
        Person,
        on_delete=models.CASCADE
    )
    distinct_id: models.CharField = models.CharField(max_length=400)


class PropertyType(models.TextChoices):
    Datetime = "DateTime", "DateTime"
    String = "String", "String"
    Numeric = "Numeric", "Numeric"
    Boolean = "Boolean", "Boolean"


class PropertyDefinition(UUIDModel):
    class Type(models.IntegerChoices):
        EVENT = 1, "event"
        PERSON = 2, "person"
        GROUP = 3, "group"

    project: models.ForeignKey = models.ForeignKey(
        "project.Project",
        on_delete=models.CASCADE,
        related_name="property_definitions",
        related_query_name="project",
    )
    name: models.CharField = models.CharField(max_length=400)
    # whether the property can be interpreted as a number, and therefore used
    # for math aggregation operations
    is_numerical: models.BooleanField = models.BooleanField(default=False)

    property_type = models.CharField(
        max_length=50,
        choices=PropertyType.choices,
        blank=True,
        null=True
    )

    type: models.PositiveSmallIntegerField = models.PositiveSmallIntegerField(
        default=Type.EVENT,
        choices=Type.choices
    )

    class Meta:
        verbose_name = "PropertyDefinition"
        verbose_name_plural = "PropertyDefinitions"
        db_table = "property_definitions"
        indexes = [
            models.Index(
                F("project_id"),
                F("type"),
                F("name").asc(),
                name="index_property_def_query",
            ),
            # creates an index pganalyze identified as missing
            # https://app.pganalyze.com/servers/i35ydkosi5cy5n7tly45vkjcqa/checks/index_advisor/missing_index/15282978
            models.Index(fields=["project_id", "type", "is_numerical"]),
        ] + [
            GinIndex(
                name="index_property_definition_name",
                fields=["name"],
                opclasses=["gin_trgm_ops"],
            )  # To speed up DB-based fuzzy searching
        ]
        constraints = [
            models.CheckConstraint(
                name="property_type_is_valid",
                check=models.Q(property_type__in=PropertyType.values),
            ),
            UniqueConstraintByExpression(
                name="integraflow_propertydefinition_uniq",
                expression="(project_id, name, type)",
                concurrently=False
            ),
        ]

    def __str__(self) -> str:
        return f"{self.name} / {self.project.name}"
