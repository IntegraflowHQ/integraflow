from enum import Enum


class EventErrorCode(Enum):
    FORBIDDEN = "forbidden"
    GRAPHQL_ERROR = "graphql_error"
    INVALID = "invalid"
