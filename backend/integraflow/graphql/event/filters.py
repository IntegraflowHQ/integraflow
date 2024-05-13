import graphene
import django_filters

from integraflow.event.models import Event
from integraflow.graphql.core.doc_category import DOC_CATEGORY_EVENTS
from integraflow.graphql.core.filters import ListObjectTypeFilter
from integraflow.graphql.core.types.filter_input import FilterInputObjectType


def filter_events_list(qs, _, values):
    if not values:
        return qs
    return qs.filter(slug__in=values)


def filter_event(qs, _, value):
    if not value:
        return qs
    return qs.filter(status=value)


class EventFilter(django_filters.FilterSet):
    events = ListObjectTypeFilter(
        input_class=graphene.String,
        method=filter_events_list
    )
    event = django_filters.CharFilter(method=filter_event)

    class Meta:
        model = Event
        fields = [
            "event"
        ]


class EventFilterInput(FilterInputObjectType):
    class Meta:
        doc_category = DOC_CATEGORY_EVENTS
        filterset_class = EventFilter
