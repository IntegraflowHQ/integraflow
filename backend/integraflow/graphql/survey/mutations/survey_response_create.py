import graphene
from typing import List, cast

from dateutil import parser
from django.core.exceptions import ValidationError
from django.utils import timezone

from integraflow.core.exceptions import PermissionDenied
from integraflow.event.utils import get_or_create_person
from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.doc_category import DOC_CATEGORY_SURVEYS
from integraflow.graphql.core.fields import JSONString
from integraflow.graphql.core.mutations import BaseMutation
from integraflow.graphql.core.scalars import UUID
from integraflow.graphql.core.types.base import BaseInputObjectType
from integraflow.graphql.core.types.common import SurveyError
from integraflow.graphql.core.utils import from_global_ids_to_pks
from integraflow.permission.auth_filters import AuthorizationFilters
from integraflow.project.models import Project
from integraflow.survey import models
from integraflow.survey.error_codes import SurveyErrorCode


class SurveyResponseInput(BaseInputObjectType):
    response = JSONString(
        description="The partial response for the survey."
    )
    started_at = graphene.DateTime(
        description="The time the survey started.",
        required=False
    )
    completed = graphene.Boolean(
        description="Whether the response is completed.",
        default_value=False
    )
    completed_at = graphene.DateTime(
        description="The time the survey completed.",
        required=False
    )
    user_id = graphene.ID(
        description="The user distinct ID.",
        required=False
    )
    event = UUID(
        description="The event ID.",
        required=False
    )
    channel = JSONString(
        description="The channel of the response.",
        required=False
    )
    metadata = JSONString(
        description="The response metadata.",
        required=False
    )
    attributes = JSONString(
        description="The user attributes.",
        required=False
    )

    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS


class SurveyResponseCreateInput(SurveyResponseInput):
    id = UUID(
        description="The ID of the response."
    )
    survey_id = graphene.ID(
        required=True,
        description="The survey ID the response belongs to."
    )

    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS


class SurveyResponseCreate(BaseMutation):
    class Arguments:
        input = SurveyResponseCreateInput(
            required=True,
            description="The details for the response to create."
        )

    response_id = graphene.GlobalID(
        description="The ID of the response.",
        required=False
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

        survey_id = kwargs.get("survey_id")
        survey = cls.get_node_or_error(
            info,
            survey_id
        )

        if survey is None or survey.project.pk != project.pk:  # type: ignore
            raise ValidationError(
                {
                    "survey_id": ValidationError(
                        f"Could not resolve survey with ID: {survey_id}",
                        code=SurveyErrorCode.NOT_FOUND.value,
                    )
                }
            )

        cleaned_input = {
            "survey_id": survey.pk
        }

        id = kwargs.get("id", None)
        if id is not None:
            cleaned_input["id"] = id

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

            cleaned_response = {}
            for response in responses:
                question_id = response["questionId"]
                answers = response["answers"]
                cleaned_response[question_id] = answers

            cleaned_input["response"] = cleaned_response

        started_at = kwargs.get("started_at", None)
        if started_at is not None:
            cleaned_input["created_at"] = parser.isoparse(
                str(started_at)
            ).isoformat()

        completed = kwargs.get("completed", False)
        if completed:
            now = timezone.now()
            cleaned_input["status"] = models.SurveyResponse.Status.COMPLETED
            completed_at = kwargs.get("completed_at", now.isoformat())

            cleaned_input["completed_at"] = parser.isoparse(
                str(completed_at)
            ).isoformat()

        user_id = kwargs.get("user_id", None)
        if user_id is not None:
            cleaned_input["distinct_id"] = user_id

        attributes = kwargs.get("attributes", None)
        if attributes is not None:
            cleaned_input["user_attributes"] = attributes

        metadata = kwargs.get("metadata", None)
        if metadata is not None:
            cleaned_input["metadata"] = metadata

        return cleaned_input

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

        cleaned_input = cls.clean_input(info, **kwargs["input"])

        project = cast(Project, info.context.project)
        distinct_id = cleaned_input.get("distinct_id", None)
        if distinct_id is not None:
            person = get_or_create_person(project.id, distinct_id)
            cleaned_input["person_id"] = person.uuid

        id = cleaned_input.get("id", None)
        if id is None:
            response = models.SurveyResponse.objects.create(**cleaned_input)
        else:
            response, _ = models.SurveyResponse.objects.update_or_create(
                id=cleaned_input["id"],
                defaults=cleaned_input
            )

        return cls(
            status=True,
            response_id=response.pk
        )
