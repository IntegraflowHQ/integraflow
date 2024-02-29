import graphene


class SurveyTypeEnum(graphene.Enum):
    SURVEY = "survey"
    QUIZ = "quiz"
    POLL = "poll"
    CUSTOM = "custom"


class SurveyStatusEnum(graphene.Enum):
    DRAFT = "draft"
    IN_PROGRESS = "in_progress"
    ACTIVE = "active"
    PAUSED = "paused"
    ARCHIVED = "archived"
    COMPLETED = "completed"


class SurveyQuestionTypeEnum(graphene.Enum):
    SINGLE = "single"
    MULTIPLE = "multiple"
    TEXT = "text"
    DATE = "date"
    CSAT = "csat"
    CES = "ces"
    SMILEY_SCALE = "smiley_scale"
    NUMERICAL_SCALE = "numerical_scale"
    RATING = "rating"
    NPS = "nps"
    FORM = "form"
    BOOLEAN = "boolean"
    CTA = "cta"
    DROPDOWN = "dropdown"
    INTEGRATION = "integration"
    CUSTOM = "custom"


class SurveyChannelTypeEnum(graphene.Enum):
    EMAIL = "email"
    LINK = "link"
    API = "api"
    CUSTOM = "custom"
    MOBILE_SDK = "mobile_sdk"
    WEB_SDK = "web_sdk"
