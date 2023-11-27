import { User } from "@/generated/graphql";
import { DeepOmit } from "@apollo/client/utilities";

export type CachedViewer = DeepOmit<User, "__typename">;
