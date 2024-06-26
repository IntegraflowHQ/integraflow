# Integraflow Codegen SDK

This custom [graphql-code-generator](https://graphql-code-generator.com/) plugin takes the Integraflow GraphQL GraphQL [fragments and operations](../client/src/_generated_documents.graphql), generated by the [Integraflow Codegen Document](../codegen-doc/README.md), and outputs a typed [Integraflow Client](../client/src/_generated_sdk.ts). This exposes all GraphQL models and operations available on the introspection query.

It requires that GraphQL [types-document-nodes](https://github.com/dotansimha/graphql-typed-document-node) have been generated and linked to this plugin using the codegen config `documentFile` property, using the plugins:
- [@graphql-codegen/typescript](https://graphql-code-generator.com/docs/plugins/typescript)
- [@graphql-codegen/typescript-operations](https://graphql-code-generator.com/docs/plugins/typescript-operations)
- [@graphql-codegen/typed-document-node](https://graphql-code-generator.com/docs/plugins/typed-document-node)

Usage in [codegen.sdk.yml](../client/codegen.sdk.yml).

## Output

The [@integraflow/client](../client/README.md) uses this code generator [plugin](./src/plugin.ts) to generate:

A model class for each model in the Integraflow API, initialized by the response fragment, and containing:
- all scalar fields on the model
- private required fields for any nested object with a matching query
- public getters, using the private required fields, for requesting any nested object with query
- public properties for any nested objects with no matching query
- connection helpers if the model matches the Relay connection shape

An operation class for each query and mutation in the Integraflow API, containing a fetch function which:
- accepts all required variables as args
- accepts all optional variables as a final object arg
- calls the `IntegraflowGraphQLClient.request` function to return the model from the production Integraflow API
- constructs the model and returns

An operation class for each nested query within a model, containing a fetch function which:
- uses the parent variables defined by the constructor scope
- accepts all required variables for the child query as args
- accepts all optional variables for the child query as a final object arg
- calls the `IntegraflowGraphQLClient.request` function to return the model from the production Integraflow API
- constructs the model and returns

An SDK class containing a public getter for each root query and mutation which:
- accepts all required variables as args
- accepts all optional variables as a final object arg
- creates the operation class
- calls the `fetch` function and returns

## Flow

1. The GraphQL schema is parsed using a reusable [ContextVisitor](../codegen-doc/src/context-visitor.ts) to provide consistent information across the Integraflow code generator plugins
2. The context is visited using the [ModelVisitor](./src/model-visitor.ts) to return a list of parsed Integraflow models
3. The models and context are [parsed](./src/parse-operation.ts) to return a map of all operations for each nested resource
4. The parsed models, operations and context are used to print [models](./src/print-model.ts), [operations](./src/print-operation.ts) and the [sdk](./src/print-sdk.ts)
5. The printed models, operations and sdk are returned to be printed

<!-- AUTO-GENERATED-CONTENT:START (TEXT_SECTION:id=license&src=../../README.md) -->
## License

<br/>

Licensed under the [MIT License](./LICENSE).
<!-- AUTO-GENERATED-CONTENT:END -->
