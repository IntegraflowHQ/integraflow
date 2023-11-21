import {
    ExtractDocumentTypeFromTypedRxJsonSchema,
    RxCollection,
    RxJsonSchema,
    toTypedRxJsonSchema,
} from "rxdb";

const viewerSchemaLiteral = {
    version: 0,
    primaryKey: "id",
    type: "object",
    properties: {
        id: {
            type: "string",
            maxLength: 100, // <- the primary key must have set maxLength
        },
        firstName: {
            type: "string",
        },
        lastName: {
            type: "string",
        },
        email: {
            type: "string",
        },
        isStaff: {
            type: "boolean",
        },
        isActive: {
            type: "boolean",
        },
        organization: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                },
                slug: {
                    type: "string",
                },
                name: {
                    type: "string",
                },
                memberCount: {
                    type: "number",
                },
            },
        },
        project: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                },
                name: {
                    type: "string",
                },
            },
        },
    },
    required: [
        "id",
        "firstName",
        "lastName",
        "email",
        "isStaff",
        "isActive",
        "organization",
        "project",
    ],
} as const;

const schemaTyped = toTypedRxJsonSchema(viewerSchemaLiteral);

// aggregate the document type from the schema
export type ViewerDoc = ExtractDocumentTypeFromTypedRxJsonSchema<
    typeof schemaTyped
>;
export type ViewerCollection = RxCollection<ViewerDoc>;

// create the typed RxJsonSchema from the literal typed object.
export const viewerSchema: RxJsonSchema<ViewerDoc> = viewerSchemaLiteral;
