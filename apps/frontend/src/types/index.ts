import { PROPERTY_FIELDS } from "@/constants";
import {
    SurveyChannel,
    SurveyQuestionCountableEdge,
    User,
} from "@/generated/graphql";
import { DeepOmit } from "@apollo/client/utilities";
import {
    Audience,
    CTAType,
    FilterOperator,
    FilterValue,
    FormFieldType,
    ID,
    LogicOperator,
    PlacementType,
    Trigger,
} from "@integraflow/web";

export type CachedViewer = DeepOmit<User, "__typename">;

export enum CreateSurvey {
    START_FROM_SCRATCH = "start from scratch",
    USE_TEMPLATE = "use template",
}

export type BackgroundOverLayType = "none" | "dark" | "light";

export type ChannelSettings = {
    name?: string;
    recurring?: boolean;
    recurringPeriod?: number;
    startDate?: string;
    endDate?: string;
    backgroundOverlay?: BackgroundOverLayType;
    placement?: PlacementType;
    closeOnLimit?: boolean;
    responseLimit?: number;
    singleUse?: boolean;
};

export type ParsedChannel = Omit<
    SurveyChannel,
    "settings" | "triggers" | "conditions"
> & {
    settings: ChannelSettings;
    triggers: Trigger;
    conditions: Audience;
};

export type LinkSettings = {
    name: string | null;
    singleUse: boolean;
    startDate: string | null;
    endDate: string | null;
};

export type EventFilter = {
    property: string;
    operator: FilterOperator;
    value: FilterValue;
};

export type AudienceFilter = {
    attribute: string;
    operator: FilterOperator;
    value: FilterValue;
};

export type TriggerCondition = {
    event: string;
    operator: LogicOperator;
    filters?: EventFilter[];
};

export type TriggerConditionInput = {
    type: keyof typeof PROPERTY_FIELDS;
    property: string;
};

export type WebChannelAccordionProps = {
    channel: ParsedChannel;
};

export type IntegraflowIconProps = {
    color?: string;
    size?: number;
};

export type QuestionOption = {
    id: string;
    orderNumber: number;
    label: string;
    comment?: boolean;
    required?: boolean;
    type?: FormFieldType;
};

export type FormLogicGroup = {
    id?: string;
    condition: string;
    operator: string;
    fields: string[];
};

export type QuestionLogic = {
    id?: ID | number | string;
    orderNumber?: number;
    destination?: ID;
    condition?: LogicConditionEnum | undefined;
    operator?: LogicOperator | undefined;
    values?: ID[] | string[];
    groups?: FormLogicGroup[];
};

export type QuestionSettings = {
    text?: string;
    link?: string;
    label?: string;
    comment?: boolean;
    type?: FormFieldType | CTAType;
    randomize?: boolean;
    randomizeExceptLast?: boolean;
    disclaimer?: boolean;
    disclaimerText?: string;
    consent?: boolean;
    consentText?: string;
    rightText?: string;
    leftText?: string;
    count?: number;
    shape?: "star" | "thumb" | "heart" | "button";
    positiveText?: string;
    negativeText?: string;
    singleLine?: boolean;
    choice?: {
        min?: number;
        max?: number;
    };
    logic?: QuestionLogic[];
};

export type ParsedQuestion = Omit<
    SurveyQuestionCountableEdge["node"],
    "questions" | "settings"
> & {
    questions: QuestionOption[];
    settings: QuestionSettings;
};

export enum LogicConditionEnum {
    IS = "is",
    IS_NOT = "is_not",
    NOT_ANSWERED = "not_answered",
    ANSWERED = "answered",
    IS_FALSE = "is_false",
    BETWEEN = "between",
    IS_TRUE = "is_true",
    ANSWER_CONTAINS = "contains",
    ANSWER_DOES_NOT_CONTAIN = "not_contain",
    HAS_ANY_VALUE = "any_value",
    QUESTION_IS_ANSWERED = "answered",
    QUESTION_IS_NOT_ANSWERED = "not_answered",
    DOES_NOT_INCLUDE_ANY = "not_include_any",
    IS_FILLED_IN = "filled",
    IS_NOT_FILLED_IN = "not_filled",
    IS_EXACTLY = "exactly",
    INCLUDES_ALL = "includes_all",
    INCLUDES_ANY = "includes_any",
}
