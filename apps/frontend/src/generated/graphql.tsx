import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSONString: any;
  /** _Any value scalar as defined by Federation spec. */
  _Any: any;
};

/** Represents an organization. */
export type AuthOrganization = Node & {
  __typename?: 'AuthOrganization';
  /** The ID of the organization. */
  id: Scalars['ID'];
  /**
   * Member count
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  memberCount: Scalars['Int'];
  /**
   * Name of the organization.
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  name: Scalars['String'];
  /** Slug of the organization. */
  slug: Scalars['String'];
};

/** Represents an authenticated user data. */
export type AuthUser = Node & {
  __typename?: 'AuthUser';
  /** The email address of the user. */
  email: Scalars['String'];
  /** The given name of the user. */
  firstName: Scalars['String'];
  /** The ID of the user. */
  id: Scalars['ID'];
  /** Determine if the user is active. */
  isActive: Scalars['Boolean'];
  /** Determine if the user is a staff admin. */
  isStaff: Scalars['Boolean'];
  /** The family name of the user. */
  lastName: Scalars['String'];
  /**
   * The current organization of the user.
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  organization?: Maybe<AuthOrganization>;
  /**
   * The current project of the user.
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  project?: Maybe<Project>;
};

/** Authenticates a user account via email and authentication token. */
export type EmailTokenUserAuth = {
  __typename?: 'EmailTokenUserAuth';
  /** CSRF token required to re-generate access token. */
  csrfToken?: Maybe<Scalars['String']>;
  errors: Array<UserError>;
  /** JWT refresh token, required to re-generate access token. */
  refreshToken?: Maybe<Scalars['String']>;
  /** Access token to authenticate the user. */
  token?: Maybe<Scalars['String']>;
  /** A user that has access to the the resources of an organization. */
  user?: Maybe<AuthUser>;
  userErrors: Array<UserError>;
};

/** Finds or creates a new user account by email and sends an email with token. */
export type EmailUserAuthChallenge = {
  __typename?: 'EmailUserAuthChallenge';
  /** Supported challenge for this user. */
  authType?: Maybe<Scalars['String']>;
  errors: Array<UserError>;
  /** Whether the operation was successful. */
  success?: Maybe<Scalars['Boolean']>;
  userErrors: Array<UserError>;
};

/** Finds or creates a new user account from google auth credentials. */
export type GoogleUserAuth = {
  __typename?: 'GoogleUserAuth';
  /** CSRF token required to re-generate access token. */
  csrfToken?: Maybe<Scalars['String']>;
  errors: Array<UserError>;
  /** JWT refresh token, required to re-generate access token. */
  refreshToken?: Maybe<Scalars['String']>;
  /** Whether the operation was successful. */
  success?: Maybe<Scalars['Boolean']>;
  /** Access token to authenticate the user. */
  token?: Maybe<Scalars['String']>;
  /** A user that has access to the the resources of an organization. */
  user?: Maybe<AuthUser>;
  userErrors: Array<UserError>;
};

/**
 * Deactivate all JWT tokens of the currently authenticated user.
 *
 * Requires one of the following permissions: AUTHENTICATED_USER.
 */
export type Logout = {
  __typename?: 'Logout';
  errors: Array<UserError>;
  userErrors: Array<UserError>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Authenticates a user account via email and authentication token. */
  emailTokenUserAuth?: Maybe<EmailTokenUserAuth>;
  /** Finds or creates a new user account by email and sends an email with token. */
  emailUserAuthChallenge?: Maybe<EmailUserAuthChallenge>;
  /** Finds or creates a new user account from google auth credentials. */
  googleUserAuth?: Maybe<GoogleUserAuth>;
  /**
   * Deactivate all JWT tokens of the currently authenticated user.
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  logout?: Maybe<Logout>;
  /**
   * Creates new organization.
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  organizationCreate?: Maybe<OrganizationCreate>;
  /** Refresh JWT token. Mutation tries to take refreshToken from the input. If it fails it will try to take `refreshToken` from the http-only cookie `refreshToken`. `csrfToken` is required when `refreshToken` is provided as a cookie. */
  tokenRefresh?: Maybe<RefreshToken>;
};


export type MutationEmailTokenUserAuthArgs = {
  email: Scalars['String'];
  token: Scalars['String'];
};


export type MutationEmailUserAuthChallengeArgs = {
  email: Scalars['String'];
};


export type MutationGoogleUserAuthArgs = {
  code: Scalars['String'];
};


export type MutationOrganizationCreateArgs = {
  input: OrganizationCreateInput;
  survey?: InputMaybe<OnboardingCustomerSurvey>;
};


export type MutationTokenRefreshArgs = {
  csrfToken?: InputMaybe<Scalars['String']>;
  refreshToken?: InputMaybe<Scalars['String']>;
};

/** An object with an ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars['ID'];
};

export type OnboardingCustomerSurvey = {
  /** Your role in your company */
  companyRole?: InputMaybe<Scalars['String']>;
  /** Size of your company */
  companySize?: InputMaybe<Scalars['String']>;
};

export enum OrderDirection {
  /** Specifies an ascending sort order. */
  Asc = 'ASC',
  /** Specifies a descending sort order. */
  Desc = 'DESC'
}

/** Represents an organization. */
export type Organization = Node & {
  __typename?: 'Organization';
  /** The ID of the organization. */
  id: Scalars['ID'];
  /**
   * Member count
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  memberCount: Scalars['Int'];
  /**
   * Users associated with the organization.
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  members?: Maybe<UserCountableConnection>;
  /**
   * Name of the organization.
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  name: Scalars['String'];
  /**
   * Projects associated with the organization.
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  projects?: Maybe<ProjectCountableConnection>;
  /** Slug of the organization. */
  slug: Scalars['String'];
};


/** Represents an organization. */
export type OrganizationMembersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserSortingInput>;
};


/** Represents an organization. */
export type OrganizationProjectsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserSortingInput>;
};

export type OrganizationCountableConnection = {
  __typename?: 'OrganizationCountableConnection';
  edges: Array<OrganizationCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type OrganizationCountableEdge = {
  __typename?: 'OrganizationCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Organization;
};

/**
 * Creates new organization.
 *
 * Requires one of the following permissions: AUTHENTICATED_USER.
 */
export type OrganizationCreate = {
  __typename?: 'OrganizationCreate';
  errors: Array<OrganizationError>;
  /** An organization. Organizations are root-level objects that contain users and projects. */
  organization?: Maybe<AuthOrganization>;
  organizationErrors: Array<OrganizationError>;
  /** A user that has access to the the resources of an organization. */
  user?: Maybe<AuthUser>;
};

export type OrganizationCreateInput = {
  /** The name of the organization. */
  name: Scalars['String'];
  /** The slug of the organization. */
  slug: Scalars['String'];
  /** The timezone of the organization, passed in by client. */
  timezone: Scalars['String'];
};

/** Represents errors in organization mutations. */
export type OrganizationError = {
  __typename?: 'OrganizationError';
  /** The error code. */
  code: UserErrorCode;
  /** Name of a field that caused the error. A value of `null` ndicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

/** Represents a project. */
export type Project = Node & {
  __typename?: 'Project';
  /** The data required for the onboarding process */
  hasCompletedOnboardingFor?: Maybe<Scalars['JSONString']>;
  /** The ID of the project. */
  id: Scalars['ID'];
  /** Slug of the project. */
  name: Scalars['String'];
  /** Organization the project belongs to. */
  organization: AuthOrganization;
  /** The timezone of the project. */
  timezone: Scalars['String'];
};

export type ProjectCountableConnection = {
  __typename?: 'ProjectCountableConnection';
  edges: Array<ProjectCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type ProjectCountableEdge = {
  __typename?: 'ProjectCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Project;
};

export enum ProjectSortField {
  /** Sort projects by created at. */
  CreatedAt = 'CREATED_AT',
  /** Sort projects by name. */
  Name = 'NAME',
  /** Sort projects by updated at. */
  UpdatedAt = 'UPDATED_AT'
}

export type ProjectSortingInput = {
  /** Specifies the direction in which to sort projects. */
  direction: OrderDirection;
  /** Sort projects by the selected field. */
  field: ProjectSortField;
};

export type Query = {
  __typename?: 'Query';
  _entities?: Maybe<Array<Maybe<_Entity>>>;
  _service?: Maybe<_Service>;
  /**
   * Return the currently authenticated user.
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  viewer?: Maybe<User>;
};


export type Query_EntitiesArgs = {
  representations?: InputMaybe<Array<InputMaybe<Scalars['_Any']>>>;
};

/** Refresh JWT token. Mutation tries to take refreshToken from the input. If it fails it will try to take `refreshToken` from the http-only cookie `refreshToken`. `csrfToken` is required when `refreshToken` is provided as a cookie. */
export type RefreshToken = {
  __typename?: 'RefreshToken';
  accountErrors: Array<UserError>;
  errors: Array<UserError>;
  /** Acess token to authenticate the user. */
  token?: Maybe<Scalars['String']>;
};

/** Represents user data. */
export type User = Node & {
  __typename?: 'User';
  /** The email address of the user. */
  email: Scalars['String'];
  /** The given name of the user. */
  firstName: Scalars['String'];
  /** The ID of the user. */
  id: Scalars['ID'];
  /** Determine if the user is active. */
  isActive: Scalars['Boolean'];
  /** Determine if the user is a staff admin. */
  isStaff: Scalars['Boolean'];
  /** The family name of the user. */
  lastName: Scalars['String'];
  /**
   * The current organization of the user.
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  organization?: Maybe<AuthOrganization>;
  /**
   * Organizations the user is part of.
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  organizations?: Maybe<OrganizationCountableConnection>;
  /**
   * The current project of the user.
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  project?: Maybe<Project>;
  /**
   * Projects the user has access to.
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  projects?: Maybe<ProjectCountableConnection>;
};


/** Represents user data. */
export type UserOrganizationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Represents user data. */
export type UserProjectsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProjectSortingInput>;
};

export type UserCountableConnection = {
  __typename?: 'UserCountableConnection';
  edges: Array<UserCountableEdge>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type UserCountableEdge = {
  __typename?: 'UserCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: User;
};

/** Represents errors in user mutations. */
export type UserError = {
  __typename?: 'UserError';
  /** The error code. */
  code: UserErrorCode;
  /** Name of a field that caused the error. A value of `null` ndicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export enum UserErrorCode {
  GraphqlError = 'GRAPHQL_ERROR',
  Inactive = 'INACTIVE',
  Invalid = 'INVALID',
  InvalidMagicCode = 'INVALID_MAGIC_CODE',
  JwtDecodeError = 'JWT_DECODE_ERROR',
  JwtInvalidCsrfToken = 'JWT_INVALID_CSRF_TOKEN',
  JwtInvalidToken = 'JWT_INVALID_TOKEN',
  JwtMissingToken = 'JWT_MISSING_TOKEN',
  JwtSignatureExpired = 'JWT_SIGNATURE_EXPIRED',
  MagicCodeExpired = 'MAGIC_CODE_EXPIRED',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

export enum UserSortField {
  /** Sort users by created at. */
  CreatedAt = 'CREATED_AT',
  /** Sort users by email. */
  Email = 'EMAIL',
  /** Sort users by first name. */
  FirstName = 'FIRST_NAME',
  /** Sort users by last name. */
  LastName = 'LAST_NAME'
}

export type UserSortingInput = {
  /** Specifies the direction in which to sort users. */
  direction: OrderDirection;
  /** Sort users by the selected field. */
  field: UserSortField;
};

/** _Entity union as defined by Federation spec. */
export type _Entity = AuthUser | User;

/** _Service manifest as defined by Federation spec. */
export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']>;
};

export type AuthUserFragmentFragment = { __typename?: 'AuthUser', id: string, email: string, isActive: boolean, firstName: string, lastName: string, isStaff: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } } | null };

export type AuthOrganizationFragmentFragment = { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number };

export type UserErrorFragmentFragment = { __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode };

export type GoogleUserAuthFragmentFragment = { __typename?: 'GoogleUserAuth', token?: string | null, refreshToken?: string | null, csrfToken?: string | null, user?: { __typename?: 'AuthUser', id: string, email: string, isActive: boolean, firstName: string, lastName: string, isStaff: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } } | null } | null, userErrors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> };

export type EmailTokenUserAuthFragmentFragment = { __typename?: 'EmailTokenUserAuth', token?: string | null, refreshToken?: string | null, csrfToken?: string | null, userErrors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> };

export type OrganizationCreateFragmentFragment = { __typename?: 'OrganizationCreate', organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, user?: { __typename?: 'AuthUser', id: string, email: string, isActive: boolean, firstName: string, lastName: string, isStaff: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } } | null } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: UserErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: UserErrorCode }> };

export type OrganizationErrorFragmentFragment = { __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: UserErrorCode };

export type EmailTokenUserAuthMutationVariables = Exact<{
  email: Scalars['String'];
  token: Scalars['String'];
}>;


export type EmailTokenUserAuthMutation = { __typename?: 'Mutation', emailTokenUserAuth?: { __typename?: 'EmailTokenUserAuth', token?: string | null, refreshToken?: string | null, csrfToken?: string | null, userErrors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> } | null };

export type EmailUserAuthChallengeMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type EmailUserAuthChallengeMutation = { __typename?: 'Mutation', emailUserAuthChallenge?: { __typename?: 'EmailUserAuthChallenge', success?: boolean | null, authType?: string | null, userErrors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> } | null };

export type GoogleUserAuthMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type GoogleUserAuthMutation = { __typename?: 'Mutation', googleUserAuth?: { __typename?: 'GoogleUserAuth', token?: string | null, refreshToken?: string | null, csrfToken?: string | null, user?: { __typename?: 'AuthUser', id: string, email: string, isActive: boolean, firstName: string, lastName: string, isStaff: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } } | null } | null, userErrors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: { __typename?: 'Logout', userErrors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> } | null };

export type OrganizationCreateMutationVariables = Exact<{
  input: OrganizationCreateInput;
  survey?: InputMaybe<OnboardingCustomerSurvey>;
}>;


export type OrganizationCreateMutation = { __typename?: 'Mutation', organizationCreate?: { __typename?: 'OrganizationCreate', organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, user?: { __typename?: 'AuthUser', id: string, email: string, isActive: boolean, firstName: string, lastName: string, isStaff: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } } | null } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: UserErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: UserErrorCode }> } | null };

export type TokenRefreshMutationVariables = Exact<{
  csrfToken?: InputMaybe<Scalars['String']>;
  refreshToken?: InputMaybe<Scalars['String']>;
}>;


export type TokenRefreshMutation = { __typename?: 'Mutation', tokenRefresh?: { __typename?: 'RefreshToken', token?: string | null, errors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> } | null };

export type ProjectFragmentFragment = { __typename?: 'Project', id: string, name: string, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } };

export const AuthOrganizationFragmentFragmentDoc = gql`
    fragment AuthOrganizationFragment on AuthOrganization {
  id
  slug
  name
  memberCount
}
    `;
export const ProjectFragmentFragmentDoc = gql`
    fragment ProjectFragment on Project {
  id
  name
  hasCompletedOnboardingFor
  timezone
  organization {
    ...AuthOrganizationFragment
  }
}
    ${AuthOrganizationFragmentFragmentDoc}`;
export const AuthUserFragmentFragmentDoc = gql`
    fragment AuthUserFragment on AuthUser {
  id
  email
  isActive
  firstName
  lastName
  isStaff
  organization {
    ...AuthOrganizationFragment
  }
  project {
    ...ProjectFragment
  }
}
    ${AuthOrganizationFragmentFragmentDoc}
${ProjectFragmentFragmentDoc}`;
export const UserErrorFragmentFragmentDoc = gql`
    fragment UserErrorFragment on UserError {
  field
  message
  code
}
    `;
export const GoogleUserAuthFragmentFragmentDoc = gql`
    fragment GoogleUserAuthFragment on GoogleUserAuth {
  token
  refreshToken
  user {
    ...AuthUserFragment
  }
  csrfToken
  userErrors {
    ...UserErrorFragment
  }
}
    ${AuthUserFragmentFragmentDoc}
${UserErrorFragmentFragmentDoc}`;
export const EmailTokenUserAuthFragmentFragmentDoc = gql`
    fragment EmailTokenUserAuthFragment on EmailTokenUserAuth {
  token
  refreshToken
  csrfToken
  userErrors {
    ...UserErrorFragment
  }
}
    ${UserErrorFragmentFragmentDoc}`;
export const OrganizationErrorFragmentFragmentDoc = gql`
    fragment OrganizationErrorFragment on OrganizationError {
  field
  message
  code
}
    `;
export const OrganizationCreateFragmentFragmentDoc = gql`
    fragment OrganizationCreateFragment on OrganizationCreate {
  organization {
    ...AuthOrganizationFragment
  }
  user {
    ...AuthUserFragment
  }
  organizationErrors {
    ...OrganizationErrorFragment
  }
  errors {
    ...OrganizationErrorFragment
  }
}
    ${AuthOrganizationFragmentFragmentDoc}
${AuthUserFragmentFragmentDoc}
${OrganizationErrorFragmentFragmentDoc}`;
export const EmailTokenUserAuthDocument = gql`
    mutation emailTokenUserAuth($email: String!, $token: String!) {
  emailTokenUserAuth(email: $email, token: $token) {
    ...EmailTokenUserAuthFragment
  }
}
    ${EmailTokenUserAuthFragmentFragmentDoc}`;
export type EmailTokenUserAuthMutationFn = Apollo.MutationFunction<EmailTokenUserAuthMutation, EmailTokenUserAuthMutationVariables>;

/**
 * __useEmailTokenUserAuthMutation__
 *
 * To run a mutation, you first call `useEmailTokenUserAuthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEmailTokenUserAuthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [emailTokenUserAuthMutation, { data, loading, error }] = useEmailTokenUserAuthMutation({
 *   variables: {
 *      email: // value for 'email'
 *      token: // value for 'token'
 *   },
 * });
 */
export function useEmailTokenUserAuthMutation(baseOptions?: Apollo.MutationHookOptions<EmailTokenUserAuthMutation, EmailTokenUserAuthMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EmailTokenUserAuthMutation, EmailTokenUserAuthMutationVariables>(EmailTokenUserAuthDocument, options);
      }
export type EmailTokenUserAuthMutationHookResult = ReturnType<typeof useEmailTokenUserAuthMutation>;
export type EmailTokenUserAuthMutationResult = Apollo.MutationResult<EmailTokenUserAuthMutation>;
export type EmailTokenUserAuthMutationOptions = Apollo.BaseMutationOptions<EmailTokenUserAuthMutation, EmailTokenUserAuthMutationVariables>;
export const EmailUserAuthChallengeDocument = gql`
    mutation emailUserAuthChallenge($email: String!) {
  emailUserAuthChallenge(email: $email) {
    success
    authType
    userErrors {
      ...UserErrorFragment
    }
  }
}
    ${UserErrorFragmentFragmentDoc}`;
export type EmailUserAuthChallengeMutationFn = Apollo.MutationFunction<EmailUserAuthChallengeMutation, EmailUserAuthChallengeMutationVariables>;

/**
 * __useEmailUserAuthChallengeMutation__
 *
 * To run a mutation, you first call `useEmailUserAuthChallengeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEmailUserAuthChallengeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [emailUserAuthChallengeMutation, { data, loading, error }] = useEmailUserAuthChallengeMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useEmailUserAuthChallengeMutation(baseOptions?: Apollo.MutationHookOptions<EmailUserAuthChallengeMutation, EmailUserAuthChallengeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EmailUserAuthChallengeMutation, EmailUserAuthChallengeMutationVariables>(EmailUserAuthChallengeDocument, options);
      }
export type EmailUserAuthChallengeMutationHookResult = ReturnType<typeof useEmailUserAuthChallengeMutation>;
export type EmailUserAuthChallengeMutationResult = Apollo.MutationResult<EmailUserAuthChallengeMutation>;
export type EmailUserAuthChallengeMutationOptions = Apollo.BaseMutationOptions<EmailUserAuthChallengeMutation, EmailUserAuthChallengeMutationVariables>;
export const GoogleUserAuthDocument = gql`
    mutation googleUserAuth($code: String!) {
  googleUserAuth(code: $code) {
    ...GoogleUserAuthFragment
  }
}
    ${GoogleUserAuthFragmentFragmentDoc}`;
export type GoogleUserAuthMutationFn = Apollo.MutationFunction<GoogleUserAuthMutation, GoogleUserAuthMutationVariables>;

/**
 * __useGoogleUserAuthMutation__
 *
 * To run a mutation, you first call `useGoogleUserAuthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGoogleUserAuthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [googleUserAuthMutation, { data, loading, error }] = useGoogleUserAuthMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useGoogleUserAuthMutation(baseOptions?: Apollo.MutationHookOptions<GoogleUserAuthMutation, GoogleUserAuthMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GoogleUserAuthMutation, GoogleUserAuthMutationVariables>(GoogleUserAuthDocument, options);
      }
export type GoogleUserAuthMutationHookResult = ReturnType<typeof useGoogleUserAuthMutation>;
export type GoogleUserAuthMutationResult = Apollo.MutationResult<GoogleUserAuthMutation>;
export type GoogleUserAuthMutationOptions = Apollo.BaseMutationOptions<GoogleUserAuthMutation, GoogleUserAuthMutationVariables>;
export const LogoutDocument = gql`
    mutation logout {
  logout {
    userErrors {
      ...UserErrorFragment
    }
  }
}
    ${UserErrorFragmentFragmentDoc}`;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const OrganizationCreateDocument = gql`
    mutation organizationCreate($input: OrganizationCreateInput!, $survey: OnboardingCustomerSurvey) {
  organizationCreate(input: $input, survey: $survey) {
    ...OrganizationCreateFragment
  }
}
    ${OrganizationCreateFragmentFragmentDoc}`;
export type OrganizationCreateMutationFn = Apollo.MutationFunction<OrganizationCreateMutation, OrganizationCreateMutationVariables>;

/**
 * __useOrganizationCreateMutation__
 *
 * To run a mutation, you first call `useOrganizationCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrganizationCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [organizationCreateMutation, { data, loading, error }] = useOrganizationCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *      survey: // value for 'survey'
 *   },
 * });
 */
export function useOrganizationCreateMutation(baseOptions?: Apollo.MutationHookOptions<OrganizationCreateMutation, OrganizationCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<OrganizationCreateMutation, OrganizationCreateMutationVariables>(OrganizationCreateDocument, options);
      }
export type OrganizationCreateMutationHookResult = ReturnType<typeof useOrganizationCreateMutation>;
export type OrganizationCreateMutationResult = Apollo.MutationResult<OrganizationCreateMutation>;
export type OrganizationCreateMutationOptions = Apollo.BaseMutationOptions<OrganizationCreateMutation, OrganizationCreateMutationVariables>;
export const TokenRefreshDocument = gql`
    mutation tokenRefresh($csrfToken: String, $refreshToken: String) {
  tokenRefresh(csrfToken: $csrfToken, refreshToken: $refreshToken) {
    token
    errors {
      ...UserErrorFragment
    }
  }
}
    ${UserErrorFragmentFragmentDoc}`;
export type TokenRefreshMutationFn = Apollo.MutationFunction<TokenRefreshMutation, TokenRefreshMutationVariables>;

/**
 * __useTokenRefreshMutation__
 *
 * To run a mutation, you first call `useTokenRefreshMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTokenRefreshMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [tokenRefreshMutation, { data, loading, error }] = useTokenRefreshMutation({
 *   variables: {
 *      csrfToken: // value for 'csrfToken'
 *      refreshToken: // value for 'refreshToken'
 *   },
 * });
 */
export function useTokenRefreshMutation(baseOptions?: Apollo.MutationHookOptions<TokenRefreshMutation, TokenRefreshMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TokenRefreshMutation, TokenRefreshMutationVariables>(TokenRefreshDocument, options);
      }
export type TokenRefreshMutationHookResult = ReturnType<typeof useTokenRefreshMutation>;
export type TokenRefreshMutationResult = Apollo.MutationResult<TokenRefreshMutation>;
export type TokenRefreshMutationOptions = Apollo.BaseMutationOptions<TokenRefreshMutation, TokenRefreshMutationVariables>;