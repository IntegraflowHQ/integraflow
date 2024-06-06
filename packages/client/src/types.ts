/**
 * Input options for creating a Integraflow Client
 */
export interface IntegraflowClientOptions extends RequestInit {
    /** Personal/Project api token generated from https://useintegraflow.com */
    apiKey?: string;
    /** The access token returned from auth endpoints in https://useintegraflow.com */
    accessToken?: string;
    /** The url to the Integraflow graphql api */
    apiUrl?: string;
    /** An optional project ID to the Integraflow graphql api */
    projectId?: string;
}

/**
 * Validated IntegraflowGraphQLClient options
 */
export interface IntegraflowClientParsedOptions extends RequestInit {
    /** The url to the Integraflow graphql api defaulted to production */
    apiUrl: string;
}

/**
 * The raw response from the Integraflow GraphQL Client
 */
export interface IntegraflowRawResponse<Data> {
    /** The returned data */
    data?: Data;
    /** Any extensions returned by the Integraflow API */
    extensions?: unknown;
    /** Response headers */
    headers?: Headers;
    /** Response status */
    status?: number;
    /** An error message */
    error?: string;
    /** Any GraphQL errors returned by the Integraflow API */
    errors?: IntegraflowGraphQLErrorRaw[];
}

/**
 * The error types returned by the Integraflow API
 */
export enum IntegraflowErrorType {
    "FeatureNotAccessible" = "FeatureNotAccessible",
    "InvalidInput" = "InvalidInput",
    "Ratelimited" = "Ratelimited",
    "NetworkError" = "NetworkError",
    "AuthenticationError" = "AuthenticationError",
    "Forbidden" = "Forbidden",
    "BootstrapError" = "BootstrapError",
    "Unknown" = "Unknown",
    "InternalError" = "InternalError",
    "Other" = "Other",
    "UserError" = "UserError",
    "GraphqlError" = "GraphqlError",
    "LockTimeout" = "LockTimeout",
}

/**
 * One of potentially many raw graphql errors returned by the Integraflow API
 */
export interface IntegraflowGraphQLErrorRaw {
    /** The error type */
    message?: IntegraflowErrorType;
    /** The path to the graphql node at which the error occured */
    path?: string[];
    extensions?: {
        /** The error type */
        type?: IntegraflowErrorType;
        /** If caused by the user input */
        userError?: boolean;
        /** A friendly error message */
        userPresentableMessage?: string;
    };
}

/**
 * Description of a GraphQL request used in error handling
 */
export interface GraphQLRequestContext<Variables extends Record<string, unknown>> {
    query: string;
    variables?: Variables;
}

/**
 * The raw error returned by the Integraflow API
 */
export interface IntegraflowErrorRaw {
    /** Error name if available */
    name?: string;
    /** Error message if available */
    message?: string;
    /** Error information for the request */
    request?: GraphQLRequestContext<Record<string, unknown>>;
    /** Error information for the response */
    response?: IntegraflowRawResponse<unknown>;
}
