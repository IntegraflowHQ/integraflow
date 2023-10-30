from enum import Enum


class UserErrorCode(Enum):
    GRAPHQL_ERROR = "graphql_error"
    INACTIVE = "inactive"
    INVALID = "invalid"
    NOT_FOUND = "not_found"
    REQUIRED = "required"
    UNIQUE = "unique"
    INVALID_MAGIC_CODE = "invalid_magic_code"
    MAGIC_CODE_EXPIRED = "magic_code_expired"
    JWT_SIGNATURE_EXPIRED = "signature_has_expired"
    JWT_INVALID_TOKEN = "invalid_token"
    JWT_DECODE_ERROR = "decode_error"
    JWT_MISSING_TOKEN = "missing_token"
    JWT_INVALID_CSRF_TOKEN = "invalid_csrf_token"
