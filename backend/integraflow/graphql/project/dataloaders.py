from collections import defaultdict

from integraflow.graphql.core.dataloaders import DataLoader
from integraflow.project.models import Project


class ProjectByOrganizationIdLoader(DataLoader):
    context_key = "app_by_organization_id"

    def batch_load(self, keys):
        projects = Project.objects.using(
            self.database_connection_name
        ).filter(organization_id__in=keys)
        projects_by_organization_map = defaultdict(list)
        for project in projects:
            projects_by_organization_map[
                project.organization_id
            ].append(project)
        return [
            projects_by_organization_map.get(
                organization_id, []
            ) for organization_id in keys
        ]
