import { User } from "@/generated/graphql";
import { DeepOmit } from "@apollo/client/utilities";

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
