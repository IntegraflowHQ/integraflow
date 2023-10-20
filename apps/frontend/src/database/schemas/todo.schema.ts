import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxCollection,
  RxJsonSchema,
  toTypedRxJsonSchema
} from 'rxdb';

const todoSchemaLiteral = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
      id: {
          type: 'string',
          maxLength: 100 // <- the primary key must have set maxLength
      },
      name: {
          type: 'string'
      },
      done: {
          type: 'boolean'
      },
      timestamp: {
          type: 'date-time'
      }
  },
  required: ['id', 'name', 'done']
} as const;

const schemaTyped = toTypedRxJsonSchema(todoSchemaLiteral);

// aggregate the document type from the schema
export type TodoDoc = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export type TodoCollection = RxCollection<TodoDoc>;

// create the typed RxJsonSchema from the literal typed object.
export const todoSchema: RxJsonSchema<TodoDoc> = todoSchemaLiteral;