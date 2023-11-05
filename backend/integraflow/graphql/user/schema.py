import graphene

from integraflow.graphql.core.doc_category import DOC_CATEGORY_USERS
from integraflow.graphql.core.fields import PermissionsField
from integraflow.permission.auth_filters import AuthorizationFilters

from .mutations.authentication import (
    EmailTokenUserAuth,
    EmailUserAuthChallenge,
    GoogleUserAuth,
    Logout,
    RefreshToken
)

from .types import User


class UserQueries(graphene.ObjectType):
    viewer = PermissionsField(
        User,
        permissions=[
            AuthorizationFilters.AUTHENTICATED_USER
        ],
        description="Return the currently authenticated user.",
        doc_category=DOC_CATEGORY_USERS,
    )

    @staticmethod
    def resolve_viewer(_root, info):
        user = info.context.user
        return user if user else None


class UserMutations(graphene.ObjectType):
    # Base mutations
    email_token_user_auth = EmailTokenUserAuth.Field()
    email_user_auth_challenge = EmailUserAuthChallenge.Field()
    google_user_auth = GoogleUserAuth.Field()
    logout = Logout.Field()
    token_refresh = RefreshToken.Field()
