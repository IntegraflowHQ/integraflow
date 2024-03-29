from uuid import UUID
import jwt

from integraflow.graphql.core.utils import from_global_id_or_none
from integraflow.graphql.project.dataloaders import ProjectByIdLoader
from integraflow.graphql.user.dataloaders import UserByEmailLoader
from integraflow.permission.user_permissions import UserPermissions
from integraflow.user.models import User

from .auth import get_project_from_request, get_token_from_request
from .jwt import (
    JWT_ACCESS_TYPE,
    JWT_THIRDPARTY_ACCESS_TYPE,
    is_integraflow_token,
    jwt_decode,
)


# Moved from `django.contrib.auth.backends.ModelBackend`
class BaseBackend:
    def authenticate(self, request, **kwargs):
        return None

    def get_user(self, user_id):
        return None

    def get_user_permissions(self, user_obj):
        return None

    def get_user_perms(self, user_obj, obj=None):
        return set()

    def get_group_perms(self, user_obj, obj=None):
        return set()

    def get_all_permissions(self, user_obj, obj=None):
        return {
            *self.get_user_perms(user_obj, obj=obj),
            *self.get_group_perms(user_obj, obj=obj),
        }

    def has_perm(self, user_obj, perm, obj=None):
        return perm in self.get_all_permissions(user_obj, obj=obj)


class JSONWebTokenBackend(BaseBackend):
    def authenticate(self, request=None, **kwargs):
        return load_user_from_request(request)

    def get_user(self, user_id):
        try:
            return User.objects.get(email=user_id, is_active=True)
        except User.DoesNotExist:
            return None

    def _get_user_permissions(self, user_obj):
        # overwrites base method to force using our permission field
        return user_obj.effective_permissions

    def _get_group_permissions(self, user_obj):
        # overwrites base method to force using our permission field
        return user_obj.effective_permissions

    def _get_permissions(self, user_obj, obj, from_name):
        """Return the permissions of `user_obj` from `from_name`.

        `from_name` can be either "group" or "user" to return permissions from
        `_get_group_permissions` or `_get_user_permissions` respectively.
        """
        if not user_obj.is_active or user_obj.is_anonymous or obj is not None:
            return set()

        perm_cache_name = "_effective_permissions_cache"
        if not getattr(user_obj, perm_cache_name, None):
            perms = getattr(self, f"_get_{from_name}_permissions")(user_obj)
            perms = perms.values_list(
                "content_type__app_label",
                "codename"
            ).order_by()
            setattr(
                user_obj,
                perm_cache_name,
                {f"{ct}.{name}" for ct, name in perms}
            )
        return getattr(user_obj, perm_cache_name)

    # Moved from `django.contrib.auth.backends.ModelBackend`
    def get_user_perms(self, user_obj, obj=None):
        """Return a set of permissions the user `user_obj` holds directly."""
        return self._get_permissions(user_obj, obj, "user")

    # Moved from `django.contrib.auth.backends.ModelBackend`
    def get_group_perms(self, user_obj, obj=None):
        """
        Return a set of permissions the user `user_obj` gets from their groups.
        """
        return self._get_permissions(user_obj, obj, "group")

    def get_user_permissions(self, user_obj):
        return UserPermissions(user_obj)

    # Moved from `django.contrib.auth.backends.ModelBackend`
    def get_all_permissions(self, user_obj, obj=None):
        if not user_obj.is_active or user_obj.is_anonymous or obj is not None:
            return set()
        if not hasattr(user_obj, "_perm_cache"):
            user_obj._perm_cache = super().get_all_permissions(user_obj)
        return user_obj._perm_cache

    # Moved from `django.contrib.auth.backends.ModelBackend`
    def has_perm(self, user_obj, perm, obj=None):
        return user_obj.is_active and super().has_perm(user_obj, perm, obj=obj)


def load_user_from_request(request):
    if request is None:
        return None
    jwt_token = get_token_from_request(request)
    if not jwt_token or not is_integraflow_token(jwt_token):
        return None
    payload = jwt_decode(jwt_token)

    jwt_type = payload.get("type")
    if jwt_type not in [JWT_ACCESS_TYPE, JWT_THIRDPARTY_ACCESS_TYPE]:
        raise jwt.InvalidTokenError(
            "Invalid token. Create new one by using emailTokenUserAuth "
            "mutation."
        )

    user = UserByEmailLoader(request).load(payload["email"]).get()
    user_jwt_token = payload.get("token")
    if not user_jwt_token:
        raise jwt.InvalidTokenError(
            "Invalid token. Create new one by using emailTokenUserAuth "
            "mutation."
        )
    elif not user:
        raise jwt.InvalidTokenError(
            "Invalid token. User does not exist or is inactive."
        )
    if user.jwt_token_key != user_jwt_token:
        raise jwt.InvalidTokenError(
            "Invalid token. Create new one by using emailTokenUserAuth "
            "mutation."
        )

    project_id = from_global_id_or_none(get_project_from_request(request))
    if project_id is not None:
        project = ProjectByIdLoader(request).load(UUID(project_id)).get()
        if project:
            user.project = project
            user.organization = project.organization

    if payload.get("is_staff"):
        user.is_staff = True
    return user
