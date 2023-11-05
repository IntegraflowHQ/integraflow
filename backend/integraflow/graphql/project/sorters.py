from integraflow.graphql.core.doc_category import DOC_CATEGORY_PROJECTS
from integraflow.graphql.core.types.base import BaseEnum
from integraflow.graphql.core.types.sort_input import SortInputObjectType


class ProjectSortField(BaseEnum):
    NAME = ["name", "id"]
    CREATED_AT = ["created_at", "name", "id"]
    UPDATED_AT = ["updated_at", "name", "id"]

    class Meta:
        doc_category = DOC_CATEGORY_PROJECTS

    @property
    def description(self):
        if self.name in ProjectSortField.__enum__._member_names_:
            sort_name = self.name.lower().replace("_", " ")
            return f"Sort projects by {sort_name}."
        raise ValueError(f"Unsupported enum value: {self.value}")


class ProjectSortingInput(SortInputObjectType):
    class Meta:
        doc_category = DOC_CATEGORY_PROJECTS
        sort_enum = ProjectSortField
        type_name = "projects"
