from typing import List, Union

from integraflow.core.utils import is_minus_one

from .models import SurveyQuestion


class LogicBaseCondition:
    HAS_ANY_VALUE = "any_value"


class LogicTextCondition(LogicBaseCondition):
    ANSWER_CONTAINS = "contains"
    ANSWER_DOES_NOT_CONTAIN = "not_contain"
    QUESTION_IS_ANSWERED = "answered"
    QUESTION_IS_NOT_ANSWERED = "not_answered"


class LogicSingleCondition(LogicBaseCondition):
    IS = "is"
    IS_NOT = "is_not"


class LogicMultipleCondition(LogicBaseCondition):
    IS_EXACTLY = "exactly"
    INCLUDES_ALL = "includes_all"
    INCLUDES_ANY = "includes_any"
    DOES_NOT_INCLUDE_ANY = "not_include_any"


class LogicFormCondition(LogicBaseCondition):
    IS_FILLED_IN = "filled"
    IS_NOT_FILLED_IN = "not_filled"


class LogicDateCondition(LogicBaseCondition):
    QUESTION_IS_ANSWERED = "answered"
    QUESTION_IS_NOT_ANSWERED = "not_answered"


class LogicRangeCondition(LogicBaseCondition):
    IS = "is"
    IS_NOT = "is_not"
    IS_BETWEEN = "between"


class LogicBooleanCondition(LogicBaseCondition):
    IS_TRUE = "is_true"
    IS_FALSE = "is_false"


def evaluate_single_logic(logic, destinations):
    if (
        logic.get("condition") == LogicSingleCondition.IS and
        len(logic.get("values")) == len(logic.options)
    ):
        destinations.clear()
        destinations.add(logic.get("destination"))


def evaluate_multiple_logic(logic, destinations):
    if (
        logic.get("condition") == LogicMultipleCondition.INCLUDES_ANY and
        len(logic.get("values")) == len(logic.options)
    ):
        destinations.clear()
        destinations.add(logic.get("destination"))


def evaluate_logic(
    question: SurveyQuestion,
    next_question_id: Union[int, str]
):
    destinations = set()
    destinations.add(next_question_id)

    settings = question.settings or {}
    sorted_logic = settings.get("logic", [])
    sorted_logic.sort(key=lambda x: x["orderNumber"])

    for logic in sorted_logic:
        destinations.add(str(logic.get("destination")))

        if logic.get("condition") == LogicBaseCondition.HAS_ANY_VALUE:
            destinations.clear()
            destinations.add(str(logic.get("destination")))
            break

        if question.type == SurveyQuestion.Type.SINGLE:
            evaluate_single_logic(logic, destinations)

        if question.type == SurveyQuestion.Type.MULTIPLE:
            evaluate_multiple_logic(logic, destinations)

    return destinations


def construct_destinations(questions: List[SurveyQuestion]):
    destinations = {}

    last_index = len(questions) - 1

    for index, question in enumerate(questions):
        next_question_id = (
            -1 if last_index == index else str(questions[index + 1].id)
        )

        destinations[str(question.id)] = evaluate_logic(
            question,
            next_question_id
        )

    return destinations


def traverse_destination(
    destination: str,
    destinations: dict,
    max_paths: dict
):
    if destination in max_paths:
        return max_paths[destination]

    # Get the next destinations for current destination
    next_destinations = destinations.get(destination, [])

    # Calculate the max path for the current question
    max_path = 0

    for next_destination in next_destinations:
        if is_minus_one(next_destination):
            # End of the survey
            max_path = max(max_path, 0)
        else:
            # Recursively calculate the max path for the next destination
            max_path = max(
                max_path,
                traverse_destination(
                    next_destination,
                    destinations,
                    max_paths
                ) + 1
            )

    # Memoize the result to avoid redundant calculations
    max_paths[destination] = max_path
    return max_path


def calculate_max_paths(survey_id: str):
    questions = list(
        SurveyQuestion.objects.filter(
            survey_id=survey_id
        ).order_by('order_number')
    )

    destinations = construct_destinations(questions)

    max_paths = {}

    for question in questions:
        # Start traversal from each question
        question.max_path = traverse_destination(
            str(question.id),
            destinations,
            max_paths
        )

    SurveyQuestion.objects.bulk_update(questions, ["max_path"])
