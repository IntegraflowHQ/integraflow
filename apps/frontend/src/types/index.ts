import { SurveyQuestionCountableEdge, User } from "@/generated/graphql";
import { DeepOmit } from "@apollo/client/utilities";
import { FormFieldType } from "@integraflow/web/src/types";

export type CachedViewer = DeepOmit<User, "__typename">;

export enum CreateSurvey {
    START_FROM_SCRATCH = "start from scratch",
    USE_TEMPLATE = "use template",
}

export type ChannelSettings = {
    name?: string;
    singleUse?: boolean;
    startDate?: string;
    endDate?: string;
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
    comment?: string;
    required?: boolean;
    type?: FormFieldType;
};


export type ParsedQuestion = Omit<SurveyQuestionCountableEdge["node"], "questions"> & {
    questions: QuestionOption[];
};
