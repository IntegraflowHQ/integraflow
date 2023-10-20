from django.core.serializers.json import DjangoJSONEncoder
from django.core.serializers.json import Serializer as JsonSerializer
from draftjs_sanitizer import SafeJSONEncoder


class Serializer(JsonSerializer):
    def _init_options(self):
        super()._init_options()  # type: ignore[misc] # private method
        self.json_kwargs["cls"] = CustomJsonEncoder


class CustomJsonEncoder(DjangoJSONEncoder):
    """Encode custom JSON"""


class HTMLSafeJSON(SafeJSONEncoder, DjangoJSONEncoder):
    """Escape dangerous characters from JSON.

    It is used for integrating JSON into HTML content in addition to
    serializing Django objects.
    """
