import { ApolloClient } from "@apollo/client";

export type AuthParams = {
    token: string | null;
    refreshToken: string | null;
    currentProjectId?: string | null;
    refresh: () => Promise<string | undefined>;
};

export interface ApolloManager<TCacheShape> {
    getClient(): ApolloClient<TCacheShape>;
    updateAuthParams(authParams: AuthParams | null): void;
}

export enum OperationType {
    Query = "query",
    Mutation = "mutation",
    Subscription = "subscription",
    Error = "error",
}
