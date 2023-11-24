from typing import Dict

import graphene
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone
from google.auth.transport import requests
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow

from integraflow.core.jwt import create_access_token, create_refresh_token
from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_AUTH
from integraflow.graphql.core.mutations import BaseMutation
from integraflow.graphql.core.utils import from_global_id_or_error
from integraflow.graphql.core.types.common import UserError
from integraflow.graphql.organization.types import OrganizationInviteDetails
from integraflow.graphql.user.types import AuthUser
from integraflow.organization.models import OrganizationInvite
from integraflow.user.models import User

from .utils import _get_new_csrf_token

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

        invite_id = graphene.ID(
            description="An optional invite ID for an organization."
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
    token = graphene.String(
        description="Access token to authenticate the user."
    )
    refresh_token = graphene.String(
        description="JWT refresh token, required to re-generate access token."
    )
    csrf_token = graphene.String(
        description="CSRF token required to re-generate access token."
    )
    user = graphene.Field(
        AuthUser,
        description=(
            "A user that has access to the the resources of an organization."
        )
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
    def perform_mutation(cls, _root, info: ResolveInfo, /, *, code, invite_id):
        credentials = cls._get_credentials(code)
        user = cls._get_user(credentials)

        if invite_id is not None:
            _, invite = from_global_id_or_error(
                invite_id,
                OrganizationInviteDetails
            )
            OrganizationInvite.objects.accept_invite(user, invite)

        csrf_token = _get_new_csrf_token()
        refresh_additional_payload = {
            "csrfToken": csrf_token,
        }

        access_token = create_access_token(user)
        refresh_token = create_refresh_token(
            user,
            additional_payload=refresh_additional_payload
        )
        setattr(info.context, "refresh_token", refresh_token)
        info.context.user = user
        info.context._cached_user = user
        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        return cls(
            errors=[],
            token=access_token,
            refresh_token=refresh_token,
            csrf_token=csrf_token,
            user=user
        )
