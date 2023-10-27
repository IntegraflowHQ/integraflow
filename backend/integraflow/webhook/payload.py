from typing import (
    TYPE_CHECKING,
    Any,
    Dict,
    Optional,
    Union,
)
from django.utils.functional import SimpleLazyObject

import graphene
from django.utils import timezone
from graphene.utils.str_converters import to_camel_case

from integraflow import __version__
from integraflow.user.models import User
from .payload_serializers import PayloadSerializer

from . import traced_payload_generator

if TYPE_CHECKING:
    from integraflow.core.middleware import Requestor
    RequestorOrLazyObject = Union[SimpleLazyObject, "Requestor"]


def generate_requestor(requestor: Optional["RequestorOrLazyObject"] = None):
    if not requestor:
        return {"id": None, "type": None}
    if isinstance(requestor, User):
        return {
            "id": graphene.Node.to_global_id("User", requestor.id),
            "type": "user"
        }
    return {"id": requestor.name, "type": "app"}  # type: ignore


def generate_meta(
    *,
    requestor_data: Dict[str, Any],
    camel_case=False,
    **kwargs
):
    meta_result = {
        "issued_at": timezone.now().isoformat(),
        "version": __version__,
        "issuing_principal": requestor_data,
    }

    meta_result.update(kwargs)

    if camel_case:
        meta = {}
        for key, value in meta_result.items():
            meta[to_camel_case(key)] = value
    else:
        meta = meta_result

    return meta


@traced_payload_generator
def generate_metadata_updated_payload(
    instance: Any, requestor: Optional["RequestorOrLazyObject"] = None
):
    return PayloadSerializer().serialize(
        [instance],
        fields=[],
        pk_field_name="id",
        extra_dict_data={
            "meta": generate_meta(
                requestor_data=generate_requestor(requestor)
            )
        },
        dump_type_name=False,
    )
