import logging
import os

from celery import Celery
from celery.schedules import crontab
from celery.signals import setup_logging

CELERY_LOGGER_NAME = "celery"


@setup_logging.connect
def setup_celery_logging(loglevel=None, **kwargs):
    """Skip default Celery logging configuration.

    Will rely on Django to set up the base root logger.
    Celery loglevel will be set if provided as Celery command argument.
    """
    if loglevel:
        logging.getLogger(CELERY_LOGGER_NAME).setLevel(loglevel)


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "integraflow.settings")

app = Celery("integraflow")

app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
# app.autodiscover_tasks(lambda: discover_plugins_modules(settings.PLUGINS))  # type: ignore[misc] # circular import # noqa: E501

app.conf.beat_scheduler = 'django_celery_beat.schedulers.DatabaseScheduler'


@app.on_after_configure.connect  # type: ignore
def setup_periodic_tasks(sender: Celery, **kwargs):
    from django.conf import settings

    sender.add_periodic_task(
        settings.EVENT_PROPERTY_USAGE_INTERVAL_SECONDS,
        calculate_event_property_usage.s(),
        name="calculate event property usage",
    )
    sender.add_periodic_task(
        crontab(hour=0, minute=0),  # type: ignore
        calculate_billing_daily_usage.s(),
        name="calculate billing daily usage",
    )  # every day midnight UTC


@app.task(ignore_result=True)
def calculate_event_property_usage():
    from integraflow.event.tasks.calculate_event_property_usage import (
        calculate_event_property_usage
    )

    calculate_event_property_usage()


@app.task(ignore_result=True)
def calculate_billing_daily_usage():
    from integraflow.organization.tasks import (
        compute_daily_usage_for_organizations
    )

    compute_daily_usage_for_organizations()
