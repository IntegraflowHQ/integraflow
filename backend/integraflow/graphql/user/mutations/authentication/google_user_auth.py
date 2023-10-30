from typing import Dict

import graphene
from django.conf import settings
from django.core.exceptions import ValidationError
from google.auth.transport import requests
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from integraflow.core.jwt import create_access_token, create_refresh_token
from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_AUTH
from integraflow.graphql.core.mutations import BaseMutation
from integraflow.graphql.core.types.common import UserError
from integraflow.user.models import User

GOOGLE_AUTH_CLIENT_CREDENTIALS = settings.GOOGLE_AUTH_CLIENT_CREDENTIALS


class GoogleUserAuth(BaseMutation):
    """
    Mutation that finds or creates a new user account from google auth
    credentials and returns access and refresh tokens.
    """

    class Arguments:
        code = graphene.String(
            required=True,
            description="Code gotten from google auth consent screen.",
        )

    class Meta:
        description = (
            "Finds or creates a new user account from google auth credentials."
        )
        doc_category = DOC_CATEGORY_AUTH
        error_type_class = UserError
        error_type_field = "user_errors"

    success = graphene.Boolean(
        description="Whether the operation was successful.",
    )

    accessToken = graphene.String(
        description="Access token for the user.",
    )

    refreshToken = graphene.String(
        description="Refresh token for the user.",
    )

    @classmethod
    def _get_credentials(cls, code: str) -> Dict[str, str]:
        try:
            flow = Flow.from_client_secrets_file(
                GOOGLE_AUTH_CLIENT_CREDENTIALS,
                scopes=[
                    "https://www.googleapis.com/auth/userinfo.profile",
                    "https://www.googleapis.com/auth/userinfo.email",
                    "openid",
                ],
            )
            flow.redirect_uri = "postmessage"
            tokens = flow.fetch_token(code=code)
            credentials = id_token.verify_oauth2_token(
                tokens["id_token"],
                requests.Request(),
            )
            return credentials  # type: ignore
        except Exception:
            raise ValidationError(
                "Failed to fetch user info from google auth.",
            )

    @classmethod
    def _get_user(cls, credentials: Dict[str, str]) -> User:
        try:
            user = User.objects.get(email=credentials["email"])
        except User.DoesNotExist:
            extra_fields = {
                "last_name": credentials["family_name"],
                "avatar": credentials["picture"],
            }
            user = User.objects.create_user(
                email=credentials["email"],
                first_name=credentials["given_name"],
                **extra_fields,
            )
        return user

    @classmethod
    def perform_mutation(cls, _root, info: ResolveInfo, /, *, code):
        credentials = cls._get_credentials(code)
        user = cls._get_user(credentials)
        access, refresh = create_access_token(user), create_refresh_token(user)
        return cls(
            success=True,
            accessToken=access,
            refreshToken=refresh,
        )
