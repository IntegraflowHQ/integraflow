import graphene
import uuid
from typing import List, cast

from dateutil import parser
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone

from integraflow.celeryconf import app as celery_app
from integraflow.core.exceptions import PermissionDenied
from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_SURVEYS
from integraflow.graphql.core.mutations import BaseMutation
from integraflow.graphql.core.types.common import SurveyError
from integraflow.graphql.core.utils import from_global_id_or_none
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.project.models import Project
from integraflow.survey import models
from integraflow.survey.error_codes import SurveyErrorCode

from .survey_response_create import SurveyResponseInput


class SurveyResponseUpdateInput(SurveyResponseInput):
    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS


class SurveyResponseCreate(BaseMutation):
    class Arguments:
        id = graphene.ID(
            description="The ID of the response.",
            required=True
        )
        input = SurveyResponseUpdateInput(
            required=True,
            description="The partial response object to update"
        )

    status = graphene.Boolean(
        description="Whether the operation was successful.",
        default_value=False
    )

    class Meta:
        description = "Creates a response to survey."
        error_type_class = SurveyError
        error_type_field = "survey_errors"
        doc_category = DOC_CATEGORY_SURVEYS

    @classmethod
    def clean_input(cls, info: ResolveInfo, **kwargs):
        project = cast(Project, info.context.project)

        responses = kwargs.get("response", None)
        if isinstance(responses, dict):
            responses = [responses]

        question_ids = []
        if isinstance(responses, List):
            for response in responses:
                question_id = response.get("questionId", None)
                str("")
                if question_id is None:
                    raise ValidationError(
                        {
                            "question_id": ValidationError(
                                "Invalid question ID provided",
                                code=SurveyErrorCode.INVALID.value,
                            )
                        }
                    )

                try:
                    response["questionId"] = uuid.UUID(question_id)
                except ValueError:
                    response["questionId"] = from_global_id_or_none(
                        question_id
                    )

                question_ids.append(response["questionId"])

            question_count = models.SurveyQuestion.objects.filter(
                id__in=question_ids
            ).count()

            if len(question_ids) != question_count:
                raise ValidationError(
                    {
                        "question_id": ValidationError(
                            "Could not resolve one of the questions",
                            code=SurveyErrorCode.NOT_FOUND.value,
                        )
                    }
                )

        setattr(kwargs, "response", responses)

        completed = kwargs.get("completed", None)

        now = timezone.now()

        if completed is not None:
            kwargs["completed"] = completed
            completed_at = kwargs.get("completed_at", now.isoformat())

            setattr(
                kwargs,
                "completed_at",
                parser.isoparse(str(completed_at)).isoformat()
            )

        user_id = kwargs.get("user_id", None)
        if user_id is not None:
            setattr(kwargs, "distinct_id", user_id)

        attributes = kwargs.get("attributes", None)
        if attributes is not None:
            setattr(kwargs, "user_attributes", user_id)

        return kwargs

    @classmethod
    def perform_mutation(cls, _root, info: ResolveInfo, **kwargs):
        if not cls.check_permissions(
            info.context,
            [
                AuthorizationFilters.AUTHENTICATED_API,
                AuthorizationFilters.ORGANIZATION_MEMBER_ACCESS
            ],
            require_all_permissions=False
        ):
            raise PermissionDenied(
                "API key not provided. You can find your project API key "
                "in Integraflow project settings."
            )

        id = kwargs["id"]
        try:
            kwargs["id"] = uuid.UUID(id)
        except ValueError:
            kwargs["id"] = from_global_id_or_none(id)

        try:
            models.SurveyResponse.objects.get(id=kwargs["id"])
        except models.SurveyResponse.DoesNotExist:
            raise ValidationError(
                {
                    "id": ValidationError(
                        f"Could not resolve response with ID: {id}",
                        code=SurveyErrorCode.NOT_FOUND.value,
                    )
                }
            )

        cleaned_input = cls.clean_input(info, kwargs=kwargs["input"])

        response = models.SurveyResponse.objects.create(**cleaned_input)

        task_name = "integraflow.survey.task.process_response"
        celery_app.send_task(
            name=task_name,
            queue=settings.CELERY_DEFAULT_QUEUE,
            args=[response],
        )
        return cls(status=True)
