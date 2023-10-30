from integraflow.user.models import User
from integraflow.graphql.core.dataloaders import DataLoader


class UserByUserIdLoader(DataLoader):
    context_key = "user_by_id"

    def batch_load(self, keys):
        user_map = User.objects.using(
            self.database_connection_name
        ).in_bulk(keys)
        return [user_map.get(user_id) for user_id in keys]


class UserByEmailLoader(DataLoader):
    context_key = "user_by_email"

    def batch_load(self, keys):
        user_map = (
            User.objects.using(self.database_connection_name)
            .filter(is_active=True)
            .in_bulk(keys, field_name="email")
        )
        return [user_map.get(email) for email in keys]
