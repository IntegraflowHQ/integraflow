import logging
import os
import re

from datetime import timedelta
from django.conf import settings
from django.utils import timezone

from integraflow.celeryconf import app
from integraflow.core.tracing import traced_atomic_transaction
from integraflow.survey.models import Survey, SurveyQuestion, SurveyResponse


logger = logging.getLogger(__name__)
FILE = os.path.dirname(__file__)
STOPWORDS = set(
    map(
        str.strip,
        open(os.path.join(settings.STATIC_ROOT, 'stopwords')).readlines()
    )
)


def process_tokens(
    text: str,
    min_word_length: int = 1,
    include_numbers: bool = True
):
    regexp = r"\w[\w']*" if min_word_length <= 1 else r"\w[\w']+"
    words = re.findall(regexp, text)

    # remove 's
    words = [
        word[:-2] if word.lower().endswith("'s") else word for word in words
    ]

    # remove numbers
    if not include_numbers:
        words = [word for word in words if not word.isdigit()]

    # remove short words
    if min_word_length:
        words = [word for word in words if len(word) >= min_word_length]

    # remove stopwords
    stopwords = set([i.lower() for i in STOPWORDS])
    words = [word for word in words if word.lower() not in stopwords]

    return words


def calculate_nps(score, nps):
    if score >= 9:
        nps["promoters"] = nps.get("promoters", 0) + 1
    elif score >= 7:
        nps["passives"] = nps.get("passives", 0) + 1
    else:
        nps["detractors"] = nps.get("detractors", 0) + 1

    return nps


def calculate_csat(score, csat):
    if score >= 4:
        csat["positive"] = csat.get("positive", 0) + 1

    csat["count"] = csat.get("count", 0) + 1

    return csat


def compute_metrics_for_response() -> None:
    timestamp = timezone.now() - timedelta(minutes=10)

    for response in SurveyResponse.objects.filter(
        is_processed=False,
        created_at__lte=timestamp
    ):
        try:
            process_response(response_id=response.pk)
        except Exception:
            logger.error(
                f"Failed to process response {response.pk}.",
                exc_info=True
            )


@app.task(
    autoretry_for=(Exception,),
    max_retries=3,
    retry_backoff=True,
)
def process_response(response_id: str) -> None:
    with traced_atomic_transaction():
        survey_response = SurveyResponse.objects.get(id=response_id)

        if survey_response is None:
            return

        if survey_response.is_processed:
            return

        response = survey_response.response

        question_ids = response.keys()

        questions = list(
            SurveyQuestion.objects.filter(
                pk__in=question_ids
            )
        )

        time_spent = 0
        is_completed = (
            survey_response.status == SurveyResponse.Status.COMPLETED
        )

        if is_completed and survey_response.completed_at is None:
            survey_response.completed_at = timezone.now()

        if survey_response.completed_at is not None:
            time_spent = (
                survey_response.completed_at - survey_response.created_at
            ).total_seconds()
            is_completed = True

        analytics_data = {}

        nps_count = 1
        ces_count = 1
        csat_count = 1

        for question in questions:
            question_id = str(question.id)
            answer = response[question_id][0].get("answer", None)
            answer_id = response[question_id][0].get("answerId", None)
            if answer is None and answer_id is None:
                continue

            if (
                answer_id is not None and
                question.type == SurveyQuestion.Type.NPS
            ):
                score = int(answer_id) - 1
                if "nps_score" in analytics_data:
                    nps_score = analytics_data["nps_score"] + score
                else:
                    nps_score = score

                analytics_data["nps_score"] = nps_score / nps_count
                nps_count += 1
                continue

            if (
                answer_id is not None and
                question.type == SurveyQuestion.Type.CES
            ):
                if "ces_score" in analytics_data:
                    ces_score = analytics_data["ces_score"] + int(answer_id)
                else:
                    ces_score = int(answer_id)

                analytics_data["ces_score"] = ces_score / ces_count
                ces_count += 1
                continue

            if (
                answer_id is not None and (
                    question.type == SurveyQuestion.Type.CSAT or
                    ((
                        question.type == SurveyQuestion.Type.SMILEY_SCALE or
                        question.type == SurveyQuestion.Type.RATING or
                        question.type == SurveyQuestion.Type.NUMERICAL_SCALE
                    ) and len(question.options) == 5)
                )
            ):
                if "csat_score" in analytics_data:
                    csat_score = analytics_data["csat_score"] + int(answer_id)
                else:
                    csat_score = int(answer_id)

                analytics_data["csat_score"] = csat_score / csat_count
                csat_count += 1
                continue

            if (
                answer is not None and
                question.type == SurveyQuestion.Type.TEXT
            ):
                response_title = analytics_data.get("response_title", None)
                if response_title is None:
                    analytics_data["title"] = answer

                if "word_tokens" in analytics_data:
                    word_token = (
                        analytics_data["word_tokens"] + process_tokens(answer)
                    )
                else:
                    word_token = process_tokens(answer)
                analytics_data["word_tokens"] = word_token

        survey_response.analytics_metadata = analytics_data
        survey_response.is_processed = True

        if is_completed:
            survey_response.time_spent = time_spent

        survey_response.save()

        survey = Survey.objects.select_for_update().get(
            id=survey_response.survey_id
        )
        analytics_metadata = survey.analytics_metadata

        if "nps_score" in analytics_data:
            nps = analytics_metadata.get("nps", {
                "promoters": 0,
                "detractors": 0,
                "passives": 0,
            })
            analytics_metadata["nps"] = calculate_nps(
                analytics_data["nps_score"],
                nps
            )

        if "ces_score" in analytics_data:
            ces = analytics_metadata.get("ces", {
                "score": analytics_data["ces_score"],
                "count": 1,
            })

            if "ces" in analytics_metadata:
                ces["score"] += analytics_metadata["ces"].get("score", 0)
                ces["count"] += analytics_metadata["ces"].get("count", 0)

            analytics_metadata["ces"] = ces

        if "csat_score" in analytics_data:
            csat = analytics_metadata.get("csat", {
                "positive": 0,
                "count": 0,
            })

            analytics_metadata["csat"] = calculate_csat(
                analytics_data["csat_score"],
                csat
            )

        analytics_metadata["response_count"] = (
            analytics_metadata.get("response_count", 0) + 1
        )

        if is_completed:
            analytics_metadata["time_spent"] = (
                analytics_metadata.get("time_spent", 0) + time_spent
            )
            analytics_metadata["completed_response_count"] = (
                analytics_metadata.get("completed_response_count", 0) + 1
            )

        survey.analytics_metadata = analytics_metadata
        survey.save()
