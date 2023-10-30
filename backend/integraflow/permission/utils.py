from typing import Iterable

from .auth_filters import AuthorizationFilters, resolve_authorization_filter_fn
from .enums import BasePermissionEnum


def all_permissions_required(
    context,
    permissions: Iterable[BasePermissionEnum]
):
    """
    Determine whether user or app has rights to perform an action.

    The `context` parameter is the Context instance associated with the
    request.

    All required Integraflow's permissions must be fulfilled.
    If authorization filter provided, at least one of them must be fulfilled.
    """
    if not permissions:
        return True

    perm_results = _get_result_of_authorization_filters_checks(
        context, permissions
    )

    return all(perm_results)


def one_of_permissions_or_auth_filter_required(
    context,
    permissions: Iterable[BasePermissionEnum]
) -> bool:
    """Determine whether user or app has rights to perform an action.

    The `context` parameter is the Context instance associated with the
    request.
    """
    if not permissions:
        return True

    perm_results = _get_result_of_authorization_filters_checks(
        context,
        permissions
    )
    return any(perm_results)


def _get_result_of_authorization_filters_checks(
    context, permissions: Iterable[BasePermissionEnum]
) -> Iterable[bool]:
    authorization_filters = [
        p for p in permissions if isinstance(p, AuthorizationFilters)
    ]
    auth_filters_results = []
    if authorization_filters:
        for p in authorization_filters:
            perm_fn = resolve_authorization_filter_fn(p)
            if perm_fn:
                res = perm_fn(context)
                auth_filters_results.append(bool(res))

    return auth_filters_results


def message_one_of_permissions_required(
    permissions: Iterable[BasePermissionEnum],
) -> str:
    permission_msg = ", ".join([p.name for p in permissions])
    return f"\n\nRequires one of the following permissions: {permission_msg}."
