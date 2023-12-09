import binascii
from dataclasses import dataclass
from typing import Literal, List, Optional, Tuple, Type, Union, overload

import graphene
from django.core.exceptions import ValidationError
from graphene import ObjectType
from graphql.error import GraphQLError

from integraflow.core.utils import is_temp_id
from integraflow.graphql.core.validators import validate_if_int_or_uuid
from integraflow.webhook.event_types import WebhookEventAsyncType


def snake_to_camel_case(name):
    """Convert snake_case variable name to camelCase."""
    if isinstance(name, str):
        split_name = name.split("_")
        return split_name[0] + "".join(map(str.capitalize, split_name[1:]))
    return name


def str_to_enum(name):
    """Create an enum value from a string."""
    return name.replace(" ", "_").replace("-", "_").upper()


def get_duplicates_items(first_list, second_list):
    """Return items that appear on both provided lists."""
    if first_list and second_list:
        return set(first_list) & set(second_list)
    return []


def get_duplicated_values(values):
    """Return set of duplicated values."""
    if values:
        return {value for value in values if values.count(value) > 1}
    return {}


@overload
def from_global_id_or_error(
    global_id: str,
    only_type: Union[ObjectType, str, None] = None,
    raise_error: Literal[True] = True,
) -> Tuple[str, str]:
    ...


@overload
def from_global_id_or_error(
    global_id: str,
    only_type: Union[Type[ObjectType], str, None] = None,
    raise_error: bool = False,
) -> Union[Tuple[str, str], Tuple[str, None]]:
    ...


def from_global_id_or_error(
    global_id: str,
    only_type: Union[Type[ObjectType], str, None] = None,
    raise_error: bool = False,
):
    """Resolve global ID or raise GraphQLError.

    Validates if given ID is a proper ID handled by Integraflow.
    Valid IDs formats, base64 encoded:
    'app:<int>:<str>' : External app ID with 'app' prefix
    '<type>:<int>' : Internal ID containing object type and ID as integer
    '<type>:<UUID>' : Internal ID containing object type and UUID
    Optionally validate the object type, if `only_type` is provided,
    raise GraphQLError when `raise_error` is set to True.

    Returns tuple: (type, id).
    """
    try:
        type_, id_ = graphene.Node.from_global_id(global_id)
    except (binascii.Error, UnicodeDecodeError, ValueError):
        raise GraphQLError(f"Couldn't resolve id: {global_id}.")
    else:
        if not validate_if_int_or_uuid(id_):
            raise GraphQLError(
                f"Error occurred during ID - {global_id} validation."
            )

    if only_type and str(type_) != str(only_type):
        if not raise_error:
            return type_, None
        raise GraphQLError(f"Must receive a {only_type} id.")
    return type_, id_


def from_global_id_or_none(
    global_id,
    only_type: Union[ObjectType, str, None] = None,
    raise_error: bool = False
):
    if not global_id:
        return None

    return from_global_id_or_error(global_id, only_type, raise_error)[1]


def to_global_id_or_none(instance):
    class_name = instance.__class__.__name__
    if instance is None or instance.pk is None:
        return None
    return graphene.Node.to_global_id(class_name, instance.pk)


def raise_validation_error(field=None, message=None, code=None):
    raise ValidationError({field: ValidationError(message, code=code)})


def ext_ref_to_global_id_or_error(model, external_reference):
    """Convert external reference to global id."""
    internal_id = (
        model.objects.filter(external_reference=external_reference)
        .values_list("id", flat=True)
        .first()
    )
    if internal_id:
        return graphene.Node.to_global_id(model.__name__, internal_id)
    else:
        raise_validation_error(
            field="externalReference",
            message=f"Couldn't resolve to a node: {external_reference}",
            code="not_found",
        )


def from_global_id_to_pk(obj: dict, key):
    id = obj.get(key, None)
    if (
        id is not None and
        not validate_if_int_or_uuid(id) and
        not is_temp_id(id)
    ):
        _, obj[key] = from_global_id_or_error(id)


def from_global_ids_to_pks(data: Union[list, dict], key: str):
    if isinstance(data, list):
        for obj in data:
            from_global_id_to_pk(obj, key)

    if isinstance(data, dict):
        from_global_id_to_pk(data, key)


def to_global_id_from_pk(class_name, obj: dict, key: str):
    id = obj.get(key, None)
    if id is not None and validate_if_int_or_uuid(id) and not is_temp_id(id):
        obj[key] = graphene.Node.to_global_id(class_name, id)


def to_global_ids_from_pks(class_name, data: Union[list, dict], key: str):
    if isinstance(data, list):
        for obj in data:
            to_global_id_from_pk(class_name, obj, key)

    if isinstance(data, dict):
        to_global_id_from_pk(class_name, data, key)


@dataclass
class WebhookEventInfo:
    type: str
    description: Optional[str] = None


def message_webhook_events(webhook_events: List[WebhookEventInfo]) -> str:
    description = "\n\nTriggers the following webhook events:"
    for event in webhook_events:
        webhook_type = (
            "async" if event.type in WebhookEventAsyncType.ALL else "sync"
        )
        description += f"\n- {event.type.upper()} ({webhook_type})"
        if event.description:
            description += f": {event.description}"
    return description
