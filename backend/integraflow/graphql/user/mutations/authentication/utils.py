from django.middleware.csrf import (
    _get_new_csrf_string,
    _mask_cipher_secret,  # type: ignore
    _unmask_cipher_token,  # type: ignore
)
from django.utils.crypto import constant_time_compare


def _get_new_csrf_token() -> str:
    return _mask_cipher_secret(_get_new_csrf_string())


def _does_token_match(token: str, csrf_token: str) -> bool:
    return constant_time_compare(
        _unmask_cipher_token(token),
        _unmask_cipher_token(csrf_token),
    )
