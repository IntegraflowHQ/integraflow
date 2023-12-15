import graphene

from integraflow.graphql.core.connection import create_connection_slice
from integraflow.graphql.core.doc_category import DOC_CATEGORY_EVENTS
from integraflow.graphql.core.fields import FilterConnectionField
from integraflow.permission.auth_filters import AuthorizationFilters

from .enums import PropertyDefinitionTypeEnum
from .mutations import EventCapture
from .resolvers import (
    resolve_event_properties,
    resolve_events,
    resolve_event_definitions,
    resolve_persons,
    resolve_property_definitions
)
from .types import (
    EventCountableConnection,
    EventDefinitionCountableConnection,
    EventPropertyCountableConnection,
    PersonCountableConnection,
    PropertyDefinitionCountableConnection
)


class EventQueries(graphene.ObjectType):
    events = FilterConnectionField(
        EventCountableConnection,
        description="List of triggered events.",
        permissions=[AuthorizationFilters.PROJECT_MEMBER_ACCESS],
        doc_category=DOC_CATEGORY_EVENTS,
    )
    event_definitions = FilterConnectionField(
        EventDefinitionCountableConnection,
        description="List of event's definitions.",
        permissions=[AuthorizationFilters.PROJECT_MEMBER_ACCESS],
        doc_category=DOC_CATEGORY_EVENTS,
    )
    event_properties = FilterConnectionField(
        EventPropertyCountableConnection,
        event=graphene.Argument(
            graphene.String,
            description=(
                "Filter properties by event. If not provided, all properties "
                "for the project will be returned."
            ),
            required=False
        ),
        description="List of event's properties.",
        permissions=[AuthorizationFilters.PROJECT_MEMBER_ACCESS],
        doc_category=DOC_CATEGORY_EVENTS,
    )
    persons = FilterConnectionField(
        PersonCountableConnection,
        description="List of persons.",
        permissions=[AuthorizationFilters.PROJECT_MEMBER_ACCESS],
        doc_category=DOC_CATEGORY_EVENTS,
    )
    property_definitions = FilterConnectionField(
        PropertyDefinitionCountableConnection,
        definition_type=graphene.Argument(
            PropertyDefinitionTypeEnum,
            description=(
                "Filter definitions by type. If not provided, all property "
                "definitions for the project will be returned."
            ),
            required=False
        ),
        description="List of the property definitions.",
        permissions=[AuthorizationFilters.PROJECT_MEMBER_ACCESS],
        doc_category=DOC_CATEGORY_EVENTS,
    )

    @staticmethod
    def resolve_events(_root, info, **kwargs):
        qs = resolve_events(info)
        return create_connection_slice(
            qs,
            info,
            kwargs,
            EventCountableConnection
        )

    @staticmethod
    def resolve_event_definitions(_root, info, **kwargs):
        qs = resolve_event_definitions(info)
        return create_connection_slice(
            qs,
            info,
            kwargs,
            EventDefinitionCountableConnection
        )

    @staticmethod
    def resolve_event_properties(_root, info, **kwargs):
        qs = resolve_event_properties(info, kwargs.get("event", None))
        return create_connection_slice(
            qs,
            info,
            kwargs,
            EventPropertyCountableConnection
        )

    @staticmethod
    def resolve_persons(_root, info, **kwargs):
        qs = resolve_persons(info)
        return create_connection_slice(
            qs,
            info,
            kwargs,
            PersonCountableConnection
        )

    @staticmethod
    def resolve_property_definitions(_root, info, **kwargs):
        qs = resolve_property_definitions(
            info,
            kwargs.get("definition_type", None)
        )
        return create_connection_slice(
            qs,
            info,
            kwargs,
            PropertyDefinitionCountableConnection
        )


class EventMutations(graphene.ObjectType):
    event_capture = EventCapture.Field()
