from typing import Optional

import graphene
from graphene.types.generic import GenericScalar

from integraflow.core.models import ModelWithMetadata
from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.types.common import NonNullList
from .resolvers import (
    check_private_metadata_privilege,
    resolve_metadata,
    resolve_object_with_metadata_type,
    resolve_private_metadata,
)


class MetadataItem(graphene.ObjectType):
    key = graphene.String(
        required=True,
        description="Key of a metadata item."
    )
    value = graphene.String(
        required=True,
        description="Value of a metadata item."
    )


class Metadata(GenericScalar):
    """Metadata is a map of key-value pairs, both keys and values are `String`.

    Example:
    ```
    {
        "key1": "value1",
        "key2": "value2"
    }
    ```

    """


def _filter_metadata(metadata, keys):
    if keys is None:
        return metadata
    return {key: value for key, value in metadata.items() if key in keys}


class MetadataDescription:
    PRIVATE_METADATA = (
        "List of private metadata items."
    )
    PRIVATE_METAFIELD = (
        "A single key from private metadata. "
    )
    PRIVATE_METAFIELDS = (
        "Private metadata."
    )
    METADATA = "List of public metadata items."
    METAFIELD = (
        "A single key from public metadata.\n\n"
        "Tip: Use GraphQL aliases to fetch multiple keys."
    )
    METAFIELDS = (
        "Public metadata. Use `keys` to control which fields you want to "
        "include. The default is to include everything."
    )


class ObjectWithMetadata(graphene.Interface):
    private_metadata = NonNullList(
        MetadataItem,
        required=True,
        description=(
            "List of private metadata items. Requires staff permissions to "
            "access."
        ),
    )
    private_metafield = graphene.String(
        args={"key": graphene.NonNull(graphene.String)},
        description=(
            "A single key from private metadata. "
            "Requires staff permissions to access.\n\n"
            "Tip: Use GraphQL aliases to fetch multiple keys."
        ),
    )
    private_metafields = Metadata(
        args={"keys": NonNullList(graphene.String)},
        description=(
            "Private metadata. Requires staff permissions to access. "
            "Use `keys` to control which fields you want to include. "
            "The default is to include everything."
        ),
    )
    metadata = NonNullList(
        MetadataItem,
        required=True,
        description=(
            "List of public metadata items. Can be accessed without "
            "permissions."
        ),
    )
    metafield = graphene.String(
        args={"key": graphene.NonNull(graphene.String)},
        description=(
            "A single key from public metadata.\n\n"
            "Tip: Use GraphQL aliases to fetch multiple keys."
        ),
    )
    metafields = Metadata(
        args={"keys": NonNullList(graphene.String)},
        description=(
            "Public metadata. Use `keys` to control which fields you want to "
            "include. The default is to include everything."
        ),
    )

    @staticmethod
    def resolve_metadata(root: ModelWithMetadata, info: ResolveInfo):
        return resolve_metadata(root.metadata)

    @staticmethod
    def resolve_metafield(
        root: ModelWithMetadata, _info: ResolveInfo, *, key: str
    ) -> Optional[str]:
        return root.metadata.get(key)

    @staticmethod
    def resolve_metafields(
        root: ModelWithMetadata, _info: ResolveInfo, *, keys=None
    ):
        return _filter_metadata(root.metadata, keys)

    @staticmethod
    def resolve_private_metadata(root: ModelWithMetadata, info: ResolveInfo):
        return resolve_private_metadata(root, info)

    @staticmethod
    def resolve_private_metafield(
        root: ModelWithMetadata, info: ResolveInfo, *, key: str
    ) -> Optional[str]:
        check_private_metadata_privilege(root, info)
        return root.private_metadata.get(key)

    @staticmethod
    def resolve_private_metafields(
        root: ModelWithMetadata, info: ResolveInfo, *, keys=None
    ):
        check_private_metadata_privilege(root, info)
        return _filter_metadata(root.private_metadata, keys)

    @classmethod
    def resolve_type(cls, instance: ModelWithMetadata, info: ResolveInfo):
        item_type, _ = resolve_object_with_metadata_type(instance)
        return item_type
