from operator import itemgetter

from ...app import models as app_models
from ...core.exceptions import PermissionDenied
from ...core.models import ModelWithMetadata
from ..core import ResolveInfo
from ..utils import get_user_or_app_from_context


def resolve_object_with_metadata_type(instance):
    # Imports inside resolvers to avoid circular imports.
    from ..app import types as app_types
    # from ..user import types as user_types

    if isinstance(instance, ModelWithMetadata):
        MODEL_TO_TYPE_MAP = {
            app_models.App: app_types.App,
            # user_models.User: user_types.User,
        }

        return MODEL_TO_TYPE_MAP.get(
            instance.__class__,  # type: ignore
            None
        ), instance.pk  # type: ignore

    raise ValueError(f"Unknown type: {instance.__class__}")


def resolve_metadata(metadata: dict):
    return sorted(
        [{"key": k, "value": v} for k, v in metadata.items()],
        key=itemgetter("key"),
    )


def check_private_metadata_privilege(
    root: ModelWithMetadata,
    info: ResolveInfo
):
    item_type, item_id = resolve_object_with_metadata_type(root)
    if not item_type:
        raise NotImplementedError(
            f"Model {type(root)} can't be mapped to type with metadata. "
            "Make sure that model exists inside MODEL_TO_TYPE_MAP."
        )

    requester = get_user_or_app_from_context(info.context)
    if not requester:
        raise PermissionDenied()


def resolve_private_metadata(root: ModelWithMetadata, info: ResolveInfo):
    check_private_metadata_privilege(root, info)
    return resolve_metadata(root.private_metadata)
