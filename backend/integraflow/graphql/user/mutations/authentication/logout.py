from typing import cast

from django.utils import timezone
from django.utils.crypto import get_random_string

from integraflow.graphql.core.mutations import BaseMutation
from integraflow.graphql.core.doc_category import DOC_CATEGORY_AUTH
from integraflow.graphql.core.types.common import UserError
from integraflow.graphql.core import ResolveInfo

from integraflow.user.models import User
from integraflow.permission.auth_filters import AuthorizationFilters


class Logout(BaseMutation):
    class Meta:
        description = (
            "Deactivate all JWT tokens of the currently authenticated user."
        )
        doc_category = DOC_CATEGORY_AUTH
        error_type_class = UserError
        error_type_field = "user_errors"
        permissions = (AuthorizationFilters.AUTHENTICATED_USER,)

    @classmethod
    def perform_mutation(cls, _root, info: ResolveInfo, /):
        user = info.context.user
        user = cast(User, user)
        user.jwt_token_key = get_random_string(length=12)
        user.token_updated_at = timezone.now()
        user.save(update_fields=["jwt_token_key", "token_updated_at"])
        return cls()
