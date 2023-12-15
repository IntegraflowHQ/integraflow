from enum import Enum


class SurveyErrorCode(Enum):
    GRAPHQL_ERROR = "graphql_error"
    INACTIVE = "inactive"
    INVALID = "invalid"
    NOT_FOUND = "not_found"
    REQUIRED = "required"
    UNIQUE = "unique"
