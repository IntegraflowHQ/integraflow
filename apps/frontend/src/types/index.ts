import { User } from "@/generated/graphql";
import { DeepOmit } from "@apollo/client/utilities";

export type SessionViewer = DeepOmit<User, "__typename">;
