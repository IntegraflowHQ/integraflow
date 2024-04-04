from collections import defaultdict
from django.utils.functional import LazyObject
from typing import Optional
from promise import Promise

from integraflow.core.auth import get_token_from_request
from integraflow.core.utils.lazyobjects import unwrap_lazy
from integraflow.graphql.core.context import IntegraflowContext
from integraflow.graphql.core.dataloaders import DataLoader
from integraflow.project.models import Project


class ProjectByIdLoader(DataLoader):
    context_key = "project_by_id"

    def batch_load(self, keys):
        projects = Project.objects.using(
            self.database_connection_name
        ).in_bulk(keys)
        return [projects.get(project_id) for project_id in keys]


class ProjectsByOrganizationIdLoader(DataLoader):
    context_key = "projects_by_organization_id"

    def batch_load(self, keys):
        projects = Project.objects.using(
            self.database_connection_name
        ).filter(organization_id__in=keys)

        projects_map = defaultdict(list)
        for project in projects:
            projects_map[project.organization_id].append(project)

        return [
            projects_map.get(organization_id, []) for organization_id in keys
        ]


class ProjectByTokenLoader(DataLoader):
    context_key = "project_by_token"

    def batch_load(self, keys):
        project_map = (
            Project.objects.using(self.database_connection_name)
            .in_bulk(keys, field_name="api_token")
        )
        return [project_map.get(token) for token in keys]


def promise_project(context: IntegraflowContext) -> Promise[Optional[Project]]:
    app_token = get_token_from_request(context)
    if not app_token or len(app_token) < 10:
        return Promise.resolve(None)  # type: ignore
    return ProjectByTokenLoader(context).load(app_token)


def get_project_promise(
    context: IntegraflowContext
) -> Promise[Optional[Project]]:
    user = None
    if hasattr(context, "user"):
        user = context.user
        if isinstance(user, LazyObject):
            user = unwrap_lazy(user)

    if user and user.project:
        return Promise.resolve(user.project)

    return promise_project(context)
