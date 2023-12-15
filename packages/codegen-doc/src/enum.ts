import { FieldDefinitionNode, EnumTypeDefinitionNode } from "graphql";

import { Named, PluginContext } from "./types";
import { reduceTypeName } from "./utils";

/**
 * Get the Enum type matching the name arg
 */
export function findEnum(
    context: PluginContext,
    field?: FieldDefinitionNode | Named<FieldDefinitionNode>
): EnumTypeDefinitionNode | undefined {
    if (field) {
        const type = reduceTypeName(field.type);
        return context.enums.find(operation => operation.name.value === type);
    }
    return undefined;
}
