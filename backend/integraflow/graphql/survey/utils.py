import graphene
import re

from integraflow.graphql.core.utils import from_global_id_or_error


# Define the pattern to match
pattern = r'{{answer:(.*?)\s*\|\s*"(.*?)"}}'


def replace_global_ids_to_pks(input_string: str):
    # Use regular expression to find matches
    matches = re.findall(pattern, input_string)

    # Replace each match with a UUID
    for match in matches:
        global_id = match[0]
        _, replacement_id = from_global_id_or_error(global_id)
        replacement_text = f'{{answer:{replacement_id} | "{match[1]}"}}'
        input_string = input_string.replace(
            f'{{answer:{global_id} | "{match[1]}"}}',
            replacement_text,
            1
        )

    return input_string


def replace_pks_to_global_ids(input_string: str, type):
    # Use regular expression to find matches
    matches = re.findall(pattern, input_string)

    # Replace each match with a UUID
    for match in matches:
        question_id = match[0]
        replacement_id = graphene.Node.to_global_id(type, question_id)
        replacement_text = f'{{answer:{replacement_id} | "{match[1]}"}}'
        input_string = input_string.replace(
            f'{{answer:{question_id} | "{match[1]}"}}',
            replacement_text,
            1
        )

    return input_string
