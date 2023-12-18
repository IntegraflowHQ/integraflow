import {
    SurveyChannel,
    SurveyQuestionCountableEdge,
    User,
} from "@/generated/graphql";
import { DeepOmit } from "@apollo/client/utilities";
import { FormFieldType } from "@integraflow/web/src/types";
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
    id: number;
    orderNumber: number;
    label: string;
    comment?: boolean;
    required?: boolean;
    type?: FormFieldType;
};

export type QuestionSettings = {
    label?: string;
    comment?: boolean;
    type?: FormFieldType;
    randomize?: boolean;
    randomizeExceptLast?: boolean;
    disclaimer?: boolean;
    disclaimerText?: string;
    consent?: boolean;
    consentText?: string;
    rightText?: string;
    leftText?: string;
    count?: number;
    shape?: "star" | "thumb" | "heart"| "button";
    positiveText?: string;
    negativeText?: string;
    singleLine?: boolean;
    choice?: {
        min?: number;
        max?: number;
    };

};

export type ParsedQuestion = Omit<
    SurveyQuestionCountableEdge["node"],
    "questions"
> & {
    questions: QuestionOption[];
};
