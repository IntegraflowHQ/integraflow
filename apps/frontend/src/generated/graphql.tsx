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
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: string;
  JSONString: any;
  /**
   * Leverages the internal Python implmeentation of UUID (uuid.UUID) to provide native UUID objects
   * in fields, resolvers and input.
   */
  UUID: any;
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

export type InviteDetails = OrganizationInviteDetails | OrganizationInviteLinkDetails;

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
  /**
   * Creates a new organization invite.
   *
   * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
   */
  organizationInviteCreate?: Maybe<OrganizationInviteCreate>;
  /**
   * Reset the current organization invite link..
   *
   * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
   */
  organizationInviteLinkReset?: Maybe<OrganizationInviteLinkReset>;
  /**
   * Joins an organization
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  organizationJoin?: Maybe<OrganizationJoin>;
  /** Creates a new project */
  projectCreate?: Maybe<ProjectCreate>;
  /** Updates a project. */
  projectUpdate?: Maybe<ProjectUpdate>;
  /** Refresh JWT token. Mutation tries to take refreshToken from the input. If it fails it will try to take `refreshToken` from the http-only cookie `refreshToken`. `csrfToken` is required when `refreshToken` is provided as a cookie. */
  tokenRefresh?: Maybe<RefreshToken>;
};


export type MutationEmailTokenUserAuthArgs = {
  email: Scalars['String'];
  inviteLink?: InputMaybe<Scalars['ID']>;
  token: Scalars['String'];
};


export type MutationEmailUserAuthChallengeArgs = {
  email: Scalars['String'];
};


export type MutationGoogleUserAuthArgs = {
  code: Scalars['String'];
  inviteLink?: InputMaybe<Scalars['ID']>;
};


export type MutationOrganizationCreateArgs = {
  input: OrganizationCreateInput;
  survey?: InputMaybe<OnboardingCustomerSurvey>;
};


export type MutationOrganizationInviteCreateArgs = {
  input: OrganizationInviteCreateInput;
};


export type MutationOrganizationJoinArgs = {
  input: OrganizationJoinInput;
};


export type MutationProjectCreateArgs = {
  input: ProjectCreateInput;
};


export type MutationProjectUpdateArgs = {
  input: ProjectUpdateInput;
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
   * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
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
   * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
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
  code: OrganizationErrorCode;
  /** Name of a field that caused the error. A value of `null` ndicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export enum OrganizationErrorCode {
  AlreadyExists = 'ALREADY_EXISTS',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

/** The organization invite that was created or updated. */
export type OrganizationInvite = Node & {
  __typename?: 'OrganizationInvite';
  /** The time at which the invite was created. */
  createdAt: Scalars['DateTime'];
  /** The invitees email address. */
  email: Scalars['String'];
  /** If the invite has expired. */
  expired: Scalars['Boolean'];
  /** First name of the invite. */
  firstName?: Maybe<Scalars['String']>;
  /** The unique identifier of the invite. */
  id: Scalars['ID'];
  /**
   * The user who created the invitation.
   *
   * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
   */
  inviter: User;
  /**
   * The current project of the user.
   *
   * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
   */
  organization: Organization;
  /** The user role that the invitee will receive upon accepting the invite. */
  role: RoleLevel;
  /** The last time at which the invite was updated. */
  updatedAt: Scalars['DateTime'];
};

/**
 * Creates a new organization invite.
 *
 * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
 */
export type OrganizationInviteCreate = {
  __typename?: 'OrganizationInviteCreate';
  errors: Array<OrganizationError>;
  organizationErrors: Array<OrganizationError>;
  organizationInvite?: Maybe<OrganizationInvite>;
};

export type OrganizationInviteCreateInput = {
  /** The email of the invitee. */
  email: Scalars['String'];
  /** The identifier in UUID v4 format. If none is provided, the backend will generate one. */
  id?: InputMaybe<Scalars['UUID']>;
  /** The message to send to the invitee. */
  message?: InputMaybe<Scalars['String']>;
  /** What member role the invite should grant. */
  role?: InputMaybe<RoleLevel>;
};

/** The organization invite that was created or updated. */
export type OrganizationInviteDetails = Node & {
  __typename?: 'OrganizationInviteDetails';
  /** The time at which the invite was created. */
  createdAt: Scalars['DateTime'];
  /** The invitees email address. */
  email: Scalars['String'];
  /** If the invite has expired. */
  expired: Scalars['Boolean'];
  /** First name of the invite. */
  firstName?: Maybe<Scalars['String']>;
  /** The unique identifier of the invite. */
  id: Scalars['ID'];
  /** The name/email of the inviter. */
  inviter: Scalars['String'];
  /** The ID of the organization the invite is for. */
  organizationId: Scalars['ID'];
  /** The logo of the organization the invite is for. */
  organizationLogo?: Maybe<Scalars['String']>;
  /** The name of the organization the invite is for. */
  organizationName: Scalars['String'];
  /** The user role that the invitee will receive upon accepting the invite. */
  role: RoleLevel;
  /** The last time at which the invite was updated. */
  updatedAt: Scalars['DateTime'];
};

/** The organization invite link. */
export type OrganizationInviteLink = Node & {
  __typename?: 'OrganizationInviteLink';
  /** The ID of the object. */
  id: Scalars['ID'];
  /**
   * The link of the organization the invite is for.
   *
   * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
   */
  inviteLink: Scalars['String'];
};

/** The organization invite that was created or updated. */
export type OrganizationInviteLinkDetails = Node & {
  __typename?: 'OrganizationInviteLinkDetails';
  /** The ID of the object. */
  id: Scalars['ID'];
  /** The ID of the organization the invite is for. */
  organizationId: Scalars['ID'];
  /** The logo of the organization the invite is for. */
  organizationLogo?: Maybe<Scalars['String']>;
  /** The name of the organization the invite is for. */
  organizationName: Scalars['String'];
};

/**
 * Reset the current organization invite link..
 *
 * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
 */
export type OrganizationInviteLinkReset = {
  __typename?: 'OrganizationInviteLinkReset';
  errors: Array<OrganizationError>;
  /** The current organization invite link. */
  inviteLink?: Maybe<Scalars['String']>;
  organizationErrors: Array<OrganizationError>;
  /** Whether the operation was successful. */
  success?: Maybe<Scalars['Boolean']>;
};

/**
 * Joins an organization
 *
 * Requires one of the following permissions: AUTHENTICATED_USER.
 */
export type OrganizationJoin = {
  __typename?: 'OrganizationJoin';
  errors: Array<OrganizationError>;
  organizationErrors: Array<OrganizationError>;
  /** A user that has access to the the resources of an organization. */
  user: AuthUser;
};

export type OrganizationJoinInput = {
  /** An invite link for an organization. */
  inviteLink: Scalars['String'];
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
  /** Whether the project is private or not. */
  accessControl?: Maybe<Scalars['Boolean']>;
  /** The data required for the onboarding process */
  hasCompletedOnboardingFor?: Maybe<Scalars['JSONString']>;
  /** The ID of the project. */
  id: Scalars['ID'];
  /** Name of the project. */
  name: Scalars['String'];
  /** Organization the project belongs to. */
  organization: AuthOrganization;
  /** Slug of the project. */
  slug: Scalars['String'];
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

/** Creates a new project */
export type ProjectCreate = {
  __typename?: 'ProjectCreate';
  errors: Array<ProjectError>;
  project?: Maybe<Project>;
  projectErrors: Array<ProjectError>;
};

export type ProjectCreateInput = {
  /** The identifier in UUID v4 format. If none is provided, the backend will generate one. */
  id?: InputMaybe<Scalars['UUID']>;
  /** The name of the project. */
  name: Scalars['String'];
  /** Whether the project is private or not. */
  private?: InputMaybe<Scalars['Boolean']>;
  /** The timezone of the project. */
  timezone?: InputMaybe<Scalars['String']>;
};

/** Represents errors in project mutations. */
export type ProjectError = {
  __typename?: 'ProjectError';
  /** The error code. */
  code: ProjectErrorCode;
  /** Name of a field that caused the error. A value of `null` ndicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export enum ProjectErrorCode {
  AlreadyExists = 'ALREADY_EXISTS',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

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

/** Updates a project. */
export type ProjectUpdate = {
  __typename?: 'ProjectUpdate';
  errors: Array<ProjectError>;
  project?: Maybe<Project>;
  projectErrors: Array<ProjectError>;
};

export type ProjectUpdateInput = {
  /** The data required for the onboarding process. */
  hasCompletedOnboardingFor?: InputMaybe<Scalars['JSONString']>;
  /** The icon of the project. */
  icon?: InputMaybe<Scalars['String']>;
  /** The name of the project. */
  name?: InputMaybe<Scalars['String']>;
  /** Whether the project is private or not. */
  private?: InputMaybe<Scalars['Boolean']>;
  /** The timezone of the project. */
  timezone?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  _entities?: Maybe<Array<Maybe<_Entity>>>;
  _service?: Maybe<_Service>;
  /** One specific organization invite. */
  organizationInviteDetails?: Maybe<InviteDetails>;
  /**
   * The current organization invite link.
   *
   * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
   */
  organizationInviteLink?: Maybe<OrganizationInviteLink>;
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


export type QueryOrganizationInviteDetailsArgs = {
  inviteLink: Scalars['String'];
};

/** Refresh JWT token. Mutation tries to take refreshToken from the input. If it fails it will try to take `refreshToken` from the http-only cookie `refreshToken`. `csrfToken` is required when `refreshToken` is provided as a cookie. */
export type RefreshToken = {
  __typename?: 'RefreshToken';
  errors: Array<UserError>;
  /** Acess token to authenticate the user. */
  token?: Maybe<Scalars['String']>;
  userErrors: Array<UserError>;
};

export enum RoleLevel {
  Admin = 'ADMIN',
  Member = 'MEMBER'
}

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

export type AuthUserFragmentFragment = { __typename?: 'AuthUser', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } } | null };

export type AuthOrganizationFragmentFragment = { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number };

export type UserErrorFragmentFragment = { __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode };

export type GoogleUserAuthFragmentFragment = { __typename?: 'GoogleUserAuth', token?: string | null, refreshToken?: string | null, csrfToken?: string | null, user?: { __typename?: 'AuthUser', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } } | null } | null, userErrors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> };

export type EmailTokenUserAuthFragmentFragment = { __typename?: 'EmailTokenUserAuth', token?: string | null, refreshToken?: string | null, csrfToken?: string | null, user?: { __typename?: 'AuthUser', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } } | null } | null, userErrors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> };

export type OrganizationCreateFragmentFragment = { __typename?: 'OrganizationCreate', organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, user?: { __typename?: 'AuthUser', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } } | null } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> };

export type OrganizationErrorFragmentFragment = { __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode };

export type EmailTokenUserAuthMutationVariables = Exact<{
  email: Scalars['String'];
  token: Scalars['String'];
}>;


export type EmailTokenUserAuthMutation = { __typename?: 'Mutation', emailTokenUserAuth?: { __typename?: 'EmailTokenUserAuth', token?: string | null, refreshToken?: string | null, csrfToken?: string | null, user?: { __typename?: 'AuthUser', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } } | null } | null, userErrors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> } | null };

export type EmailUserAuthChallengeMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type EmailUserAuthChallengeMutation = { __typename?: 'Mutation', emailUserAuthChallenge?: { __typename?: 'EmailUserAuthChallenge', success?: boolean | null, authType?: string | null, userErrors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> } | null };

export type GoogleUserAuthMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type GoogleUserAuthMutation = { __typename?: 'Mutation', googleUserAuth?: { __typename?: 'GoogleUserAuth', token?: string | null, refreshToken?: string | null, csrfToken?: string | null, user?: { __typename?: 'AuthUser', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } } | null } | null, userErrors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: { __typename?: 'Logout', userErrors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> } | null };

export type OrganizationCreateMutationVariables = Exact<{
  input: OrganizationCreateInput;
  survey?: InputMaybe<OnboardingCustomerSurvey>;
}>;


export type OrganizationCreateMutation = { __typename?: 'Mutation', organizationCreate?: { __typename?: 'OrganizationCreate', organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, user?: { __typename?: 'AuthUser', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } } | null } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> } | null };

export type TokenRefreshMutationVariables = Exact<{
  csrfToken?: InputMaybe<Scalars['String']>;
  refreshToken?: InputMaybe<Scalars['String']>;
}>;


export type TokenRefreshMutation = { __typename?: 'Mutation', tokenRefresh?: { __typename?: 'RefreshToken', token?: string | null, errors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> } | null };

export type OrganizationInviteLinkCreateFragmentFragment = { __typename?: 'OrganizationInviteLink', id: string, inviteLink: string };

export type OrganizationInviteCreateFragmentFragment = { __typename?: 'OrganizationInviteCreate', organizationInvite?: { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel, createdAt: string, updatedAt: string, expired: boolean, inviter: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean }, organization: { __typename?: 'Organization', id: string } } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> };

export type OrganizationInviteFragmentFragment = { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel, createdAt: string, updatedAt: string, expired: boolean, inviter: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean }, organization: { __typename?: 'Organization', id: string } };

export type RefreshOrganizationInviteLinkFragmentFragment = { __typename?: 'OrganizationInviteLinkReset', inviteLink?: string | null, success?: boolean | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> };

export type OrganizationInviteCreateMutationVariables = Exact<{
  input: OrganizationInviteCreateInput;
}>;


export type OrganizationInviteCreateMutation = { __typename?: 'Mutation', organizationInviteCreate?: { __typename?: 'OrganizationInviteCreate', organizationInvite?: { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel, createdAt: string, updatedAt: string, expired: boolean, inviter: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean }, organization: { __typename?: 'Organization', id: string } } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> } | null };

export type OrganizationInviteLinkResetMutationVariables = Exact<{ [key: string]: never; }>;


export type OrganizationInviteLinkResetMutation = { __typename?: 'Mutation', organizationInviteLinkReset?: { __typename?: 'OrganizationInviteLinkReset', inviteLink?: string | null, success?: boolean | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> } | null };

export type OrganizationInviteLinkCreateQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationInviteLinkCreateQuery = { __typename?: 'Query', organizationInviteLink?: { __typename?: 'OrganizationInviteLink', id: string, inviteLink: string } | null };

export type ProjectCreateFragmentFragment = { __typename?: 'ProjectCreate', project?: { __typename?: 'Project', id: string, name: string, slug: string, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } } | null, projectErrors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }>, errors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }> };

export type ProjectErrorFragmentFragment = { __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode };

export type ProjectFragmentFragment = { __typename?: 'Project', id: string, name: string, slug: string, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } };

export type ProjectCreateMutationVariables = Exact<{
  input: ProjectCreateInput;
}>;


export type ProjectCreateMutation = { __typename?: 'Mutation', projectCreate?: { __typename?: 'ProjectCreate', project?: { __typename?: 'Project', id: string, name: string, slug: string, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } } | null, projectErrors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }>, errors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }> } | null };

export type ViewerQueryVariables = Exact<{ [key: string]: never; }>;


export type ViewerQuery = { __typename?: 'Query', viewer?: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } } | null, organizations?: { __typename?: 'OrganizationCountableConnection', edges: Array<{ __typename?: 'OrganizationCountableEdge', node: { __typename?: 'Organization', id: string, slug: string, name: string, memberCount: number, projects?: { __typename?: 'ProjectCountableConnection', edges: Array<{ __typename?: 'ProjectCountableEdge', node: { __typename?: 'Project', id: string, name: string, slug: string, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } } }> } | null } }> } | null } | null };

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
  slug
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
  firstName
  lastName
  isStaff
  isActive
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
  user {
    ...AuthUserFragment
  }
  userErrors {
    ...UserErrorFragment
  }
}
    ${AuthUserFragmentFragmentDoc}
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
export const OrganizationInviteLinkCreateFragmentFragmentDoc = gql`
    fragment OrganizationInviteLinkCreateFragment on OrganizationInviteLink {
  id
  inviteLink
}
    `;
export const OrganizationInviteFragmentFragmentDoc = gql`
    fragment OrganizationInviteFragment on OrganizationInvite {
  id
  email
  firstName
  role
  createdAt
  updatedAt
  expired
  inviter {
    id
    email
    firstName
    lastName
    isStaff
    isActive
  }
  organization {
    id
  }
}
    `;
export const OrganizationInviteCreateFragmentFragmentDoc = gql`
    fragment OrganizationInviteCreateFragment on OrganizationInviteCreate {
  organizationInvite {
    ...OrganizationInviteFragment
  }
  organizationErrors {
    ...OrganizationErrorFragment
  }
  errors {
    ...OrganizationErrorFragment
  }
}
    ${OrganizationInviteFragmentFragmentDoc}
${OrganizationErrorFragmentFragmentDoc}`;
export const RefreshOrganizationInviteLinkFragmentFragmentDoc = gql`
    fragment RefreshOrganizationInviteLinkFragment on OrganizationInviteLinkReset {
  inviteLink
  success
  organizationErrors {
    ...OrganizationErrorFragment
  }
  errors {
    ...OrganizationErrorFragment
  }
}
    ${OrganizationErrorFragmentFragmentDoc}`;
export const ProjectErrorFragmentFragmentDoc = gql`
    fragment ProjectErrorFragment on ProjectError {
  field
  message
  code
}
    `;
export const ProjectCreateFragmentFragmentDoc = gql`
    fragment ProjectCreateFragment on ProjectCreate {
  project {
    ...ProjectFragment
  }
  projectErrors {
    ...ProjectErrorFragment
  }
  errors {
    ...ProjectErrorFragment
  }
}
    ${ProjectFragmentFragmentDoc}
${ProjectErrorFragmentFragmentDoc}`;
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
export const OrganizationInviteCreateDocument = gql`
    mutation organizationInviteCreate($input: OrganizationInviteCreateInput!) {
  organizationInviteCreate(input: $input) {
    ...OrganizationInviteCreateFragment
  }
}
    ${OrganizationInviteCreateFragmentFragmentDoc}`;
export type OrganizationInviteCreateMutationFn = Apollo.MutationFunction<OrganizationInviteCreateMutation, OrganizationInviteCreateMutationVariables>;

/**
 * __useOrganizationInviteCreateMutation__
 *
 * To run a mutation, you first call `useOrganizationInviteCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrganizationInviteCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [organizationInviteCreateMutation, { data, loading, error }] = useOrganizationInviteCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrganizationInviteCreateMutation(baseOptions?: Apollo.MutationHookOptions<OrganizationInviteCreateMutation, OrganizationInviteCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<OrganizationInviteCreateMutation, OrganizationInviteCreateMutationVariables>(OrganizationInviteCreateDocument, options);
      }
export type OrganizationInviteCreateMutationHookResult = ReturnType<typeof useOrganizationInviteCreateMutation>;
export type OrganizationInviteCreateMutationResult = Apollo.MutationResult<OrganizationInviteCreateMutation>;
export type OrganizationInviteCreateMutationOptions = Apollo.BaseMutationOptions<OrganizationInviteCreateMutation, OrganizationInviteCreateMutationVariables>;
export const OrganizationInviteLinkResetDocument = gql`
    mutation organizationInviteLinkReset {
  organizationInviteLinkReset {
    ...RefreshOrganizationInviteLinkFragment
  }
}
    ${RefreshOrganizationInviteLinkFragmentFragmentDoc}`;
export type OrganizationInviteLinkResetMutationFn = Apollo.MutationFunction<OrganizationInviteLinkResetMutation, OrganizationInviteLinkResetMutationVariables>;

/**
 * __useOrganizationInviteLinkResetMutation__
 *
 * To run a mutation, you first call `useOrganizationInviteLinkResetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrganizationInviteLinkResetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [organizationInviteLinkResetMutation, { data, loading, error }] = useOrganizationInviteLinkResetMutation({
 *   variables: {
 *   },
 * });
 */
export function useOrganizationInviteLinkResetMutation(baseOptions?: Apollo.MutationHookOptions<OrganizationInviteLinkResetMutation, OrganizationInviteLinkResetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<OrganizationInviteLinkResetMutation, OrganizationInviteLinkResetMutationVariables>(OrganizationInviteLinkResetDocument, options);
      }
export type OrganizationInviteLinkResetMutationHookResult = ReturnType<typeof useOrganizationInviteLinkResetMutation>;
export type OrganizationInviteLinkResetMutationResult = Apollo.MutationResult<OrganizationInviteLinkResetMutation>;
export type OrganizationInviteLinkResetMutationOptions = Apollo.BaseMutationOptions<OrganizationInviteLinkResetMutation, OrganizationInviteLinkResetMutationVariables>;
export const OrganizationInviteLinkCreateDocument = gql`
    query OrganizationInviteLinkCreate {
  organizationInviteLink {
    ...OrganizationInviteLinkCreateFragment
  }
}
    ${OrganizationInviteLinkCreateFragmentFragmentDoc}`;

/**
 * __useOrganizationInviteLinkCreateQuery__
 *
 * To run a query within a React component, call `useOrganizationInviteLinkCreateQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationInviteLinkCreateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationInviteLinkCreateQuery({
 *   variables: {
 *   },
 * });
 */
export function useOrganizationInviteLinkCreateQuery(baseOptions?: Apollo.QueryHookOptions<OrganizationInviteLinkCreateQuery, OrganizationInviteLinkCreateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationInviteLinkCreateQuery, OrganizationInviteLinkCreateQueryVariables>(OrganizationInviteLinkCreateDocument, options);
      }
export function useOrganizationInviteLinkCreateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationInviteLinkCreateQuery, OrganizationInviteLinkCreateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationInviteLinkCreateQuery, OrganizationInviteLinkCreateQueryVariables>(OrganizationInviteLinkCreateDocument, options);
        }
export type OrganizationInviteLinkCreateQueryHookResult = ReturnType<typeof useOrganizationInviteLinkCreateQuery>;
export type OrganizationInviteLinkCreateLazyQueryHookResult = ReturnType<typeof useOrganizationInviteLinkCreateLazyQuery>;
export type OrganizationInviteLinkCreateQueryResult = Apollo.QueryResult<OrganizationInviteLinkCreateQuery, OrganizationInviteLinkCreateQueryVariables>;
export const ProjectCreateDocument = gql`
    mutation projectCreate($input: ProjectCreateInput!) {
  projectCreate(input: $input) {
    ...ProjectCreateFragment
  }
}
    ${ProjectCreateFragmentFragmentDoc}`;
export type ProjectCreateMutationFn = Apollo.MutationFunction<ProjectCreateMutation, ProjectCreateMutationVariables>;

/**
 * __useProjectCreateMutation__
 *
 * To run a mutation, you first call `useProjectCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProjectCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [projectCreateMutation, { data, loading, error }] = useProjectCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProjectCreateMutation(baseOptions?: Apollo.MutationHookOptions<ProjectCreateMutation, ProjectCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ProjectCreateMutation, ProjectCreateMutationVariables>(ProjectCreateDocument, options);
      }
export type ProjectCreateMutationHookResult = ReturnType<typeof useProjectCreateMutation>;
export type ProjectCreateMutationResult = Apollo.MutationResult<ProjectCreateMutation>;
export type ProjectCreateMutationOptions = Apollo.BaseMutationOptions<ProjectCreateMutation, ProjectCreateMutationVariables>;
export const ViewerDocument = gql`
    query viewer {
  viewer {
    id
    email
    firstName
    lastName
    isStaff
    isActive
    organization {
      ...AuthOrganizationFragment
    }
    project {
      ...ProjectFragment
    }
    organizations(first: 50) {
      edges {
        node {
          id
          slug
          name
          memberCount
          projects(first: 100) {
            edges {
              node {
                ...ProjectFragment
              }
            }
          }
        }
      }
    }
  }
}
    ${AuthOrganizationFragmentFragmentDoc}
${ProjectFragmentFragmentDoc}`;

/**
 * __useViewerQuery__
 *
 * To run a query within a React component, call `useViewerQuery` and pass it any options that fit your needs.
 * When your component renders, `useViewerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useViewerQuery({
 *   variables: {
 *   },
 * });
 */
export function useViewerQuery(baseOptions?: Apollo.QueryHookOptions<ViewerQuery, ViewerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ViewerQuery, ViewerQueryVariables>(ViewerDocument, options);
      }
export function useViewerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ViewerQuery, ViewerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ViewerQuery, ViewerQueryVariables>(ViewerDocument, options);
        }
export type ViewerQueryHookResult = ReturnType<typeof useViewerQuery>;
export type ViewerLazyQueryHookResult = ReturnType<typeof useViewerLazyQuery>;
export type ViewerQueryResult = Apollo.QueryResult<ViewerQuery, ViewerQueryVariables>;