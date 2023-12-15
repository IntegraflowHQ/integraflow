import graphene

from integraflow.event import models
from integraflow.graphql.core.connection import CountableConnection
from integraflow.graphql.core.doc_category import DOC_CATEGORY_EVENTS
from integraflow.graphql.core.fields import JSONString, PermissionsField
from integraflow.graphql.core.types.common import NonNullList
from integraflow.graphql.core.types.model import ModelObjectType
from integraflow.graphql.event.enums import (
    PropertyDefinitionTypeEnum,
    PropertyTypeEnum
)
from integraflow.permission.auth_filters import AuthorizationFilters


class Event(ModelObjectType):
    id = graphene.GlobalID(
        required=True,
        description="The ID of the event."
    )
    project = PermissionsField(
        "integraflow.graphql.project.types.Project",
        description="The project the event belongs to",
        required=True,
        permissions=[
            AuthorizationFilters.PROJECT_MEMBER_ACCESS,
        ],
    )
    event = graphene.String(
        description="The event name",
        required=True
    )
    distinct_id = graphene.String(
        description="The event name",
        required=True
    )
    properties = JSONString(
        description="The event properties",
        required=False
    )
    timestamp = graphene.DateTime(
        description="The time the event occurred",
        required=False
    )
    created_at = graphene.DateTime(
        description="The time the event was created",
        required=False
    )

    class Meta:
        description = "Represents an event."
        doc_category = DOC_CATEGORY_EVENTS
        model = models.Event
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_project(root: models.Event, info):
        return root.project


class EventDefinition(ModelObjectType):
    id = graphene.GlobalID(
        required=True,
        description="The ID of the event definition."
    )
    project = PermissionsField(
        "integraflow.graphql.project.types.Project",
        description="The project the event definition belongs to",
        required=True,
        permissions=[
            AuthorizationFilters.PROJECT_MEMBER_ACCESS,
        ],
    )
    name = graphene.String(
        description="The name of the event definition",
        required=True
    )
    created_at = graphene.DateTime(
        description="The time the event was created",
        required=False
    )
    last_seen_at = graphene.DateTime(
        description="The time the event was last seen",
        required=False
    )

    class Meta:
        description = "Represents an event definition."
        doc_category = DOC_CATEGORY_EVENTS
        model = models.EventDefinition
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_project(root: models.EventDefinition, info):
        return root.project


class EventProperty(ModelObjectType):
    id = graphene.GlobalID(
        required=True,
        description="The ID of the event property."
    )
    project = PermissionsField(
        "integraflow.graphql.project.types.Project",
        description="The project the event property belongs to",
        required=True,
        permissions=[
            AuthorizationFilters.PROJECT_MEMBER_ACCESS,
        ],
    )
    event = graphene.String(
        description="The name of the event",
        required=True
    )
    property = graphene.String(
        description="The property of the event",
        required=True
    )

    class Meta:
        description = "Represents an event property."
        doc_category = DOC_CATEGORY_EVENTS
        model = models.EventProperty
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_project(root: models.EventProperty, info):
        return root.project


class Person(ModelObjectType):
    id = graphene.GlobalID(
        required=True,
        description="The ID of the event property."
    )
    project = PermissionsField(
        "integraflow.graphql.project.types.Project",
        description="The project the person belongs to",
        required=True,
        permissions=[
            AuthorizationFilters.PROJECT_MEMBER_ACCESS,
        ],
    )
    uuid = graphene.UUID(
        description="The person's uuid",
        required=True
    )
    attributes = JSONString(
        description="The person's attributes",
        required=False
    )
    distinct_ids = NonNullList(
        graphene.String,
        description="The person's distinct ids",
        required=False
    )
    is_identified = graphene.Boolean(
        description="Whether the person has been identified",
        required=True
    )
    created_at = graphene.DateTime(
        description="The time the person was created",
        required=False
    )

    class Meta:
        description = "Represents a person."
        doc_category = DOC_CATEGORY_EVENTS
        model = models.Person
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_project(root: models.Person, info):
        return root.project

    @staticmethod
    def resolve_distinct_ids(root: models.Person, info):
        return root.distinct_ids


class PropertyDefinition(ModelObjectType):
    id = graphene.GlobalID(
        required=True,
        description="The ID of the event property."
    )
    project = PermissionsField(
        "integraflow.graphql.project.types.Project",
        description="The project the person belongs to",
        required=True,
        permissions=[
            AuthorizationFilters.PROJECT_MEMBER_ACCESS,
        ],
    )
    name = graphene.String(
        description="The name of the property definition",
        required=True
    )
    is_numerical = graphene.Boolean(
        description="Whether property accepts a numerical value",
        required=True
    )
    type = graphene.Field(
        PropertyDefinitionTypeEnum,
        required=True,
        description="The type of the property definition",
    )
    property_type = graphene.Field(
        PropertyTypeEnum,
        required=True,
        description="The property type",
    )

    class Meta:
        description = "Represents a property definition."
        doc_category = DOC_CATEGORY_EVENTS
        model = models.PropertyDefinition
        interfaces = [graphene.relay.Node]

    @staticmethod
    def resolve_project(root: models.PropertyDefinition, info):
        return root.project


class EventCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_EVENTS
        node = Event


class EventDefinitionCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_EVENTS
        node = EventDefinition


class EventPropertyCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_EVENTS
        node = EventProperty


class PersonCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_EVENTS
        node = Person


class PropertyDefinitionCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_EVENTS
        node = PropertyDefinition
