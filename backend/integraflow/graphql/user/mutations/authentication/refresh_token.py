import graphene
from typing import Optional

from django.core.exceptions import ValidationError
from django.utils import timezone

from integraflow.core.jwt import (
    JWT_REFRESH_TOKEN_COOKIE_NAME,
    JWT_REFRESH_TYPE,
    create_access_token
)
from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_AUTH
from integraflow.graphql.core.mutations import BaseMutation
from integraflow.graphql.core.types.common import UserError
from integraflow.user.error_codes import UserErrorCode

from .utils import _does_token_match, get_payload, get_user


class RefreshToken(BaseMutation):
    """Mutation that refresh user token and returns token and user data."""

    token = graphene.String(
        description="Acess token to authenticate the user."
    )

    class Arguments:
        refresh_token = graphene.String(
            required=False,
            description="Refresh token."
        )
        csrf_token = graphene.String(
            required=False,
            description=(
                "CSRF token required to refresh token. This argument is "
                "required when `refreshToken` is provided as a cookie."
            ),
        )

    class Meta:
        description = (
            "Refresh JWT token. Mutation tries to take refreshToken from the "
            "input. If it fails it will try to take `refreshToken` from the "
            f"http-only cookie `{JWT_REFRESH_TOKEN_COOKIE_NAME}`. `csrfToken` "
            "is required when `refreshToken` is provided as a cookie."
        )
        doc_category = DOC_CATEGORY_AUTH
        error_type_class = UserError
        error_type_field = "account_errors"

    @classmethod
    def get_refresh_token_payload(cls, refresh_token):
        try:
            payload = get_payload(refresh_token)
        except ValidationError as e:
            raise ValidationError({"refreshToken": e})
        return payload

    @classmethod
    def get_refresh_token(
        cls, info: ResolveInfo, refresh_token: Optional[str] = None
    ) -> Optional[str]:
        request = info.context
        refresh_token = refresh_token or request.COOKIES.get(
            JWT_REFRESH_TOKEN_COOKIE_NAME, None
        )
        return refresh_token

    @classmethod
    def clean_refresh_token(cls, refresh_token):
        if not refresh_token:
            raise ValidationError(
                {
                    "refresh_token": ValidationError(
                        "Missing refreshToken",
                        code=UserErrorCode.JWT_MISSING_TOKEN.value,
                    )
                }
            )
        payload = cls.get_refresh_token_payload(refresh_token)
        if payload["type"] != JWT_REFRESH_TYPE:
            raise ValidationError(
                {
                    "refresh_token": ValidationError(
                        "Incorrect refreshToken",
                        code=UserErrorCode.JWT_INVALID_TOKEN.value,
                    )
                }
            )
        return payload

    @classmethod
    def clean_csrf_token(cls, csrf_token, payload):
        if not csrf_token:
            msg = (
                "CSRF token is required when refreshToken is provided by the "
                "cookie"
            )
            raise ValidationError(
                {
                    "csrf_token": ValidationError(
                        msg,
                        code=UserErrorCode.REQUIRED.value,
                    )
                }
            )
        is_valid = _does_token_match(csrf_token, payload["csrfToken"])
        if not is_valid:
            raise ValidationError(
                {
                    "csrf_token": ValidationError(
                        "Invalid csrf token",
                        code=UserErrorCode.JWT_INVALID_CSRF_TOKEN.value,
                    )
                }
            )

    @classmethod
    def get_user(cls, payload):
        try:
            user = get_user(payload)
        except ValidationError as e:
            raise ValidationError({"refresh_token": e})
        return user

    @classmethod
    def perform_mutation(
        cls,
        _root,
        info: ResolveInfo,
        /,
        *,
        csrf_token=None,
        refresh_token=None
    ):
        need_csrf = refresh_token is None
        refresh_token = cls.get_refresh_token(info, refresh_token)
        payload = cls.clean_refresh_token(refresh_token)

        # None when we got refresh_token from cookie.
        if need_csrf:
            cls.clean_csrf_token(csrf_token, payload)

        user = get_user(payload)
        token = create_access_token(
            user
        )
        if user and not user.is_anonymous:
            user.last_login = timezone.now()
            user.save(update_fields=["last_login"])
        return cls(
            errors=[],
            token=token
        )
