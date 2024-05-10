import logging

from datetime import datetime
from typing import Dict, List, TypedDict

from django.conf import settings

from integraflow.core.utils import get_previous_day
from integraflow.event.models import Event, Person
from integraflow.organization.models import Organization
from integraflow.project.models import Project
from integraflow.survey.models import SurveyResponse


logger = logging.getLogger(__name__)
Count = TypedDict("Count", {"count": int, "limit": int})

OrgUsage = TypedDict(
    "OrgUsage",
    {
        "events": Count,
        "responses": Count,
        "persons": Count,
    },
)


def compute_daily_usage_for_organizations(*, dry_run: bool = False):
    period_start, period_end = get_previous_day()

    org_data: Dict[str, List[str]] = {}

    for project in Project.objects.all():
        org = project.organization
        id = org.id
        if id in org_data:
            org_data[id].append(project.id)
        else:
            org_data[id] = [project.id]

        for org_id, project_ids in org_data.items():
            try:
                usage = get_org_usage(
                    project_ids=project_ids,
                    period_start=period_start,
                    period_end=period_end
                )

                if not dry_run:
                    update_org_usage(org_id, usage)
            except Exception:
                logger.error(
                    f"Failed to compute usage for org {org_id}",
                    exc_info=True
                )


def get_org_usage(
    project_ids: List[str],
    period_start: datetime,
    period_end: datetime
) -> OrgUsage:
    default_usage: OrgUsage = {
        "events": {
            "count": 0,
            "limit": int(settings.EVENTS_USAGE_FREE_TIER_LIMIT)
        },
        "responses": {
            "count": 0,
            "limit": int(settings.RESPONSES_USAGE_FREE_TIER_LIMIT)
        },
        "persons": {
            "count": 0,
            "limit":  int(settings.PERSONS_USAGE_FREE_TIER_LIMIT),
        }
    }

    usage = default_usage.copy()

    usage["events"]["count"] = Event.objects.filter(
        project_id__in=project_ids,
        timestamp__gte=period_start,
        timestamp__lte=period_end,
    ).count()

    usage["responses"]["count"] = SurveyResponse.objects.filter(
        survey__project_id__in=project_ids,
        created_at__gte=period_start,
        created_at__lte=period_end,
    ).count()

    usage["persons"]["count"] = Person.objects.filter(
        project_id__in=project_ids,
        created_at__gte=period_start,
        created_at__lte=period_end,
    ).count()

    return usage


def update_org_usage(org_id: str, usage: OrgUsage):
    org = Organization.objects.get(id=org_id)
    usage_metadata = org.usage_metadata or {}

    if "events" in usage_metadata:
        usage_metadata["events"]["count"] += usage["events"]["count"]
        usage_metadata["events"]["limit"] = usage["events"]["limit"]
    else:
        usage_metadata["events"] = usage["events"]

    if "responses" in usage_metadata:
        usage_metadata["responses"]["count"] += usage["responses"]["count"]
        usage_metadata["responses"]["limit"] = usage["responses"]["limit"]
    else:
        usage_metadata["responses"] = usage["responses"]

    if "persons" in usage_metadata:
        usage_metadata["persons"]["count"] += usage["persons"]["count"]
        usage_metadata["persons"]["limit"] = usage["persons"]["limit"]
    else:
        usage_metadata["persons"] = usage["persons"]

    org.usage_metadata = usage_metadata
    org.save()
