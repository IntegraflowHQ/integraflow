import graphene

from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.utils import timezone

from integraflow.graphql.core.mutations import BaseMutation
from integraflow.graphql.core.doc_category import DOC_CATEGORY_AUTH
from integraflow.graphql.core.types.common import UserError
from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.user.types import AuthUser

from integraflow.core.jwt import create_access_token, create_refresh_token
from integraflow.user.error_codes import UserErrorCode
from integraflow.user import models
from integraflow.user.utils import retrieve_user_by_email

from .utils import _get_new_csrf_token


class EmailTokenUserAuth(BaseMutation):
    """
    Mutation that authenticates a user account via email and authentication
    token.
    """

    class Arguments:
        email = graphene.String(
            required=True,
            description="The email which to login via the magic login code."
        )

        token = graphene.String(
            required=True,
            description="The magic login code."
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

    class Meta:
        description = (
            "Authenticates a user account via email and authentication token."
        )
        doc_category = DOC_CATEGORY_AUTH
        error_type_class = UserError
        error_type_field = "user_errors"

    @classmethod
    def perform_mutation(
        cls, _root, info: ResolveInfo, /, **data
    ):
        token = data["token"].strip()
        email = data["email"].strip().lower()

        key = "magic_" + str(email)

        if cache.has_key(key):
            cached_data = cache.get(key)

            if (str(token) == str(cached_data["token"])):
                user = retrieve_user_by_email(email)
                additional_paylod = {}
                csrf_token = _get_new_csrf_token()
                refresh_additional_payload = {
                    "csrfToken": csrf_token,
                }

                if user is None:
                    user = models.User.objects.create_user(email)
                    user.date_joined = timezone.now()
                    user.token_updated_at = timezone.now()
                    user.save(
                        update_fields=["date_joined", "token_updated_at"]
                    )

                access_token = create_access_token(
                    user,
                    additional_payload=additional_paylod
                )
                refresh_token = create_refresh_token(
                    user,
                    additional_payload=refresh_additional_payload
                )
                setattr(info.context, "refresh_token", refresh_token)
                info.context.user = user
                info.context._cached_user = user
                user.last_login = timezone.now()
                user.save(update_fields=["last_login"])

                cache.delete(key)

                return cls(
                    errors=[],
                    token=access_token,
                    refresh_token=refresh_token,
                    csrf_token=csrf_token,
                    user=user
                )
            else:
                raise ValidationError({
                    "token": ValidationError(
                        "Your login code was incorrect. Please try again.",
                        code=UserErrorCode.INVALID_MAGIC_CODE.value,
                    )
                })
        else:
            raise ValidationError({
                "token": ValidationError(
                    "The magic code/link has expired please try again",
                    code=UserErrorCode.INVALID_MAGIC_CODE.value,
                )
            })
