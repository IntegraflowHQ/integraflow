from typing import TYPE_CHECKING
from urllib.parse import unquote, urlparse

import graphene
from django.core.files.storage import default_storage

from integraflow.core.utils import build_absolute_uri
from integraflow.graphql.core.doc_category import (
    DOC_CATEGORY_ORGANIZATIONS,
    DOC_CATEGORY_USERS,
    DOC_CATEGORY_APPS,
    DOC_CATEGORY_WEBHOOKS,
)
from integraflow.graphql.core.scalars import Decimal
from integraflow.graphql.core.enums import (
    UserErrorCode,
    AppErrorCode,
    JobStatusEnum,
    WebhookDryRunErrorCode,
    WebhookErrorCode,
    WebhookTriggerErrorCode,
)
from integraflow.graphql.core.scalars import Date
from integraflow.graphql.core.tracing import traced_resolver
from .base import BaseObjectType

if TYPE_CHECKING:
    from integraflow.graphql.core import ResolveInfo


class NonNullList(graphene.List):
    """A list type that automatically adds non-null constraint on contained
    items."""

    def __init__(self, of_type, *args, **kwargs):
        of_type = graphene.NonNull(of_type)
        super(NonNullList, self).__init__(of_type, *args, **kwargs)


class Error(BaseObjectType):
    field = graphene.String(
        description=(
            "Name of a field that caused the error. A value of `null` "
            "ndicates that the error isn't associated with a particular field."
        ),
        required=False,
    )
    message = graphene.String(description="The error message.")

    class Meta:
        description = "Represents an error in the input of a mutation."


class BulkError(BaseObjectType):
    path = graphene.String(
        description=(
            "Path to field that caused the error. A value of `null` indicates "
            "that the error isn't associated with a particular field."
        ),
        required=False,
    )
    message = graphene.String(description="The error message.")

    class Meta:
        description = "Represents an error in the input of a mutation."


class OrganizationError(Error):
    code = UserErrorCode(description="The error code.", required=True)

    class Meta:
        description = "Represents errors in organization mutations."
        doc_category = DOC_CATEGORY_ORGANIZATIONS


class UserError(Error):
    code = UserErrorCode(description="The error code.", required=True)

    class Meta:
        description = "Represents errors in user mutations."
        doc_category = DOC_CATEGORY_USERS


class AppError(Error):
    code = AppErrorCode(description="The error code.", required=True)

    class Meta:
        doc_category = DOC_CATEGORY_APPS


class WebhookError(Error):
    code = WebhookErrorCode(description="The error code.", required=True)

    class Meta:
        doc_category = DOC_CATEGORY_WEBHOOKS


class WebhookDryRunError(Error):
    code = WebhookDryRunErrorCode(description="The error code.", required=True)

    class Meta:
        doc_category = DOC_CATEGORY_WEBHOOKS


class WebhookTriggerError(Error):
    code = WebhookTriggerErrorCode(
        description="The error code.",
        required=True
    )

    class Meta:
        doc_category = DOC_CATEGORY_WEBHOOKS


class Image(graphene.ObjectType):
    url = graphene.String(required=True, description="The URL of the image.")
    alt = graphene.String(description="Alt text for an image.")

    class Meta:
        description = "Represents an image."

    def resolve_url(self, root, _info: "ResolveInfo"):
        if urlparse(root.url).netloc:
            return root.url
        return build_absolute_uri(root.url)


class File(graphene.ObjectType):
    url = graphene.String(required=True, description="The URL of the file.")
    content_type = graphene.String(
        required=False, description="Content type of the file."
    )

    @staticmethod
    def resolve_url(root, _info: "ResolveInfo"):
        # check if URL is absolute:
        if urlparse(root.url).netloc:
            return root.url
        # unquote used for preventing double URL encoding
        return build_absolute_uri(default_storage.url(unquote(root.url)))


class DecimalRangeInput(graphene.InputObjectType):
    gte = Decimal(
        description="Decimal value greater than or equal to.",
        required=False
    )
    lte = Decimal(
        description="Decimal value less than or equal to.",
        required=False
    )


class DateRangeInput(graphene.InputObjectType):
    gte = Date(description="Start date.", required=False)
    lte = Date(description="End date.", required=False)


class DateTimeRangeInput(graphene.InputObjectType):
    gte = graphene.DateTime(description="Start date.", required=False)
    lte = graphene.DateTime(description="End date.", required=False)


class IntRangeInput(graphene.InputObjectType):
    gte = graphene.Int(
        description="Value greater than or equal to.",
        required=False
    )
    lte = graphene.Int(
        description="Value less than or equal to.",
        required=False
    )


class Job(graphene.Interface):
    status = JobStatusEnum(description="Job status.", required=True)
    created_at = graphene.DateTime(
        description="Created date time of job in ISO 8601 format.",
        required=True
    )
    updated_at = graphene.DateTime(
        description="Date time of job last update in ISO 8601 format.",
        required=True
    )
    message = graphene.String(description="Job message.")

    @classmethod
    @traced_resolver
    def resolve_type(cls, instance, _info: "ResolveInfo"):
        """Map a data object to a Graphene type."""
        return None  # FIXME: why do we have this method?
