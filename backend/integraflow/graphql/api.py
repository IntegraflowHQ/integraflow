import graphql
from django.urls import reverse
from django.utils.functional import SimpleLazyObject
from graphql import GraphQLScalarType

from .event.schema import EventMutations, EventQueries
from .organization.schema import OrganizationMutations, OrganizationQueries
from .project.schema import ProjectMutations, ProjectQueries
from .survey.schema import SurveyMutations, SurveyQueries
from .user.schema import UserMutations, UserQueries

from .core.federation.schema import build_federated_schema

API_PATH = SimpleLazyObject(lambda: reverse("api"))


class Query(
    EventQueries,
    OrganizationQueries,
    ProjectQueries,
    SurveyQueries,
    UserQueries
):
    pass


class Mutation(
    EventMutations,
    OrganizationMutations,
    ProjectMutations,
    SurveyMutations,
    UserMutations
):
    pass


GraphQLDocDirective = graphql.GraphQLDirective(
    name="doc",
    description="Groups fields and operations into named groups.",
    args={
        "category": graphql.GraphQLArgument(
            type_=graphql.GraphQLNonNull(graphql.GraphQLString),
            description="Name of the grouping category",
        )
    },
    locations=[
        graphql.DirectiveLocation.ENUM,
        graphql.DirectiveLocation.FIELD,
        graphql.DirectiveLocation.FIELD_DEFINITION,
        graphql.DirectiveLocation.INPUT_OBJECT,
        graphql.DirectiveLocation.OBJECT,
    ],
)


def serialize_webhook_event(value):
    return value


GraphQLWebhookEventAsyncType = GraphQLScalarType(
    name="WebhookEventTypeAsyncEnum",
    description="",
    serialize=serialize_webhook_event,
)

GraphQLWebhookEventSyncType = GraphQLScalarType(
    name="WebhookEventTypeSyncEnum",
    description="",
    serialize=serialize_webhook_event,
)

GraphQLWebhookEventsInfoDirective = graphql.GraphQLDirective(
    name="webhookEventsInfo",
    description="Webhook events triggered by a specific location.",
    args={
        "asyncEvents": graphql.GraphQLArgument(
            type_=graphql.GraphQLNonNull(
                graphql.GraphQLList(
                    graphql.GraphQLNonNull(GraphQLWebhookEventAsyncType)
                )
            ),
            description=(
                "List of asynchronous webhook events triggered by a specific "
                "location."
            ),
        ),
        "syncEvents": graphql.GraphQLArgument(
            type_=graphql.GraphQLNonNull(
                graphql.GraphQLList(
                    graphql.GraphQLNonNull(GraphQLWebhookEventSyncType)
                )
            ),
            description=(
                "List of synchronous webhook events triggered by a specific "
                "location."
            ),
        ),
    },
    locations=[
        graphql.DirectiveLocation.FIELD,
        graphql.DirectiveLocation.FIELD_DEFINITION,
        graphql.DirectiveLocation.INPUT_OBJECT,
        graphql.DirectiveLocation.OBJECT,
    ],
)

schema = build_federated_schema(
    Query,
    mutation=Mutation,
    types=[],
    subscription=None,
    directives=graphql.specified_directives + [GraphQLDocDirective],
)
