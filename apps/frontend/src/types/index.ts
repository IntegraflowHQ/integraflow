import { PROPERTY_FIELDS } from "@/constants";
import {
    SurveyChannel,
    SurveyQuestionCountableEdge,
    User,
} from "@/generated/graphql";
import { DeepOmit } from "@apollo/client/utilities";
import {
    CTAType,
    FormFieldType,
    ID,
    LogicBooleanCondition,
    LogicDateCondition,
    LogicMultipleCondition,
    LogicRangeCondition,
    LogicSingleCondition,
    LogicTextCondition,
} from "@integraflow/web/src/types";
import {
    Audience,
    FilterOperator,
    FilterValue,
    LogicOperator,
    PlacementType,
    Trigger,
} from "@integraflow/web/src/types/index";

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

export type QuestionLogic = {
    id?: ID;
    orderNumber?: number;
    destination?: ID;
    condition?:
        | LogicMultipleCondition
        | LogicSingleCondition
        | LogicRangeCondition
        | LogicBooleanCondition
        | LogicDateCondition
        | LogicTextCondition;
    operator?: LogicOperator;
    values?: ID[] | string[];
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
    "questions"
> & {
    questions: QuestionOption[];
};
