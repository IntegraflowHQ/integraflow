from typing import Optional, cast

from django.contrib.auth import authenticate
from django.http import HttpRequest
from django.utils import timezone
from django.utils.functional import SimpleLazyObject

from integraflow.app.models import App
from integraflow.core.auth import get_token_from_request
from integraflow.core.jwt import jwt_decode_with_exception_handler
from integraflow.user.models import User

from .api import API_PATH
from .app.dataloaders import get_app_promise
from .core import IntegraflowContext
from .project.dataloaders import get_project_promise


def get_context_value(request: HttpRequest) -> IntegraflowContext:
    request = cast(IntegraflowContext, request)
    request.dataloaders = {}
    request.allow_replica = getattr(request, "allow_replica", True)
    request.request_time = timezone.now()
    set_app_on_context(request)
    set_project_on_context(request)
    set_auth_on_context(request)
    set_decoded_auth_token(request)
    return request


class RequestWithUser(HttpRequest):
    _cached_user: Optional[User]
    app: Optional[App]


def set_decoded_auth_token(request: IntegraflowContext):
    auth_token = get_token_from_request(request)
    if auth_token:
        request.decoded_auth_token = jwt_decode_with_exception_handler(
            auth_token
        )
    else:
        request.decoded_auth_token = None


def set_app_on_context(request: IntegraflowContext):
    if request.path == API_PATH and not hasattr(request, "app"):
        request.app = get_app_promise(request).get()


def set_project_on_context(request: IntegraflowContext):
    if request.path == API_PATH and not hasattr(request, "project"):
        request.project = get_project_promise(request).get()


def get_user(request: IntegraflowContext) -> Optional[User]:
    if not hasattr(request, "_cached_user"):
        request._cached_user = cast(Optional[User], authenticate(
            request=request
        ))
    return request._cached_user


def set_auth_on_context(request: IntegraflowContext):
    if hasattr(request, "app") and request.app:
        request.user = SimpleLazyObject(lambda: None)  # type: ignore
        return request

    def user():
        return get_user(request) or None

    request.user = SimpleLazyObject(user)  # type: ignore
