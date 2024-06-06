import { IntegraflowErrorRaw, IntegraflowErrorType, IntegraflowGraphQLErrorRaw } from "./types";
import { capitalize, getKeyByValue, nonNullable } from "./utils";

/**
 * A map between the Integraflow API string type and the IntegraflowErrorType enum
 */
const errorMap: Record<IntegraflowErrorType, string> = {
  [IntegraflowErrorType.FeatureNotAccessible]: "feature not accessible",
  [IntegraflowErrorType.InvalidInput]: "invalid input",
  [IntegraflowErrorType.Ratelimited]: "ratelimited",
  [IntegraflowErrorType.NetworkError]: "network error",
  [IntegraflowErrorType.AuthenticationError]: "authentication error",
  [IntegraflowErrorType.Forbidden]: "forbidden",
  [IntegraflowErrorType.BootstrapError]: "bootstrap error",
  [IntegraflowErrorType.Unknown]: "unknown",
  [IntegraflowErrorType.InternalError]: "internal error",
  [IntegraflowErrorType.Other]: "other",
  [IntegraflowErrorType.UserError]: "user error",
  [IntegraflowErrorType.GraphqlError]: "graphql error",
  [IntegraflowErrorType.LockTimeout]: "lock timeout",
};

/**
 * Match the error type or return unknown
 */
function getErrorType(type?: string): IntegraflowErrorType {
  return getKeyByValue(errorMap, type) ?? IntegraflowErrorType.Unknown;
}
/**
 * The error shown if no other message is available
 */
const defaultError = "Unknown error from IntegraflowClient";

/**
 * One of potentially many graphql errors returned by the Integraflow API
 *
 * @error the raw graphql error returned on the error response
 */
export class IntegraflowGraphQLError {
  /** The type of this graphql error */
  public type: IntegraflowErrorType;
  /** A friendly error message */
  public message: string;
  /** If this error is caused by the user input */
  public userError?: boolean;
  /** The path to the graphql node at which the error occured */
  public path?: string[];

  public constructor(error?: IntegraflowGraphQLErrorRaw) {
    this.type = getErrorType(error?.extensions?.type);
    this.userError = error?.extensions?.userError;
    this.path = error?.path;

    /** Select most readable message */
    this.message =
      error?.extensions?.userPresentableMessage ?? error?.message ?? error?.extensions?.type ?? defaultError;
  }
}

/**
 * An error from the Integraflow API
 *
 * @param error a raw error returned from the IntegraflowGraphQLClient
 */
export class IntegraflowError extends Error {
  /** The type of the first error returned by the Integraflow API */
  public type?: IntegraflowErrorType;
  /** A list of graphql errors returned by the Integraflow API */
  public errors?: IntegraflowGraphQLError[];
  /** The graphql query that caused this error */
  public query?: string;
  /** The graphql variables that caused this error */
  public variables?: Record<string, unknown>;
  /** Any data returned by this request */
  public data?: unknown;
  /** The http status of this request */
  public status?: number;
  /** The raw IntegraflowGraphQLClient error */
  public raw?: IntegraflowErrorRaw;

  public constructor(error?: IntegraflowErrorRaw, errors?: IntegraflowGraphQLError[], type?: IntegraflowErrorType) {
    /** Find messages, duplicate and join, or default */
    super(
      Array.from(
        new Set(
          [capitalize(error?.message?.split(": {")?.[0]), error?.response?.error, errors?.[0]?.message].filter(
            nonNullable
          )
        )
      )
        .filter(nonNullable)
        .join(" - ") ?? defaultError
    );

    this.type = type;

    /** Set error properties */
    this.errors = errors;
    this.query = error?.request?.query;
    this.variables = error?.request?.variables;
    this.status = error?.response?.status;
    this.data = error?.response?.data;
    this.raw = error;
  }
}

export class FeatureNotAccessibleIntegraflowError extends IntegraflowError {
  public constructor(error?: IntegraflowErrorRaw, errors?: IntegraflowGraphQLError[]) {
    super(error, errors, IntegraflowErrorType.FeatureNotAccessible);
  }
}

export class InvalidInputIntegraflowError extends IntegraflowError {
  public constructor(error?: IntegraflowErrorRaw, errors?: IntegraflowGraphQLError[]) {
    super(error, errors, IntegraflowErrorType.InvalidInput);
  }
}

export class RatelimitedIntegraflowError extends IntegraflowError {
  public constructor(error?: IntegraflowErrorRaw, errors?: IntegraflowGraphQLError[]) {
    super(error, errors, IntegraflowErrorType.Ratelimited);
  }
}

export class NetworkIntegraflowError extends IntegraflowError {
  public constructor(error?: IntegraflowErrorRaw, errors?: IntegraflowGraphQLError[]) {
    super(error, errors, IntegraflowErrorType.NetworkError);
  }
}

export class AuthenticationIntegraflowError extends IntegraflowError {
  public constructor(error?: IntegraflowErrorRaw, errors?: IntegraflowGraphQLError[]) {
    super(error, errors, IntegraflowErrorType.AuthenticationError);
  }
}

export class ForbiddenIntegraflowError extends IntegraflowError {
  public constructor(error?: IntegraflowErrorRaw, errors?: IntegraflowGraphQLError[]) {
    super(error, errors, IntegraflowErrorType.Forbidden);
  }
}

export class BootstrapIntegraflowError extends IntegraflowError {
  public constructor(error?: IntegraflowErrorRaw, errors?: IntegraflowGraphQLError[]) {
    super(error, errors, IntegraflowErrorType.BootstrapError);
  }
}

export class UnknownIntegraflowError extends IntegraflowError {
  public constructor(error?: IntegraflowErrorRaw, errors?: IntegraflowGraphQLError[]) {
    super(error, errors, IntegraflowErrorType.Unknown);
  }
}

export class InternalIntegraflowError extends IntegraflowError {
  public constructor(error?: IntegraflowErrorRaw, errors?: IntegraflowGraphQLError[]) {
    super(error, errors, IntegraflowErrorType.InternalError);
  }
}

export class OtherIntegraflowError extends IntegraflowError {
  public constructor(error?: IntegraflowErrorRaw, errors?: IntegraflowGraphQLError[]) {
    super(error, errors, IntegraflowErrorType.Other);
  }
}

export class UserIntegraflowError extends IntegraflowError {
  public constructor(error?: IntegraflowErrorRaw, errors?: IntegraflowGraphQLError[]) {
    super(error, errors, IntegraflowErrorType.UserError);
  }
}

export class GraphqlIntegraflowError extends IntegraflowError {
  public constructor(error?: IntegraflowErrorRaw, errors?: IntegraflowGraphQLError[]) {
    super(error, errors, IntegraflowErrorType.GraphqlError);
  }
}

export class LockTimeoutIntegraflowError extends IntegraflowError {
  public constructor(error?: IntegraflowErrorRaw, errors?: IntegraflowGraphQLError[]) {
    super(error, errors, IntegraflowErrorType.LockTimeout);
  }
}

/**
 * A map between the Integraflow error type and the IntegraflowError class
 */
const errorConstructorMap: Record<IntegraflowErrorType, typeof IntegraflowError> = {
  [IntegraflowErrorType.FeatureNotAccessible]: FeatureNotAccessibleIntegraflowError,
  [IntegraflowErrorType.InvalidInput]: InvalidInputIntegraflowError,
  [IntegraflowErrorType.Ratelimited]: RatelimitedIntegraflowError,
  [IntegraflowErrorType.NetworkError]: NetworkIntegraflowError,
  [IntegraflowErrorType.AuthenticationError]: AuthenticationIntegraflowError,
  [IntegraflowErrorType.Forbidden]: ForbiddenIntegraflowError,
  [IntegraflowErrorType.BootstrapError]: BootstrapIntegraflowError,
  [IntegraflowErrorType.Unknown]: UnknownIntegraflowError,
  [IntegraflowErrorType.InternalError]: InternalIntegraflowError,
  [IntegraflowErrorType.Other]: OtherIntegraflowError,
  [IntegraflowErrorType.UserError]: UserIntegraflowError,
  [IntegraflowErrorType.GraphqlError]: GraphqlIntegraflowError,
  [IntegraflowErrorType.LockTimeout]: LockTimeoutIntegraflowError,
};

export function parseIntegraflowError(error?: IntegraflowErrorRaw | IntegraflowError): IntegraflowError {
  if (error instanceof IntegraflowError) {
    return error;
  }

  /** Parse graphQL errors */
  const errors = (error?.response?.errors ?? []).map(graphqlError => {
    return new IntegraflowGraphQLError(graphqlError);
  });

  /** Set type based first graphql error or http status */
  const status = error?.response?.status;
  const type =
    errors[0]?.type ??
    (status === 403
      ? IntegraflowErrorType.Forbidden
      : status === 429
      ? IntegraflowErrorType.Ratelimited
      : `${status}`.startsWith("4")
      ? IntegraflowErrorType.AuthenticationError
      : status === 500
      ? IntegraflowErrorType.InternalError
      : `${status}`.startsWith("5")
      ? IntegraflowErrorType.NetworkError
      : IntegraflowErrorType.Unknown);

  const IntegraflowErrorConstructor = errorConstructorMap[type] ?? IntegraflowError;

  return new IntegraflowErrorConstructor(error, errors);
}
