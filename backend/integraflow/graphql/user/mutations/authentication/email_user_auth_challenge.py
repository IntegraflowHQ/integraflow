import graphene
import random
import string

from django.core.cache import cache
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from integraflow.graphql.core.mutations import BaseMutation
from integraflow.graphql.core.doc_category import DOC_CATEGORY_AUTH
from integraflow.graphql.core.types.common import UserError
from integraflow.graphql.core import ResolveInfo

from integraflow.messaging.tasks import send_magic_link

CACHE_DEFAULT_TIMEOUT: int = 5 * 60  # 5 minutes


class EmailUserAuthChallenge(BaseMutation):
    """
    Mutation that finds or creates a new user account by email and sends an
    email with token.
    """

    class Arguments:
        email = graphene.String(
            required=True,
            description="The email for which to generate the magic login code."
        )

    class Meta:
        description = (
            "Finds or creates a new user account by email and sends an email "
            "with token."
        )
        doc_category = DOC_CATEGORY_AUTH
        error_type_class = UserError
        error_type_field = "user_errors"

    success = graphene.Boolean(
        description="Whether the operation was successful."
    )

    authType = graphene.String(
        description="Supported challenge for this user."
    )

    @classmethod
    def _get_user(email: str):
        pass

    @classmethod
    def perform_mutation(
        cls, _root, info: ResolveInfo, /, *, email
    ):
        # Clean up
        email = email.strip().lower()
        validate_email(email)

        # Generate a random token
        token = (
            "".join(
                random.choices(string.ascii_lowercase + string.digits, k=5)
            )
            + "-"
            + "".join(
                random.choices(string.ascii_lowercase + string.digits, k=5)
            )
        )

        key = "magic_" + str(email)

        # Check if the key already exists in python
        if cache.has_key(key):
            data = cache.get(key)

            current_attempt = data["current_attempt"] + 1

            if data["current_attempt"] > 2:
                raise ValidationError(
                    "Max attempts exhausted. Please try again later."
                )
        else:
            current_attempt = 0

        value = {
            "current_attempt": current_attempt,
            "email": email,
            "token": token,
        }

        cache.set(key, value=value, timeout=CACHE_DEFAULT_TIMEOUT)
        send_magic_link(email=email, token=token)

        return cls(
            success=True,
            authType="authToken"
        )