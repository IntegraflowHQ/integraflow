import logging

from datetime import timedelta
from typing import List, Tuple

from celery.app import shared_task
from django.db.models import Count
from django.utils.timezone import now

from integraflow.event.models import Event, EventDefinition
from integraflow.project.models import Project


logger = logging.getLogger(__name__)


def calculate_event_property_usage() -> None:
    for project in Project.objects.all():
        try:
            calculate_event_property_usage_for_team(project_id=project.pk)
        except Exception:
            logger.error(
                f"""Failed to calculate event property usage for project
                    {project.pk}""",
                exc_info=True,
            )


@shared_task(ignore_result=True, max_retries=1)
def calculate_event_property_usage_for_team(project_id: str) -> None:
    project = Project.objects.get(pk=project_id)

    events_volume = _get_events_volume(project)
    for event in EventDefinition.objects.filter(project_id=project_id):
        volume = _extract_count(events_volume, event.name)
        EventDefinition.objects.filter(
            name=event.name, project_id=project_id
        ).update(volume_30_day=volume)


def _get_events_volume(project: Project) -> List[Tuple[str, int]]:
    timestamp = now() - timedelta(days=30)

    return (
        Event.objects.filter(project=project, timestamp__gt=timestamp)
        .values("event")
        .annotate(count=Count("id"))
        .values_list("event", "count")
    )  # type: ignore


def _extract_count(events_volume: List[Tuple[str, int]], event: str) -> int:
    try:
        return [count[1] for count in events_volume if count[0] == event][0]
    except IndexError:
        return 0
