from enum import Enum


class ProjectErrorCode(Enum):
    ALREADY_EXISTS = "already_exists"
    GRAPHQL_ERROR = "graphql_error"
    INVALID = "invalid"
    INVALID_PERMISSION = "invalid_permission"
    NOT_FOUND = "not_found"
    REQUIRED = "required"
    UNIQUE = "unique"
