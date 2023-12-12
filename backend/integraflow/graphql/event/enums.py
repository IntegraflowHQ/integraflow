import graphene


class PropertyTypeEnum(graphene.Enum):
    Datetime = "DateTime"
    String = "String"
    Numeric = "Numeric"
    Boolean = "Boolean"


class PropertyDefinitionTypeEnum(graphene.Enum):
    EVENT = 1
    PERSON = 2
    GROUP = 3
