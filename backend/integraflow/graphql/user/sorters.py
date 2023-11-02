from integraflow.graphql.core.doc_category import DOC_CATEGORY_USERS
from integraflow.graphql.core.types.base import BaseEnum
from integraflow.graphql.core.types.sort_input import SortInputObjectType


class UserSortField(BaseEnum):
    FIRST_NAME = ["first_name", "last_name", "pk"]
    LAST_NAME = ["last_name", "first_name", "pk"]
    EMAIL = ["email"]
    CREATED_AT = ["date_joined", "pk"]

    class Meta:
        doc_category = DOC_CATEGORY_USERS

    @property
    def description(self):
        if self.name in UserSortField.__enum__._member_names_:
            sort_name = self.name.lower().replace("_", " ")
            return f"Sort users by {sort_name}."
        raise ValueError(f"Unsupported enum value: {self.value}")


class UserSortingInput(SortInputObjectType):
    class Meta:
        doc_category = DOC_CATEGORY_USERS
        sort_enum = UserSortField
        type_name = "users"
