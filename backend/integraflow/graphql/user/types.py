import graphene
from graphene import relay

from django.contrib.auth import get_user_model

from integraflow.user import models

from integraflow.graphql.core.federation import federated_entity
from integraflow.graphql.core.types.model import ModelObjectType
from integraflow.graphql.core.doc_category import DOC_CATEGORY_USERS


@federated_entity("id")
@federated_entity("email")
class User(ModelObjectType[models.User]):
    id = graphene.GlobalID(required=True, description="The ID of the user.")
    email = graphene.String(
        required=True,
        description="The email address of the user."
    )
    first_name = graphene.String(
        required=True, description="The given name of the address."
    )
    last_name = graphene.String(
        required=True, description="The family name of the address."
    )
    is_staff = graphene.Boolean(
        required=True, description="Determine if the user is a staff admin."
    )
    is_active = graphene.Boolean(
        required=True, description="Determine if the user is active."
    )

    class Meta:
        description = "Represents user data."
        interfaces = [relay.Node]
        model = get_user_model()
        doc_category = DOC_CATEGORY_USERS
