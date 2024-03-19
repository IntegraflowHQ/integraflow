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

import { ApolloManager, AuthParams } from "../types";
import { loggerLink } from "../utils";

const logger = loggerLink(() => "Integraflow");

export interface Options<TCacheShape> extends ApolloClientOptions<TCacheShape> {
    onError?: (err: GraphQLErrors | undefined) => void;
    onNetworkError?: (err: Error | ServerParseError | ServerError) => void;
    onUnauthenticatedError?: () => void;
    initialAuthParams: AuthParams | null;
    extraLinks?: ApolloLink[];
    isDebugMode?: boolean;
}

export class ApolloFactory<TCacheShape> implements ApolloManager<TCacheShape> {
    private client: ApolloClient<TCacheShape>;
    private authParams: AuthParams | null = null;

    constructor(opts: Options<TCacheShape>) {
        const {
            uri,
            onError: onErrorCb,
            onNetworkError,
            onUnauthenticatedError,
            initialAuthParams,
            extraLinks,
            isDebugMode,
            ...options
        } = opts;

        this.authParams = initialAuthParams;

        const buildApolloLink = (): ApolloLink => {
            const authLink = setContext(async (_, { headers }) => {
                let newHeaders = {};

                if (this.authParams?.token) {
                    newHeaders = {
                        ...newHeaders,
                        authorization: `Bearer ${this.authParams?.token}`,
                    };
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
                        ...newHeaders
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
                                        (async () => {
                                            if (!this.authParams) {
                                                return;
                                            }

                                            try {
                                                const token = await this.authParams.refresh();
                                                if (token) {
                                                    this.updateAuthParams({
                                                        ...this.authParams,
                                                        token
                                                    });
                                                }
                                            } catch (err) {
                                                onUnauthenticatedError?.();
                                            }
                                        })()
                                    ).flatMap(() => forward(operation));
                                }
                                case "InvalidSignatureError":
                                    onUnauthenticatedError?.();
                                    break;
                                default:
                                    if (isDebugMode) {
                                        logDebug(
                                            `[GraphQL error]: Message: ${graphQLError.message
                                            }, Location: ${graphQLError.locations
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

    updateAuthParams(authParams: AuthParams | null) {
        if (!authParams) {
            return;
        }

        this.authParams = {
            ...this.authParams,
            ...authParams
        };
    }

    getClient() {
        return this.client;
    }
}
