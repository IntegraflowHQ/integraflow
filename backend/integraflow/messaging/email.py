import sys

from typing import Dict, List, Optional

from django.conf import settings
from django.core import exceptions, mail
from django.core.mail.backends.smtp import EmailBackend
from django.db import transaction
from django.template.loader import get_template
from django.utils import timezone
from django.utils.html import strip_tags
from django.utils.module_loading import import_string
from sentry_sdk import capture_exception

from integraflow.celeryconf import app

from .models import MessagingRecord
from .utils import inline_css, is_email_available


@app.task(ignore_result=True, max_retries=3)
def _send_email(
    campaign_key: str,
    to: List[Dict[str, str]],
    subject: str,
    headers: Dict,
    txt_body: str = "",
    html_body: str = "",
    reply_to: Optional[str] = None,
    campaign_count: int = 0,
) -> None:
    """
    Sends built email message asynchronously.
    """

    messages: List = []
    records: List[MessagingRecord] = []

    with transaction.atomic():

        for dest in to:
            record, _ = MessagingRecord.objects.get_or_create(
                raw_email=dest["raw_email"],
                campaign_key=campaign_key
            )

            # Lock object (database-level) while the message is sent
            record = MessagingRecord.objects.select_for_update().get(
                pk=record.pk
            )
            # If an email for this campaign was already sent to this user,
            # skip recipient
            if record.sent_at and record.campaign_count == 0:
                record.delete()  # release DB lock
                continue

            records.append(record)
            reply_to = reply_to or settings.DEFAULT_FROM_EMAIL

            email_message = mail.EmailMultiAlternatives(
                subject=subject,
                body=txt_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[dest["recipient"]],
                headers=headers,
                reply_to=[reply_to] if reply_to else None,
            )

            email_message.attach_alternative(html_body, "text/html")
            messages.append(email_message)

        connection = None
        try:
            klass = import_string(
                settings.EMAIL_BACKEND
            ) if settings.EMAIL_BACKEND else EmailBackend
            connection = klass(
                host=settings.EMAIL_HOST,
                port=settings.EMAIL_PORT,
                username=settings.EMAIL_HOST_USER,
                password=settings.EMAIL_HOST_PASSWORD,
                use_tls=settings.EMAIL_USE_TLS,
                use_ssl=settings.EMAIL_USE_SSL,
            )
            connection.open()
            connection.send_messages(messages)

            for record in records:
                if record.campaign_count > 1:
                    record.campaign_count = record.campaign_count - 1
                    record.sent_at = timezone.now()
                    record.save()
                else:
                    record.delete()

        except Exception as err:
            # Handle exceptions gracefully to avoid breaking the entire task
            # for all projects but make sure they're tracked on Sentry.
            print("Could not send email:", err, file=sys.stderr)
            capture_exception(err)
        finally:
            # Ensure that connection has been closed
            try:
                connection.close()  # type: ignore
            except Exception as err:
                print(
                    "Could not close email connection (this can be ignored):",
                    err,
                    file=sys.stderr
                )


class EmailMessage:
    def __init__(
        self,
        campaign_key: str,
        subject: str,
        template_name: str,
        template_context: Dict = {},
        headers: Optional[Dict] = None,
        reply_to: Optional[str] = None,
    ):
        if not is_email_available():
            raise exceptions.ImproperlyConfigured(
                "Email is not enabled in this instance."
            )

        if "utm_tags" not in template_context:
            template_context.update({
                "utm_tags": "utm_source=integraflow&utm_medium=email"
                f"&utm_campaign={template_name}"
            })

        self.campaign_key = campaign_key
        self.subject = subject
        template = get_template(f"emails/{template_name}.html")
        self.html_body = inline_css(template.render(template_context))
        self.txt_body = strip_tags(self.html_body)
        self.headers = headers if headers else {}
        self.to: List[Dict[str, str]] = []
        self.reply_to = reply_to

    def add_recipient(self, email: str, name: Optional[str] = None) -> None:
        self.to.append({
            "recipient": f'"{name}" <{email}>' if name else email,
            "raw_email": email
        })

    def send(self, send_async: bool = True) -> None:
        if not self.to:
            raise ValueError(
                "No recipients provided! Use EmailMessage.add_recipient()"
                " first!"
            )

        kwargs = {
            "campaign_key": self.campaign_key,
            "to": self.to,
            "subject": self.subject,
            "headers": self.headers,
            "txt_body": self.txt_body,
            "html_body": self.html_body,
            "reply_to": self.reply_to,
        }

        if send_async:
            _send_email.apply_async(kwargs=kwargs)
        else:
            _send_email.apply(kwargs=kwargs)
