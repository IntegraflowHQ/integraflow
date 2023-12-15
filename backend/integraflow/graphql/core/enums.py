import graphene

from .utils import str_to_enum

from integraflow.app import error_codes as app_error_codes
from integraflow.event import error_codes as event_error_codes
from integraflow.organization import error_codes as organization_error_codes
from integraflow.project import error_codes as project_error_codes
from integraflow.survey import error_codes as survey_error_codes
from integraflow.user import error_codes as user_error_codes
from integraflow.webhook import error_codes as webhook_error_codes
from .doc_category import (
    DOC_CATEGORY_APPS,
    DOC_CATEGORY_ORGANIZATIONS,
    DOC_CATEGORY_PROJECTS,
    DOC_CATEGORY_SURVEYS,
    DOC_CATEGORY_USERS,
    DOC_CATEGORY_WEBHOOKS,
)
from integraflow.core import JobStatus


class OrderDirection(graphene.Enum):
    ASC = ""
    DESC = "-"

    @property
    def description(self):
        # Disable all the no-member violations in this function
        # pylint: disable=no-member
        if self == OrderDirection.ASC:
            return "Specifies an ascending sort order."
        if self == OrderDirection.DESC:
            return "Specifies a descending sort order."
        raise ValueError(f"Unsupported enum value: {self.value}")


class ReportingPeriod(graphene.Enum):
    TODAY = "TODAY"
    THIS_MONTH = "THIS_MONTH"


class RoleLevel(graphene.Enum):
    MEMBER = 1
    ADMIN = 8


def to_enum(enum_cls, *, type_name=None, **options) -> graphene.Enum:
    """Create a Graphene enum from a class containing a set of options.

    :param enum_cls:
        The class to build the enum from.
    :param type_name:
        The name of the type. Default is the class name + 'Enum'.
    :param options:
        - description:
            Contains the type description (default is the class's docstring)
        - deprecation_reason:
            Contains the deprecation reason.
            The default is enum_cls.__deprecation_reason__ or None.
    :return:
    """

    # note this won't work until
    # https://github.com/graphql-python/graphene/issues/956 is fixed
    deprecation_reason = getattr(enum_cls, "__deprecation_reason__", None)
    if deprecation_reason:
        options.setdefault("deprecation_reason", deprecation_reason)

    type_name = type_name or (enum_cls.__name__ + "Enum")
    enum_data = [
        (str_to_enum(code.upper()), code) for code, name in enum_cls.CHOICES
    ]
    return graphene.Enum(type_name, enum_data, **options)


class ErrorPolicy:
    IGNORE_FAILED = "ignore_failed"
    REJECT_EVERYTHING = "reject_everything"
    REJECT_FAILED_ROWS = "reject_failed_rows"

    CHOICES = [
        (IGNORE_FAILED, "Ignore failed"),
        (REJECT_EVERYTHING, "Reject everything"),
        (REJECT_FAILED_ROWS, "Reject failed rows"),
    ]


def error_policy_enum_description(enum):
    if enum == ErrorPolicyEnum.IGNORE_FAILED:
        return (
            "Save what is possible within a single row. If there are errors "
            "in an input data row, try to save it partially and skip the "
            "invalid part."
        )
    if enum == ErrorPolicyEnum.REJECT_FAILED_ROWS:
        return "Reject rows with errors."
    if enum == ErrorPolicyEnum.REJECT_EVERYTHING:
        return "Reject all rows if there is at least one error in any of them."
    return None


ErrorPolicyEnum = to_enum(
    ErrorPolicy,
    description=error_policy_enum_description
)

AppErrorCode = graphene.Enum.from_enum(app_error_codes.AppErrorCode)
AppErrorCode.doc_category = DOC_CATEGORY_APPS

EventErrorCode = graphene.Enum.from_enum(event_error_codes.EventErrorCode)

JobStatusEnum = to_enum(JobStatus)

OrganizationErrorCode = graphene.Enum.from_enum(
    organization_error_codes.OrganizationErrorCode
)
OrganizationErrorCode.doc_category = DOC_CATEGORY_ORGANIZATIONS

ProjectErrorCode = graphene.Enum.from_enum(
    project_error_codes.ProjectErrorCode
)
ProjectErrorCode.doc_category = DOC_CATEGORY_PROJECTS

SurveyErrorCode = graphene.Enum.from_enum(
    survey_error_codes.SurveyErrorCode
)
SurveyErrorCode.doc_category = DOC_CATEGORY_SURVEYS

UserErrorCode = graphene.Enum.from_enum(
    user_error_codes.UserErrorCode
)
UserErrorCode.doc_category = DOC_CATEGORY_USERS

WebhookErrorCode = graphene.Enum.from_enum(
    webhook_error_codes.WebhookErrorCode
)
WebhookErrorCode.doc_category = DOC_CATEGORY_WEBHOOKS

WebhookDryRunErrorCode = graphene.Enum.from_enum(
    webhook_error_codes.WebhookDryRunErrorCode
)
WebhookDryRunErrorCode.doc_category = DOC_CATEGORY_WEBHOOKS

WebhookTriggerErrorCode = graphene.Enum.from_enum(
    webhook_error_codes.WebhookTriggerErrorCode
)
WebhookTriggerErrorCode.doc_category = DOC_CATEGORY_WEBHOOKS
