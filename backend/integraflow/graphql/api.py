import graphql
from django.urls import reverse
from django.utils.functional import SimpleLazyObject

from .core.federation.schema import build_federated_schema

API_PATH = SimpleLazyObject(lambda: reverse("api"))


"""class Query():
    pass


class Mutation():
    pass
"""


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


schema = build_federated_schema(
    query=None,
    mutation=None,
    types=[],
    subscription=None,
    directives=graphql.specified_directives + [GraphQLDocDirective],
)
