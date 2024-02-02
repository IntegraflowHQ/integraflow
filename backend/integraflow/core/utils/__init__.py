import secrets
import socket
import string
from random import choice
from typing import (
    TYPE_CHECKING,
    Any,
    Callable,
    Iterable,
    Optional,
    TypeVar,
    Union
)
from urllib.parse import urljoin, urlparse

from celery.utils.log import get_task_logger
from django.conf import settings
from django.db import IntegrityError, transaction
from django.db.backends.ddl_references import Statement
from django.db.models import Model
from django.db.models.constraints import BaseConstraint
from django.utils.crypto import get_random_string
from django.utils.encoding import iri_to_uri
from django.utils.text import slugify
from text_unidecode import unidecode

T = TypeVar("T")

MAX_SLUG_LENGTH = 48
BASE62 = string.digits + string.ascii_letters

task_logger = get_task_logger(__name__)

if TYPE_CHECKING:
    from django.utils.safestring import SafeText


def get_domain() -> str:
    if settings.PUBLIC_URL:
        return urlparse(settings.PUBLIC_URL).netloc
    if settings.SITE_URL:
        return urlparse(settings.SITE_URL).netloc
    return "useintegraflow.com"


def get_public_url(domain: Optional[str] = None) -> str:
    if settings.PUBLIC_URL:
        return settings.PUBLIC_URL
    if settings.SITE_URL:
        return settings.SITE_URL

    host = domain or "useintegraflow.com"
    protocol = "https" if settings.ENABLE_SSL else "http"
    return f"{protocol}://{host}"


def is_ssl_enabled() -> bool:
    if settings.PUBLIC_URL:
        return urlparse(settings.PUBLIC_URL).scheme.lower() == "https"
    return settings.ENABLE_SSL


def build_absolute_uri(location: str, domain: Optional[str] = None) -> str:
    """Create absolute uri from location.

    If provided location is absolute uri by itself, it returns unchanged value,
    otherwise if provided location is relative, absolute uri is built
    and returned.
    """
    current_uri = get_public_url(domain)
    location = urljoin(current_uri, location)
    return iri_to_uri(location)


def get_client_ip(request):
    """Retrieve the IP address from the request data.

    Tries to get a valid IP address from X-Forwarded-For, if the user is
    hiding behind a transparent proxy or if the server is behind a proxy.

    If no forwarded IP was provided or all of them are invalid,
    it fallback to the requester IP.
    """
    ip = request.META.get("HTTP_X_FORWARDED_FOR", "")
    ips = ip.split(",")
    for ip in ips:
        if is_valid_ipv4(ip) or is_valid_ipv6(ip):
            return ip
    return request.META.get("REMOTE_ADDR", None)


def is_valid_ipv4(ip: str) -> bool:
    """Check whether the passed IP is a valid V4 IP address."""
    try:
        socket.inet_pton(socket.AF_INET, ip)
    except socket.error:
        return False
    return True


def is_valid_ipv6(ip: str) -> bool:
    """Check whether the passed IP is a valid V6 IP address."""
    try:
        socket.inet_pton(socket.AF_INET6, ip)
    except socket.error:
        return False
    return True


def generate_unique_slug(
    instance: Model,
    slugable_value: str,
    slug_field_name: str = "slug",
    *,
    additional_search_lookup=None,
) -> str:
    """Create unique slug for model instance.

    The function uses `django.utils.text.slugify` to generate a slug from
    the `slugable_value` of model field. If the slug already exists it adds
    a numeric suffix and increments it until a unique value is found.

    Args:
        instance: model instance for which slug is created
        slugable_value: value used to create slug
        slug_field_name: name of slug field in instance model
        additional_search_lookup: when provided, it will be used to find the
        instances with the same slug that passed also additional conditions

    """
    slug = slugify(unidecode(slugable_value))

    ModelClass = instance.__class__

    search_field = f"{slug_field_name}__iregex"
    pattern = rf"{slug}-\d+$|{slug}$"
    lookup = {search_field: pattern}
    if additional_search_lookup:
        lookup.update(additional_search_lookup)

    slug_values = (
        ModelClass._default_manager.filter(**lookup)
        .exclude(pk=instance.pk)
        .values_list(slug_field_name, flat=True)
    )

    unique_slug = prepare_unique_slug(slug, slug_values)

    return unique_slug


def prepare_unique_slug(slug: str, slug_values: Iterable):
    """Prepare unique slug value based on provided list of existing slug
    values."""
    unique_slug: Union["SafeText", str] = slug
    extension = 1

    while unique_slug in slug_values:
        extension += 1
        unique_slug = f"{slug}-{extension}"

    return unique_slug


def generate_random_short_suffix(len: int = 4):
    """
    Return a 4 letter suffix made up random ASCII letters, useful for
    disambiguation of duplicates.
    """
    return "".join(choice(string.ascii_letters) for _ in range(len))


def create_with_slug(
    create_func: Callable[..., T],
    default_slug: str = "",
    *args, **kwargs
) -> T:
    """
    Run model manager create function, making sure that the model is saved
    with a valid autogenerated slug field.
    """
    slugified_name = slugify(
        kwargs["name"]
    )[:MAX_SLUG_LENGTH] if "name" in kwargs else default_slug

    for retry_i in range(10):
        # This retry loop handles possible duplicates by appending `-\d`
        # to the slug in case of an IntegrityError
        if not retry_i:
            kwargs["slug"] = slugified_name
        else:
            kwargs["slug"] = (
                f"{slugified_name[: MAX_SLUG_LENGTH - 5]}-"
                f"{generate_random_short_suffix()}"
            )
        try:
            with transaction.atomic():
                return create_func(*args, **kwargs)
        except IntegrityError:
            continue
    raise Exception("Could not create a model instance with slug in 10 tries!")


def create_with_unique_string(
    create_func: Callable[..., T],
    field_name: str = "slug",
    *args, **kwargs
) -> T:
    """
    Run model manager create function, making sure that the model is saved
    with a valid autogenerated field.
    """
    for _ in range(10):
        # This retry loop handles possible duplicates by appending `-\d`
        # to the slug in case of an IntegrityError
        kwargs[field_name] = get_random_string(6)
        try:
            with transaction.atomic():
                return create_func(*args, **kwargs)
        except IntegrityError:
            continue
    raise Exception(
        f"Could not create a model instance with {field_name} in 10 tries!"
    )


def sane_repr(*attrs: str, include_id=True) -> Callable[[object], str]:
    if "id" not in attrs and "pk" not in attrs and include_id:
        attrs = ("id",) + attrs

    def _repr(self):
        pairs = (f"{attr}={repr(getattr(self, attr))}" for attr in attrs)
        return (
            f"<{type(self).__name__} at {hex(id(self))}: {', '.join(pairs)}>"
        )

    return _repr


class PotentialSecurityProblemException(Exception):
    """
    When providing an absolutely-formatted URL
    we will not provide one that has an unexpected hostname
    because an attacker might use that to redirect traffic somewhere *bad*
    """

    pass


def absolute_uri(url: Optional[str] = None) -> str:
    """
    Returns an absolutely-formatted URL based on the `SITE_URL` config.

    If the provided URL is already absolutely formatted
    it does not allow anything except the hostname of the SITE_URL config
    """
    if not url:
        return settings.SITE_URL

    provided_url = urlparse(url)
    if provided_url.hostname and provided_url.scheme:
        site_url = urlparse(settings.SITE_URL)
        provided_url = provided_url
        if (
            site_url.hostname != provided_url.hostname
            or site_url.port != provided_url.port
            or site_url.scheme != provided_url.scheme
        ):
            raise PotentialSecurityProblemException(
                f"It is forbidden to provide an absolute URI using {url}"
            )

    return urljoin(settings.SITE_URL.rstrip("/") + "/", url.lstrip("/"))


def generate_random_token(nbytes: int = 32) -> str:
    """Generate a securely random token.

    Random 32 bytes - default value here - is believed to be sufficiently
    secure for practically all purposes:
    https://docs.python.org/3/library/secrets.html#how-many-bytes-should-tokens-use
    """
    return int_to_base(secrets.randbits(nbytes * 8), 62)


def generate_random_token_project() -> str:
    return "ifc_" + generate_random_token()  # "c" standing for "client"


def generate_default_slug_project() -> str:
    return "default-project-" + get_random_string(5)


def int_to_base(number: int, base: int) -> str:
    if base > 62:
        raise ValueError("Cannot convert integer to base above 62")
    alphabet = BASE62[:base]
    if number < 0:
        return "-" + int_to_base(-number, base)
    value = ""
    while number != 0:
        number, index = divmod(number, len(alphabet))
        value = alphabet[index] + value
    return value or "0"


def is_minus_one(id):
    if id == -1 or id == "-1":
        return True
    return False


class UniqueConstraintByExpression(BaseConstraint):
    def __init__(self, *, name: str, expression: str, concurrently=True):
        self.name = name
        self.expression = expression
        self.concurrently = concurrently

    def constraint_sql(self, model, schema_editor: Any):
        schema_editor.deferred_sql.append(
            str(self.create_sql(model, schema_editor, table_creation=True))
        )
        return None

    def create_sql(self, model, schema_editor, table_creation=False):
        table = model._meta.db_table
        return Statement(
            f"""
            CREATE UNIQUE INDEX {
                'CONCURRENTLY' if self.concurrently and not table_creation
                else ''
            } %(name)s
            ON %(table)s
            %(expression)s
            """,
            name=self.name,
            table=table,
            expression=self.expression,
        )

    def remove_sql(self, model, schema_editor):
        return Statement(
            "DROP INDEX IF EXISTS %(name)s",
            name=self.name,
        )

    def deconstruct(self):
        path, args, kwargs = super().deconstruct()
        kwargs["expression"] = self.expression
        kwargs["concurrently"] = self.concurrently
        return path, args, kwargs

    def __eq__(self, other):
        if isinstance(other, UniqueConstraintByExpression):
            return (
                self.name == other.name and self.expression == other.expression
            )
        return super().__eq__(other)
