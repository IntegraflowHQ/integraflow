from django.apps import AppConfig
from django.db.models.signals import post_delete


class UserAppConfig(AppConfig):
    name = "integraflow.user"

    def ready(self):
        from .models import User
        from .signals import delete_avatar

        post_delete.connect(
            delete_avatar,
            sender=User,
            dispatch_uid="delete_user_avatar",
        )
