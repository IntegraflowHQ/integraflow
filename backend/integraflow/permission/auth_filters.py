from typing import cast

from integraflow.graphql.core.context import IntegraflowContext
from integraflow.organization.models import OrganizationMembership
from integraflow.user.models import User

from .enums import BasePermissionEnum


def is_app(context: IntegraflowContext):
    return bool(context.app)


def is_api(context: IntegraflowContext):
    return bool(context.project)


def is_user(context: IntegraflowContext):
    user = context.user
    return user and user.is_authenticated


def get_org_member_level(context: IntegraflowContext):
    requesting_level = None

    user = context.user
    if user and is_user(context):
        user_permission = user.get_permission()
        if user_permission is not None:
            try:
                requesting_level = OrganizationMembership.objects.get(
                    user=cast(User, context.user),
                    organization=user_permission.current_organization
                ).level
            except OrganizationMembership.DoesNotExist:
                requesting_level = None

    return requesting_level


def is_organization_member(context: IntegraflowContext):
    return get_org_member_level(context) is not None


def is_organization_admin(context: IntegraflowContext):
    requesting_level = get_org_member_level(context)
    if requesting_level is None:
        return False

    return requesting_level >= OrganizationMembership.Level.ADMIN


def is_organization_owner(context: IntegraflowContext):
    requesting_level = get_org_member_level(context)
    if requesting_level is None:
        return False

    return requesting_level == OrganizationMembership.Level.OWNER


def get_project_member_level(context: IntegraflowContext):
    requesting_level = None

    user = context.user
    if user and is_user(context):
        user_permission = user.get_permission()
        if user_permission is not None:
            requesting_level = (
                user_permission.current_project.effective_membership_level
            )

    return requesting_level


def is_project_member(context: IntegraflowContext):
    return get_project_member_level(context) is not None


def is_project_admin(context: IntegraflowContext):
    requesting_level = get_project_member_level(context)
    if requesting_level is None:
        return False

    return requesting_level >= OrganizationMembership.Level.ADMIN


class AuthorizationFilters(BasePermissionEnum):
    # Grants access to any authenticated app.
    AUTHENTICATED_APP = "authorization_filters.authenticated_app"

    # Grants access to any authenticated api.
    AUTHENTICATED_API = "authorization_filters.authenticated_api"

    # Grants access to any authenticated user.
    AUTHENTICATED_USER = "authorization_filters.authenticated_user"

    # Requires at least admin effective organization access level.
    ORGANIZATION_ADMIN_ACCESS = (
        "authorization_filters.organization_admin_access"
    )

    # Requires effective organization membership for any access at all.
    ORGANIZATION_MEMBER_ACCESS = (
        "authorization_filters.organization_member_access"
    )

    # Requires an owner effective organization access level.
    ORGANIZATION_OWNER_ACCESS = (
        "authorization_filters.organization_owner_access"
    )

    # Requires at least admin effective project access level.
    PROJECT_ADMIN_ACCESS = (
        "authorization_filters.project_admin_access"
    )

    # Requires effective project membership for any access at all.
    PROJECT_MEMBER_ACCESS = "authorization_filters.project_member_access"

    # Grants access to the owner of the related object. This rule doesn't come
    # with any permission function, as the ownership needs to be defined
    # individually in each case.
    OWNER = "authorization_filters.owner"


AUTHORIZATION_FILTER_MAP = {
    AuthorizationFilters.AUTHENTICATED_APP: is_app,
    AuthorizationFilters.AUTHENTICATED_API: is_api,
    AuthorizationFilters.AUTHENTICATED_USER: is_user,
    AuthorizationFilters.ORGANIZATION_ADMIN_ACCESS: is_organization_admin,
    AuthorizationFilters.ORGANIZATION_MEMBER_ACCESS: is_organization_member,
    AuthorizationFilters.ORGANIZATION_ADMIN_ACCESS: is_organization_owner,
    AuthorizationFilters.PROJECT_ADMIN_ACCESS: is_project_admin,
    AuthorizationFilters.PROJECT_MEMBER_ACCESS: is_project_member,
}


def resolve_authorization_filter_fn(perm):
    return AUTHORIZATION_FILTER_MAP.get(perm)
