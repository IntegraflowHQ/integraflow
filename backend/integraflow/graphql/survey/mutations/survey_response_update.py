import uuid
import graphene
from typing import List, cast

from dateutil import parser
from django.core.exceptions import ValidationError
from django.utils import timezone

from integraflow.core.exceptions import PermissionDenied
from integraflow.event.utils import get_or_create_person
from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_SURVEYS
from integraflow.graphql.core.mutations import BaseMutation
from integraflow.graphql.core.types.common import SurveyError
from integraflow.graphql.core.utils import (
    from_global_id_or_none,
    from_global_ids_to_pks
)
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.project.models import Project
from integraflow.survey import models
from integraflow.survey.error_codes import SurveyErrorCode

from .survey_response_create import SurveyResponseInput


class SurveyResponseUpdateInput(SurveyResponseInput):
    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS


class SurveyResponseUpdate(BaseMutation):
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
        description = "Updates a response."
        error_type_class = SurveyError
        error_type_field = "survey_errors"
        doc_category = DOC_CATEGORY_SURVEYS

    @classmethod
    def clean_input(
        cls,
        info: ResolveInfo,
        survey_response: models.SurveyResponse,
        **kwargs
    ):
        responses = kwargs.get("response", None)
        if responses is not None:
            if isinstance(responses, dict):
                responses = [responses]

            question_ids = []
            if isinstance(responses, List):
                for response in responses:
                    question_ids.append(response.get("questionId", None))

                questions = cls.get_nodes_or_error(
                    question_ids,
                    "question_id",
                    schema=info.schema
                )
                count = len(questions)

                if len(question_ids) != count:
                    raise ValidationError(
                        {
                            "question_id": ValidationError(
                                "Could not resolve one of the questions",
                                code=SurveyErrorCode.NOT_FOUND.value,
                            )
                        }
                    )

            from_global_ids_to_pks(responses, "questionId")

            cleaned_response = survey_response.response or {}
            for response in responses:
                question_id = response["questionId"]
                answers = response["answers"]
                cleaned_response[question_id] = answers

            survey_response.response = cleaned_response

        started_at = kwargs.get("completed_at", None)
        if started_at is not None:
            survey_response.created_at = parser.isoparse(
                str(started_at)
            ).isoformat()

        completed = kwargs.get("completed", False)
        if completed is True:
            now = timezone.now()
            survey_response.status = models.SurveyResponse.Status.COMPLETED
            completed_at = kwargs.get("completed_at", now.isoformat())

            survey_response.completed_at = parser.isoparse(
                str(completed_at)
            ).isoformat()

        user_id = kwargs.get("user_id", None)
        if user_id is not None:
            survey_response.distinct_id = user_id

        attributes = kwargs.get("attributes", None)
        if attributes is not None:
            user_attributes = survey_response.user_attributes or {}
            user_attributes.update(attributes)
            survey_response.user_attributes = user_attributes

        metadata = kwargs.get("metadata", None)
        if metadata is not None:
            survey_metadata = survey_response.metadata or {}
            survey_metadata.update(metadata)
            survey_response.metadata = metadata

        return survey_response

    @classmethod
    def perform_mutation(cls, _root, info: ResolveInfo, **kwargs):
        if not cls.check_permissions(
            info.context,
            [AuthorizationFilters.AUTHENTICATED_API],
            require_all_permissions=False
        ):
            raise PermissionDenied(
                "API key not provided. You can find your project API key "
                "in Integraflow project settings."
            )

        project = cast(Project, info.context.project)

        try:
            id = uuid.UUID(kwargs["id"])
        except ValueError:
            id = from_global_id_or_none(kwargs["id"])

        try:
            response = models.SurveyResponse.objects.get(
                id=id,
                survey__project_id=project.pk
            )
        except models.SurveyResponse.DoesNotExist:
            raise ValidationError(
                {
                    "id": ValidationError(
                        f"Could not resolve response with ID: {id}",
                        code=SurveyErrorCode.NOT_FOUND.value,
                    )
                }
            )

        old_distinct_id = response.distinct_id

        cls.clean_input(info, response, **kwargs["input"])

        project = cast(Project, info.context.project)

        distinct_id = response.distinct_id
        if distinct_id != old_distinct_id:
            person = get_or_create_person(project.id, distinct_id)
            response.person_id = person.uuid

        response.completed_at = timezone.now()
        response.save()

        if response.status == models.SurveyResponse.Status.COMPLETED:
            # Trigger a celery task to calculate survey metrics
            pass

        return cls(status=True)
