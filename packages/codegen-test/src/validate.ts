import { PluginValidateFn, Types } from "@graphql-codegen/plugin-helpers";
import { logger, validateExtension } from "@integraflow/codegen-doc";
import { SdkPluginConfig } from "@integraflow/codegen-sdk";
import { GraphQLSchema } from "graphql";

const log = "codegen-test:validate:";

/**
 * Validate use of the plugin
 */
export const validate: PluginValidateFn = async (
  _schema: GraphQLSchema,
  _documents: Types.DocumentFile[],
  config: SdkPluginConfig,
  outputFile: string
) => {
  const packageName = "@integraflow/codegen-test";
  logger.info(log, `Validating ${packageName}`);
  logger.info(log, config);

  const prefix = `${log} Plugin "${packageName}" config requires`;

  /** Check the output file extension */
  validateExtension(prefix, ".test.ts", outputFile);
};
