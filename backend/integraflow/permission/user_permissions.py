from functools import cached_property
from typing import Any, Dict, Optional
from uuid import UUID

from integraflow.organization.models import (
    Organization,
    OrganizationMembership
)
from integraflow.project.models import Project, ProjectMembership
from integraflow.user.models import User


class UserPermissions:
    """
    Class responsible for figuring out user permissions in an efficient manner.

    Generally responsible for the following tasks:
    1. Calculating whether a user has access to the current project
    2. Calculating whether a user has access to other project(s)

    Note that for efficiency sake the class _generally_ expects the current
    project to be passed to it and will use it to skip certain lookups.
    """

    def __init__(self, user: User):
        self.user = user
        self._current_project: Optional[Project] = user.project

        self._project_permissions: Dict[int, UserProjectPermissions] = {}

    @cached_property
    def current_project(self) -> "UserProjectPermissions":
        if self._current_project is None:
            raise ValueError(
                "Cannot call .current_project without passing project to User"
            )

        return UserProjectPermissions(self, self._current_project)

    def project(self, project: Project) -> "UserProjectPermissions":
        if self._current_project and project.pk == self._current_project.pk:
            return self.current_project

        if project.pk not in self._project_permissions:
            self._project_permissions[project.pk] = UserProjectPermissions(
                self,
                project
            )
        return self._project_permissions[project.pk]

    @cached_property
    def current_organization(self) -> Optional[Organization]:
        if self._current_project is None:
            raise ValueError(
                "Cannot call .current_organization without passing "
                "project to UserPermissions"
            )
        return self.get_organization(self._current_project.organization_id)

    def get_organization(
        self,
        organization_id: UUID
    ) -> Optional[Organization]:
        return self.organizations.get(organization_id)

    @cached_property
    def organizations(self) -> Dict[UUID, Organization]:
        return {
            member.organization_id: member.organization
            for member in self.organization_memberships.values()
        }

    @cached_property
    def organization_memberships(self) -> Dict[UUID, OrganizationMembership]:
        memberships = OrganizationMembership.objects.filter(
            user=self.user
        ).select_related("organization")
        return {
            membership.organization_id:
            membership for membership in memberships
        }

    @cached_property
    def explicit_project_memberships(self) -> Dict[UUID, Any]:
        memberships = ProjectMembership.objects.filter(
            parent_membership_id__in=[
                membership.pk for membership in
                self.organization_memberships.values()
            ]
        ).only("parent_membership_id", "level")
        return {
            membership.parent_membership_id:
            membership.level for membership in memberships
        }


class UserProjectPermissions:
    def __init__(self, user_permissions: "UserPermissions", project: Project):
        self.p = user_permissions
        self.project = project

    @cached_property
    def effective_membership_level(
        self
    ) -> Optional["OrganizationMembership.Level"]:
        """
        Return an effective membership level. None returned if the user has no
        explicit membership and organization access is too low for implicit
        membership.
        """

        membership = self.p.organization_memberships.get(
            self.project.organization_id
        )
        organization = self.p.get_organization(
            self.project.organization_id
        )

        return self.effective_membership_level_for_parent_membership(
            organization,
            membership
        )

    def effective_membership_level_for_parent_membership(
        self,
        organization: Optional[Organization],
        organization_membership: Optional[OrganizationMembership],
    ) -> Optional["OrganizationMembership.Level"]:
        if organization is None or organization_membership is None:
            return None

        if not self.project.access_control:
            return organization_membership.level

        explicit_membership_level = self.p.explicit_project_memberships.get(
            organization_membership.pk
        )
        if explicit_membership_level is not None:
            return max(
                explicit_membership_level, organization_membership.level
            )

        # Only organizations admins and above get implicit project membership
        elif (
            organization_membership.level < OrganizationMembership.Level.ADMIN
        ):
            return None
        else:
            return organization_membership.level
