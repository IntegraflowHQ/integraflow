import {
    ApolloClient,
    ApolloLink,
    HttpLink,
    InMemoryCache,
    UriFunction,
} from "@apollo/client";

import {
    TokenRefreshDocument,
    TokenRefreshMutation,
    TokenRefreshMutationVariables,
} from "@/generated/graphql";
import { loggerLink } from "@/modules/apollo/utils";

const logger = loggerLink(() => "Integraflow-Refresh");

/**
 * Refresh token mutation with custom apollo client
 * @param uri string | UriFunction | undefined
 * @param refreshToken string
 * @returns TokenRefreshMutation
 */
const refreshTokenMutation = async (
    uri: string | UriFunction | undefined,
    refreshToken: string,
) => {
    const httpLink = new HttpLink({ uri });

    // Create new client to call refresh token graphql mutation
    const client = new ApolloClient({
        link: ApolloLink.from([logger, httpLink]),
        cache: new InMemoryCache({}),
    });

    const { data, errors } = await client.mutate<
        TokenRefreshMutation,
        TokenRefreshMutationVariables
    >({
        mutation: TokenRefreshDocument,
        variables: { refreshToken },
        fetchPolicy: "network-only",
    });

    if (errors || !data) {
        throw new Error("Something went wrong during token renewal");
    }

    return data;
};

/**
 * Refresh token and update cookie storage
 * @param uri string | UriFunction | undefined
 * @returns string
 */
export const refreshToken = async (
    uri: string | UriFunction | undefined,
    refreshToken?: string | null,
) => {
    if (!refreshToken) {
        throw new Error("Refresh token is not defined");
    }

    const data = await refreshTokenMutation(uri, refreshToken);

    return data.tokenRefresh?.token;
};
