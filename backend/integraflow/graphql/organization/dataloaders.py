from integraflow.graphql.core.dataloaders import DataLoader
from integraflow.organization.models import Organization


class OrganizationByIdLoader(DataLoader):
    context_key = "organization_by_id"

    def batch_load(self, keys):
        organizations = Organization.objects.using(
            self.database_connection_name
        ).in_bulk(keys)
        return [organizations.get(organization_id) for organization_id in keys]
