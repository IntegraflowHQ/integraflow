from integraflow.graphql.core.doc_category import DOC_CATEGORY_SURVEYS
from integraflow.graphql.core.types.base import BaseEnum
from integraflow.graphql.core.types.sort_input import SortInputObjectType


class SurveySortField(BaseEnum):
    NAME = ["name", "pk"]
    TYPE = ["type", "name", "pk"]
    STATUS = ["status", "name", "pk"]
    CREATED_AT = ["created_at", "pk"]
    LAST_MODIFIED_AT = ["updated_at", "pk"]

    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS

    @property
    def description(self):
        if self.name in SurveySortField.__enum__._member_names_:
            sort_name = self.name.lower().replace("_", " ")
            return f"Sort surveys by {sort_name}."
        raise ValueError(f"Unsupported enum value: {self.value}")


class SurveySortingInput(SortInputObjectType):
    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS
        sort_enum = SurveySortField
        type_name = "surveys"


class SurveyResponseSortField(BaseEnum):
    STATUS = ["status", "pk"]
    CREATED_AT = ["created_at", "pk"]
    LAST_MODIFIED_AT = ["updated_at", "pk"]
    COMPLETED_AT = ["completed_at", "pk"]
    TIME_SPENT = ["time_spent", "pk"]

    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS

    @property
    def description(self):
        if self.name in SurveyResponseSortField.__enum__._member_names_:
            sort_name = self.name.lower().replace("_", " ")
            return f"Sort responses by {sort_name}."
        raise ValueError(f"Unsupported enum value: {self.value}")


class SurveyResponseSortingInput(SortInputObjectType):
    class Meta:
        doc_category = DOC_CATEGORY_SURVEYS
        sort_enum = SurveyResponseSortField
        type_name = "responses"
