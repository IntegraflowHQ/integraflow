from typing import Optional

from django.http import HttpRequest

INTEGRAFLOW_AUTH_HEADER = "HTTP_AUTHORIZATION_BEARER"
DEFAULT_AUTH_HEADER = "HTTP_AUTHORIZATION"
PROJECT_HEADER = "HTTP_PROJECT"
AUTH_HEADER_PREFIXES = ["JWT", "BEARER"]


def get_token_from_request(request: HttpRequest) -> Optional[str]:
    token: Optional[str] = request.META.get(INTEGRAFLOW_AUTH_HEADER)

    if not token:
        auth = request.META.get(DEFAULT_AUTH_HEADER, "").split(maxsplit=1)

        if len(auth) == 2 and auth[0].upper() in AUTH_HEADER_PREFIXES:
            token = auth[1]

    if not token:
        token = request.META.get(DEFAULT_AUTH_HEADER)
    return token


def get_project_from_request(request: HttpRequest) -> Optional[str]:
    return request.META.get(PROJECT_HEADER)
