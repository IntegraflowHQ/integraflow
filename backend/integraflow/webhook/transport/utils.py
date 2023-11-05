import hashlib
import json
import logging
from contextlib import contextmanager
from dataclasses import dataclass
from enum import Enum
from time import time
from typing import Callable, Dict, Optional
from urllib.parse import unquote, urlparse, urlunparse

import boto3
from botocore.exceptions import ClientError
from celery.exceptions import MaxRetriesExceededError, Retry
from celery.utils.log import get_task_logger
from django.conf import settings
from django.urls import reverse
from google.cloud.pubsub_v1 import PublisherClient
from google.cloud.pubsub_v1.publisher import exceptions
from requests import RequestException
from requests_hardened.ip_filter import InvalidIPAddress

from integraflow.app.headers import AppHeaders
from integraflow.app.models import App
from integraflow.core.http_client import HTTPClient
from integraflow.core.models import (
    EventDelivery,
    EventDeliveryAttempt,
    EventDeliveryStatus,
    EventPayload,
)
from integraflow.core.utils import build_absolute_uri
from integraflow.webhook import observability
from . import signature_for_payload

logger = logging.getLogger(__name__)
task_logger = get_task_logger(__name__)


DEFAULT_TAX_CODE = "UNMAPPED"
DEFAULT_TAX_DESCRIPTION = "Unmapped Product/Product Type"


class WebhookSchemes(str, Enum):
    HTTP = "http"
    HTTPS = "https"
    AWS_SQS = "awssqs"
    GOOGLE_CLOUD_PUBSUB = "gcpubsub"


@dataclass
class PaymentAppData:
    app_pk: Optional[int]
    app_identifier: Optional[str]
    name: str


@dataclass
class WebhookResponse:
    content: str
    request_headers: Optional[Dict] = None
    response_headers: Optional[Dict] = None
    response_status_code: Optional[int] = None
    status: str = EventDeliveryStatus.SUCCESS
    duration: float = 0.0


def generate_cache_key_for_webhook(
    key_data: dict, webhook_url: str, event: str, app_id: int
) -> str:
    """Generate cache key for webhook.

    Cache key takes into account the webhook url, event type, and app id.
    The response from webhook_url can be different for different events.
    Apps can have assigned different permissions, so the response can vary for
    different apps.
    """
    key = json.dumps(key_data)
    return (
        f"{app_id}-{webhook_url}-{event}-"
        f"{hashlib.sha256(key.encode('utf-8')).hexdigest()}"
    )


def send_webhook_using_http(
    target_url,
    message,
    domain,
    signature,
    event_type,
    timeout=settings.WEBHOOK_TIMEOUT,
    custom_headers: Optional[Dict[str, str]] = None,
) -> WebhookResponse:
    """Send a webhook request using http / https protocol.

    :param target_url: Target URL request will be sent to.
    :param message: Payload that will be used.
    :param domain: Current site domain.
    :param signature: Webhook secret key checksum.
    :param event_type: Webhook event type.
    :param timeout: Request timeout.
    :param custom_headers: Custom headers which will be added to request
    headers.

    :return: WebhookResponse object.
    """
    headers = {
        "Content-Type": "application/json",
        AppHeaders.EVENT_TYPE: event_type,
        AppHeaders.DOMAIN: domain,
        AppHeaders.SIGNATURE: signature,
        AppHeaders.API_URL: build_absolute_uri(reverse("api"), domain),
    }

    if custom_headers:
        headers.update(custom_headers)

    try:
        response = HTTPClient.send_request(
            "POST",
            target_url,
            data=message,
            headers=headers,
            timeout=timeout,
            allow_redirects=False,
        )
    except RequestException as e:
        if e.response:
            return WebhookResponse(
                content=e.response.text,
                status=EventDeliveryStatus.FAILED,
                request_headers=headers,
                response_headers=dict(e.response.headers),
                response_status_code=e.response.status_code,
            )

        if isinstance(e, InvalidIPAddress):
            message = "Invalid IP address"
        else:
            message = str(e)
        result = WebhookResponse(
            content=message,
            status=EventDeliveryStatus.FAILED,
            request_headers=headers,
        )
        return result

    return WebhookResponse(
        content=response.text,
        request_headers=headers,
        response_headers=dict(response.headers),
        response_status_code=response.status_code,
        duration=response.elapsed.total_seconds(),
        status=(
            EventDeliveryStatus.SUCCESS if response.ok
            else EventDeliveryStatus.FAILED
        ),
    )


def send_webhook_using_aws_sqs(
    target_url, message, domain, signature, event_type, **kwargs
):
    parts = urlparse(target_url)
    region = "us-east-1"
    hostname_parts = parts.hostname.split(".")
    if len(hostname_parts) == 4 and hostname_parts[0] == "sqs":
        region = hostname_parts[1]
    client = boto3.client(
        "sqs",
        region_name=region,
        aws_access_key_id=parts.username,
        aws_secret_access_key=(
            unquote(parts.password) if parts.password else parts.password
        ),
    )
    queue_url = urlunparse(
        (
            "https",
            parts.hostname,
            parts.path,
            parts.params,
            parts.query,
            parts.fragment,
        )
    )
    is_fifo = parts.path.endswith(".fifo")

    msg_attributes = {
        "IntegraflowDomain": {"DataType": "String", "StringValue": domain},
        "IntegraflowApiUrl": {
            "DataType": "String",
            "StringValue": build_absolute_uri(reverse("api"), domain),
        },
        "EventType": {"DataType": "String", "StringValue": event_type},
    }
    if signature:
        msg_attributes["Signature"] = {
            "DataType": "String",
            "StringValue": signature,
        }

    message_kwargs = {
        "QueueUrl": queue_url,
        "MessageAttributes": msg_attributes,
        "MessageBody": message.decode("utf-8"),
    }
    if is_fifo:
        message_kwargs["MessageGroupId"] = domain
    with catch_duration_time() as duration:
        try:
            response = client.send_message(**message_kwargs)
        except (ClientError,) as e:
            return WebhookResponse(
                content=str(e),
                status=EventDeliveryStatus.FAILED,
                duration=duration()
            )
        return WebhookResponse(content=response, duration=duration())


def send_webhook_using_google_cloud_pubsub(
    target_url, message, domain, signature, event_type, **kwargs
):
    parts = urlparse(target_url)
    client = PublisherClient()
    topic_name = parts.path[1:]  # drop the leading slash
    with catch_duration_time() as duration:
        try:
            future = client.publish(
                topic_name,
                message,
                integraflowDomain=domain,
                integraflowApiUrl=build_absolute_uri(reverse("api"), domain),
                eventType=event_type,
                signature=signature,
            )
        except (
            exceptions.MessageTooLargeError,
            RuntimeError
        ) as e:
            return WebhookResponse(
                content=str(e),
                status=EventDeliveryStatus.FAILED
            )
        response_duration = duration()
        response = future.result()
        return WebhookResponse(content=response, duration=response_duration)


def send_webhook_using_scheme_method(
    target_url,
    domain,
    secret,
    event_type,
    data,
    custom_headers=None,
) -> WebhookResponse:
    parts = urlparse(target_url)
    message = data.encode("utf-8")
    signature = signature_for_payload(message, secret)
    scheme_matrix: Dict[WebhookSchemes, Callable] = {
        WebhookSchemes.HTTP: send_webhook_using_http,
        WebhookSchemes.HTTPS: send_webhook_using_http,
        WebhookSchemes.AWS_SQS: send_webhook_using_aws_sqs,
        WebhookSchemes.GOOGLE_CLOUD_PUBSUB:
            send_webhook_using_google_cloud_pubsub,
    }

    if send_method := scheme_matrix.get(parts.scheme.lower()):
        # try:
        return send_method(
            target_url,
            message,
            domain,
            signature,
            event_type,
            custom_headers=custom_headers,
        )
    raise ValueError("Unknown webhook scheme: %r" % (parts.scheme,))


def handle_webhook_retry(
    celery_task, webhook, response_content, delivery, delivery_attempt
) -> bool:
    """Handle celery retry for webhook requests.

    Calls retry to re-run the celery_task by raising Retry exception.
    When MaxRetriesExceededError is raised the function will end without
    exception.
    """
    is_success = True
    task_logger.info(
        "[Webhook ID: %r] Failed request to %r: %r for event: %r."
        " Delivery attempt id: %r",
        webhook.id,
        webhook.target_url,
        response_content,
        delivery.event_type,
        delivery_attempt.id,
    )
    try:
        countdown = celery_task.retry_backoff * (
            2**celery_task.request.retries
        )
        celery_task.retry(countdown=countdown, **celery_task.retry_kwargs)
    except Retry as retry_error:
        next_retry = observability.task_next_retry_date(retry_error)
        observability.report_event_delivery_attempt(
            delivery_attempt,
            next_retry
        )
        raise retry_error
    except MaxRetriesExceededError:
        is_success = False
        task_logger.info(
            "[Webhook ID: %r] Failed request to %r: exceeded retry limit."
            "Delivery id: %r",
            webhook.id,
            webhook.target_url,
            delivery.id,
        )
    return is_success


def get_delivery_for_webhook(event_delivery_id) -> Optional["EventDelivery"]:
    try:
        delivery = EventDelivery.objects.select_related(
            "payload",
            "webhook__app"
        ).get(
            id=event_delivery_id
        )
    except EventDelivery.DoesNotExist:
        logger.error("Event delivery id: %r not found", event_delivery_id)
        return None

    if not delivery.webhook.is_active:
        delivery_update(delivery=delivery, status=EventDeliveryStatus.FAILED)
        logger.info(
            "Event delivery id: %r webhook is disabled.", event_delivery_id
        )
        return None
    return delivery


@contextmanager
def catch_duration_time():
    start = time()
    yield lambda: time() - start


def create_attempt(
    delivery: "EventDelivery",
    task_id: Optional[str] = None,
):
    attempt = EventDeliveryAttempt.objects.create(
        delivery=delivery,
        task_id=task_id,
        duration=None,
        response=None,
        request_headers=None,
        response_headers=None,
        status=EventDeliveryStatus.PENDING,
    )
    return attempt


def attempt_update(
    attempt: "EventDeliveryAttempt",
    webhook_response: "WebhookResponse",
):
    attempt.duration = webhook_response.duration
    attempt.response = webhook_response.content
    attempt.response_headers = json.dumps(webhook_response.response_headers)
    attempt.response_status_code = webhook_response.response_status_code
    attempt.request_headers = json.dumps(webhook_response.request_headers)
    attempt.status = webhook_response.status
    attempt.save(
        update_fields=[
            "duration",
            "response",
            "response_headers",
            "response_status_code",
            "request_headers",
            "status",
        ]
    )


def clear_successful_delivery(delivery: "EventDelivery"):
    if delivery.status == EventDeliveryStatus.SUCCESS:
        payload_id = delivery.payload_id  # type: ignore
        delivery.delete()
        if payload_id:
            EventPayload.objects.filter(
                pk=payload_id,
                deliveries__isnull=True
            ).delete()


def delivery_update(delivery: "EventDelivery", status: str):
    delivery.status = status
    delivery.save(update_fields=["status"])


def get_meta_code_key(app: App) -> str:
    return f"{app.identifier}.code"


def get_meta_description_key(app: App) -> str:
    return f"{app.identifier}.description"
