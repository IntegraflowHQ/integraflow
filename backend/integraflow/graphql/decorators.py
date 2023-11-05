from enum import Enum
from functools import wraps
from typing import Iterable, List, Union

from graphene import ResolveInfo

from integraflow.core.exceptions import PermissionDenied
from integraflow.permission.auth_filters import is_app, is_staff_user
from integraflow.permission.enums import BasePermissionEnum
from integraflow.permission.utils import (
    one_of_permissions_or_auth_filter_required,
)

from .utils import get_user_or_app_from_context


def context(f):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            info = next(arg for arg in args if isinstance(arg, ResolveInfo))
            return func(info.context, *args, **kwargs)

        return wrapper

    return decorator


def requester_passes_test(test_func):
    """Determine if user/app has permission to access to content."""

    def decorator(f):
        @wraps(f)
        @context(f)
        def wrapper(context, *args, **kwargs):
            test_func(context)
            return f(*args, **kwargs)

        return wrapper

    return decorator


def permission_required(
    perm: Union[BasePermissionEnum, List[BasePermissionEnum]]
):
    def check_perms(context):
        if isinstance(perm, Enum):
            perms = [perm]
        else:
            perms = perm

        requestor = get_user_or_app_from_context(context)
        if not one_of_permissions_or_auth_filter_required(requestor, perms):
            raise PermissionDenied(permissions=perms)

    return requester_passes_test(check_perms)


def one_of_permissions_required(perms: Iterable[BasePermissionEnum]):
    def check_perms(context):
        if not one_of_permissions_or_auth_filter_required(context, perms):
            raise PermissionDenied(permissions=perms)

    return requester_passes_test(check_perms)


def _check_staff_member(context):
    if not is_staff_user(context):
        raise PermissionDenied(
            message=(
                "You need to be authenticated as a staff member to perform"
                " this action"
            )
        )


staff_member_required = requester_passes_test(_check_staff_member)


def _check_staff_member_or_app(context):
    if not (is_app(context) or is_staff_user(context)):
        raise PermissionDenied(
            message=(
                "You need to be authenticated as a staff member or an app to "
                "perform this action"
            )
        )


staff_member_or_app_required = requester_passes_test(
    _check_staff_member_or_app
)
