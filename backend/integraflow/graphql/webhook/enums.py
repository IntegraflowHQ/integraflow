import graphene

from integraflow.webhook.event_types import (
    WebhookEventAsyncType,
    WebhookEventSyncType
)
from integraflow.graphql.core.doc_category import DOC_CATEGORY_WEBHOOKS
from integraflow.graphql.core.types.base import BaseEnum
from integraflow.graphql.core.utils import str_to_enum

checkout_updated_event_enum_description = (
    "A checkout is updated. It also triggers all updates related to the "
    "checkout."
)

order_confirmed_event_enum_description = (
    "An order is confirmed (status change unconfirmed -> unfulfilled) "
    "by a staff user using the OrderConfirm mutation. "
    "It also triggers when the user completes the checkout and the shop "
    "setting `automatically_confirm_all_new_orders` is enabled."
)

order_fully_paid_event_enum_description = (
    "Payment is made and an order is fully paid."
)

order_updated_event_enum_description = (
    "An order is updated; triggered for all changes related to an order; "
    "covers all other order webhooks, except for ORDER_CREATED."
)


WEBHOOK_EVENT_DESCRIPTION = {
    WebhookEventAsyncType.APP_INSTALLED: "A new app installed.",
    WebhookEventAsyncType.APP_UPDATED: "An app updated.",
    WebhookEventAsyncType.APP_DELETED: "An app deleted.",
    WebhookEventAsyncType.APP_STATUS_CHANGED: "An app status is changed.",
}


def description(enum):
    if enum:
        return WEBHOOK_EVENT_DESCRIPTION.get(enum.value)
    return "Enum determining type of webhook."


WebhookEventTypeEnum = graphene.Enum(
    "WebhookEventTypeEnum",
    [
        (str_to_enum(e_type[0]), e_type[0])
        for e_type in (
            WebhookEventAsyncType.CHOICES + WebhookEventSyncType.CHOICES
        )
    ],
    description=description,
)
WebhookEventTypeEnum.doc_category = DOC_CATEGORY_WEBHOOKS


WebhookEventTypeAsyncEnum = graphene.Enum(
    "WebhookEventTypeAsyncEnum",
    [
        (
            str_to_enum(e_type[0]), e_type[0]
        ) for e_type in WebhookEventAsyncType.CHOICES
    ],
    description=description,
)
WebhookEventTypeAsyncEnum.doc_category = DOC_CATEGORY_WEBHOOKS

WebhookEventTypeSyncEnum = graphene.Enum(
    "WebhookEventTypeSyncEnum",
    [
        (
            str_to_enum(e_type[0]), e_type[0]
        ) for e_type in WebhookEventSyncType.CHOICES
    ],
    description=description,
)
WebhookEventTypeSyncEnum.doc_category = DOC_CATEGORY_WEBHOOKS

WebhookSampleEventTypeEnum = graphene.Enum(
    "WebhookSampleEventTypeEnum",
    [
        (str_to_enum(e_type[0]), e_type[0])
        for e_type in WebhookEventAsyncType.CHOICES
        if e_type[0] != WebhookEventAsyncType.ANY
    ],
)
WebhookSampleEventTypeEnum.doc_category = DOC_CATEGORY_WEBHOOKS


class EventDeliveryStatusEnum(BaseEnum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"

    class Meta:
        doc_category = DOC_CATEGORY_WEBHOOKS
