import { DocumentNode } from "graphql/language/ast";
import { IntegraflowSdk } from "./_generated_sdk";
import { parseIntegraflowError } from "./error";
import { IntegraflowGraphQLClient } from "./graphql-client";
import { IntegraflowClientOptions, IntegraflowClientParsedOptions } from "./types";
import { serializeUserAgent } from "./utils";

/**
 * Validate and return default IntegraflowGraphQLClient options
 *
 * @param options initial request options to pass to the graphql client
 * @returns parsed graphql client options
 */
function parseClientOptions({
    apiKey,
    accessToken,
    apiUrl,
    headers,
    ...opts
}: IntegraflowClientOptions): IntegraflowClientParsedOptions {
    if (!accessToken && !apiKey) {
        throw new Error(
            "No accessToken or apiKey provided to the IntegraflowClient - create one here: https://useintegraflow.com"
        );
    }

    return {
        headers: {
            /** Use bearer if oauth token exists, otherwise use the provided apiKey */
            Authorization: accessToken
                ? accessToken.startsWith("Bearer ")
                    ? accessToken
                    : `Bearer ${accessToken}`
                : apiKey ?? "",
            /** Use configured headers */
            ...headers,
            /** Override any user agent with the sdk name and version */
            "User-Agent": serializeUserAgent({
                [process.env.npm_package_name ?? "@integraflow/sdk"]: process.env.npm_package_version ?? "unknown",
            }),
        },
        /** Default to production Integraflow api */
        apiUrl: apiUrl ?? "https://api.useintegraflow.com/graphql",
        ...opts,
    };
}

/**
 * Create a Integraflow API client
 *
 * @param options request options to pass to the IntegraflowGraphQLClient
 */
export class IntegraflowClient extends IntegraflowSdk {
    public options: IntegraflowClientParsedOptions;
    public client: IntegraflowGraphQLClient;

    public constructor(options: IntegraflowClientOptions) {
        const parsedOptions = parseClientOptions(options);
        const graphQLClient = new IntegraflowGraphQLClient(parsedOptions.apiUrl, parsedOptions);

        super(<Data, Variables extends Record<string, unknown>>(doc: DocumentNode, vars?: Variables) =>
            /** Call the IntegraflowGraphQLClient */
            this.client.request<Data, Variables>(doc, vars).catch(error => {
                /** Catch and wrap errors from the IntegraflowGraphQLClient */
                throw parseIntegraflowError(error);
            })
        );

        this.options = parsedOptions;
        this.client = graphQLClient;
    }
}
