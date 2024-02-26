import { InMemoryCache } from "@apollo/client";

import {
    EmailTokenUserAuthDocument,
    EmailTokenUserAuthMutation,
    EmailTokenUserAuthMutationVariables,
    EmailUserAuthChallengeDocument,
    EmailUserAuthChallengeMutation,
    EmailUserAuthChallengeMutationVariables,
    GoogleUserAuthDocument,
    GoogleUserAuthMutation,
    GoogleUserAuthMutationVariables,
    LogoutDocument,
    LogoutMutation,
    LogoutMutationVariables,
    TokenRefreshDocument,
    TokenRefreshMutation,
    TokenRefreshMutationVariables,
} from "@/generated/graphql";

import { ApolloFactory } from "@/modules/apollo/services/apollo.factory";

const isDebugMode = import.meta.env.MODE === "development";

// Create an apollo client to call auth graphql mutations
const client = new ApolloFactory({
    uri: `${import.meta.env.VITE_SERVER_BASE_URL}/graphql`,
    cache: new InMemoryCache(),
    defaultOptions: {
        mutate: {
            fetchPolicy: "network-only",
        },
    },
    connectToDevTools: isDebugMode,
    // We don't want to re-create the client on token change or it will cause infinite loop
    initialAuthParams: null,
    extraLinks: [],
    isDebugMode,
}).getClient();

export const emailAuthChallenge = (email: string, inviteLink?: string) => {
    return client.mutate<EmailUserAuthChallengeMutation, EmailUserAuthChallengeMutationVariables>({
        mutation: EmailUserAuthChallengeDocument,
        variables: {
            email,
            inviteLink,
        },
    });
};

export const verifyAuthToken = (email: string, token: string, inviteLink?: string) => {
    return client.mutate<EmailTokenUserAuthMutation, EmailTokenUserAuthMutationVariables>({
        mutation: EmailTokenUserAuthDocument,
        variables: {
            email,
            token,
            inviteLink,
        },
    });
};

export const googleAuthLogin = (code: string, inviteLink?: string) => {
    return client.mutate<GoogleUserAuthMutation, GoogleUserAuthMutationVariables>({
        mutation: GoogleUserAuthDocument,
        variables: {
            code,
            inviteLink,
        },
    });
};

/**
 * Refresh token
 * @param refreshToken string
 * @returns string
 */
export const refreshToken = async (token: string) => {
    const { data, errors } = await client.mutate<TokenRefreshMutation, TokenRefreshMutationVariables>({
        mutation: TokenRefreshDocument,
        variables: { refreshToken: token },
    });

    if (errors || !data || data.tokenRefresh?.errors?.length || !data.tokenRefresh?.token) {
        throw new Error("Something went wrong during token renewal");
    }

    return data.tokenRefresh?.token;
};

/**
 * Logout user
 * @param refreshToken string
 * @returns string
 */
export const logout = async (token: string) => {
    const { data, errors } = await client.mutate<LogoutMutation, LogoutMutationVariables>({
        mutation: LogoutDocument,
        context: {
            authorization: `Bearer ${token}`,
        },
    });

    if (errors || !data || data.logout?.userErrors?.length) {
        throw new Error("Something went wrong during token renewal");
    }

    return true;
};
