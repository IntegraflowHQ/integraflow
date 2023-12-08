from typing import cast

from integraflow.graphql.core.context import get_database_connection_name
from integraflow.project import models


def resolve_themes(info):
    project = cast(models.Project, info.context.user.project)
    return models.ProjectTheme.objects.using(
        get_database_connection_name(info.context)
    ).filter(project_id=project.pk)
