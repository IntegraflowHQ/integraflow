import graphene

from ...user import models

from ..core.federation import federated_entity
from ..core.types import ModelObjectType


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
    is_confirmed = graphene.Boolean(
        required=True,
        description="Determines if user has confirmed email.",
    )
