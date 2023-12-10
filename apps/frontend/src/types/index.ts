import { User } from "@/generated/graphql";
import { DeepOmit } from "@apollo/client/utilities";

export type CachedViewer = DeepOmit<User, "__typename">;


export enum CreateSurvey {
    START_FROM_SCRATCH = "start from scratch",
    USE_TEMPLATE = "use template",
}
