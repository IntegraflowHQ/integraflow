import {
    ApolloClient,
    ApolloClientOptions,
    ApolloLink,
    fromPromise,
    HttpLink,
    ServerError,
    ServerParseError,
} from "@apollo/client";
import { GraphQLErrors } from "@apollo/client/errors";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";

import { logDebug } from "@/utils/log";

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
    UserUpdateDocument,
    UserUpdateMutation,
    UserUpdateMutationVariables,
    ViewerDocument,
    ViewerQuery,
    ViewerQueryVariables,
} from "@/generated/graphql";
import { ApolloManager, AuthParams } from "../types";
import { loggerLink } from "../utils";

const isDebug = import.meta.env.MODE === "development";
const logger = loggerLink(() => "Integraflow");
const AUTH_EXEMPT = "exempt-auth";

interface Actions {
    onError?: (err: GraphQLErrors | undefined) => void;
    onNetworkError?: (err: Error | ServerParseError | ServerError) => void;
    onUnauthenticatedError?: () => void;
    onTokenRefreshed?: (token: string) => void;
}

export interface Options<TCacheShape> extends ApolloClientOptions<TCacheShape> {
    initialActions: Actions | null;
    initialAuthParams: AuthParams | null;
    extraLinks?: ApolloLink[];
    isDebugMode?: boolean;
}

export class ApolloFactory<TCacheShape> implements ApolloManager<TCacheShape> {
    private client: ApolloClient<TCacheShape>;
    private authParams: AuthParams | null = null;
    private actions: Actions | null = null;

    constructor(opts: Options<TCacheShape>) {
        const {
            uri = `${import.meta.env.VITE_SERVER_BASE_URL}/graphql`,
            initialActions,
            initialAuthParams,
            extraLinks = [],
            isDebugMode = isDebug,
            connectToDevTools = isDebug,
            defaultOptions = {
                query: {
                    fetchPolicy: "cache-first",
                },
            },
            ...options
        } = opts;

        this.authParams = initialAuthParams;
        this.actions = initialActions;

        const buildApolloLink = (): ApolloLink => {
            const authLink = setContext(async (_, { headers }) => {
                let newHeaders: { [key: string]: string | undefined } = {};

                if (this.authParams?.token) {
                    newHeaders = {
                        ...newHeaders,
                        authorization: `Bearer ${this.authParams?.token}`,
                    };
                }

                if (headers && headers.authorization) {
                    if (headers.authorization === AUTH_EXEMPT) {
                        newHeaders = {
                            ...newHeaders,
                            authorization: undefined,
                        };
                    }
                }

                if (this.authParams?.currentProjectId) {
                    newHeaders = {
                        ...newHeaders,
                        project: this.authParams?.currentProjectId,
                    };
                }

                return {
                    headers: {
                        ...headers,
                        ...newHeaders,
                    },
                };
            });

            const retryLink = new RetryLink({
                delay: {
                    initial: 3000,
                },
                attempts: {
                    max: 2,
                    retryIf: (error) => !!error,
                },
            });

            const errorLink = onError(({ graphQLErrors, networkError, forward, operation }) => {
                if (graphQLErrors) {
                    this.actions?.onError?.(graphQLErrors);

                    for (const graphQLError of graphQLErrors) {
                        switch (graphQLError?.extensions?.exception?.code) {
                            case "ExpiredSignatureError": {
                                return fromPromise(
                                    (async () => {
                                        if (!this.authParams) {
                                            return;
                                        }

                                        try {
                                            const token = await this.refreshToken();
                                            if (token) {
                                                this.updateAuthParams({
                                                    ...this.authParams,
                                                    token,
                                                });
                                                this.actions?.onTokenRefreshed?.(token);
                                            }
                                        } catch (err) {
                                            this.actions?.onUnauthenticatedError?.();
                                        }
                                    })(),
                                ).flatMap(() => forward(operation));
                            }
                            case "InvalidSignatureError":
                                this.actions?.onUnauthenticatedError?.();
                                break;
                            default:
                                if (isDebugMode) {
                                    logDebug(
                                        `[GraphQL error]: Message: ${graphQLError.message}, Location: ${
                                            graphQLError.locations
                                                ? JSON.stringify(graphQLError.locations)
                                                : graphQLError.locations
                                        }, Path: ${graphQLError.path}`,
                                    );
                                }
                        }
                    }
                }

                if (networkError) {
                    if (isDebugMode) {
                        logDebug(`[Network error]: ${networkError}`);
                    }
                    this.actions?.onNetworkError?.(networkError);
                }
            });

            const links = [errorLink, authLink, ...(extraLinks ? extraLinks : []), retryLink];

            if (isDebugMode) {
                links.push(logger);
            }

            return ApolloLink.from(links).concat(new HttpLink({ uri }));
        };

        this.client = new ApolloClient({
            ...options,
            link: buildApolloLink(),
        });
    }

    updateAuthParams(authParams: AuthParams | null) {
        if (!authParams) {
            return;
        }

        this.authParams = {
            ...this.authParams,
            ...authParams,
        };
    }

    updateActions(actions: Actions | null) {
        if (!actions) {
            return;
        }

        this.actions = {
            ...this.actions,
            ...actions,
        };
    }

    getClient() {
        return this.client;
    }

    emailAuthChallenge(email: string, inviteLink?: string) {
        return this.client.mutate<EmailUserAuthChallengeMutation, EmailUserAuthChallengeMutationVariables>({
            mutation: EmailUserAuthChallengeDocument,
            variables: {
                email,
                inviteLink,
            },
            context: {
                headers: {
                    authorization: AUTH_EXEMPT,
                },
            },
        });
    }

    verifyAuthToken = (email: string, token: string, inviteLink?: string) => {
        return this.client.mutate<EmailTokenUserAuthMutation, EmailTokenUserAuthMutationVariables>({
            mutation: EmailTokenUserAuthDocument,
            variables: {
                email,
                token,
                inviteLink,
            },
            context: {
                headers: {
                    authorization: AUTH_EXEMPT,
                },
            },
        });
    };

    googleAuthLogin = (code: string, inviteLink?: string) => {
        return this.client.mutate<GoogleUserAuthMutation, GoogleUserAuthMutationVariables>({
            mutation: GoogleUserAuthDocument,
            variables: {
                code,
                inviteLink,
            },
            context: {
                headers: {
                    authorization: AUTH_EXEMPT,
                },
            },
        });
    };

    async logout() {
        const { data, errors } = await this.client.mutate<LogoutMutation, LogoutMutationVariables>({
            mutation: LogoutDocument,
        });

        if (errors || !data || data.logout?.userErrors?.length) {
            throw new Error("Something went wrong during token revocation");
        }

        return true;
    }

    async refreshToken() {
        if (!this.authParams?.refreshToken) {
            return;
        }

        const { data, errors } = await this.client.mutate<TokenRefreshMutation, TokenRefreshMutationVariables>({
            mutation: TokenRefreshDocument,
            variables: { refreshToken: this.authParams.refreshToken },
            context: {
                headers: {
                    authorization: AUTH_EXEMPT,
                },
            },
        });

        if (errors || !data || data.tokenRefresh?.errors?.length || !data.tokenRefresh?.token) {
            throw new Error("Something went wrong during token renewal");
        }

        return data.tokenRefresh?.token;
    }

    async getUser() {
        const { data, errors } = await this.client.query<ViewerQuery, ViewerQueryVariables>({
            query: ViewerDocument,
        });

        if (errors || !data) {
            throw new Error("Something went wrong while fetching user");
        }

        return data;
    }

    async updateUser(variables: UserUpdateMutationVariables) {
        const { data, errors } = await this.client.mutate<UserUpdateMutation, UserUpdateMutationVariables>({
            mutation: UserUpdateDocument,
            variables,
        });

        if (errors || !data) {
            throw new Error("Something went wrong during user update");
        }

        return data.userUpdate?.user;
    }
}
