from functools import wraps
from json import JSONDecodeError
from typing import Optional

import graphene
from django.conf import settings
from graphene.relay import Connection, is_node
from graphql import GraphQLError

from .connection import (
    FILTERS_NAME,
    FILTERSET_CLASS,
    WHERE_FILTERSET_CLASS,
    WHERE_NAME
)
from .utils import WebhookEventInfo, message_webhook_events


class BaseField(graphene.Field):
    description: Optional[str]
    doc_category: Optional[str]
    webhook_events_info: Optional[list[WebhookEventInfo]]

    def __init__(self, *args, **kwargs):
        auto_webhook_events_info_message = kwargs.pop(
            "auto_webhook_events_info_message", True
        )
        self.doc_category = kwargs.pop("doc_category", None)
        self.webhook_events_info = kwargs.pop("webhook_events_info", None)

        super(BaseField, self).__init__(*args, **kwargs)

        if self.webhook_events_info and auto_webhook_events_info_message:
            description = self.description or ""
            description += message_webhook_events(self.webhook_events_info)
            self.description = description

    def get_resolver(self, parent_resolver):
        resolver = self.resolver or parent_resolver
        setattr(resolver, "doc_category", self.doc_category)
        setattr(resolver, "webhook_events_info", self.webhook_events_info)
        return resolver


class ConnectionField(BaseField):
    def __init__(self, type_, *args, **kwargs):
        kwargs.setdefault(
            "before",
            graphene.String(
                description=(
                    "Return the elements in the list that come before "
                    "the specified cursor."
                )
            ),
        )
        kwargs.setdefault(
            "after",
            graphene.String(
                description=(
                    "Return the elements in the list that come after "
                    "the specified cursor."
                )
            ),
        )
        kwargs.setdefault(
            "first",
            graphene.Int(
                description=(
                    "Retrieve the first n elements from the list. "
                    "Note that the system only allows fetching "
                    f"a maximum of {settings.GRAPHQL_PAGINATION_LIMIT} "
                    "objects in a single query."
                ),
            ),
        )
        kwargs.setdefault(
            "last",
            graphene.Int(
                description=(
                    "Retrieve the last n elements from the list. "
                    "Note that the system only allows fetching "
                    f"a maximum of {settings.GRAPHQL_PAGINATION_LIMIT} "
                    "objects in a single query."
                )
            ),
        )
        super().__init__(type_, *args, **kwargs)

    @property
    def type(self):
        type = super(ConnectionField, self).type
        connection_type = type
        if isinstance(type, graphene.NonNull):
            connection_type = type.of_type

        if is_node(connection_type):
            raise Exception(
                "ConnectionFields now need a explicit ConnectionType for"
                "Nodes.\nRead more: "
                "https://github.com/graphql-python/graphene/blob/v2.0.0/"
                "UPGRADE-v2.0.md#node-connections"
            )

        assert issubclass(
            connection_type,  # type: ignore
            Connection
        ), (
            '{} type have to be a subclass of Connection. Received "{}".'
        ).format(self.__class__.__name__, connection_type)
        return type


class FilterConnectionField(ConnectionField):
    def __init__(self, type_, *args, **kwargs):
        self.filter_field_name = kwargs.pop("filter_field_name", "filter")
        self.filter_input = kwargs.get(self.filter_field_name)
        self.filterset_class = None
        if self.filter_input:
            self.filterset_class = self.filter_input.filterset_class

        self.where_field_name = kwargs.get("where_field_name", "where")
        self.where_input = kwargs.get(self.where_field_name)
        self.where_filterset_class = None
        if self.where_input:
            self.where_filterset_class = self.where_input.filterset_class

        super().__init__(type_, *args, **kwargs)

    def get_resolver(self, parent_resolver):
        wrapped_resolver = super().get_resolver(parent_resolver)

        @wraps(wrapped_resolver)
        def new_resolver(obj, info, **kwargs):
            kwargs[FILTERSET_CLASS] = self.filterset_class
            kwargs[FILTERS_NAME] = self.filter_field_name
            kwargs[WHERE_FILTERSET_CLASS] = self.where_filterset_class
            kwargs[WHERE_NAME] = self.where_field_name
            return wrapped_resolver(obj, info, **kwargs)

        return new_resolver


class JSONString(graphene.JSONString):
    @staticmethod
    def parse_literal(node):
        try:
            return graphene.JSONString.parse_literal(node)
        except JSONDecodeError:
            raise GraphQLError(
                f"{str(node.value)[:20]}... is not a valid JSONString"
            )
