import ast
import logging
import os
import os.path
import warnings
from datetime import timedelta
from typing import List, Optional
from urllib.parse import urlparse

import dj_database_url
import dj_email_url
import django_cache_url
import django_stubs_ext
import jaeger_client.config
import sentry_sdk
import sentry_sdk.utils
from corsheaders.defaults import default_headers

# from celery.schedules import crontab
from django.conf import global_settings
from django.core.exceptions import ImproperlyConfigured
from django.core.management.utils import get_random_secret_key
from django.core.validators import URLValidator
from graphql.execution import executor
from kombu import Exchange, Queue
from pytimeparse import parse
from sentry_sdk.integrations.celery import CeleryIntegration
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.logging import ignore_logger

from . import PatchedSubscriberExecutionContext, __version__

# from .core.languages import LANGUAGES as CORE_LANGUAGES
# from .core.schedules import initiated_promotion_webhook_schedule

django_stubs_ext.monkeypatch()


def get_list(text):
    return [item.strip() for item in text.split(",")]


def get_bool_from_env(name, default_value):
    if name in os.environ:
        value = os.environ[name]
        try:
            return ast.literal_eval(value)
        except ValueError as e:
            raise ValueError(
                "{} is an invalid value for {}".format(value, name)
            ) from e
    return default_value


def get_url_from_env(name, *, schemes=None) -> Optional[str]:
    if name in os.environ:
        value = os.environ[name]
        message = f"{value} is an invalid value for {name}"
        URLValidator(schemes=schemes, message=message)(value)
        return value
    return None


DEBUG = get_bool_from_env("DEBUG", True)

PROJECT_ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))

ROOT_URLCONF = "integraflow.urls"

WSGI_APPLICATION = "integraflow.wsgi.application"

ADMINS = (
    # ('Your Name', 'your_email@example.com'),
)

APPEND_SLASH = False

_DEFAULT_CLIENT_HOSTS = "localhost,127.0.0.1"

ALLOWED_CLIENT_HOSTS = os.environ.get("ALLOWED_CLIENT_HOSTS")
if not ALLOWED_CLIENT_HOSTS:
    if DEBUG:
        ALLOWED_CLIENT_HOSTS = _DEFAULT_CLIENT_HOSTS
    else:
        raise ImproperlyConfigured(
            "ALLOWED_CLIENT_HOSTS environment variable must be set when "
            + "DEBUG=False."
        )

ALLOWED_CLIENT_HOSTS = get_list(ALLOWED_CLIENT_HOSTS)

INTERNAL_IPS = get_list(os.environ.get("INTERNAL_IPS", "127.0.0.1"))

# Maximum time in seconds Django can keep the database connections opened.
# Set the value to 0 to disable connection persistence, database connections
# will be closed after each request.
DB_CONN_MAX_AGE = int(os.environ.get("DB_CONN_MAX_AGE", 600))

DATABASE_CONNECTION_DEFAULT_NAME = "default"
# TODO: For local envs will be activated in separate PR.
# We need to update docs an integraflow platform.
# This variable should be set to `replica`
DATABASE_CONNECTION_REPLICA_NAME = "replica"

DATABASES = {
    DATABASE_CONNECTION_DEFAULT_NAME: dj_database_url.config(
        default="postgres://root:integraflow@localhost:5432/integraflow",
        conn_max_age=DB_CONN_MAX_AGE,
    ),
    DATABASE_CONNECTION_REPLICA_NAME: dj_database_url.config(
        default="postgres://root:integraflow@localhost:5432/integraflow",
        # TODO: We need to add read only user to integraflow platform,
        # and we need to update docs.
        # default="postgres://root:integraflow@localhost:5432/integraflow",
        conn_max_age=DB_CONN_MAX_AGE,
    ),
}

DATABASE_ROUTERS = ["integraflow.core.db_routers.PrimaryReplicaRouter"]

DEFAULT_AUTO_FIELD = "django.db.models.AutoField"

TIME_ZONE = "UTC"
LOCALE_PATHS = [os.path.join(PROJECT_ROOT, "locale")]
USE_I18N = True
USE_L10N = True
USE_TZ = True

FORM_RENDERER = "django.forms.renderers.TemplatesSetting"

EMAIL_URL = os.environ.get("EMAIL_URL")
SENDGRID_USERNAME = os.environ.get("SENDGRID_USERNAME")
SENDGRID_PASSWORD = os.environ.get("SENDGRID_PASSWORD")
if not EMAIL_URL and SENDGRID_USERNAME and SENDGRID_PASSWORD:
    EMAIL_URL = (
        f"smtp://{SENDGRID_USERNAME}"
        f":{SENDGRID_PASSWORD}@smtp.sendgrid.net:587/?tls=True"
    )

email_config = dj_email_url.parse(EMAIL_URL or "")

EMAIL_FILE_PATH: str = email_config.get("EMAIL_FILE_PATH", "")
EMAIL_HOST_USER: str = email_config.get("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD: str = email_config.get("EMAIL_HOST_PASSWORD", "")
EMAIL_HOST: str = email_config.get("EMAIL_HOST", "")
EMAIL_PORT: str = str(email_config.get("EMAIL_PORT", ""))
EMAIL_BACKEND: str = email_config.get("EMAIL_BACKEND", "")
EMAIL_USE_TLS: bool = email_config.get("EMAIL_USE_TLS", False)
EMAIL_USE_SSL: bool = email_config.get("EMAIL_USE_SSL", False)

ENABLE_SSL: bool = get_bool_from_env("ENABLE_SSL", False)

# URL on which Integraflow frontend is hosted (e.g., https://app.example.com/).
SITE_URL = os.environ.get("SITE_URL", "http://localhost:8000").rstrip("/")

# URL on which Integraflow backend is hosted (e.g., https://api.example.com/).
# This has precedence over ENABLE_SSL when generating URLs pointing to itself.
PUBLIC_URL: Optional[str] = get_url_from_env(
    "PUBLIC_URL",
    schemes=["http", "https"]
)
if PUBLIC_URL:
    if os.environ.get("ENABLE_SSL") is not None:
        warnings.warn(
            "ENABLE_SSL is ignored on URL generation if PUBLIC_URL is set."
        )
    ENABLE_SSL = urlparse(PUBLIC_URL).scheme.lower() == "https"

if ENABLE_SSL:
    SECURE_SSL_REDIRECT = not DEBUG

DEFAULT_FROM_EMAIL: str = os.environ.get(
    "DEFAULT_FROM_EMAIL", EMAIL_HOST_USER or "noreply@example.com"
)

MEDIA_ROOT: str = os.path.join(PROJECT_ROOT, "media")
MEDIA_URL: str = os.environ.get("MEDIA_URL", "/media/")

STATIC_ROOT: str = os.path.join(PROJECT_ROOT, "static")
STATIC_URL: str = os.environ.get("STATIC_URL", "/static/")
STATICFILES_DIRS = [
    ("images", os.path.join(PROJECT_ROOT, "integraflow", "static", "images"))
]
STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]

context_processors = [
    "django.template.context_processors.debug",
    "django.template.context_processors.media",
    "django.template.context_processors.static",
]

loaders = [
    "django.template.loaders.filesystem.Loader",
    "django.template.loaders.app_directories.Loader",
]

TEMPLATES_DIR = os.path.join(PROJECT_ROOT, "templates")
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [TEMPLATES_DIR],
        "OPTIONS": {
            "debug": DEBUG,
            "context_processors": context_processors,
            "loaders": loaders,
            "string_if_invalid": '<<MISSING VARIABLE "%s">>' if DEBUG else "",
        },
    }
]

# Make this unique, and don't share it with anybody.
SECRET_KEY = os.environ.get("SECRET_KEY")

# Additional password algorithms that can be used by Integraflow.
# The first algorithm defined by Django is the preferred one; users not using
# the first algorithm will automatically be upgraded to it upon login
PASSWORD_HASHERS = [
    *global_settings.PASSWORD_HASHERS,
    "django.contrib.auth.hashers.BCryptPasswordHasher",
    "integraflow.core.hashers.SHA512Base64PBKDF2PasswordHasher",
]

if not SECRET_KEY and DEBUG:
    warnings.warn("SECRET_KEY not configured, using a random temporary key.")
    SECRET_KEY = get_random_secret_key()


GOOGLE_AUTH_CLIENT_CREDENTIALS = os.environ.get(
    "GOOGLE_AUTH_CLIENT_CREDENTIALS",
    None
)

RSA_PRIVATE_KEY = os.environ.get("RSA_PRIVATE_KEY", None)
RSA_PRIVATE_PASSWORD = os.environ.get("RSA_PRIVATE_PASSWORD", None)
JWT_MANAGER_PATH = os.environ.get(
    "JWT_MANAGER_PATH", "integraflow.core.jwt_manager.JWTManager"
)

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.common.CommonMiddleware",
    "integraflow.core.middleware.jwt_refresh_token_middleware",
]

INSTALLED_APPS = [
    # External apps that need to go before django's
    "corsheaders",
    "storages",
    # Django modules
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.staticfiles",
    "django.contrib.postgres",
    "django_celery_beat",
    # Local apps
    "integraflow.app",
    "integraflow.core",
    "integraflow.event",
    "integraflow.messaging",
    "integraflow.organization",
    "integraflow.project",
    "integraflow.graphql",
    "integraflow.survey",
    "integraflow.user",
    "integraflow.webhook",
    # External apps
    "django_measurement",
    "django_prices",
    "mptt",
    "django_countries",
    "django_filters",
    "phonenumber_field",
]

ENABLE_DJANGO_EXTENSIONS = get_bool_from_env("ENABLE_DJANGO_EXTENSIONS", False)
if ENABLE_DJANGO_EXTENSIONS:
    INSTALLED_APPS += [
        "django_extensions",
    ]

ENABLE_DEBUG_TOOLBAR = get_bool_from_env("ENABLE_DEBUG_TOOLBAR", False)
if ENABLE_DEBUG_TOOLBAR:
    # Ensure the graphiql debug toolbar is actually installed before adding it
    try:
        __import__("graphiql_debug_toolbar")
    except ImportError as exc:
        msg = (
            f"{exc} -- Install the missing dependencies by "
            f"running `pip install -r requirements_dev.txt`"
        )
        warnings.warn(msg)
    else:
        INSTALLED_APPS += [
            "django.forms",
            "debug_toolbar",
            "graphiql_debug_toolbar"
        ]
        MIDDLEWARE.append(
            "integraflow.graphql.middleware.DebugToolbarMiddleware"
        )

        DEBUG_TOOLBAR_PANELS = [
            "debug_toolbar.panels.history.HistoryPanel",
            "debug_toolbar.panels.timer.TimerPanel",
            "debug_toolbar.panels.headers.HeadersPanel",
            "debug_toolbar.panels.request.RequestPanel",
            "debug_toolbar.panels.sql.SQLPanel",
            "debug_toolbar.panels.profiling.ProfilingPanel",
        ]
        DEBUG_TOOLBAR_CONFIG = {"RESULTS_CACHE_SIZE": 100}

# Make the `logging` Python module capture `warnings.warn()` calls
# This is needed in order to log them as JSON when DEBUG=False
logging.captureWarnings(True)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "root": {"level": "INFO", "handlers": ["default"]},
    "formatters": {
        "django.server": {
            "()": "django.utils.log.ServerFormatter",
            "format": "[{server_time}] {message}",
            "style": "{",
        },
        "json": {
            "()": "integraflow.core.logging.JsonFormatter",
            "datefmt": "%Y-%m-%dT%H:%M:%SZ",
            "format": (
                "%(asctime)s %(levelname)s %(lineno)s %(message)s %(name)s "
                + "%(pathname)s %(process)d %(threadName)s"
            ),
        },
        "celery_json": {
            "()": "integraflow.core.logging.JsonCeleryFormatter",
            "datefmt": "%Y-%m-%dT%H:%M:%SZ",
            "format": (
                "%(asctime)s %(levelname)s %(celeryTaskId)s " + "%(celeryTaskName)s "
            ),
        },
        "celery_task_json": {
            "()": "integraflow.core.logging.JsonCeleryTaskFormatter",
            "datefmt": "%Y-%m-%dT%H:%M:%SZ",
            "format": (
                "%(asctime)s %(levelname)s %(celeryTaskId)s "
                "%(celeryTaskName)s %(message)s "
            ),
        },
        "verbose": {
            "format": (
                "%(asctime)s %(levelname)s %(name)s %(message)s "
                "[PID:%(process)d:%(threadName)s]"
            )
        },
    },
    "handlers": {
        "default": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "verbose" if DEBUG else "json",
        },
        "django.server": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "formatter": "django.server" if DEBUG else "json",
        },
        "celery_app": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "formatter": "verbose" if DEBUG else "celery_json",
        },
        "celery_task": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "formatter": "verbose" if DEBUG else "celery_task_json",
        },
        "null": {
            "class": "logging.NullHandler",
        },
    },
    "loggers": {
        "django": {"level": "INFO", "propagate": True},
        "django.server": {
            "handlers": ["django.server"],
            "level": "INFO",
            "propagate": False,
        },
        "celery.app.trace": {
            "handlers": ["celery_app"],
            "level": "INFO",
            "propagate": False,
        },
        "celery.task": {
            "handlers": ["celery_task"],
            "level": "INFO",
            "propagate": False,
        },
        "integraflow": {"level": "DEBUG", "propagate": True},
        "integraflow.graphql.errors.handled": {
            "handlers": ["default"],
            "level": "INFO",
            "propagate": False,
        },
        "graphql.execution.utils": {"propagate": False, "handlers": ["null"]},
        "graphql.execution.executor": {
            "propagate": False,
            "handlers": ["null"]
        },
    },
}

AUTH_USER_MODEL = "user.User"

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation.MinimumLengthValidator"
        ),
        "OPTIONS": {"min_length": 8},
    }
]

DEFAULT_COUNTRY = os.environ.get("DEFAULT_COUNTRY", "US")
DEFAULT_DECIMAL_PLACES = 3
DEFAULT_MAX_DIGITS = 12
DEFAULT_CURRENCY_CODE_LENGTH = 3

# The default max length for the display name of the
# sender email address. Following the recommendation of
# https://tools.ietf.org/html/rfc5322#section-2.1.1
DEFAULT_MAX_EMAIL_DISPLAY_NAME_LENGTH = 78

COUNTRIES_OVERRIDE = {"EU": "European Union"}

MAX_USER_ADDRESSES = int(os.environ.get("MAX_USER_ADDRESSES", 100))

TEST_RUNNER = "integraflow.tests.runner.PytestTestRunner"


PLAYGROUND_ENABLED = get_bool_from_env("PLAYGROUND_ENABLED", True)

ALLOWED_HOSTS = get_list(
    os.environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1")
)
ALLOWED_GRAPHQL_ORIGINS: List[str] = get_list(
    os.environ.get("ALLOWED_GRAPHQL_ORIGINS", "*")
)

CORS_ALLOW_ALL_ORIGINS: bool = False
CORS_ALLOWED_ORIGINS: List[str] = []

if ALLOWED_GRAPHQL_ORIGINS[0] == "*":
    CORS_ALLOW_ALL_ORIGINS = True
else:
    CORS_ALLOWED_ORIGINS = ALLOWED_GRAPHQL_ORIGINS

CORS_ALLOW_HEADERS = (
    *default_headers,
    "Project",
    "Organization",
)

CORS_EXPOSE_HEADERS = (
    *default_headers,
    "Project",
    "Organization",
)

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Amazon S3 configuration
# See https://django-storages.readthedocs.io/en/latest/backends/amazon-S3.html
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_LOCATION = os.environ.get("AWS_LOCATION", "")
AWS_MEDIA_BUCKET_NAME = os.environ.get("AWS_MEDIA_BUCKET_NAME")
AWS_MEDIA_CUSTOM_DOMAIN = os.environ.get("AWS_MEDIA_CUSTOM_DOMAIN")
AWS_QUERYSTRING_AUTH = get_bool_from_env("AWS_QUERYSTRING_AUTH", False)
AWS_QUERYSTRING_EXPIRE = get_bool_from_env("AWS_QUERYSTRING_EXPIRE", 3600)
AWS_S3_CUSTOM_DOMAIN = os.environ.get("AWS_STATIC_CUSTOM_DOMAIN")
AWS_S3_ENDPOINT_URL = os.environ.get("AWS_S3_ENDPOINT_URL", None)
AWS_S3_REGION_NAME = os.environ.get("AWS_S3_REGION_NAME", None)
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME")
AWS_DEFAULT_ACL = os.environ.get("AWS_DEFAULT_ACL", None)
AWS_S3_FILE_OVERWRITE = get_bool_from_env("AWS_S3_FILE_OVERWRITE", True)

# Google Cloud Storage configuration
# See https://django-storages.readthedocs.io/en/latest/backends/gcloud.html
GS_PROJECT_ID = os.environ.get("GS_PROJECT_ID")
GS_BUCKET_NAME = os.environ.get("GS_BUCKET_NAME")
GS_LOCATION = os.environ.get("GS_LOCATION", "")
GS_CUSTOM_ENDPOINT = os.environ.get("GS_CUSTOM_ENDPOINT")
GS_MEDIA_BUCKET_NAME = os.environ.get("GS_MEDIA_BUCKET_NAME")
GS_AUTO_CREATE_BUCKET = get_bool_from_env("GS_AUTO_CREATE_BUCKET", False)
GS_QUERYSTRING_AUTH = get_bool_from_env("GS_QUERYSTRING_AUTH", False)
GS_DEFAULT_ACL = os.environ.get("GS_DEFAULT_ACL", None)
GS_MEDIA_CUSTOM_ENDPOINT = os.environ.get("GS_MEDIA_CUSTOM_ENDPOINT", None)
GS_EXPIRATION = timedelta(
    seconds=parse(os.environ.get("GS_EXPIRATION", "1 day"))  # type: ignore
)
GS_FILE_OVERWRITE = get_bool_from_env("GS_FILE_OVERWRITE", True)

# If GOOGLE_APPLICATION_CREDENTIALS is set there is no need to load OAuth token
# See https://django-storages.readthedocs.io/en/latest/backends/gcloud.html
if "GOOGLE_APPLICATION_CREDENTIALS" not in os.environ:
    GS_CREDENTIALS = os.environ.get("GS_CREDENTIALS")

# Azure Storage configuration
# See https://django-storages.readthedocs.io/en/latest/backends/azure.html
AZURE_ACCOUNT_NAME = os.environ.get("AZURE_ACCOUNT_NAME")
AZURE_ACCOUNT_KEY = os.environ.get("AZURE_ACCOUNT_KEY")
AZURE_CONTAINER = os.environ.get("AZURE_CONTAINER")
AZURE_SSL = os.environ.get("AZURE_SSL")

if AWS_STORAGE_BUCKET_NAME:
    STATICFILES_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"
elif GS_BUCKET_NAME:
    STATICFILES_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"

if AWS_MEDIA_BUCKET_NAME:
    DEFAULT_FILE_STORAGE = "integraflow.core.storages.S3MediaStorage"
elif GS_MEDIA_BUCKET_NAME:
    DEFAULT_FILE_STORAGE = "integraflow.core.storages.GCSMediaStorage"
elif AZURE_CONTAINER:
    DEFAULT_FILE_STORAGE = "integraflow.core.storages.AzureMediaStorage"

PLACEHOLDER_IMAGES = {
    32: "images/placeholder32.png",
    64: "images/placeholder64.png",
    128: "images/placeholder128.png",
    256: "images/placeholder256.png",
    512: "images/placeholder512.png",
    1024: "images/placeholder1024.png",
    2048: "images/placeholder2048.png",
    4096: "images/placeholder4096.png",
}


AUTHENTICATION_BACKENDS = [
    "integraflow.core.auth_backend.JSONWebTokenBackend",
]

# Exports settings - defines after what time exported files will be deleted
EXPORT_FILES_TIMEDELTA = timedelta(
    seconds=parse(
        os.environ.get("EXPORT_FILES_TIMEDELTA", "30 days")
    )  # type: ignore
)

# CELERY SETTINGS
CELERY_TIMEZONE = TIME_ZONE
CELERY_BROKER_URL = (
    os.environ.get("CELERY_BROKER_URL", os.environ.get("CLOUDAMQP_URL")) or ""
)
CELERY_TASK_ALWAYS_EAGER = not CELERY_BROKER_URL
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_RESULT_BACKEND = os.environ.get("CELERY_RESULT_BACKEND", None)
CELERY_TASK_ROUTES = {
    "integraflow.plugins.webhook.tasks.observability_reporter_task": {
        "queue": "observability"
    },
    "integraflow.plugins.webhook.tasks.observability_send_events": {
        "queue": "observability"
    },
}
CELERY_QUEUES = (Queue("celery", Exchange("celery"), "celery"),)
CELERY_DEFAULT_QUEUE = "celery"

# The maximum wait time between each is_due() call on schedulers
# It needs to be higher than the frequency of the schedulers to avoid
# unnecessary is_due() calls
CELERY_BEAT_MAX_LOOP_INTERVAL = 300  # 5 minutes

EVENT_PAYLOAD_DELETE_PERIOD = timedelta(
    seconds=parse(
        os.environ.get("EVENT_PAYLOAD_DELETE_PERIOD", "14 days")
    )  # type: ignore
)

CELERY_BEAT_SCHEDULE = {}

# Observability settings
OBSERVABILITY_BROKER_URL = os.environ.get("OBSERVABILITY_BROKER_URL")
OBSERVABILITY_ACTIVE = bool(OBSERVABILITY_BROKER_URL)
OBSERVABILITY_REPORT_ALL_API_CALLS = get_bool_from_env(
    "OBSERVABILITY_REPORT_ALL_API_CALLS", False
)
OBSERVABILITY_MAX_PAYLOAD_SIZE = int(
    os.environ.get("OBSERVABILITY_MAX_PAYLOAD_SIZE", 25 * 1000)
)
OBSERVABILITY_BUFFER_SIZE_LIMIT = int(
    os.environ.get("OBSERVABILITY_BUFFER_SIZE_LIMIT", 1000)
)
OBSERVABILITY_BUFFER_BATCH_SIZE = int(
    os.environ.get("OBSERVABILITY_BUFFER_BATCH_SIZE", 100)
)
OBSERVABILITY_REPORT_PERIOD = timedelta(
    seconds=parse(
        os.environ.get("OBSERVABILITY_REPORT_PERIOD", "20 seconds")
    )  # type: ignore
)
OBSERVABILITY_BUFFER_TIMEOUT = timedelta(
    seconds=parse(
        os.environ.get("OBSERVABILITY_BUFFER_TIMEOUT", "5 minutes")
    )  # type: ignore
)
if OBSERVABILITY_ACTIVE:
    CELERY_BEAT_SCHEDULE["observability-reporter"] = {
        "task": (
            "integraflow.plugins.webhook.tasks.observability_reporter_task"
        ),
        "schedule": OBSERVABILITY_REPORT_PERIOD,
        "options": {"expires": OBSERVABILITY_REPORT_PERIOD.total_seconds()},
    }
    if OBSERVABILITY_BUFFER_TIMEOUT < OBSERVABILITY_REPORT_PERIOD * 2:
        warnings.warn(
            "OBSERVABILITY_REPORT_PERIOD is too big compared to "
            "OBSERVABILITY_BUFFER_TIMEOUT. That can lead to a loss of events."
        )

# Change this value if your application is running behind a proxy,
# e.g. HTTP_CF_Connecting_IP for Cloudflare or X_FORWARDED_FOR
REAL_IP_ENVIRON = get_list(os.environ.get("REAL_IP_ENVIRON", "REMOTE_ADDR"))


#  Sentry
sentry_sdk.utils.MAX_STRING_LENGTH = 4096  # type: ignore[attr-defined]
SENTRY_DSN = os.environ.get("SENTRY_DSN")
SENTRY_OPTS = {"integrations": [CeleryIntegration(), DjangoIntegration()]}


def SENTRY_INIT(dsn: str, sentry_opts: dict):
    """Init function for sentry.

    Will only be called if SENTRY_DSN is not None, during core start, can be
    overriden in separate settings file.
    """
    sentry_sdk.init(dsn, release=__version__, **sentry_opts)
    ignore_logger("graphql.execution.utils")
    ignore_logger("graphql.execution.executor")


GRAPHQL_PAGINATION_LIMIT = 100
GRAPHQL_MIDDLEWARE: List[str] = []

# Set GRAPHQL_QUERY_MAX_COMPLEXITY=0 in env to disable (not recommended)
GRAPHQL_QUERY_MAX_COMPLEXITY = int(
    os.environ.get("GRAPHQL_QUERY_MAX_COMPLEXITY", 50000)
)

# Max number entities that can be requested in single query by
# Apollo Federation. Federation protocol implements no securities on its
# own part - malicious actor may build a query that requests for potentially
# few thousands of entities. Set FEDERATED_QUERY_MAX_ENTITIES=0 in env
# to disable (not recommended)
FEDERATED_QUERY_MAX_ENTITIES = int(
    os.environ.get("FEDERATED_QUERY_MAX_ENTITIES", 100)
)

# Default timeout (sec) for establishing a connection when performing external
# requests.
REQUESTS_CONN_EST_TIMEOUT = 2

# Default timeout for external requests.
COMMON_REQUESTS_TIMEOUT = (REQUESTS_CONN_EST_TIMEOUT, 18)

# Timeouts for webhook requests. Sync webhooks (eg. payment webhook) need more
# time for getting response from the server.
WEBHOOK_TIMEOUT = 10
WEBHOOK_SYNC_TIMEOUT = COMMON_REQUESTS_TIMEOUT

# When `True`, HTTP requests made from arbitrary URLs will be rejected
# (e.g.,webhooks). if they try to access private IP address ranges, and
# loopback ranges (unless `HTTP_IP_FILTER_ALLOW_LOOPBACK_IPS=False`).
HTTP_IP_FILTER_ENABLED: bool = get_bool_from_env(
    "HTTP_IP_FILTER_ENABLED",
    True
)

# When `False` it rejects loopback IPs during external calls.
# Refer to `HTTP_IP_FILTER_ENABLED` for more details.
HTTP_IP_FILTER_ALLOW_LOOPBACK_IPS: bool = get_bool_from_env(
    "HTTP_IP_FILTER_ALLOW_LOOPBACK_IPS", False
)

# Initialize a simple and basic Jaeger Tracing integration
# for open-tracing if enabled.
#
# If running locally, set:
#   JAEGER_AGENT_HOST=localhost
if "JAEGER_AGENT_HOST" in os.environ:
    jaeger_client.Config(  # type: ignore
        config={
            "sampler": {"type": "const", "param": 1},
            "local_agent": {
                "reporting_port": os.environ.get(
                    "JAEGER_AGENT_PORT",
                    jaeger_client.config.DEFAULT_REPORTING_PORT
                ),
                "reporting_host": os.environ.get("JAEGER_AGENT_HOST"),
            },
            "logging": get_bool_from_env("JAEGER_LOGGING", False),
        },
        service_name="integraflow",
        validate=True,
    ).initialize_tracer()


# Some cloud providers (Heroku) export REDIS_URL variable instead of CACHE_URL
REDIS_URL = os.environ.get("REDIS_URL")
if REDIS_URL:
    CACHE_URL = os.environ.setdefault("CACHE_URL", REDIS_URL)
CACHES = {"default": django_cache_url.config()}
CACHES["default"]["TIMEOUT"] = parse(os.environ.get("CACHE_TIMEOUT", "7 days"))

JWT_EXPIRE = True
JWT_TTL_ACCESS = timedelta(
    seconds=parse(
        os.environ.get("JWT_TTL_ACCESS", "30 days")
    )  # type: ignore
)
JWT_TTL_APP_ACCESS = timedelta(
    seconds=parse(
        os.environ.get("JWT_TTL_APP_ACCESS", "30 days")
    )  # type: ignore
)
JWT_TTL_REFRESH = timedelta(
    seconds=parse(os.environ.get("JWT_TTL_REFRESH", "60 days"))  # type: ignore
)

JWT_TTL_REQUEST_EMAIL_CHANGE = timedelta(
    seconds=parse(
        os.environ.get("JWT_TTL_REQUEST_EMAIL_CHANGE", "1 hour")
    )  # type: ignore
)

MAGIC_LINK_MINUTES_VALIDITY = os.environ.get(
    "MAGIC_LINK_MINUTES_VALIDITY", 10
)  # 10 mins
MAGIC_LINK_MAX_ATTEMPTS = os.environ.get(
    "MAGIC_LINK_MAX_ATTEMPTS",
    5
)  # 5 tries

INVITE_DAYS_VALIDITY = os.environ.get(
    "INVITE_DAYS_VALIDITY", 3
)  # number of days for which invites are valid

# Patch SubscriberExecutionContext class from `graphql-core-legacy` package
# to fix bug causing not returning errors for subscription queries.

executor.SubscriberExecutionContext = (  # type: ignore
    PatchedSubscriberExecutionContext  # type: ignore
)

# Queue name for "async webhook" events
WEBHOOK_CELERY_QUEUE_NAME = os.environ.get("WEBHOOK_CELERY_QUEUE_NAME", None)

# Lock time for request password reset mutation per user (seconds)
RESET_PASSWORD_LOCK_TIME = parse(
    os.environ.get("RESET_PASSWORD_LOCK_TIME", "15 minutes")
)

# Lock time for request confirmation email mutation per user
CONFIRMATION_EMAIL_LOCK_TIME = parse(
    os.environ.get("CONFIRMATION_EMAIL_LOCK_TIME", "15 minutes")
)

# Time threshold to update user last_login when performing
# requests with OAUTH token.
OAUTH_UPDATE_LAST_LOGIN_THRESHOLD = parse(
    os.environ.get("OAUTH_UPDATE_LAST_LOGIN_THRESHOLD", "15 minutes")
)
