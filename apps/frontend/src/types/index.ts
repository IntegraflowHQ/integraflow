import { PROPERTY_FIELDS } from "@/constants";
import { ProjectTheme, SurveyChannel, SurveyQuestionCountableEdge, SurveyResponse, User } from "@/generated/graphql";
import { DeepOmit } from "@apollo/client/utilities";

export type CachedViewer = DeepOmit<User, "__typename">;

export type ID = string | number;

export type PlacementType = "bottomLeft" | "bottomRight" | "topLeft" | "topRight" | "center";

export enum CreateSurvey {
    START_FROM_SCRATCH = "start from scratch",
    USE_TEMPLATE = "use template",
}

export type BackgroundOverLayType = "none" | "dark" | "light";
export type ViewPortType = "mobile" | "desktop";
export type PreviewMode = "link" | "sdk";

export enum FormFieldType {
    FIRST_NAME = "first_name",
    LAST_NAME = "last_name",
    EMAIL = "email",
    ORGANIZATION = "organization",
    DEPARTMENT = "department",
    JOB_TITLE = "job_title",
    PHONE = "phone",
    WEBSITE = "website",
    COUNTRY = "country",
    ADDRESS_ONE = "address_one",
    ADDRESS_TWO = "address_two",
    CITY = "city",
    STATE = "state",
    ZIP = "zip",
    FAX = "fax",
    ANNUAL_REVENUE = "annual_revenue",
    EMPLOYEES = "employees",
    INDUSTRY = "industry",
    CONFIRMATION = "confirmation",
    SECURITY_INFO = "security_info",
    COMMENT = "comment",
}

export enum FilterOperator {
    IN = "in",
    IS = "is",
    IS_NOT = "is_not",
    STARTS_WITH = "starts_with",
    ENDS_WITH = "ends_with",
    CONTAINS = "contains",
    DOES_NOT_CONTAIN = "not_contain",
    IS_UNKNOWN = "is_unknown",
    HAS_ANY_VALUE = "any_value",
    GREATER_THAN = "greater_than",
    LESS_THAN = "less_than",
    IS_TRUE = "is_true",
    IS_FALSE = "is_false",
}

export type FilterValue = number | boolean | string | string[];

export interface Audience {
    operator: LogicOperator;
    filters: {
        attribute: string;
        operator: FilterOperator;
        value: FilterValue;
    }[];
}

export interface Trigger {
    delay?: number;
    conditions?: {
        event: string;
        operator: LogicOperator;
        filters?: {
            property: string;
            operator: FilterOperator;
            value: FilterValue;
        }[];
    }[];
}

export enum LogicOperator {
    OR = "or",
    AND = "and",
}

export enum CTAType {
    LINK = "link",
    NEXT = "next",
    CLOSE = "close",
    HIDDEN = "hidden",
}

export type Jsonish =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Jsonish }
    | { toJSON: () => any }
    | Jsonish[]
    | undefined;

export interface EventProperties {
    [key: string]: Jsonish;
}

export interface SurveyAnswer {
    finished?: boolean;
    ctaSuccess?: boolean;
    fieldType?: FormFieldType;
    completionRate?: number;
    answer?: string;
    answerId?: ID;
}

export interface FormField extends QuestionOption {
    type: FormFieldType;
    required: boolean;
}

export type SurveySettings = {
    close?: boolean;
    showProgressBar?: boolean;
    showBranding?: boolean;
    submitText?: string;
};

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
};

export type ParsedChannel = Omit<SurveyChannel, "settings" | "triggers" | "conditions"> & {
    settings: ChannelSettings;
    triggers: Trigger;
    conditions: Audience;
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

export type IntegraflowIconProps = React.SVGAttributes<SVGSVGElement> & {
    size?: number;
};

export type QuestionOption = {
    id: number | string;
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

export enum CTAEnums {
    BUTTON = "button",
    LINK = "link",
    HIDDEN = "hidden",
    CLOSE = "close",
}

export enum LimitRange {
    EXACT = "exact",
    RANGE = "range",
}

export type ParsedQuestion = Omit<SurveyQuestionCountableEdge["node"], "options" | "settings"> & {
    options: QuestionOption[];
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
    DOES_NOT_INCLUDE_ANY = "not_include_any",
    IS_FILLED_IN = "filled",
    IS_NOT_FILLED_IN = "not_filled",
    IS_EXACTLY = "exactly",
    INCLUDES_ALL = "includes_all",
    INCLUDES_ANY = "includes_any",
}

export type MentionItem = {
    value: string;
    id: string;
    type: string;
    disabled?: boolean;
};

export type MentionOption = {
    title: string;
    items: MentionItem[];
};

export type ColorScheme = {
    question: string;
    answer: string;
    progressBar: string;
    button: string;
    background: string;
};

export type ParsedTheme = Omit<ProjectTheme, "colorScheme"> & {
    colorScheme: ColorScheme;
};

export type Theme = {
    id: string | null;
    name: string;
    colorScheme: ColorScheme;
};

export type Properties = Record<string, string | boolean>;

export type UserAttributes = Record<string, string>;
export type Response = Record<string, SurveyAnswer[]>;

export type ParsedResponse = Omit<SurveyResponse, "userAttributes" | "response"> & {
    userAttributes: UserAttributes;
    response: Response;
};

export type NPSMetric = {
    promoters: number;
    passives: number;
    detractors: number;
    score: number;
};

export type CESMetric = {
    low: number;
    medium: number;
    high: number;
    score: number;
};

export type CSATMetric = {
    positive: number;
    neutral: number;
    negative: number;
    score: number;
};

export type Summary = {
    value: number | null;
};

export type DateFilterValue = {
    timePeriod: "today" | "last 7 days" | "30 days" | "1 year" | "custom";
    current: {
        gte: string;
        lte: string;
    };
    previous?: {
        gte: string;
        lte: string;
    };
};

export enum AnalyzeTabs {
    Overview = "Overview",
    Responses = "Responses",
    Insights = "Insights",
    Trends = "Trends",
    Text = "Text",
}
