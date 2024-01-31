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
    LogicOperator,
    LogicRangeCondition,
    LogicSingleCondition,
    LogicTextCondition,
} from "@integraflow/web/src/types";
import { PlacementType } from "@integraflow/web/src/types/index";

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
    startDate?: string | Date;
    endDate?: string | Date;
    backgroundOverlay?: BackgroundOverLayType;
    placement?: PlacementType;
    closeOnLimit?: boolean;
    responseLimit?: number;
    singleUse?: boolean;
};

export type ParsedChannel = Omit<SurveyChannel, "settings"> & {
    settings: ChannelSettings;
};

export type LinkSettings = {
    name: string | null;
    singleUse: boolean;
    startDate: string | null;
    endDate: string | null;
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
    condition?:
        | LogicMultipleCondition
        | LogicSingleCondition
        | LogicRangeCondition
        | LogicBooleanCondition
        | LogicDateCondition
        | LogicTextCondition;
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
    "questions"
> & {
    questions: QuestionOption[];
};
