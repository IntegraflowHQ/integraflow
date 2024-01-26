import { ApolloClient } from "@apollo/client";

export type AuthToken = {
    token: string | null;
    refreshToken: string | null;
};

export interface ApolloManager<TCacheShape> {
    getClient(): ApolloClient<TCacheShape>;
    updateAuthToken(authToken: AuthToken | null): void;
}

export enum OperationType {
    Query = "query",
    Mutation = "mutation",
    Subscription = "subscription",
    Error = "error",
}

export type ApolloWorkspace = {
    project: string;
    organization: string;
};
