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

import { refreshToken } from "@/modules/auth/services/auth.service";
import { logDebug } from "@/utils/log";

import { ApolloManager, AuthToken } from "../types";
import { loggerLink } from "../utils";

const logger = loggerLink(() => "Integraflow");

export interface Options<TCacheShape> extends ApolloClientOptions<TCacheShape> {
    onError?: (err: GraphQLErrors | undefined) => void;
    onNetworkError?: (err: Error | ServerParseError | ServerError) => void;
    onAccessTokenChange?: (token: string) => void;
    onUnauthenticatedError?: () => void;
    initialAuthToken: AuthToken | null;
    extraLinks?: ApolloLink[];
    isDebugMode?: boolean;
}

export class ApolloFactory<TCacheShape> implements ApolloManager<TCacheShape> {
    private client: ApolloClient<TCacheShape>;
    private authToken: AuthToken | null = null;

    constructor(opts: Options<TCacheShape>) {
        const {
            uri,
            onError: onErrorCb,
            onNetworkError,
            onAccessTokenChange,
            onUnauthenticatedError,
            initialAuthToken,
            extraLinks,
            isDebugMode,
            ...options
        } = opts;

        this.authToken = initialAuthToken;

        const buildApolloLink = (): ApolloLink => {
            const authLink = setContext(async (_, { headers }) => {
                return {
                    headers: {
                        ...headers,
                        authorization: this.authToken?.token
                            ? `Bearer ${this.authToken?.token}`
                            : "",
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
            const errorLink = onError(
                ({ graphQLErrors, networkError, forward, operation }) => {
                    if (graphQLErrors) {
                        onErrorCb?.(graphQLErrors);

                        for (const graphQLError of graphQLErrors) {
                            switch (graphQLError?.extensions?.exception?.code) {
                                case "ExpiredSignatureError": {
                                    return fromPromise(
                                        refreshToken(
                                            uri,
                                            this.authToken?.refreshToken,
                                        )
                                            .then((token) => {
                                                if (token) {
                                                    this.updateAuthToken({
                                                        token,
                                                        refreshToken:
                                                            this.authToken
                                                                ?.refreshToken ??
                                                            "",
                                                    });
                                                    onAccessTokenChange?.(
                                                        token,
                                                    );
                                                }
                                            })
                                            .catch(() => {
                                                onUnauthenticatedError?.();
                                            }),
                                    ).flatMap(() => forward(operation));
                                }
                                case "InvalidSignatureError":
                                    onUnauthenticatedError?.();
                                    break;
                                default:
                                    if (isDebugMode) {
                                        logDebug(
                                            `[GraphQL error]: Message: ${
                                                graphQLError.message
                                            }, Location: ${
                                                graphQLError.locations
                                                    ? JSON.stringify(
                                                          graphQLError.locations,
                                                      )
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
                        onNetworkError?.(networkError);
                    }
                },
            );

            const links = [
                errorLink,
                authLink,
                ...(extraLinks ? extraLinks : []),
                retryLink,
            ];

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

    updateAuthToken(authToken: AuthToken | null) {
        this.authToken = {
            refreshToken: authToken?.refreshToken ?? "",
            token: authToken?.token ?? "",
        };
    }

    getClient() {
        return this.client;
    }
}
