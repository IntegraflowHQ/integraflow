import graphene

from integraflow.graphql.core.doc_category import DOC_CATEGORY_USERS
from integraflow.graphql.core.fields import BaseField

from .mutations.authentication import EmailUserAuthChallenge

from .types import User


class UserQueries(graphene.ObjectType):
    me = BaseField(
        User,
        description="Return the currently authenticated user.",
        doc_category=DOC_CATEGORY_USERS,
    )

    @staticmethod
    def resolve_me(_root, info):
        user = info.context.user
        return user if user else None


class UserMutations(graphene.ObjectType):
    # Base mutations
    email_user_auth_challenge = EmailUserAuthChallenge.Field()
    google_user_auth_challenge = EmailUserAuthChallenge.Field()
