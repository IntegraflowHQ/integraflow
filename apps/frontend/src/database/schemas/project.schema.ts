import {
    ExtractDocumentTypeFromTypedRxJsonSchema,
    RxCollection,
    RxJsonSchema,
    toTypedRxJsonSchema,
} from "rxdb";

const projectSchemaLiteral = {
    version: 0,
    primaryKey: "id",
    type: "object",
    properties: {
        id: {
            type: "string",
            maxLength: 100, // <- the primary key must have set maxLength
        },
        name: {
            type: "string",
        },
        timezone: {
            type: "string",
        },
    },
    required: ["id", "name", "timezone"],
} as const;

const schemaTyped = toTypedRxJsonSchema(projectSchemaLiteral);

// aggregate the document type from the schema
export type ProjectDoc = ExtractDocumentTypeFromTypedRxJsonSchema<
    typeof schemaTyped
>;
export type ProjectCollection = RxCollection<ProjectDoc>;

// create the typed RxJsonSchema from the literal typed object.
export const projectSchema: RxJsonSchema<ProjectDoc> = projectSchemaLiteral;
