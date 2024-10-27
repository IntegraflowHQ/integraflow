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
   * The `Date` scalar type represents a Date
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Date: any;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: string;
  JSONString: any;
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
  /** Determine if the user has finished onboarding. */
  isOnboarded: Scalars['Boolean'];
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

/** Represents a project. */
export type BaseProject = Node & {
  __typename?: 'BaseProject';
  /** API token for project. */
  apiToken: Scalars['String'];
  /** The ID of the project. */
  id: Scalars['ID'];
  /** Name of the project. */
  name: Scalars['String'];
};

/** Represents a theme. */
export type BaseProjectTheme = Node & {
  __typename?: 'BaseProjectTheme';
  /** The settings of the theme. */
  colorScheme?: Maybe<Scalars['JSONString']>;
  /** The ID of the theme. */
  id: Scalars['ID'];
  /** Name of the theme. */
  name: Scalars['String'];
  /** The settings of the theme. */
  settings?: Maybe<Scalars['JSONString']>;
};

/** Represents a survey from used by our sdk. */
export type BaseSurvey = Node & {
  __typename?: 'BaseSurvey';
  /** The distribution channels supported by the survey */
  channels: Array<BaseSurveyChannel>;
  /** The time at which the survey was created. */
  createdAt: Scalars['DateTime'];
  /** The date at which the survey was ended. */
  endDate?: Maybe<Scalars['DateTime']>;
  /** The ID of the survey. */
  id: Scalars['ID'];
  /** Name of the survey. */
  name?: Maybe<Scalars['String']>;
  /** The project the survey belongs to */
  project?: Maybe<BaseProject>;
  /** The questions in the the survey */
  questions: Array<BaseSurveyQuestion>;
  /** The settings of the survey. */
  settings?: Maybe<Scalars['JSONString']>;
  /** Slug of the survey. */
  slug: Scalars['String'];
  /** The date at which the survey was started. */
  startDate?: Maybe<Scalars['DateTime']>;
  /** The status of the survey */
  status: SurveyStatusEnum;
  /** The theme of the survey. */
  theme?: Maybe<BaseProjectTheme>;
};


/** Represents a survey from used by our sdk. */
export type BaseSurveyChannelsArgs = {
  channelType?: InputMaybe<SurveyChannelTypeEnum>;
};

/** Represents a survey channel. */
export type BaseSurveyChannel = Node & {
  __typename?: 'BaseSurveyChannel';
  /** The settings of the question. */
  conditions?: Maybe<Scalars['JSONString']>;
  /** The time at which the channel was created. */
  createdAt: Scalars['DateTime'];
  /** The ID of the channel. */
  id: Scalars['ID'];
  /** Unique link to the channel. */
  link: Scalars['String'];
  /** The settings of the question. */
  settings?: Maybe<Scalars['JSONString']>;
  /** The options of the question. */
  triggers?: Maybe<Scalars['JSONString']>;
  /** The type of the survey channel */
  type: SurveyChannelTypeEnum;
};

export type BaseSurveyCountableConnection = {
  __typename?: 'BaseSurveyCountableConnection';
  edges: Array<BaseSurveyCountableEdge>;
  nodes: Array<BaseSurvey>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type BaseSurveyCountableEdge = {
  __typename?: 'BaseSurveyCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: BaseSurvey;
};

/** Represents a question. */
export type BaseSurveyQuestion = Node & {
  __typename?: 'BaseSurveyQuestion';
  /** The time at which the question was created. */
  createdAt: Scalars['DateTime'];
  /** Description of the question. */
  description: Scalars['String'];
  /** The ID of the question. */
  id: Scalars['ID'];
  /** Label of the question. */
  label: Scalars['String'];
  /** The position of the question. */
  maxPath: Scalars['Int'];
  /** The options of the question. */
  options?: Maybe<Scalars['JSONString']>;
  /** The position of the question. */
  orderNumber: Scalars['Int'];
  /** The settings of the question. */
  settings?: Maybe<Scalars['JSONString']>;
  /** The type of the question */
  type: SurveyQuestionTypeEnum;
};

export type DateRangeInput = {
  /** Start date. */
  gte?: InputMaybe<Scalars['Date']>;
  /** End date. */
  lte?: InputMaybe<Scalars['Date']>;
};

export type DateTimeRangeInput = {
  /** Start date. */
  gte?: InputMaybe<Scalars['DateTime']>;
  /** End date. */
  lte?: InputMaybe<Scalars['DateTime']>;
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

/** Represents an event. */
export type Event = Node & {
  __typename?: 'Event';
  /** The time the event was created */
  createdAt?: Maybe<Scalars['DateTime']>;
  /** The event name */
  distinctId: Scalars['String'];
  /** The event name */
  event: Scalars['String'];
  /** The ID of the event. */
  id: Scalars['ID'];
  /**
   * The project the event belongs to
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  project: Project;
  /** The event properties */
  properties?: Maybe<Scalars['JSONString']>;
  /** The time the event occurred */
  timestamp?: Maybe<Scalars['DateTime']>;
};

/** Captures event. */
export type EventCapture = {
  __typename?: 'EventCapture';
  errors: Array<EventError>;
  eventErrors: Array<EventError>;
  /** Whether the operation was successful. */
  status?: Maybe<Scalars['Boolean']>;
};

export type EventCaptureInput = {
  /** The user attributes. */
  attributes?: InputMaybe<Scalars['JSONString']>;
  /** The name of the event. */
  event: Scalars['String'];
  /** The event properties. */
  properties?: InputMaybe<Scalars['JSONString']>;
  /** The time the event happened */
  timestamp: Scalars['DateTime'];
  /** The user distinct ID. */
  userId?: InputMaybe<Scalars['ID']>;
  /** The event payload ID. */
  uuid?: InputMaybe<Scalars['UUID']>;
};

export type EventCountableConnection = {
  __typename?: 'EventCountableConnection';
  edges: Array<EventCountableEdge>;
  nodes: Array<Event>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type EventCountableEdge = {
  __typename?: 'EventCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Event;
};

/** Represents an event definition. */
export type EventDefinition = Node & {
  __typename?: 'EventDefinition';
  /** The time the event was created */
  createdAt?: Maybe<Scalars['DateTime']>;
  /** The ID of the event definition. */
  id: Scalars['ID'];
  /** The time the event was last seen */
  lastSeenAt?: Maybe<Scalars['DateTime']>;
  /** The name of the event definition */
  name: Scalars['String'];
  /**
   * The project the event definition belongs to
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  project: Project;
  /** The volume of events in the last 30 rolling days */
  volume: Scalars['Int'];
};

export type EventDefinitionCountableConnection = {
  __typename?: 'EventDefinitionCountableConnection';
  edges: Array<EventDefinitionCountableEdge>;
  nodes: Array<EventDefinition>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type EventDefinitionCountableEdge = {
  __typename?: 'EventDefinitionCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: EventDefinition;
};

/** Represents errors in event mutations. */
export type EventError = {
  __typename?: 'EventError';
  /** The error code. */
  code: EventErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export enum EventErrorCode {
  Forbidden = 'FORBIDDEN',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID'
}

export type EventFilterInput = {
  event?: InputMaybe<Scalars['String']>;
  events?: InputMaybe<Array<Scalars['String']>>;
};

/** Represents an event property. */
export type EventProperty = Node & {
  __typename?: 'EventProperty';
  /** The name of the event */
  event: Scalars['String'];
  /** The ID of the event property. */
  id: Scalars['ID'];
  /**
   * The project the event property belongs to
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  project: Project;
  /** The property of the event */
  property: Scalars['String'];
};

export type EventPropertyCountableConnection = {
  __typename?: 'EventPropertyCountableConnection';
  edges: Array<EventPropertyCountableEdge>;
  nodes: Array<EventProperty>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type EventPropertyCountableEdge = {
  __typename?: 'EventPropertyCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: EventProperty;
};

/** Represents an event property with definition. */
export type EventPropertyWithDefinition = {
  __typename?: 'EventPropertyWithDefinition';
  /** The name of the event */
  event: Scalars['String'];
  /** Whether property accepts a numerical value */
  isNumerical: Scalars['Boolean'];
  /** The property of the event */
  property: Scalars['String'];
  /** The property type */
  propertyType: PropertyTypeEnum;
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
  /** Captures event. */
  eventCapture?: Maybe<EventCapture>;
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
   * Deletes an organization invite.
   *
   * Requires one of the following permissions: ORGANIZATION_ADMIN_ACCESS.
   */
  organizationInviteDelete?: Maybe<OrganizationInviteDelete>;
  /**
   * Reset the current organization invite link..
   *
   * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
   */
  organizationInviteLinkReset?: Maybe<OrganizationInviteLinkReset>;
  /**
   * Resend an existing invite
   *
   * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
   */
  organizationInviteResend?: Maybe<OrganizationInviteResend>;
  /**
   * Joins an organization
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  organizationJoin?: Maybe<OrganizationJoin>;
  /**
   * Leaves an organization.
   *
   * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
   */
  organizationLeave?: Maybe<OrganizationLeave>;
  /**
   * Deletes a member from an organization.
   *
   * Requires one of the following permissions: ORGANIZATION_ADMIN_ACCESS.
   */
  organizationMemberLeave?: Maybe<OrganizationMemberLeave>;
  /**
   * Updates an organization member.
   *
   * Requires one of the following permissions: ORGANIZATION_ADMIN_ACCESS.
   */
  organizationMemberUpdate?: Maybe<OrganizationMemberUpdate>;
  /**
   * Updates an organization.
   *
   * Requires one of the following permissions: ORGANIZATION_ADMIN_ACCESS.
   */
  organizationUpdate?: Maybe<OrganizationUpdate>;
  /** Creates a new project */
  projectCreate?: Maybe<ProjectCreate>;
  /**
   * Creates a new theme
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  projectThemeCreate?: Maybe<ProjectThemeCreate>;
  /**
   * Deletes a theme.
   *
   * Requires one of the following permissions: PROJECT_ADMIN_ACCESS.
   */
  projectThemeDelete?: Maybe<ProjectThemeDelete>;
  /**
   * Updates an existing theme
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  projectThemeUpdate?: Maybe<ProjectThemeUpdate>;
  /**
   * Updates a project token.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  projectTokenReset?: Maybe<ProjectTokenReset>;
  /** Updates a project. */
  projectUpdate?: Maybe<ProjectUpdate>;
  /**
   * Creates a new distibution channel
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  surveyChannelCreate?: Maybe<SurveyChannelCreate>;
  /**
   * Deletes a channel.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  surveyChannelDelete?: Maybe<SurveyChannelDelete>;
  /**
   * Updates a channel
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  surveyChannelUpdate?: Maybe<SurveyChannelUpdate>;
  /**
   * Creates a new survey
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  surveyCreate?: Maybe<SurveyCreate>;
  /**
   * Deletes a survey.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  surveyDelete?: Maybe<SurveyDelete>;
  /**
   * Creates a new question
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  surveyQuestionCreate?: Maybe<SurveyQuestionCreate>;
  /**
   * Deletes a question.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  surveyQuestionDelete?: Maybe<SurveyQuestionDelete>;
  /**
   * Updates a question
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  surveyQuestionUpdate?: Maybe<SurveyQuestionUpdate>;
  /** Creates a response to survey. */
  surveyResponseCreate?: Maybe<SurveyResponseCreate>;
  /** Updates a response. */
  surveyResponseUpdate?: Maybe<SurveyResponseUpdate>;
  /**
   * Updates a survey
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  surveyUpdate?: Maybe<SurveyUpdate>;
  /** Refresh JWT token. Mutation tries to take refreshToken from the input. If it fails it will try to take `refreshToken` from the http-only cookie `refreshToken`. `csrfToken` is required when `refreshToken` is provided as a cookie. */
  tokenRefresh?: Maybe<RefreshToken>;
  /**
   * Updates a user.
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  userUpdate?: Maybe<UserUpdate>;
};


export type MutationEmailTokenUserAuthArgs = {
  email: Scalars['String'];
  inviteLink?: InputMaybe<Scalars['String']>;
  token: Scalars['String'];
};


export type MutationEmailUserAuthChallengeArgs = {
  email: Scalars['String'];
  inviteLink?: InputMaybe<Scalars['String']>;
};


export type MutationEventCaptureArgs = {
  batch?: InputMaybe<Array<EventCaptureInput>>;
  input?: InputMaybe<EventCaptureInput>;
  sentAt?: InputMaybe<Scalars['DateTime']>;
};


export type MutationGoogleUserAuthArgs = {
  code: Scalars['String'];
  inviteLink?: InputMaybe<Scalars['String']>;
};


export type MutationOrganizationCreateArgs = {
  input: OrganizationCreateInput;
  survey?: InputMaybe<OnboardingCustomerSurvey>;
};


export type MutationOrganizationInviteCreateArgs = {
  input: OrganizationInviteCreateInput;
};


export type MutationOrganizationInviteDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationOrganizationInviteResendArgs = {
  id: Scalars['ID'];
};


export type MutationOrganizationJoinArgs = {
  input: OrganizationJoinInput;
};


export type MutationOrganizationLeaveArgs = {
  id: Scalars['ID'];
};


export type MutationOrganizationMemberLeaveArgs = {
  id: Scalars['ID'];
};


export type MutationOrganizationMemberUpdateArgs = {
  id: Scalars['ID'];
  input: OrganizationMemberUpdateInput;
};


export type MutationOrganizationUpdateArgs = {
  input: OrganizationUpdateInput;
};


export type MutationProjectCreateArgs = {
  input: ProjectCreateInput;
};


export type MutationProjectThemeCreateArgs = {
  input: ProjectThemeCreateInput;
};


export type MutationProjectThemeDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationProjectThemeUpdateArgs = {
  id: Scalars['ID'];
  input: ProjectThemeUpdateInput;
};


export type MutationProjectUpdateArgs = {
  input: ProjectUpdateInput;
};


export type MutationSurveyChannelCreateArgs = {
  input: SurveyChannelCreateInput;
};


export type MutationSurveyChannelDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationSurveyChannelUpdateArgs = {
  id: Scalars['ID'];
  input: SurveyChannelUpdateInput;
};


export type MutationSurveyCreateArgs = {
  input: SurveyCreateInput;
};


export type MutationSurveyDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationSurveyQuestionCreateArgs = {
  input: SurveyQuestionCreateInput;
};


export type MutationSurveyQuestionDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationSurveyQuestionUpdateArgs = {
  id: Scalars['ID'];
  input: SurveyQuestionUpdateInput;
};


export type MutationSurveyResponseCreateArgs = {
  input: SurveyResponseCreateInput;
};


export type MutationSurveyResponseUpdateArgs = {
  id: Scalars['ID'];
  input: SurveyResponseUpdateInput;
};


export type MutationSurveyUpdateArgs = {
  id: Scalars['ID'];
  input: SurveyUpdateInput;
};


export type MutationTokenRefreshArgs = {
  csrfToken?: InputMaybe<Scalars['String']>;
  refreshToken?: InputMaybe<Scalars['String']>;
};


export type MutationUserUpdateArgs = {
  input: UserInput;
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
  /**
   * Billing usage of the organization.
   *
   * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
   */
  billingUsage?: Maybe<Scalars['JSONString']>;
  /** The ID of the organization. */
  id: Scalars['ID'];
  /**
   * Invites associated with the organization.
   *
   * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
   */
  invites?: Maybe<OrganizationInviteCountableConnection>;
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
  members?: Maybe<OrganizationMemberCountableConnection>;
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
export type OrganizationInvitesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Represents an organization. */
export type OrganizationMembersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Represents an organization. */
export type OrganizationProjectsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type OrganizationCountableConnection = {
  __typename?: 'OrganizationCountableConnection';
  edges: Array<OrganizationCountableEdge>;
  nodes: Array<Organization>;
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
  organization?: Maybe<Organization>;
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
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
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

export type OrganizationInviteCountableConnection = {
  __typename?: 'OrganizationInviteCountableConnection';
  edges: Array<OrganizationInviteCountableEdge>;
  nodes: Array<OrganizationInvite>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type OrganizationInviteCountableEdge = {
  __typename?: 'OrganizationInviteCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: OrganizationInvite;
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

/**
 * Deletes an organization invite.
 *
 * Requires one of the following permissions: ORGANIZATION_ADMIN_ACCESS.
 */
export type OrganizationInviteDelete = {
  __typename?: 'OrganizationInviteDelete';
  errors: Array<OrganizationError>;
  organizationErrors: Array<OrganizationError>;
  organizationInvite?: Maybe<OrganizationInvite>;
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
export type OrganizationInviteLink = {
  __typename?: 'OrganizationInviteLink';
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
 * Resend an existing invite
 *
 * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
 */
export type OrganizationInviteResend = {
  __typename?: 'OrganizationInviteResend';
  errors: Array<OrganizationError>;
  organizationErrors: Array<OrganizationError>;
  organizationInvite?: Maybe<OrganizationInvite>;
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

/**
 * Leaves an organization.
 *
 * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
 */
export type OrganizationLeave = {
  __typename?: 'OrganizationLeave';
  errors: Array<OrganizationError>;
  organization?: Maybe<Organization>;
  organizationErrors: Array<OrganizationError>;
};

/** Represents an organization member. */
export type OrganizationMember = Node & {
  __typename?: 'OrganizationMember';
  /** The time at which the member was created. */
  createdAt: Scalars['DateTime'];
  /** The email address of the member. */
  email: Scalars['String'];
  /** The given name of the member. */
  firstName: Scalars['String'];
  /** The ID of the member. */
  id: Scalars['ID'];
  /** The family name of the member. */
  lastName: Scalars['String'];
  /** The member role */
  role: RoleLevel;
  /** The last time at which the member was updated. */
  updatedAt: Scalars['DateTime'];
};

export type OrganizationMemberCountableConnection = {
  __typename?: 'OrganizationMemberCountableConnection';
  edges: Array<OrganizationMemberCountableEdge>;
  nodes: Array<OrganizationMember>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type OrganizationMemberCountableEdge = {
  __typename?: 'OrganizationMemberCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: OrganizationMember;
};

/**
 * Deletes a member from an organization.
 *
 * Requires one of the following permissions: ORGANIZATION_ADMIN_ACCESS.
 */
export type OrganizationMemberLeave = {
  __typename?: 'OrganizationMemberLeave';
  errors: Array<OrganizationError>;
  organizationErrors: Array<OrganizationError>;
  organizationMembership?: Maybe<OrganizationMember>;
};

/**
 * Updates an organization member.
 *
 * Requires one of the following permissions: ORGANIZATION_ADMIN_ACCESS.
 */
export type OrganizationMemberUpdate = {
  __typename?: 'OrganizationMemberUpdate';
  errors: Array<OrganizationError>;
  organizationErrors: Array<OrganizationError>;
  organizationMembership?: Maybe<OrganizationMember>;
};

export type OrganizationMemberUpdateInput = {
  /** What member role to grant. */
  role?: InputMaybe<RoleLevel>;
};

/**
 * Updates an organization.
 *
 * Requires one of the following permissions: ORGANIZATION_ADMIN_ACCESS.
 */
export type OrganizationUpdate = {
  __typename?: 'OrganizationUpdate';
  errors: Array<OrganizationError>;
  organization?: Maybe<Organization>;
  organizationErrors: Array<OrganizationError>;
};

export type OrganizationUpdateInput = {
  /** The name of the organization. */
  name?: InputMaybe<Scalars['String']>;
  /** The slug of the organization. */
  slug?: InputMaybe<Scalars['String']>;
  /** The timezone of the organization, passed in by client. */
  timezone?: InputMaybe<Scalars['String']>;
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

/** Represents a person. */
export type Person = Node & {
  __typename?: 'Person';
  /** The person's attributes */
  attributes?: Maybe<Scalars['JSONString']>;
  /** The time the person was created */
  createdAt?: Maybe<Scalars['DateTime']>;
  /** The person's distinct ids */
  distinctIds?: Maybe<Array<Scalars['String']>>;
  /** The ID of the event property. */
  id: Scalars['ID'];
  /** Whether the person has been identified */
  isIdentified: Scalars['Boolean'];
  /**
   * The project the person belongs to
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  project: Project;
  /** The person's uuid */
  uuid: Scalars['UUID'];
};

export type PersonCountableConnection = {
  __typename?: 'PersonCountableConnection';
  edges: Array<PersonCountableEdge>;
  nodes: Array<Person>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type PersonCountableEdge = {
  __typename?: 'PersonCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Person;
};

/** Represents a project. */
export type Project = Node & {
  __typename?: 'Project';
  /** Whether the project is private or not. */
  accessControl?: Maybe<Scalars['Boolean']>;
  /** API token for project. */
  apiToken: Scalars['String'];
  /** The data required for the onboarding process */
  hasCompletedOnboardingFor?: Maybe<Scalars['JSONString']>;
  /** The ID of the project. */
  id: Scalars['ID'];
  /** Name of the project. */
  name: Scalars['String'];
  /** Organization the project belongs to. */
  organization: Organization;
  /** Slug of the project. */
  slug: Scalars['String'];
  /** The timezone of the project. */
  timezone: Scalars['String'];
};

export type ProjectCountableConnection = {
  __typename?: 'ProjectCountableConnection';
  edges: Array<ProjectCountableEdge>;
  nodes: Array<Project>;
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
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export enum ProjectErrorCode {
  AlreadyExists = 'ALREADY_EXISTS',
  GraphqlError = 'GRAPHQL_ERROR',
  Invalid = 'INVALID',
  InvalidPermission = 'INVALID_PERMISSION',
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

/** Represents a theme. */
export type ProjectTheme = Node & {
  __typename?: 'ProjectTheme';
  /** The settings of the theme. */
  colorScheme?: Maybe<Scalars['JSONString']>;
  /** The time at which the invite was created. */
  createdAt: Scalars['DateTime'];
  /**
   * The user who created the theme.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  creator: User;
  /** The ID of the theme. */
  id: Scalars['ID'];
  /** Name of the theme. */
  name: Scalars['String'];
  /**
   * The project the theme belongs to.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  project: Project;
  /** For internal purpose. */
  reference?: Maybe<Scalars['ID']>;
  /** The settings of the theme. */
  settings?: Maybe<Scalars['JSONString']>;
  /** The last time at which the invite was updated. */
  updatedAt: Scalars['DateTime'];
};

export type ProjectThemeCountableConnection = {
  __typename?: 'ProjectThemeCountableConnection';
  edges: Array<ProjectThemeCountableEdge>;
  nodes: Array<ProjectTheme>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type ProjectThemeCountableEdge = {
  __typename?: 'ProjectThemeCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: ProjectTheme;
};

/**
 * Creates a new theme
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type ProjectThemeCreate = {
  __typename?: 'ProjectThemeCreate';
  errors: Array<ProjectError>;
  projectErrors: Array<ProjectError>;
  projectTheme?: Maybe<ProjectTheme>;
};

export type ProjectThemeCreateInput = {
  /** The color scheme of the theme. */
  colorScheme?: InputMaybe<Scalars['JSONString']>;
  /** The id of the theme. */
  id?: InputMaybe<Scalars['UUID']>;
  /** The name of the theme. */
  name: Scalars['String'];
};

/**
 * Deletes a theme.
 *
 * Requires one of the following permissions: PROJECT_ADMIN_ACCESS.
 */
export type ProjectThemeDelete = {
  __typename?: 'ProjectThemeDelete';
  errors: Array<ProjectError>;
  projectErrors: Array<ProjectError>;
  projectTheme?: Maybe<ProjectTheme>;
};

/**
 * Updates an existing theme
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type ProjectThemeUpdate = {
  __typename?: 'ProjectThemeUpdate';
  errors: Array<ProjectError>;
  projectErrors: Array<ProjectError>;
  projectTheme?: Maybe<ProjectTheme>;
};

export type ProjectThemeUpdateInput = {
  /** The color scheme of the theme. */
  colorScheme?: InputMaybe<Scalars['JSONString']>;
  /** The name of the theme. */
  name?: InputMaybe<Scalars['String']>;
};

/**
 * Updates a project token.
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type ProjectTokenReset = {
  __typename?: 'ProjectTokenReset';
  errors: Array<ProjectError>;
  /** The project the token belongs to */
  project: Project;
  projectErrors: Array<ProjectError>;
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

/** Represents a property definition. */
export type PropertyDefinition = Node & {
  __typename?: 'PropertyDefinition';
  /** The ID of the event property. */
  id: Scalars['ID'];
  /** Whether property accepts a numerical value */
  isNumerical: Scalars['Boolean'];
  /** The name of the property definition */
  name: Scalars['String'];
  /**
   * The project the person belongs to
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  project: Project;
  /** The property type */
  propertyType: PropertyTypeEnum;
  /** The type of the property definition */
  type: PropertyDefinitionTypeEnum;
};

export type PropertyDefinitionCountableConnection = {
  __typename?: 'PropertyDefinitionCountableConnection';
  edges: Array<PropertyDefinitionCountableEdge>;
  nodes: Array<PropertyDefinition>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type PropertyDefinitionCountableEdge = {
  __typename?: 'PropertyDefinitionCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: PropertyDefinition;
};

export enum PropertyDefinitionTypeEnum {
  Event = 'EVENT',
  Group = 'GROUP',
  Person = 'PERSON'
}

export enum PropertyTypeEnum {
  Boolean = 'Boolean',
  Datetime = 'Datetime',
  Numeric = 'Numeric',
  String = 'String'
}

export type Query = {
  __typename?: 'Query';
  _entities?: Maybe<Array<Maybe<_Entity>>>;
  _service?: Maybe<_Service>;
  /**
   * List of the project's surveys.
   *
   * Requires one of the following permissions: AUTHENTICATED_API.
   */
  activeSurveys?: Maybe<BaseSurveyCountableConnection>;
  /**
   * List of channels for a specific survey.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  channels?: Maybe<SurveyChannelCountableConnection>;
  /**
   * List of event's definitions.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  eventDefinitions?: Maybe<EventDefinitionCountableConnection>;
  /**
   * List of event's properties.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  eventProperties?: Maybe<EventPropertyCountableConnection>;
  /**
   * List of triggered events.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  events?: Maybe<EventCountableConnection>;
  /** One specific organization invite. */
  organizationInviteDetails?: Maybe<InviteDetails>;
  /**
   * The current organization invite link.
   *
   * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
   */
  organizationInviteLink?: Maybe<OrganizationInviteLink>;
  /**
   * List of persons.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  persons?: Maybe<PersonCountableConnection>;
  /**
   * List of event's properties.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  propertiesWithDefinitions?: Maybe<Array<EventPropertyWithDefinition>>;
  /**
   * List of the property definitions.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  propertyDefinitions?: Maybe<PropertyDefinitionCountableConnection>;
  /**
   * List of questions for a specific survey.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  questions?: Maybe<SurveyQuestionCountableConnection>;
  /**
   * Response insight for a survey.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  responseMetric?: Maybe<SurveyResponseMetric>;
  /**
   * List of the survey's responses.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  responses?: Maybe<SurveyResponseCountableConnection>;
  /**
   * Look up a survey by ID or slug.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS, AUTHENTICATED_API.
   */
  survey?: Maybe<Survey>;
  /** Look up a survey by channel ID or link. */
  surveyByChannel?: Maybe<BaseSurvey>;
  /**
   * List of the project's surveys.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  surveys?: Maybe<SurveyCountableConnection>;
  /**
   * List of the project's themes.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  themes?: Maybe<ProjectThemeCountableConnection>;
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


export type QueryActiveSurveysArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<SurveyFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<SurveySortingInput>;
};


export type QueryChannelsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryEventDefinitionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryEventPropertiesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  event?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryEventsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<EventFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryOrganizationInviteDetailsArgs = {
  inviteLink: Scalars['String'];
};


export type QueryPersonsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryPropertiesWithDefinitionsArgs = {
  event?: InputMaybe<Scalars['String']>;
};


export type QueryPropertyDefinitionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  definitionType?: InputMaybe<PropertyDefinitionTypeEnum>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryQuestionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryResponseMetricArgs = {
  date?: InputMaybe<DateRangeInput>;
  id: Scalars['ID'];
  metric: SurveyResponseMetricEnum;
  previousDate?: InputMaybe<DateRangeInput>;
};


export type QueryResponsesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<SurveyResponseFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<SurveyResponseSortingInput>;
};


export type QuerySurveyArgs = {
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};


export type QuerySurveyByChannelArgs = {
  id?: InputMaybe<Scalars['ID']>;
  link?: InputMaybe<Scalars['String']>;
};


export type QuerySurveysArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<SurveyFilterInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sortBy?: InputMaybe<SurveySortingInput>;
};


export type QueryThemesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
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
  Member = 'MEMBER',
  Owner = 'OWNER'
}

/** Represents a survey. */
export type Survey = Node & {
  __typename?: 'Survey';
  /**
   * The distribution channels supported by the survey
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  channels: SurveyChannelCountableConnection;
  /** The time at which the survey was created. */
  createdAt: Scalars['DateTime'];
  /**
   * The user who created the theme.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  creator: User;
  /** The ID of the survey. */
  id: Scalars['ID'];
  /** Name of the survey. */
  name?: Maybe<Scalars['String']>;
  /**
   * The project the survey belongs to
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  project?: Maybe<Project>;
  /**
   * The questions in the the survey
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  questions: SurveyQuestionCountableConnection;
  /** For internal purpose. */
  reference?: Maybe<Scalars['ID']>;
  /** The settings of the survey. */
  settings?: Maybe<Scalars['JSONString']>;
  /** Slug of the survey. */
  slug: Scalars['String'];
  /** The statistics of the survey. */
  stats?: Maybe<Scalars['JSONString']>;
  /** The status of the survey */
  status: SurveyStatusEnum;
  /**
   * The theme of the survey.
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  theme?: Maybe<ProjectTheme>;
  /** The type of the survey */
  type: SurveyTypeEnum;
  /** The last time at which the survey was updated. */
  updatedAt: Scalars['DateTime'];
};


/** Represents a survey. */
export type SurveyChannelsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


/** Represents a survey. */
export type SurveyQuestionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

/** Represents a survey channel. */
export type SurveyChannel = Node & {
  __typename?: 'SurveyChannel';
  /** The settings of the question. */
  conditions?: Maybe<Scalars['JSONString']>;
  /** The time at which the channel was created. */
  createdAt: Scalars['DateTime'];
  /** The ID of the channel. */
  id: Scalars['ID'];
  /** Unique link to the channel. */
  link: Scalars['String'];
  /** For internal purpose. */
  reference?: Maybe<Scalars['ID']>;
  /** The settings of the question. */
  settings?: Maybe<Scalars['JSONString']>;
  /**
   * The project the survey belongs to
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  survey?: Maybe<Survey>;
  /** The options of the question. */
  triggers?: Maybe<Scalars['JSONString']>;
  /** The type of the survey channel */
  type: SurveyChannelTypeEnum;
};

export type SurveyChannelCountableConnection = {
  __typename?: 'SurveyChannelCountableConnection';
  edges: Array<SurveyChannelCountableEdge>;
  nodes: Array<SurveyChannel>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type SurveyChannelCountableEdge = {
  __typename?: 'SurveyChannelCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: SurveyChannel;
};

/**
 * Creates a new distibution channel
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type SurveyChannelCreate = {
  __typename?: 'SurveyChannelCreate';
  errors: Array<SurveyError>;
  /** The checkout with the added gift card or voucher. */
  surveyChannel?: Maybe<SurveyChannel>;
  surveyErrors: Array<SurveyError>;
};

export type SurveyChannelCreateInput = {
  /** The conditions for the channel. */
  conditions?: InputMaybe<Scalars['JSONString']>;
  /** The id of the channel. */
  id?: InputMaybe<Scalars['UUID']>;
  /** The settings of the channel. */
  settings?: InputMaybe<Scalars['JSONString']>;
  /** The survey ID the channel belongs to. */
  surveyId: Scalars['ID'];
  /** The triggers for the channel. */
  triggers?: InputMaybe<Scalars['JSONString']>;
  /** The type of the distribution channel */
  type?: InputMaybe<SurveyChannelTypeEnum>;
};

/**
 * Deletes a channel.
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type SurveyChannelDelete = {
  __typename?: 'SurveyChannelDelete';
  errors: Array<SurveyError>;
  surveyChannel?: Maybe<SurveyChannel>;
  surveyErrors: Array<SurveyError>;
};

export enum SurveyChannelTypeEnum {
  Api = 'API',
  Custom = 'CUSTOM',
  Email = 'EMAIL',
  Link = 'LINK',
  MobileSdk = 'MOBILE_SDK',
  WebSdk = 'WEB_SDK'
}

/**
 * Updates a channel
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type SurveyChannelUpdate = {
  __typename?: 'SurveyChannelUpdate';
  errors: Array<SurveyError>;
  surveyChannel?: Maybe<SurveyChannel>;
  surveyErrors: Array<SurveyError>;
};

export type SurveyChannelUpdateInput = {
  /** The conditions for the channel. */
  conditions?: InputMaybe<Scalars['JSONString']>;
  /** The settings of the channel. */
  settings?: InputMaybe<Scalars['JSONString']>;
  /** The triggers for the channel. */
  triggers?: InputMaybe<Scalars['JSONString']>;
  /** The type of the distribution channel */
  type?: InputMaybe<SurveyChannelTypeEnum>;
};

export type SurveyCountableConnection = {
  __typename?: 'SurveyCountableConnection';
  edges: Array<SurveyCountableEdge>;
  nodes: Array<Survey>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type SurveyCountableEdge = {
  __typename?: 'SurveyCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Survey;
};

/**
 * Creates a new survey
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type SurveyCreate = {
  __typename?: 'SurveyCreate';
  errors: Array<SurveyError>;
  survey?: Maybe<Survey>;
  surveyErrors: Array<SurveyError>;
};

export type SurveyCreateInput = {
  /** The id of the survey. */
  id?: InputMaybe<Scalars['UUID']>;
  /** The name of the survey. */
  name?: InputMaybe<Scalars['String']>;
  /** The settings of the survey. */
  settings?: InputMaybe<Scalars['JSONString']>;
  /** The slug of the survey. */
  slug?: InputMaybe<Scalars['String']>;
  /** The status of the survey */
  status?: InputMaybe<SurveyStatusEnum>;
  /** The theme of the survey. */
  themeId?: InputMaybe<Scalars['ID']>;
  /** The type of the survey */
  type?: InputMaybe<SurveyTypeEnum>;
};

/**
 * Deletes a survey.
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type SurveyDelete = {
  __typename?: 'SurveyDelete';
  errors: Array<SurveyError>;
  survey?: Maybe<Survey>;
  surveyErrors: Array<SurveyError>;
};

/** Represents errors in survey mutations. */
export type SurveyError = {
  __typename?: 'SurveyError';
  /** The error code. */
  code: SurveyErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
  field?: Maybe<Scalars['String']>;
  /** The error message. */
  message?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export enum SurveyErrorCode {
  GraphqlError = 'GRAPHQL_ERROR',
  Inactive = 'INACTIVE',
  Invalid = 'INVALID',
  NotFound = 'NOT_FOUND',
  Required = 'REQUIRED',
  Unique = 'UNIQUE'
}

export type SurveyFilterInput = {
  createdAt?: InputMaybe<DateRangeInput>;
  endDate?: InputMaybe<DateTimeRangeInput>;
  /** Filter by ids. */
  ids?: InputMaybe<Array<Scalars['ID']>>;
  search?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<DateRangeInput>;
  status?: InputMaybe<SurveyStatusEnum>;
  /** Filter by type */
  type?: InputMaybe<SurveyTypeEnum>;
  updatedAt?: InputMaybe<DateTimeRangeInput>;
};

/** Represents a question. */
export type SurveyQuestion = Node & {
  __typename?: 'SurveyQuestion';
  /** The time at which the question was created. */
  createdAt: Scalars['DateTime'];
  /** Description of the question. */
  description: Scalars['String'];
  /** The ID of the question. */
  id: Scalars['ID'];
  /** Label of the question. */
  label: Scalars['String'];
  /** The position of the question. */
  maxPath: Scalars['Int'];
  /** The options of the question. */
  options?: Maybe<Scalars['JSONString']>;
  /** The position of the question. */
  orderNumber: Scalars['Int'];
  /** For internal purpose. */
  reference?: Maybe<Scalars['ID']>;
  /** The settings of the question. */
  settings?: Maybe<Scalars['JSONString']>;
  /**
   * The project the survey belongs to
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  survey?: Maybe<Survey>;
  /** The type of the question */
  type: SurveyQuestionTypeEnum;
};

export type SurveyQuestionCountableConnection = {
  __typename?: 'SurveyQuestionCountableConnection';
  edges: Array<SurveyQuestionCountableEdge>;
  nodes: Array<SurveyQuestion>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type SurveyQuestionCountableEdge = {
  __typename?: 'SurveyQuestionCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: SurveyQuestion;
};

/**
 * Creates a new question
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type SurveyQuestionCreate = {
  __typename?: 'SurveyQuestionCreate';
  errors: Array<SurveyError>;
  surveyErrors: Array<SurveyError>;
  surveyQuestion?: Maybe<SurveyQuestion>;
};

export type SurveyQuestionCreateInput = {
  /** The description of the question. */
  description?: InputMaybe<Scalars['String']>;
  /** The id of the question. */
  id?: InputMaybe<Scalars['UUID']>;
  /** The label of the question. */
  label?: InputMaybe<Scalars['String']>;
  /** The options of the question. */
  options?: InputMaybe<Scalars['JSONString']>;
  /** The settings of the question. */
  orderNumber: Scalars['Int'];
  /** The settings of the question. */
  settings?: InputMaybe<Scalars['JSONString']>;
  /** The survey ID the question belongs to. */
  surveyId: Scalars['ID'];
  /** The type of the question */
  type?: InputMaybe<SurveyQuestionTypeEnum>;
};

/**
 * Deletes a question.
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type SurveyQuestionDelete = {
  __typename?: 'SurveyQuestionDelete';
  errors: Array<SurveyError>;
  surveyErrors: Array<SurveyError>;
  surveyQuestion?: Maybe<SurveyQuestion>;
};

export enum SurveyQuestionTypeEnum {
  Boolean = 'BOOLEAN',
  Ces = 'CES',
  Csat = 'CSAT',
  Cta = 'CTA',
  Custom = 'CUSTOM',
  Date = 'DATE',
  Dropdown = 'DROPDOWN',
  Form = 'FORM',
  Integration = 'INTEGRATION',
  Multiple = 'MULTIPLE',
  Nps = 'NPS',
  NumericalScale = 'NUMERICAL_SCALE',
  Rating = 'RATING',
  Single = 'SINGLE',
  SmileyScale = 'SMILEY_SCALE',
  Text = 'TEXT'
}

/**
 * Updates a question
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type SurveyQuestionUpdate = {
  __typename?: 'SurveyQuestionUpdate';
  errors: Array<SurveyError>;
  surveyErrors: Array<SurveyError>;
  surveyQuestion?: Maybe<SurveyQuestion>;
};

export type SurveyQuestionUpdateInput = {
  /** The description of the question. */
  description?: InputMaybe<Scalars['String']>;
  /** The label of the question. */
  label?: InputMaybe<Scalars['String']>;
  /** The options of the question. */
  options?: InputMaybe<Scalars['JSONString']>;
  /** The settings of the question. */
  orderNumber?: InputMaybe<Scalars['Int']>;
  /** The settings of the question. */
  settings?: InputMaybe<Scalars['JSONString']>;
  /** The type of the question */
  type?: InputMaybe<SurveyQuestionTypeEnum>;
};

/** Represents a survey response. */
export type SurveyResponse = Node & {
  __typename?: 'SurveyResponse';
  /** The time the survey completed. */
  completedAt?: Maybe<Scalars['DateTime']>;
  /** The time at which the response was created. */
  createdAt: Scalars['DateTime'];
  /** The ID of the response. */
  id: Scalars['ID'];
  /** The response. */
  response: Scalars['JSONString'];
  /** The statistics of the response. */
  stats?: Maybe<Scalars['JSONString']>;
  /** The status of the survey response */
  status: SurveyResponseStatusEnum;
  /**
   * The survey the response belongs to
   *
   * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
   */
  survey?: Maybe<Survey>;
  /** The time spent to complete the survey. */
  timeSpent?: Maybe<Scalars['Float']>;
  /** The title of the response. */
  title: Scalars['String'];
  /** The last time at which the response was updated. */
  updatedAt: Scalars['DateTime'];
  /** The user attributes. */
  userAttributes?: Maybe<Scalars['JSONString']>;
};

export type SurveyResponseCountableConnection = {
  __typename?: 'SurveyResponseCountableConnection';
  edges: Array<SurveyResponseCountableEdge>;
  nodes: Array<SurveyResponse>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  /** A total count of items in the collection. */
  totalCount?: Maybe<Scalars['Int']>;
};

export type SurveyResponseCountableEdge = {
  __typename?: 'SurveyResponseCountableEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: SurveyResponse;
};

/** Creates a response to survey. */
export type SurveyResponseCreate = {
  __typename?: 'SurveyResponseCreate';
  errors: Array<SurveyError>;
  /** The ID of the response. */
  responseId?: Maybe<Scalars['ID']>;
  /** Whether the operation was successful. */
  status?: Maybe<Scalars['Boolean']>;
  surveyErrors: Array<SurveyError>;
};

export type SurveyResponseCreateInput = {
  /** The user attributes. */
  attributes?: InputMaybe<Scalars['JSONString']>;
  /** The channel of the response. */
  channel?: InputMaybe<Scalars['JSONString']>;
  /** Whether the response is completed. */
  completed?: InputMaybe<Scalars['Boolean']>;
  /** The time the survey completed. */
  completedAt?: InputMaybe<Scalars['DateTime']>;
  /** The event ID. */
  event?: InputMaybe<Scalars['UUID']>;
  /** The ID of the response. */
  id?: InputMaybe<Scalars['UUID']>;
  /** The response metadata. */
  metadata?: InputMaybe<Scalars['JSONString']>;
  /** The partial response for the survey. */
  response?: InputMaybe<Scalars['JSONString']>;
  /** The time the survey started. */
  startedAt?: InputMaybe<Scalars['DateTime']>;
  /** The survey ID the response belongs to. */
  surveyId: Scalars['ID'];
  /** The user distinct ID. */
  userId?: InputMaybe<Scalars['ID']>;
};

export type SurveyResponseFilterInput = {
  createdAt?: InputMaybe<DateRangeInput>;
  /** Filter by ids. */
  ids?: InputMaybe<Array<Scalars['ID']>>;
  status?: InputMaybe<SurveyResponseStatusEnum>;
};

/** Represents a survey response metric (e.g. total responses, nps). */
export type SurveyResponseMetric = {
  __typename?: 'SurveyResponseMetric';
  /** The current value. */
  current?: Maybe<Scalars['JSONString']>;
  /** The previous value. */
  previous?: Maybe<Scalars['JSONString']>;
};

export enum SurveyResponseMetricEnum {
  AverageTime = 'AVERAGE_TIME',
  Ces = 'CES',
  CompletionRate = 'COMPLETION_RATE',
  Csat = 'CSAT',
  Nps = 'NPS',
  TotalResponses = 'TOTAL_RESPONSES'
}

export enum SurveyResponseSortField {
  /** Sort responses by completed at. */
  CompletedAt = 'COMPLETED_AT',
  /** Sort responses by created at. */
  CreatedAt = 'CREATED_AT',
  /** Sort responses by last modified at. */
  LastModifiedAt = 'LAST_MODIFIED_AT',
  /** Sort responses by status. */
  Status = 'STATUS',
  /** Sort responses by time spent. */
  TimeSpent = 'TIME_SPENT'
}

export type SurveyResponseSortingInput = {
  /** Specifies the direction in which to sort responses. */
  direction: OrderDirection;
  /** Sort responses by the selected field. */
  field: SurveyResponseSortField;
};

export enum SurveyResponseStatusEnum {
  Archived = 'ARCHIVED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS'
}

/** Updates a response. */
export type SurveyResponseUpdate = {
  __typename?: 'SurveyResponseUpdate';
  errors: Array<SurveyError>;
  /** Whether the operation was successful. */
  status?: Maybe<Scalars['Boolean']>;
  surveyErrors: Array<SurveyError>;
};

export type SurveyResponseUpdateInput = {
  /** The user attributes. */
  attributes?: InputMaybe<Scalars['JSONString']>;
  /** The channel of the response. */
  channel?: InputMaybe<Scalars['JSONString']>;
  /** Whether the response is completed. */
  completed?: InputMaybe<Scalars['Boolean']>;
  /** The time the survey completed. */
  completedAt?: InputMaybe<Scalars['DateTime']>;
  /** The event ID. */
  event?: InputMaybe<Scalars['UUID']>;
  /** The response metadata. */
  metadata?: InputMaybe<Scalars['JSONString']>;
  /** The partial response for the survey. */
  response?: InputMaybe<Scalars['JSONString']>;
  /** The time the survey started. */
  startedAt?: InputMaybe<Scalars['DateTime']>;
  /** The user distinct ID. */
  userId?: InputMaybe<Scalars['ID']>;
};

export enum SurveySortField {
  /** Sort surveys by created at. */
  CreatedAt = 'CREATED_AT',
  /** Sort surveys by last modified at. */
  LastModifiedAt = 'LAST_MODIFIED_AT',
  /** Sort surveys by name. */
  Name = 'NAME',
  /** Sort surveys by status. */
  Status = 'STATUS',
  /** Sort surveys by type. */
  Type = 'TYPE'
}

export type SurveySortingInput = {
  /** Specifies the direction in which to sort surveys. */
  direction: OrderDirection;
  /** Sort surveys by the selected field. */
  field: SurveySortField;
};

export enum SurveyStatusEnum {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED',
  Completed = 'COMPLETED',
  Draft = 'DRAFT',
  InProgress = 'IN_PROGRESS',
  Paused = 'PAUSED'
}

export enum SurveyTypeEnum {
  Custom = 'CUSTOM',
  Poll = 'POLL',
  Quiz = 'QUIZ',
  Survey = 'SURVEY'
}

/**
 * Updates a survey
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type SurveyUpdate = {
  __typename?: 'SurveyUpdate';
  errors: Array<SurveyError>;
  survey?: Maybe<Survey>;
  surveyErrors: Array<SurveyError>;
};

export type SurveyUpdateInput = {
  /** The name of the survey. */
  name?: InputMaybe<Scalars['String']>;
  /** The settings of the survey. */
  settings?: InputMaybe<Scalars['JSONString']>;
  /** The slug of the survey. */
  slug?: InputMaybe<Scalars['String']>;
  /** The status of the survey */
  status?: InputMaybe<SurveyStatusEnum>;
  /** The theme of the survey. */
  themeId?: InputMaybe<Scalars['ID']>;
  /** The type of the survey */
  type?: InputMaybe<SurveyTypeEnum>;
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
  /** Determine if the user has finished onboarding. */
  isOnboarded: Scalars['Boolean'];
  /** Determine if the user is a staff admin. */
  isStaff: Scalars['Boolean'];
  /** The family name of the user. */
  lastName: Scalars['String'];
  /**
   * The current organization of the user.
   *
   * Requires one of the following permissions: AUTHENTICATED_USER.
   */
  organization?: Maybe<Organization>;
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
  sortBy?: InputMaybe<ProjectSortingInput>;
};

/** Represents errors in user mutations. */
export type UserError = {
  __typename?: 'UserError';
  /** The error code. */
  code: UserErrorCode;
  /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
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

export type UserInput = {
  /** The avatar of the user. */
  avatar?: InputMaybe<Scalars['String']>;
  /** The given name of the user. */
  firstName?: InputMaybe<Scalars['String']>;
  /** Determine if the user has finished onboarding. */
  isOnboarded?: InputMaybe<Scalars['Boolean']>;
  /** The family name of the user. */
  lastName?: InputMaybe<Scalars['String']>;
};

/**
 * Updates a user.
 *
 * Requires one of the following permissions: AUTHENTICATED_USER.
 */
export type UserUpdate = {
  __typename?: 'UserUpdate';
  errors: Array<UserError>;
  user?: Maybe<User>;
  userErrors: Array<UserError>;
};

/** _Entity union as defined by Federation spec. */
export type _Entity = AuthUser | User;

/** _Service manifest as defined by Federation spec. */
export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']>;
};

export type PersonFragmentFragment = { __typename?: 'Person', id: string, uuid: any, attributes?: any | null, distinctIds?: Array<string> | null, isIdentified: boolean, createdAt?: string | null, project: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } };

export type GetPersonsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type GetPersonsQuery = { __typename?: 'Query', persons?: { __typename?: 'PersonCountableConnection', totalCount?: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'PersonCountableEdge', node: { __typename?: 'Person', id: string, uuid: any, attributes?: any | null, distinctIds?: Array<string> | null, isIdentified: boolean, createdAt?: string | null, project: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } } }> } | null };

export type AuthUserFragmentFragment = { __typename?: 'AuthUser', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean, isOnboarded: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } | null };

export type AuthOrganizationFragmentFragment = { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number };

export type UserErrorFragmentFragment = { __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode };

export type GoogleUserAuthFragmentFragment = { __typename?: 'GoogleUserAuth', token?: string | null, refreshToken?: string | null, csrfToken?: string | null, user?: { __typename?: 'AuthUser', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean, isOnboarded: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } | null } | null, userErrors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> };

export type EmailTokenUserAuthFragmentFragment = { __typename?: 'EmailTokenUserAuth', token?: string | null, refreshToken?: string | null, csrfToken?: string | null, user?: { __typename?: 'AuthUser', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean, isOnboarded: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } | null } | null, userErrors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> };

export type UserFragmentFragment = { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean, isOnboarded: boolean, organization?: { __typename?: 'Organization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } | null, organizations?: { __typename?: 'OrganizationCountableConnection', edges: Array<{ __typename?: 'OrganizationCountableEdge', node: { __typename?: 'Organization', id: string, slug: string, name: string, memberCount: number, billingUsage?: any | null, invites?: { __typename?: 'OrganizationInviteCountableConnection', edges: Array<{ __typename?: 'OrganizationInviteCountableEdge', node: { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel } }> } | null, members?: { __typename?: 'OrganizationMemberCountableConnection', edges: Array<{ __typename?: 'OrganizationMemberCountableEdge', node: { __typename?: 'OrganizationMember', id: string, email: string, firstName: string, lastName: string, role: RoleLevel } }> } | null, projects?: { __typename?: 'ProjectCountableConnection', edges: Array<{ __typename?: 'ProjectCountableEdge', node: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } }> } | null } }> } | null };

export type EmailTokenUserAuthMutationVariables = Exact<{
  email: Scalars['String'];
  token: Scalars['String'];
  inviteLink?: InputMaybe<Scalars['String']>;
}>;


export type EmailTokenUserAuthMutation = { __typename?: 'Mutation', emailTokenUserAuth?: { __typename?: 'EmailTokenUserAuth', token?: string | null, refreshToken?: string | null, csrfToken?: string | null, user?: { __typename?: 'AuthUser', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean, isOnboarded: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } | null } | null, userErrors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> } | null };

export type EmailUserAuthChallengeMutationVariables = Exact<{
  email: Scalars['String'];
  inviteLink?: InputMaybe<Scalars['String']>;
}>;


export type EmailUserAuthChallengeMutation = { __typename?: 'Mutation', emailUserAuthChallenge?: { __typename?: 'EmailUserAuthChallenge', success?: boolean | null, authType?: string | null, userErrors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> } | null };

export type GoogleUserAuthMutationVariables = Exact<{
  code: Scalars['String'];
  inviteLink?: InputMaybe<Scalars['String']>;
}>;


export type GoogleUserAuthMutation = { __typename?: 'Mutation', googleUserAuth?: { __typename?: 'GoogleUserAuth', token?: string | null, refreshToken?: string | null, csrfToken?: string | null, user?: { __typename?: 'AuthUser', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean, isOnboarded: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } | null } | null, userErrors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout?: { __typename?: 'Logout', userErrors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> } | null };

export type TokenRefreshMutationVariables = Exact<{
  csrfToken?: InputMaybe<Scalars['String']>;
  refreshToken?: InputMaybe<Scalars['String']>;
}>;


export type TokenRefreshMutation = { __typename?: 'Mutation', tokenRefresh?: { __typename?: 'RefreshToken', token?: string | null, errors: Array<{ __typename?: 'UserError', field?: string | null, message?: string | null, code: UserErrorCode }> } | null };

export type UserUpdateMutationVariables = Exact<{
  input: UserInput;
}>;


export type UserUpdateMutation = { __typename?: 'Mutation', userUpdate?: { __typename?: 'UserUpdate', user?: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean, isOnboarded: boolean } | null } | null };

export type ViewerQueryVariables = Exact<{ [key: string]: never; }>;


export type ViewerQuery = { __typename?: 'Query', viewer?: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean, isOnboarded: boolean, organization?: { __typename?: 'Organization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } | null, organizations?: { __typename?: 'OrganizationCountableConnection', edges: Array<{ __typename?: 'OrganizationCountableEdge', node: { __typename?: 'Organization', id: string, slug: string, name: string, memberCount: number, billingUsage?: any | null, invites?: { __typename?: 'OrganizationInviteCountableConnection', edges: Array<{ __typename?: 'OrganizationInviteCountableEdge', node: { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel } }> } | null, members?: { __typename?: 'OrganizationMemberCountableConnection', edges: Array<{ __typename?: 'OrganizationMemberCountableEdge', node: { __typename?: 'OrganizationMember', id: string, email: string, firstName: string, lastName: string, role: RoleLevel } }> } | null, projects?: { __typename?: 'ProjectCountableConnection', edges: Array<{ __typename?: 'ProjectCountableEdge', node: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } }> } | null } }> } | null } | null };

export type EventDefinitionsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type EventDefinitionsQuery = { __typename?: 'Query', eventDefinitions?: { __typename?: 'EventDefinitionCountableConnection', totalCount?: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'EventDefinitionCountableEdge', node: { __typename?: 'EventDefinition', id: string, name: string, volume: number, createdAt?: string | null, lastSeenAt?: string | null, project: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } } }> } | null };

export type EventsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<EventFilterInput>;
}>;


export type EventsQuery = { __typename?: 'Query', events?: { __typename?: 'EventCountableConnection', edges: Array<{ __typename?: 'EventCountableEdge', node: { __typename?: 'Event', id: string, event: string, distinctId: string, properties?: any | null, timestamp?: string | null, createdAt?: string | null, project: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } } }> } | null };

export type PropertyDefinitionsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
}>;


export type PropertyDefinitionsQuery = { __typename?: 'Query', propertyDefinitions?: { __typename?: 'PropertyDefinitionCountableConnection', totalCount?: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'PropertyDefinitionCountableEdge', node: { __typename?: 'PropertyDefinition', id: string, name: string, isNumerical: boolean, type: PropertyDefinitionTypeEnum, propertyType: PropertyTypeEnum, project: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } } }> } | null };

export type PropertiesWithDefinitionsQueryVariables = Exact<{
  event?: InputMaybe<Scalars['String']>;
}>;


export type PropertiesWithDefinitionsQuery = { __typename?: 'Query', propertiesWithDefinitions?: Array<{ __typename?: 'EventPropertyWithDefinition', event: string, property: string, isNumerical: boolean, propertyType: PropertyTypeEnum }> | null };

export type CompleteOnboardingStageMutationVariables = Exact<{
  input: ProjectUpdateInput;
}>;


export type CompleteOnboardingStageMutation = { __typename?: 'Mutation', projectUpdate?: { __typename?: 'ProjectUpdate', project?: { __typename: 'Project', id: string, hasCompletedOnboardingFor?: any | null } | null } | null };

export type ProjectCreateFragmentFragment = { __typename?: 'ProjectCreate', project?: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } | null, projectErrors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }>, errors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }> };

export type ProjectErrorFragmentFragment = { __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode };

export type ProjectFragmentFragment = { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } };

export type ProjectTokenResetFragmentFragment = { __typename?: 'ProjectTokenReset', project: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } }, projectErrors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }>, errors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }> };

export type ProjectUpdateFragmentFragment = { __typename?: 'ProjectUpdate', project?: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } | null, projectErrors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }>, errors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }> };

export type ProjectThemeFragmentFragment = { __typename?: 'ProjectTheme', id: string, reference?: string | null, name: string, colorScheme?: any | null, createdAt: string, updatedAt: string };

export type ProjectThemeUpdateFragmentFragment = { __typename?: 'ProjectThemeUpdate', projectTheme?: { __typename?: 'ProjectTheme', id: string, reference?: string | null, name: string, colorScheme?: any | null, createdAt: string, updatedAt: string } | null, projectErrors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }>, errors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }> };

export type ProjectCreateMutationVariables = Exact<{
  input: ProjectCreateInput;
}>;


export type ProjectCreateMutation = { __typename?: 'Mutation', projectCreate?: { __typename?: 'ProjectCreate', project?: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } | null, projectErrors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }>, errors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }> } | null };

export type ProjectUpdateMutationVariables = Exact<{
  input: ProjectUpdateInput;
}>;


export type ProjectUpdateMutation = { __typename?: 'Mutation', projectUpdate?: { __typename?: 'ProjectUpdate', project?: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } | null, projectErrors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }>, errors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }> } | null };

export type ProjectTokenResetMutationVariables = Exact<{ [key: string]: never; }>;


export type ProjectTokenResetMutation = { __typename?: 'Mutation', projectTokenReset?: { __typename?: 'ProjectTokenReset', project: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } }, projectErrors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }>, errors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }> } | null };

export type ProjectThemeCreateMutationVariables = Exact<{
  input: ProjectThemeCreateInput;
}>;


export type ProjectThemeCreateMutation = { __typename?: 'Mutation', projectThemeCreate?: { __typename?: 'ProjectThemeCreate', errors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }>, projectTheme?: { __typename?: 'ProjectTheme', id: string, reference?: string | null, name: string, colorScheme?: any | null, createdAt: string, updatedAt: string } | null, projectErrors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }> } | null };

export type ProjectThemeDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ProjectThemeDeleteMutation = { __typename?: 'Mutation', projectThemeDelete?: { __typename?: 'ProjectThemeDelete', projectErrors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }>, errors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }>, projectTheme?: { __typename?: 'ProjectTheme', id: string, reference?: string | null, name: string, colorScheme?: any | null, createdAt: string, updatedAt: string } | null } | null };

export type ProjectThemeUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: ProjectThemeUpdateInput;
}>;


export type ProjectThemeUpdateMutation = { __typename?: 'Mutation', projectThemeUpdate?: { __typename?: 'ProjectThemeUpdate', projectTheme?: { __typename?: 'ProjectTheme', id: string, reference?: string | null, name: string, colorScheme?: any | null, createdAt: string, updatedAt: string } | null, projectErrors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }>, errors: Array<{ __typename?: 'ProjectError', field?: string | null, message?: string | null, code: ProjectErrorCode }> } | null };

export type ProjectEventsDataQueryVariables = Exact<{ [key: string]: never; }>;


export type ProjectEventsDataQuery = { __typename?: 'Query', eventDefinitions?: { __typename?: 'EventDefinitionCountableConnection', edges: Array<{ __typename?: 'EventDefinitionCountableEdge', node: { __typename?: 'EventDefinition', id: string, name: string, createdAt?: string | null, lastSeenAt?: string | null } }> } | null, eventProperties?: { __typename?: 'EventPropertyCountableConnection', edges: Array<{ __typename?: 'EventPropertyCountableEdge', node: { __typename?: 'EventProperty', id: string, event: string, property: string } }> } | null, propertyDefinitions?: { __typename?: 'PropertyDefinitionCountableConnection', edges: Array<{ __typename?: 'PropertyDefinitionCountableEdge', node: { __typename?: 'PropertyDefinition', id: string, name: string, isNumerical: boolean, type: PropertyDefinitionTypeEnum, propertyType: PropertyTypeEnum } }> } | null };

export type ThemesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
}>;


export type ThemesQuery = { __typename?: 'Query', themes?: { __typename?: 'ProjectThemeCountableConnection', totalCount?: number | null, edges: Array<{ __typename?: 'ProjectThemeCountableEdge', node: { __typename?: 'ProjectTheme', id: string, reference?: string | null, name: string, colorScheme?: any | null, createdAt: string, updatedAt: string } }> } | null };

export type SurveyQuestionFragmentFragment = { __typename?: 'SurveyQuestion', id: string, reference?: string | null, label: string, description: string, type: SurveyQuestionTypeEnum, options?: any | null, settings?: any | null, orderNumber: number, maxPath: number, createdAt: string, survey?: { __typename?: 'Survey', id: string, reference?: string | null, slug: string, name?: string | null, project?: { __typename?: 'Project', id: string, slug: string, name: string } | null } | null };

export type SurveyChannelFragmentFragment = { __typename?: 'SurveyChannel', id: string, link: string, reference?: string | null, type: SurveyChannelTypeEnum, triggers?: any | null, conditions?: any | null, settings?: any | null, createdAt: string };

export type SurveyCoreFragment = { __typename?: 'Survey', id: string, slug: string, name?: string | null, status: SurveyStatusEnum, createdAt: string, updatedAt: string, reference?: string | null, stats?: any | null, creator: { __typename?: 'User', firstName: string, lastName: string, email: string } };

export type SurveyFragmentFragment = { __typename?: 'Survey', type: SurveyTypeEnum, settings?: any | null, id: string, slug: string, name?: string | null, status: SurveyStatusEnum, createdAt: string, updatedAt: string, reference?: string | null, stats?: any | null, theme?: { __typename?: 'ProjectTheme', id: string, reference?: string | null, name: string, colorScheme?: any | null, createdAt: string, updatedAt: string } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } | null, questions: { __typename?: 'SurveyQuestionCountableConnection', edges: Array<{ __typename?: 'SurveyQuestionCountableEdge', node: { __typename?: 'SurveyQuestion', id: string, reference?: string | null, label: string, description: string, type: SurveyQuestionTypeEnum, options?: any | null, settings?: any | null, orderNumber: number, maxPath: number, createdAt: string, survey?: { __typename?: 'Survey', id: string, reference?: string | null, slug: string, name?: string | null, project?: { __typename?: 'Project', id: string, slug: string, name: string } | null } | null } }> }, channels: { __typename?: 'SurveyChannelCountableConnection', edges: Array<{ __typename?: 'SurveyChannelCountableEdge', node: { __typename?: 'SurveyChannel', id: string, link: string, reference?: string | null, type: SurveyChannelTypeEnum, triggers?: any | null, conditions?: any | null, settings?: any | null, createdAt: string } }> }, creator: { __typename?: 'User', firstName: string, lastName: string, email: string } };

export type SurveyErrorFragmentFragment = { __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode };

export type SurveyResponseFragmentFragment = { __typename?: 'SurveyResponse', id: string, title: string, userAttributes?: any | null, response: any, status: SurveyResponseStatusEnum, completedAt?: string | null, createdAt: string, updatedAt: string, timeSpent?: number | null, stats?: any | null };

export type SurveyQuestionCreateMutationVariables = Exact<{
  input: SurveyQuestionCreateInput;
}>;


export type SurveyQuestionCreateMutation = { __typename?: 'Mutation', surveyQuestionCreate?: { __typename?: 'SurveyQuestionCreate', surveyErrors: Array<{ __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode }>, errors: Array<{ __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode }>, surveyQuestion?: { __typename?: 'SurveyQuestion', id: string, reference?: string | null, label: string, description: string, type: SurveyQuestionTypeEnum, options?: any | null, settings?: any | null, orderNumber: number, maxPath: number, createdAt: string, survey?: { __typename?: 'Survey', id: string, reference?: string | null, slug: string, name?: string | null, project?: { __typename?: 'Project', id: string, slug: string, name: string } | null } | null } | null } | null };

export type SurveyChannelCreateMutationVariables = Exact<{
  input: SurveyChannelCreateInput;
}>;


export type SurveyChannelCreateMutation = { __typename?: 'Mutation', surveyChannelCreate?: { __typename?: 'SurveyChannelCreate', surveyChannel?: { __typename?: 'SurveyChannel', id: string, link: string, reference?: string | null, type: SurveyChannelTypeEnum, triggers?: any | null, conditions?: any | null, settings?: any | null, createdAt: string } | null, surveyErrors: Array<{ __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode }>, errors: Array<{ __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode }> } | null };

export type SurveyChannelUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: SurveyChannelUpdateInput;
}>;


export type SurveyChannelUpdateMutation = { __typename?: 'Mutation', surveyChannelUpdate?: { __typename?: 'SurveyChannelUpdate', surveyChannel?: { __typename?: 'SurveyChannel', id: string, link: string, reference?: string | null, type: SurveyChannelTypeEnum, triggers?: any | null, conditions?: any | null, settings?: any | null, createdAt: string } | null, surveyErrors: Array<{ __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode }>, errors: Array<{ __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode }> } | null };

export type SurveyChannelDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SurveyChannelDeleteMutation = { __typename?: 'Mutation', surveyChannelDelete?: { __typename?: 'SurveyChannelDelete', surveyChannel?: { __typename?: 'SurveyChannel', id: string, link: string, reference?: string | null, type: SurveyChannelTypeEnum, triggers?: any | null, conditions?: any | null, settings?: any | null, createdAt: string } | null, surveyErrors: Array<{ __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode }>, errors: Array<{ __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode }> } | null };

export type SurveyDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SurveyDeleteMutation = { __typename?: 'Mutation', surveyDelete?: { __typename?: 'SurveyDelete', surveyErrors: Array<{ __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode }>, errors: Array<{ __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode }>, survey?: { __typename?: 'Survey', type: SurveyTypeEnum, settings?: any | null, id: string, slug: string, name?: string | null, status: SurveyStatusEnum, createdAt: string, updatedAt: string, reference?: string | null, stats?: any | null, theme?: { __typename?: 'ProjectTheme', id: string, reference?: string | null, name: string, colorScheme?: any | null, createdAt: string, updatedAt: string } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } | null, questions: { __typename?: 'SurveyQuestionCountableConnection', edges: Array<{ __typename?: 'SurveyQuestionCountableEdge', node: { __typename?: 'SurveyQuestion', id: string, reference?: string | null, label: string, description: string, type: SurveyQuestionTypeEnum, options?: any | null, settings?: any | null, orderNumber: number, maxPath: number, createdAt: string, survey?: { __typename?: 'Survey', id: string, reference?: string | null, slug: string, name?: string | null, project?: { __typename?: 'Project', id: string, slug: string, name: string } | null } | null } }> }, channels: { __typename?: 'SurveyChannelCountableConnection', edges: Array<{ __typename?: 'SurveyChannelCountableEdge', node: { __typename?: 'SurveyChannel', id: string, link: string, reference?: string | null, type: SurveyChannelTypeEnum, triggers?: any | null, conditions?: any | null, settings?: any | null, createdAt: string } }> }, creator: { __typename?: 'User', firstName: string, lastName: string, email: string } } | null } | null };

export type SurveyCreateMutationVariables = Exact<{
  input: SurveyCreateInput;
}>;


export type SurveyCreateMutation = { __typename?: 'Mutation', surveyCreate?: { __typename?: 'SurveyCreate', surveyErrors: Array<{ __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode }>, errors: Array<{ __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode }>, survey?: { __typename?: 'Survey', type: SurveyTypeEnum, settings?: any | null, id: string, slug: string, name?: string | null, status: SurveyStatusEnum, createdAt: string, updatedAt: string, reference?: string | null, stats?: any | null, theme?: { __typename?: 'ProjectTheme', id: string, reference?: string | null, name: string, colorScheme?: any | null, createdAt: string, updatedAt: string } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } | null, questions: { __typename?: 'SurveyQuestionCountableConnection', edges: Array<{ __typename?: 'SurveyQuestionCountableEdge', node: { __typename?: 'SurveyQuestion', id: string, reference?: string | null, label: string, description: string, type: SurveyQuestionTypeEnum, options?: any | null, settings?: any | null, orderNumber: number, maxPath: number, createdAt: string, survey?: { __typename?: 'Survey', id: string, reference?: string | null, slug: string, name?: string | null, project?: { __typename?: 'Project', id: string, slug: string, name: string } | null } | null } }> }, channels: { __typename?: 'SurveyChannelCountableConnection', edges: Array<{ __typename?: 'SurveyChannelCountableEdge', node: { __typename?: 'SurveyChannel', id: string, link: string, reference?: string | null, type: SurveyChannelTypeEnum, triggers?: any | null, conditions?: any | null, settings?: any | null, createdAt: string } }> }, creator: { __typename?: 'User', firstName: string, lastName: string, email: string } } | null } | null };

export type SurveyUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: SurveyUpdateInput;
}>;


export type SurveyUpdateMutation = { __typename?: 'Mutation', surveyUpdate?: { __typename?: 'SurveyUpdate', surveyErrors: Array<{ __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode }>, errors: Array<{ __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode }>, survey?: { __typename?: 'Survey', type: SurveyTypeEnum, settings?: any | null, id: string, slug: string, name?: string | null, status: SurveyStatusEnum, createdAt: string, updatedAt: string, reference?: string | null, stats?: any | null, theme?: { __typename?: 'ProjectTheme', id: string, reference?: string | null, name: string, colorScheme?: any | null, createdAt: string, updatedAt: string } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } | null, questions: { __typename?: 'SurveyQuestionCountableConnection', edges: Array<{ __typename?: 'SurveyQuestionCountableEdge', node: { __typename?: 'SurveyQuestion', id: string, reference?: string | null, label: string, description: string, type: SurveyQuestionTypeEnum, options?: any | null, settings?: any | null, orderNumber: number, maxPath: number, createdAt: string, survey?: { __typename?: 'Survey', id: string, reference?: string | null, slug: string, name?: string | null, project?: { __typename?: 'Project', id: string, slug: string, name: string } | null } | null } }> }, channels: { __typename?: 'SurveyChannelCountableConnection', edges: Array<{ __typename?: 'SurveyChannelCountableEdge', node: { __typename?: 'SurveyChannel', id: string, link: string, reference?: string | null, type: SurveyChannelTypeEnum, triggers?: any | null, conditions?: any | null, settings?: any | null, createdAt: string } }> }, creator: { __typename?: 'User', firstName: string, lastName: string, email: string } } | null } | null };

export type SurveyQuestionDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type SurveyQuestionDeleteMutation = { __typename?: 'Mutation', surveyQuestionDelete?: { __typename?: 'SurveyQuestionDelete', surveyErrors: Array<{ __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode }>, errors: Array<{ __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode }>, surveyQuestion?: { __typename?: 'SurveyQuestion', id: string, reference?: string | null, label: string, description: string, type: SurveyQuestionTypeEnum, options?: any | null, settings?: any | null, orderNumber: number, maxPath: number, createdAt: string, survey?: { __typename?: 'Survey', id: string, reference?: string | null, slug: string, name?: string | null, project?: { __typename?: 'Project', id: string, slug: string, name: string } | null } | null } | null } | null };

export type SurveyQuestionUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: SurveyQuestionUpdateInput;
}>;


export type SurveyQuestionUpdateMutation = { __typename?: 'Mutation', surveyQuestionUpdate?: { __typename?: 'SurveyQuestionUpdate', surveyErrors: Array<{ __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode }>, errors: Array<{ __typename?: 'SurveyError', field?: string | null, message?: string | null, code: SurveyErrorCode }>, surveyQuestion?: { __typename?: 'SurveyQuestion', id: string, reference?: string | null, label: string, description: string, type: SurveyQuestionTypeEnum, options?: any | null, settings?: any | null, orderNumber: number, maxPath: number, createdAt: string, survey?: { __typename?: 'Survey', id: string, reference?: string | null, slug: string, name?: string | null, project?: { __typename?: 'Project', id: string, slug: string, name: string } | null } | null } | null } | null };

export type AudiencePropertiesQueryVariables = Exact<{ [key: string]: never; }>;


export type AudiencePropertiesQuery = { __typename?: 'Query', propertyDefinitions?: { __typename?: 'PropertyDefinitionCountableConnection', edges: Array<{ __typename?: 'PropertyDefinitionCountableEdge', node: { __typename?: 'PropertyDefinition', id: string, name: string, isNumerical: boolean, type: PropertyDefinitionTypeEnum, propertyType: PropertyTypeEnum } }> } | null };

export type ChannelsQueryVariables = Exact<{
  surveyId: Scalars['ID'];
}>;


export type ChannelsQuery = { __typename?: 'Query', channels?: { __typename?: 'SurveyChannelCountableConnection', edges: Array<{ __typename?: 'SurveyChannelCountableEdge', node: { __typename?: 'SurveyChannel', id: string, link: string, reference?: string | null, type: SurveyChannelTypeEnum, triggers?: any | null, conditions?: any | null, settings?: any | null, createdAt: string } }> } | null };

export type GetQuestionsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetQuestionsQuery = { __typename?: 'Query', questions?: { __typename?: 'SurveyQuestionCountableConnection', totalCount?: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, edges: Array<{ __typename?: 'SurveyQuestionCountableEdge', node: { __typename?: 'SurveyQuestion', id: string, reference?: string | null, label: string, description: string, type: SurveyQuestionTypeEnum, options?: any | null, settings?: any | null, orderNumber: number, maxPath: number, createdAt: string, survey?: { __typename?: 'Survey', id: string, reference?: string | null, slug: string, name?: string | null, project?: { __typename?: 'Project', id: string, slug: string, name: string } | null } | null } }> } | null };

export type GetSurveyQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
}>;


export type GetSurveyQuery = { __typename?: 'Query', survey?: { __typename?: 'Survey', type: SurveyTypeEnum, settings?: any | null, id: string, slug: string, name?: string | null, status: SurveyStatusEnum, createdAt: string, updatedAt: string, reference?: string | null, stats?: any | null, theme?: { __typename?: 'ProjectTheme', id: string, reference?: string | null, name: string, colorScheme?: any | null, createdAt: string, updatedAt: string } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } | null, questions: { __typename?: 'SurveyQuestionCountableConnection', edges: Array<{ __typename?: 'SurveyQuestionCountableEdge', node: { __typename?: 'SurveyQuestion', id: string, reference?: string | null, label: string, description: string, type: SurveyQuestionTypeEnum, options?: any | null, settings?: any | null, orderNumber: number, maxPath: number, createdAt: string, survey?: { __typename?: 'Survey', id: string, reference?: string | null, slug: string, name?: string | null, project?: { __typename?: 'Project', id: string, slug: string, name: string } | null } | null } }> }, channels: { __typename?: 'SurveyChannelCountableConnection', edges: Array<{ __typename?: 'SurveyChannelCountableEdge', node: { __typename?: 'SurveyChannel', id: string, link: string, reference?: string | null, type: SurveyChannelTypeEnum, triggers?: any | null, conditions?: any | null, settings?: any | null, createdAt: string } }> }, creator: { __typename?: 'User', firstName: string, lastName: string, email: string } } | null };

export type GetSurveyListQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filter?: InputMaybe<SurveyFilterInput>;
  sortBy?: InputMaybe<SurveySortingInput>;
}>;


export type GetSurveyListQuery = { __typename?: 'Query', surveys?: { __typename?: 'SurveyCountableConnection', totalCount?: number | null, edges: Array<{ __typename?: 'SurveyCountableEdge', node: { __typename?: 'Survey', id: string, slug: string, name?: string | null, status: SurveyStatusEnum, createdAt: string, updatedAt: string, reference?: string | null, stats?: any | null, creator: { __typename?: 'User', firstName: string, lastName: string, email: string } } }>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null } } | null };

export type ResponsesQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
  filter?: InputMaybe<SurveyResponseFilterInput>;
  before?: InputMaybe<Scalars['String']>;
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
}>;


export type ResponsesQuery = { __typename?: 'Query', responses?: { __typename?: 'SurveyResponseCountableConnection', totalCount?: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null }, nodes: Array<{ __typename?: 'SurveyResponse', id: string, title: string, userAttributes?: any | null, response: any, status: SurveyResponseStatusEnum, completedAt?: string | null, createdAt: string, updatedAt: string, timeSpent?: number | null, stats?: any | null }> } | null };

export type ResponseMetricQueryVariables = Exact<{
  id: Scalars['ID'];
  date?: InputMaybe<DateRangeInput>;
  previousDate?: InputMaybe<DateRangeInput>;
  metric: SurveyResponseMetricEnum;
}>;


export type ResponseMetricQuery = { __typename?: 'Query', responseMetric?: { __typename?: 'SurveyResponseMetric', current?: any | null, previous?: any | null } | null };

export type OrganizationFragmentFragment = { __typename?: 'Organization', id: string, slug: string, name: string, memberCount: number, billingUsage?: any | null, invites?: { __typename?: 'OrganizationInviteCountableConnection', edges: Array<{ __typename?: 'OrganizationInviteCountableEdge', node: { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel } }> } | null, members?: { __typename?: 'OrganizationMemberCountableConnection', edges: Array<{ __typename?: 'OrganizationMemberCountableEdge', node: { __typename?: 'OrganizationMember', id: string, email: string, firstName: string, lastName: string, role: RoleLevel } }> } | null, projects?: { __typename?: 'ProjectCountableConnection', edges: Array<{ __typename?: 'ProjectCountableEdge', node: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } }> } | null };

export type OrganizationMembershipFragmentFragment = { __typename?: 'OrganizationMember', id: string, email: string, firstName: string, lastName: string, role: RoleLevel };

export type OrganizationCreateFragmentFragment = { __typename?: 'OrganizationCreate', organization?: { __typename?: 'Organization', id: string, slug: string, name: string, memberCount: number, billingUsage?: any | null, invites?: { __typename?: 'OrganizationInviteCountableConnection', edges: Array<{ __typename?: 'OrganizationInviteCountableEdge', node: { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel } }> } | null, members?: { __typename?: 'OrganizationMemberCountableConnection', edges: Array<{ __typename?: 'OrganizationMemberCountableEdge', node: { __typename?: 'OrganizationMember', id: string, email: string, firstName: string, lastName: string, role: RoleLevel } }> } | null, projects?: { __typename?: 'ProjectCountableConnection', edges: Array<{ __typename?: 'ProjectCountableEdge', node: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } }> } | null } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> };

export type OrganizationUpdateFragmentFragment = { __typename?: 'OrganizationUpdate', organization?: { __typename?: 'Organization', id: string, slug: string, name: string, memberCount: number, billingUsage?: any | null, invites?: { __typename?: 'OrganizationInviteCountableConnection', edges: Array<{ __typename?: 'OrganizationInviteCountableEdge', node: { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel } }> } | null, members?: { __typename?: 'OrganizationMemberCountableConnection', edges: Array<{ __typename?: 'OrganizationMemberCountableEdge', node: { __typename?: 'OrganizationMember', id: string, email: string, firstName: string, lastName: string, role: RoleLevel } }> } | null, projects?: { __typename?: 'ProjectCountableConnection', edges: Array<{ __typename?: 'ProjectCountableEdge', node: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } }> } | null } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> };

export type OrganizationErrorFragmentFragment = { __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode };

export type OrganizationInviteLinkCreateFragmentFragment = { __typename?: 'OrganizationInviteLink', inviteLink: string };

export type OrganizationInviteCreateFragmentFragment = { __typename?: 'OrganizationInviteCreate', organizationInvite?: { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel, createdAt: string, updatedAt: string, expired: boolean, inviter: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean }, organization: { __typename?: 'Organization', id: string } } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> };

export type OrganizationInviteFragmentFragment = { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel, createdAt: string, updatedAt: string, expired: boolean, inviter: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean }, organization: { __typename?: 'Organization', id: string } };

export type OrganizationInviteDetailsFragmentFragment = { __typename?: 'OrganizationInviteDetails', id: string, email: string, firstName?: string | null, expired: boolean, inviter: string, organizationId: string, organizationName: string, organizationLogo?: string | null };

export type OrganizationInviteLinkDetailsFragmentFragment = { __typename?: 'OrganizationInviteLinkDetails', id: string, organizationId: string, organizationName: string, organizationLogo?: string | null };

export type OrganizationJoinFragmentFragment = { __typename?: 'OrganizationJoin', user: { __typename?: 'AuthUser', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean, isOnboarded: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } | null }, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> };

export type RefreshOrganizationInviteLinkFragmentFragment = { __typename?: 'OrganizationInviteLinkReset', inviteLink?: string | null, success?: boolean | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> };

export type ResendOrganizationInviteLinkFragmentFragment = { __typename?: 'OrganizationInviteResend', organizationInvite?: { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel, createdAt: string, updatedAt: string, expired: boolean, inviter: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean }, organization: { __typename?: 'Organization', id: string } } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> };

export type OrganizationInviteDeleteFragmentFragment = { __typename?: 'OrganizationInviteDelete', organizationInvite?: { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel, createdAt: string, updatedAt: string, expired: boolean, inviter: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean }, organization: { __typename?: 'Organization', id: string } } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> };

export type OrganizationLeaveFragmentFragment = { __typename?: 'OrganizationLeave', organization?: { __typename?: 'Organization', id: string, slug: string, name: string, memberCount: number, billingUsage?: any | null, invites?: { __typename?: 'OrganizationInviteCountableConnection', edges: Array<{ __typename?: 'OrganizationInviteCountableEdge', node: { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel } }> } | null, members?: { __typename?: 'OrganizationMemberCountableConnection', edges: Array<{ __typename?: 'OrganizationMemberCountableEdge', node: { __typename?: 'OrganizationMember', id: string, email: string, firstName: string, lastName: string, role: RoleLevel } }> } | null, projects?: { __typename?: 'ProjectCountableConnection', edges: Array<{ __typename?: 'ProjectCountableEdge', node: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } }> } | null } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> };

export type OrganizationMemberLeaveFragmentFragment = { __typename?: 'OrganizationMemberLeave', organizationMembership?: { __typename?: 'OrganizationMember', id: string, email: string, firstName: string, lastName: string, role: RoleLevel } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> };

export type OrganizationMemberUpdateFragmentFragment = { __typename?: 'OrganizationMemberUpdate', organizationMembership?: { __typename?: 'OrganizationMember', id: string, email: string, firstName: string, lastName: string, role: RoleLevel } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> };

export type OrganizationCreateMutationVariables = Exact<{
  input: OrganizationCreateInput;
  survey?: InputMaybe<OnboardingCustomerSurvey>;
}>;


export type OrganizationCreateMutation = { __typename?: 'Mutation', organizationCreate?: { __typename?: 'OrganizationCreate', organization?: { __typename?: 'Organization', id: string, slug: string, name: string, memberCount: number, billingUsage?: any | null, invites?: { __typename?: 'OrganizationInviteCountableConnection', edges: Array<{ __typename?: 'OrganizationInviteCountableEdge', node: { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel } }> } | null, members?: { __typename?: 'OrganizationMemberCountableConnection', edges: Array<{ __typename?: 'OrganizationMemberCountableEdge', node: { __typename?: 'OrganizationMember', id: string, email: string, firstName: string, lastName: string, role: RoleLevel } }> } | null, projects?: { __typename?: 'ProjectCountableConnection', edges: Array<{ __typename?: 'ProjectCountableEdge', node: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } }> } | null } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> } | null };

export type OrganizationUpdateMutationVariables = Exact<{
  input: OrganizationUpdateInput;
}>;


export type OrganizationUpdateMutation = { __typename?: 'Mutation', organizationUpdate?: { __typename?: 'OrganizationUpdate', organization?: { __typename?: 'Organization', id: string, slug: string, name: string, memberCount: number, billingUsage?: any | null, invites?: { __typename?: 'OrganizationInviteCountableConnection', edges: Array<{ __typename?: 'OrganizationInviteCountableEdge', node: { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel } }> } | null, members?: { __typename?: 'OrganizationMemberCountableConnection', edges: Array<{ __typename?: 'OrganizationMemberCountableEdge', node: { __typename?: 'OrganizationMember', id: string, email: string, firstName: string, lastName: string, role: RoleLevel } }> } | null, projects?: { __typename?: 'ProjectCountableConnection', edges: Array<{ __typename?: 'ProjectCountableEdge', node: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } }> } | null } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> } | null };

export type OrganizationLeaveMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrganizationLeaveMutation = { __typename?: 'Mutation', organizationLeave?: { __typename?: 'OrganizationLeave', organization?: { __typename?: 'Organization', id: string, slug: string, name: string, memberCount: number, billingUsage?: any | null, invites?: { __typename?: 'OrganizationInviteCountableConnection', edges: Array<{ __typename?: 'OrganizationInviteCountableEdge', node: { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel } }> } | null, members?: { __typename?: 'OrganizationMemberCountableConnection', edges: Array<{ __typename?: 'OrganizationMemberCountableEdge', node: { __typename?: 'OrganizationMember', id: string, email: string, firstName: string, lastName: string, role: RoleLevel } }> } | null, projects?: { __typename?: 'ProjectCountableConnection', edges: Array<{ __typename?: 'ProjectCountableEdge', node: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } }> } | null } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> } | null };

export type OrganizationMemberLeaveMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrganizationMemberLeaveMutation = { __typename?: 'Mutation', organizationMemberLeave?: { __typename?: 'OrganizationMemberLeave', organizationMembership?: { __typename?: 'OrganizationMember', id: string, email: string, firstName: string, lastName: string, role: RoleLevel } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> } | null };

export type OrganizationMemberUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  input: OrganizationMemberUpdateInput;
}>;


export type OrganizationMemberUpdateMutation = { __typename?: 'Mutation', organizationMemberUpdate?: { __typename?: 'OrganizationMemberUpdate', organizationMembership?: { __typename?: 'OrganizationMember', id: string, email: string, firstName: string, lastName: string, role: RoleLevel } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> } | null };

export type OrganizationInviteCreateMutationVariables = Exact<{
  input: OrganizationInviteCreateInput;
}>;


export type OrganizationInviteCreateMutation = { __typename?: 'Mutation', organizationInviteCreate?: { __typename?: 'OrganizationInviteCreate', organizationInvite?: { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel, createdAt: string, updatedAt: string, expired: boolean, inviter: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean }, organization: { __typename?: 'Organization', id: string } } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> } | null };

export type OrganizationJoinMutationVariables = Exact<{
  input: OrganizationJoinInput;
}>;


export type OrganizationJoinMutation = { __typename?: 'Mutation', organizationJoin?: { __typename?: 'OrganizationJoin', user: { __typename?: 'AuthUser', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean, isOnboarded: boolean, organization?: { __typename?: 'AuthOrganization', id: string, slug: string, name: string, memberCount: number } | null, project?: { __typename?: 'Project', id: string, name: string, slug: string, apiToken: string, accessControl?: boolean | null, hasCompletedOnboardingFor?: any | null, timezone: string, organization: { __typename?: 'Organization', id: string, slug: string, name: string } } | null }, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> } | null };

export type OrganizationInviteResendMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrganizationInviteResendMutation = { __typename?: 'Mutation', organizationInviteResend?: { __typename?: 'OrganizationInviteResend', organizationInvite?: { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel, createdAt: string, updatedAt: string, expired: boolean, inviter: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean }, organization: { __typename?: 'Organization', id: string } } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> } | null };

export type OrganizationInviteLinkResetMutationVariables = Exact<{ [key: string]: never; }>;


export type OrganizationInviteLinkResetMutation = { __typename?: 'Mutation', organizationInviteLinkReset?: { __typename?: 'OrganizationInviteLinkReset', inviteLink?: string | null, success?: boolean | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> } | null };

export type OrganizationInviteDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrganizationInviteDeleteMutation = { __typename?: 'Mutation', organizationInviteDelete?: { __typename?: 'OrganizationInviteDelete', organizationInvite?: { __typename?: 'OrganizationInvite', id: string, email: string, firstName?: string | null, role: RoleLevel, createdAt: string, updatedAt: string, expired: boolean, inviter: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, isStaff: boolean, isActive: boolean }, organization: { __typename?: 'Organization', id: string } } | null, organizationErrors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }>, errors: Array<{ __typename?: 'OrganizationError', field?: string | null, message?: string | null, code: OrganizationErrorCode }> } | null };

export type OrganizationInviteDetailsQueryVariables = Exact<{
  inviteLink: Scalars['String'];
}>;


export type OrganizationInviteDetailsQuery = { __typename?: 'Query', organizationInviteDetails?: { __typename?: 'OrganizationInviteDetails', id: string, email: string, firstName?: string | null, expired: boolean, inviter: string, organizationId: string, organizationName: string, organizationLogo?: string | null } | { __typename?: 'OrganizationInviteLinkDetails', id: string, organizationId: string, organizationName: string, organizationLogo?: string | null } | null };

export type OrganizationInviteLinkCreateQueryVariables = Exact<{ [key: string]: never; }>;


export type OrganizationInviteLinkCreateQuery = { __typename?: 'Query', organizationInviteLink?: { __typename?: 'OrganizationInviteLink', inviteLink: string } | null };

export const ProjectFragmentFragmentDoc = gql`
    fragment ProjectFragment on Project {
  id
  name
  slug
  apiToken
  accessControl
  hasCompletedOnboardingFor
  timezone
  organization {
    id
    slug
    name
  }
}
    `;
export const PersonFragmentFragmentDoc = gql`
    fragment PersonFragment on Person {
  id
  project {
    ...ProjectFragment
  }
  uuid
  attributes
  distinctIds
  isIdentified
  createdAt
}
    ${ProjectFragmentFragmentDoc}`;
export const AuthOrganizationFragmentFragmentDoc = gql`
    fragment AuthOrganizationFragment on AuthOrganization {
  id
  slug
  name
  memberCount
}
    `;
export const AuthUserFragmentFragmentDoc = gql`
    fragment AuthUserFragment on AuthUser {
  id
  email
  firstName
  lastName
  isStaff
  isActive
  isOnboarded
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
export const OrganizationFragmentFragmentDoc = gql`
    fragment OrganizationFragment on Organization {
  id
  slug
  name
  memberCount
  invites(first: 100) {
    edges {
      node {
        id
        email
        firstName
        role
      }
    }
  }
  members(first: 100) {
    edges {
      node {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
  projects(first: 100) {
    edges {
      node {
        ...ProjectFragment
      }
    }
  }
  billingUsage
}
    ${ProjectFragmentFragmentDoc}`;
export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  id
  email
  firstName
  lastName
  isStaff
  isActive
  isOnboarded
  organization {
    id
    slug
    name
    memberCount
  }
  project {
    ...ProjectFragment
  }
  organizations(first: 50) {
    edges {
      node {
        ...OrganizationFragment
      }
    }
  }
}
    ${ProjectFragmentFragmentDoc}
${OrganizationFragmentFragmentDoc}`;
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
export const ProjectTokenResetFragmentFragmentDoc = gql`
    fragment ProjectTokenResetFragment on ProjectTokenReset {
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
export const ProjectUpdateFragmentFragmentDoc = gql`
    fragment ProjectUpdateFragment on ProjectUpdate {
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
export const ProjectThemeFragmentFragmentDoc = gql`
    fragment ProjectThemeFragment on ProjectTheme {
  id
  reference
  name
  colorScheme
  createdAt
  updatedAt
}
    `;
export const ProjectThemeUpdateFragmentFragmentDoc = gql`
    fragment ProjectThemeUpdateFragment on ProjectThemeUpdate {
  projectTheme {
    ...ProjectThemeFragment
  }
  projectErrors {
    ...ProjectErrorFragment
  }
  errors {
    ...ProjectErrorFragment
  }
}
    ${ProjectThemeFragmentFragmentDoc}
${ProjectErrorFragmentFragmentDoc}`;
export const SurveyCoreFragmentDoc = gql`
    fragment SurveyCore on Survey {
  id
  slug
  name
  status
  createdAt
  updatedAt
  reference
  creator {
    firstName
    lastName
    email
  }
  stats
}
    `;
export const SurveyQuestionFragmentFragmentDoc = gql`
    fragment SurveyQuestionFragment on SurveyQuestion {
  id
  reference
  label
  description
  type
  options
  settings
  orderNumber
  maxPath
  createdAt
  survey {
    id
    reference
    slug
    name
    project {
      id
      slug
      name
    }
  }
}
    `;
export const SurveyChannelFragmentFragmentDoc = gql`
    fragment SurveyChannelFragment on SurveyChannel {
  id
  link
  reference
  type
  triggers
  conditions
  settings
  createdAt
}
    `;
export const SurveyFragmentFragmentDoc = gql`
    fragment SurveyFragment on Survey {
  ...SurveyCore
  type
  settings
  theme {
    ...ProjectThemeFragment
  }
  project {
    ...ProjectFragment
  }
  questions(first: 50) {
    edges {
      node {
        ...SurveyQuestionFragment
      }
    }
  }
  channels(first: 50) {
    edges {
      node {
        ...SurveyChannelFragment
      }
    }
  }
}
    ${SurveyCoreFragmentDoc}
${ProjectThemeFragmentFragmentDoc}
${ProjectFragmentFragmentDoc}
${SurveyQuestionFragmentFragmentDoc}
${SurveyChannelFragmentFragmentDoc}`;
export const SurveyErrorFragmentFragmentDoc = gql`
    fragment SurveyErrorFragment on SurveyError {
  field
  message
  code
}
    `;
export const SurveyResponseFragmentFragmentDoc = gql`
    fragment SurveyResponseFragment on SurveyResponse {
  id
  title
  userAttributes
  response
  status
  completedAt
  createdAt
  updatedAt
  timeSpent
  stats
}
    `;
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
    ...OrganizationFragment
  }
  organizationErrors {
    ...OrganizationErrorFragment
  }
  errors {
    ...OrganizationErrorFragment
  }
}
    ${OrganizationFragmentFragmentDoc}
${OrganizationErrorFragmentFragmentDoc}`;
export const OrganizationUpdateFragmentFragmentDoc = gql`
    fragment OrganizationUpdateFragment on OrganizationUpdate {
  organization {
    ...OrganizationFragment
  }
  organizationErrors {
    ...OrganizationErrorFragment
  }
  errors {
    ...OrganizationErrorFragment
  }
}
    ${OrganizationFragmentFragmentDoc}
${OrganizationErrorFragmentFragmentDoc}`;
export const OrganizationInviteLinkCreateFragmentFragmentDoc = gql`
    fragment OrganizationInviteLinkCreateFragment on OrganizationInviteLink {
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
export const OrganizationInviteDetailsFragmentFragmentDoc = gql`
    fragment OrganizationInviteDetailsFragment on OrganizationInviteDetails {
  id
  email
  firstName
  expired
  inviter
  organizationId
  organizationName
  organizationLogo
}
    `;
export const OrganizationInviteLinkDetailsFragmentFragmentDoc = gql`
    fragment OrganizationInviteLinkDetailsFragment on OrganizationInviteLinkDetails {
  id
  organizationId
  organizationName
  organizationLogo
}
    `;
export const OrganizationJoinFragmentFragmentDoc = gql`
    fragment OrganizationJoinFragment on OrganizationJoin {
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
    ${AuthUserFragmentFragmentDoc}
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
export const ResendOrganizationInviteLinkFragmentFragmentDoc = gql`
    fragment ResendOrganizationInviteLinkFragment on OrganizationInviteResend {
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
export const OrganizationInviteDeleteFragmentFragmentDoc = gql`
    fragment OrganizationInviteDeleteFragment on OrganizationInviteDelete {
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
export const OrganizationLeaveFragmentFragmentDoc = gql`
    fragment OrganizationLeaveFragment on OrganizationLeave {
  organization {
    ...OrganizationFragment
  }
  organizationErrors {
    ...OrganizationErrorFragment
  }
  errors {
    ...OrganizationErrorFragment
  }
}
    ${OrganizationFragmentFragmentDoc}
${OrganizationErrorFragmentFragmentDoc}`;
export const OrganizationMembershipFragmentFragmentDoc = gql`
    fragment OrganizationMembershipFragment on OrganizationMember {
  id
  email
  firstName
  lastName
  role
}
    `;
export const OrganizationMemberLeaveFragmentFragmentDoc = gql`
    fragment OrganizationMemberLeaveFragment on OrganizationMemberLeave {
  organizationMembership {
    ...OrganizationMembershipFragment
  }
  organizationErrors {
    ...OrganizationErrorFragment
  }
  errors {
    ...OrganizationErrorFragment
  }
}
    ${OrganizationMembershipFragmentFragmentDoc}
${OrganizationErrorFragmentFragmentDoc}`;
export const OrganizationMemberUpdateFragmentFragmentDoc = gql`
    fragment OrganizationMemberUpdateFragment on OrganizationMemberUpdate {
  organizationMembership {
    ...OrganizationMembershipFragment
  }
  organizationErrors {
    ...OrganizationErrorFragment
  }
  errors {
    ...OrganizationErrorFragment
  }
}
    ${OrganizationMembershipFragmentFragmentDoc}
${OrganizationErrorFragmentFragmentDoc}`;
export const GetPersonsDocument = gql`
    query getPersons($first: Int, $last: Int, $after: String, $before: String) {
  persons(first: $first, last: $last, after: $after, before: $before) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        ...PersonFragment
      }
    }
    totalCount
  }
}
    ${PersonFragmentFragmentDoc}`;

/**
 * __useGetPersonsQuery__
 *
 * To run a query within a React component, call `useGetPersonsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPersonsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPersonsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useGetPersonsQuery(baseOptions?: Apollo.QueryHookOptions<GetPersonsQuery, GetPersonsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPersonsQuery, GetPersonsQueryVariables>(GetPersonsDocument, options);
      }
export function useGetPersonsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPersonsQuery, GetPersonsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPersonsQuery, GetPersonsQueryVariables>(GetPersonsDocument, options);
        }
export type GetPersonsQueryHookResult = ReturnType<typeof useGetPersonsQuery>;
export type GetPersonsLazyQueryHookResult = ReturnType<typeof useGetPersonsLazyQuery>;
export type GetPersonsQueryResult = Apollo.QueryResult<GetPersonsQuery, GetPersonsQueryVariables>;
export const EmailTokenUserAuthDocument = gql`
    mutation emailTokenUserAuth($email: String!, $token: String!, $inviteLink: String) {
  emailTokenUserAuth(email: $email, token: $token, inviteLink: $inviteLink) {
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
 *      inviteLink: // value for 'inviteLink'
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
    mutation emailUserAuthChallenge($email: String!, $inviteLink: String) {
  emailUserAuthChallenge(email: $email, inviteLink: $inviteLink) {
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
 *      inviteLink: // value for 'inviteLink'
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
    mutation googleUserAuth($code: String!, $inviteLink: String) {
  googleUserAuth(code: $code, inviteLink: $inviteLink) {
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
 *      inviteLink: // value for 'inviteLink'
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
export const UserUpdateDocument = gql`
    mutation userUpdate($input: UserInput!) {
  userUpdate(input: $input) {
    user {
      ... on User {
        id
        email
        firstName
        lastName
        isStaff
        isActive
        isOnboarded
      }
    }
  }
}
    `;
export type UserUpdateMutationFn = Apollo.MutationFunction<UserUpdateMutation, UserUpdateMutationVariables>;

/**
 * __useUserUpdateMutation__
 *
 * To run a mutation, you first call `useUserUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userUpdateMutation, { data, loading, error }] = useUserUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserUpdateMutation(baseOptions?: Apollo.MutationHookOptions<UserUpdateMutation, UserUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserUpdateMutation, UserUpdateMutationVariables>(UserUpdateDocument, options);
      }
export type UserUpdateMutationHookResult = ReturnType<typeof useUserUpdateMutation>;
export type UserUpdateMutationResult = Apollo.MutationResult<UserUpdateMutation>;
export type UserUpdateMutationOptions = Apollo.BaseMutationOptions<UserUpdateMutation, UserUpdateMutationVariables>;
export const ViewerDocument = gql`
    query viewer {
  viewer {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

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
export const EventDefinitionsDocument = gql`
    query EventDefinitions($first: Int, $last: Int, $after: String, $before: String) {
  eventDefinitions(first: $first, last: $last, after: $after, before: $before) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      node {
        id
        project {
          ...ProjectFragment
        }
        name
        volume
        createdAt
        lastSeenAt
      }
    }
  }
}
    ${ProjectFragmentFragmentDoc}`;

/**
 * __useEventDefinitionsQuery__
 *
 * To run a query within a React component, call `useEventDefinitionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventDefinitionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventDefinitionsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function useEventDefinitionsQuery(baseOptions?: Apollo.QueryHookOptions<EventDefinitionsQuery, EventDefinitionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventDefinitionsQuery, EventDefinitionsQueryVariables>(EventDefinitionsDocument, options);
      }
export function useEventDefinitionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventDefinitionsQuery, EventDefinitionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventDefinitionsQuery, EventDefinitionsQueryVariables>(EventDefinitionsDocument, options);
        }
export type EventDefinitionsQueryHookResult = ReturnType<typeof useEventDefinitionsQuery>;
export type EventDefinitionsLazyQueryHookResult = ReturnType<typeof useEventDefinitionsLazyQuery>;
export type EventDefinitionsQueryResult = Apollo.QueryResult<EventDefinitionsQuery, EventDefinitionsQueryVariables>;
export const EventsDocument = gql`
    query events($first: Int, $filter: EventFilterInput) {
  events(first: $first, filter: $filter) {
    edges {
      node {
        id
        project {
          ...ProjectFragment
        }
        event
        distinctId
        properties
        timestamp
        createdAt
      }
    }
  }
}
    ${ProjectFragmentFragmentDoc}`;

/**
 * __useEventsQuery__
 *
 * To run a query within a React component, call `useEventsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEventsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEventsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useEventsQuery(baseOptions?: Apollo.QueryHookOptions<EventsQuery, EventsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EventsQuery, EventsQueryVariables>(EventsDocument, options);
      }
export function useEventsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EventsQuery, EventsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EventsQuery, EventsQueryVariables>(EventsDocument, options);
        }
export type EventsQueryHookResult = ReturnType<typeof useEventsQuery>;
export type EventsLazyQueryHookResult = ReturnType<typeof useEventsLazyQuery>;
export type EventsQueryResult = Apollo.QueryResult<EventsQuery, EventsQueryVariables>;
export const PropertyDefinitionsDocument = gql`
    query propertyDefinitions($first: Int, $last: Int, $after: String, $before: String) {
  propertyDefinitions(first: $first, last: $last, after: $after, before: $before) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        project {
          ...ProjectFragment
        }
        name
        isNumerical
        type
        propertyType
      }
    }
    totalCount
  }
}
    ${ProjectFragmentFragmentDoc}`;

/**
 * __usePropertyDefinitionsQuery__
 *
 * To run a query within a React component, call `usePropertyDefinitionsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePropertyDefinitionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePropertyDefinitionsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *   },
 * });
 */
export function usePropertyDefinitionsQuery(baseOptions?: Apollo.QueryHookOptions<PropertyDefinitionsQuery, PropertyDefinitionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PropertyDefinitionsQuery, PropertyDefinitionsQueryVariables>(PropertyDefinitionsDocument, options);
      }
export function usePropertyDefinitionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PropertyDefinitionsQuery, PropertyDefinitionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PropertyDefinitionsQuery, PropertyDefinitionsQueryVariables>(PropertyDefinitionsDocument, options);
        }
export type PropertyDefinitionsQueryHookResult = ReturnType<typeof usePropertyDefinitionsQuery>;
export type PropertyDefinitionsLazyQueryHookResult = ReturnType<typeof usePropertyDefinitionsLazyQuery>;
export type PropertyDefinitionsQueryResult = Apollo.QueryResult<PropertyDefinitionsQuery, PropertyDefinitionsQueryVariables>;
export const PropertiesWithDefinitionsDocument = gql`
    query propertiesWithDefinitions($event: String) {
  propertiesWithDefinitions(event: $event) {
    event
    property
    isNumerical
    propertyType
  }
}
    `;

/**
 * __usePropertiesWithDefinitionsQuery__
 *
 * To run a query within a React component, call `usePropertiesWithDefinitionsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePropertiesWithDefinitionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePropertiesWithDefinitionsQuery({
 *   variables: {
 *      event: // value for 'event'
 *   },
 * });
 */
export function usePropertiesWithDefinitionsQuery(baseOptions?: Apollo.QueryHookOptions<PropertiesWithDefinitionsQuery, PropertiesWithDefinitionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PropertiesWithDefinitionsQuery, PropertiesWithDefinitionsQueryVariables>(PropertiesWithDefinitionsDocument, options);
      }
export function usePropertiesWithDefinitionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PropertiesWithDefinitionsQuery, PropertiesWithDefinitionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PropertiesWithDefinitionsQuery, PropertiesWithDefinitionsQueryVariables>(PropertiesWithDefinitionsDocument, options);
        }
export type PropertiesWithDefinitionsQueryHookResult = ReturnType<typeof usePropertiesWithDefinitionsQuery>;
export type PropertiesWithDefinitionsLazyQueryHookResult = ReturnType<typeof usePropertiesWithDefinitionsLazyQuery>;
export type PropertiesWithDefinitionsQueryResult = Apollo.QueryResult<PropertiesWithDefinitionsQuery, PropertiesWithDefinitionsQueryVariables>;
export const CompleteOnboardingStageDocument = gql`
    mutation completeOnboardingStage($input: ProjectUpdateInput!) {
  projectUpdate(input: $input) {
    project {
      id
      hasCompletedOnboardingFor
      __typename
    }
  }
}
    `;
export type CompleteOnboardingStageMutationFn = Apollo.MutationFunction<CompleteOnboardingStageMutation, CompleteOnboardingStageMutationVariables>;

/**
 * __useCompleteOnboardingStageMutation__
 *
 * To run a mutation, you first call `useCompleteOnboardingStageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteOnboardingStageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeOnboardingStageMutation, { data, loading, error }] = useCompleteOnboardingStageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCompleteOnboardingStageMutation(baseOptions?: Apollo.MutationHookOptions<CompleteOnboardingStageMutation, CompleteOnboardingStageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteOnboardingStageMutation, CompleteOnboardingStageMutationVariables>(CompleteOnboardingStageDocument, options);
      }
export type CompleteOnboardingStageMutationHookResult = ReturnType<typeof useCompleteOnboardingStageMutation>;
export type CompleteOnboardingStageMutationResult = Apollo.MutationResult<CompleteOnboardingStageMutation>;
export type CompleteOnboardingStageMutationOptions = Apollo.BaseMutationOptions<CompleteOnboardingStageMutation, CompleteOnboardingStageMutationVariables>;
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
export const ProjectUpdateDocument = gql`
    mutation projectUpdate($input: ProjectUpdateInput!) {
  projectUpdate(input: $input) {
    ...ProjectUpdateFragment
  }
}
    ${ProjectUpdateFragmentFragmentDoc}`;
export type ProjectUpdateMutationFn = Apollo.MutationFunction<ProjectUpdateMutation, ProjectUpdateMutationVariables>;

/**
 * __useProjectUpdateMutation__
 *
 * To run a mutation, you first call `useProjectUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProjectUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [projectUpdateMutation, { data, loading, error }] = useProjectUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProjectUpdateMutation(baseOptions?: Apollo.MutationHookOptions<ProjectUpdateMutation, ProjectUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ProjectUpdateMutation, ProjectUpdateMutationVariables>(ProjectUpdateDocument, options);
      }
export type ProjectUpdateMutationHookResult = ReturnType<typeof useProjectUpdateMutation>;
export type ProjectUpdateMutationResult = Apollo.MutationResult<ProjectUpdateMutation>;
export type ProjectUpdateMutationOptions = Apollo.BaseMutationOptions<ProjectUpdateMutation, ProjectUpdateMutationVariables>;
export const ProjectTokenResetDocument = gql`
    mutation projectTokenReset {
  projectTokenReset {
    ...ProjectTokenResetFragment
  }
}
    ${ProjectTokenResetFragmentFragmentDoc}`;
export type ProjectTokenResetMutationFn = Apollo.MutationFunction<ProjectTokenResetMutation, ProjectTokenResetMutationVariables>;

/**
 * __useProjectTokenResetMutation__
 *
 * To run a mutation, you first call `useProjectTokenResetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProjectTokenResetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [projectTokenResetMutation, { data, loading, error }] = useProjectTokenResetMutation({
 *   variables: {
 *   },
 * });
 */
export function useProjectTokenResetMutation(baseOptions?: Apollo.MutationHookOptions<ProjectTokenResetMutation, ProjectTokenResetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ProjectTokenResetMutation, ProjectTokenResetMutationVariables>(ProjectTokenResetDocument, options);
      }
export type ProjectTokenResetMutationHookResult = ReturnType<typeof useProjectTokenResetMutation>;
export type ProjectTokenResetMutationResult = Apollo.MutationResult<ProjectTokenResetMutation>;
export type ProjectTokenResetMutationOptions = Apollo.BaseMutationOptions<ProjectTokenResetMutation, ProjectTokenResetMutationVariables>;
export const ProjectThemeCreateDocument = gql`
    mutation ProjectThemeCreate($input: ProjectThemeCreateInput!) {
  projectThemeCreate(input: $input) {
    errors {
      ...ProjectErrorFragment
    }
    projectTheme {
      ...ProjectThemeFragment
    }
    projectErrors {
      ...ProjectErrorFragment
    }
  }
}
    ${ProjectErrorFragmentFragmentDoc}
${ProjectThemeFragmentFragmentDoc}`;
export type ProjectThemeCreateMutationFn = Apollo.MutationFunction<ProjectThemeCreateMutation, ProjectThemeCreateMutationVariables>;

/**
 * __useProjectThemeCreateMutation__
 *
 * To run a mutation, you first call `useProjectThemeCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProjectThemeCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [projectThemeCreateMutation, { data, loading, error }] = useProjectThemeCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProjectThemeCreateMutation(baseOptions?: Apollo.MutationHookOptions<ProjectThemeCreateMutation, ProjectThemeCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ProjectThemeCreateMutation, ProjectThemeCreateMutationVariables>(ProjectThemeCreateDocument, options);
      }
export type ProjectThemeCreateMutationHookResult = ReturnType<typeof useProjectThemeCreateMutation>;
export type ProjectThemeCreateMutationResult = Apollo.MutationResult<ProjectThemeCreateMutation>;
export type ProjectThemeCreateMutationOptions = Apollo.BaseMutationOptions<ProjectThemeCreateMutation, ProjectThemeCreateMutationVariables>;
export const ProjectThemeDeleteDocument = gql`
    mutation ProjectThemeDelete($id: ID!) {
  projectThemeDelete(id: $id) {
    projectErrors {
      ...ProjectErrorFragment
    }
    errors {
      ...ProjectErrorFragment
    }
    projectTheme {
      ...ProjectThemeFragment
    }
  }
}
    ${ProjectErrorFragmentFragmentDoc}
${ProjectThemeFragmentFragmentDoc}`;
export type ProjectThemeDeleteMutationFn = Apollo.MutationFunction<ProjectThemeDeleteMutation, ProjectThemeDeleteMutationVariables>;

/**
 * __useProjectThemeDeleteMutation__
 *
 * To run a mutation, you first call `useProjectThemeDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProjectThemeDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [projectThemeDeleteMutation, { data, loading, error }] = useProjectThemeDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useProjectThemeDeleteMutation(baseOptions?: Apollo.MutationHookOptions<ProjectThemeDeleteMutation, ProjectThemeDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ProjectThemeDeleteMutation, ProjectThemeDeleteMutationVariables>(ProjectThemeDeleteDocument, options);
      }
export type ProjectThemeDeleteMutationHookResult = ReturnType<typeof useProjectThemeDeleteMutation>;
export type ProjectThemeDeleteMutationResult = Apollo.MutationResult<ProjectThemeDeleteMutation>;
export type ProjectThemeDeleteMutationOptions = Apollo.BaseMutationOptions<ProjectThemeDeleteMutation, ProjectThemeDeleteMutationVariables>;
export const ProjectThemeUpdateDocument = gql`
    mutation ProjectThemeUpdate($id: ID!, $input: ProjectThemeUpdateInput!) {
  projectThemeUpdate(id: $id, input: $input) {
    projectTheme {
      ...ProjectThemeFragment
    }
    projectErrors {
      ...ProjectErrorFragment
    }
    errors {
      ...ProjectErrorFragment
    }
  }
}
    ${ProjectThemeFragmentFragmentDoc}
${ProjectErrorFragmentFragmentDoc}`;
export type ProjectThemeUpdateMutationFn = Apollo.MutationFunction<ProjectThemeUpdateMutation, ProjectThemeUpdateMutationVariables>;

/**
 * __useProjectThemeUpdateMutation__
 *
 * To run a mutation, you first call `useProjectThemeUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProjectThemeUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [projectThemeUpdateMutation, { data, loading, error }] = useProjectThemeUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProjectThemeUpdateMutation(baseOptions?: Apollo.MutationHookOptions<ProjectThemeUpdateMutation, ProjectThemeUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ProjectThemeUpdateMutation, ProjectThemeUpdateMutationVariables>(ProjectThemeUpdateDocument, options);
      }
export type ProjectThemeUpdateMutationHookResult = ReturnType<typeof useProjectThemeUpdateMutation>;
export type ProjectThemeUpdateMutationResult = Apollo.MutationResult<ProjectThemeUpdateMutation>;
export type ProjectThemeUpdateMutationOptions = Apollo.BaseMutationOptions<ProjectThemeUpdateMutation, ProjectThemeUpdateMutationVariables>;
export const ProjectEventsDataDocument = gql`
    query projectEventsData {
  eventDefinitions(first: 100) {
    edges {
      node {
        id
        name
        createdAt
        lastSeenAt
      }
    }
  }
  eventProperties(first: 100) {
    edges {
      node {
        id
        event
        property
      }
    }
  }
  propertyDefinitions(first: 100, definitionType: EVENT) {
    edges {
      node {
        id
        name
        isNumerical
        type
        propertyType
      }
    }
  }
}
    `;

/**
 * __useProjectEventsDataQuery__
 *
 * To run a query within a React component, call `useProjectEventsDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectEventsDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectEventsDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useProjectEventsDataQuery(baseOptions?: Apollo.QueryHookOptions<ProjectEventsDataQuery, ProjectEventsDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProjectEventsDataQuery, ProjectEventsDataQueryVariables>(ProjectEventsDataDocument, options);
      }
export function useProjectEventsDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectEventsDataQuery, ProjectEventsDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProjectEventsDataQuery, ProjectEventsDataQueryVariables>(ProjectEventsDataDocument, options);
        }
export type ProjectEventsDataQueryHookResult = ReturnType<typeof useProjectEventsDataQuery>;
export type ProjectEventsDataLazyQueryHookResult = ReturnType<typeof useProjectEventsDataLazyQuery>;
export type ProjectEventsDataQueryResult = Apollo.QueryResult<ProjectEventsDataQuery, ProjectEventsDataQueryVariables>;
export const ThemesDocument = gql`
    query Themes($first: Int) {
  themes(first: $first) {
    edges {
      node {
        ...ProjectThemeFragment
      }
    }
    totalCount
  }
}
    ${ProjectThemeFragmentFragmentDoc}`;

/**
 * __useThemesQuery__
 *
 * To run a query within a React component, call `useThemesQuery` and pass it any options that fit your needs.
 * When your component renders, `useThemesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useThemesQuery({
 *   variables: {
 *      first: // value for 'first'
 *   },
 * });
 */
export function useThemesQuery(baseOptions?: Apollo.QueryHookOptions<ThemesQuery, ThemesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ThemesQuery, ThemesQueryVariables>(ThemesDocument, options);
      }
export function useThemesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ThemesQuery, ThemesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ThemesQuery, ThemesQueryVariables>(ThemesDocument, options);
        }
export type ThemesQueryHookResult = ReturnType<typeof useThemesQuery>;
export type ThemesLazyQueryHookResult = ReturnType<typeof useThemesLazyQuery>;
export type ThemesQueryResult = Apollo.QueryResult<ThemesQuery, ThemesQueryVariables>;
export const SurveyQuestionCreateDocument = gql`
    mutation SurveyQuestionCreate($input: SurveyQuestionCreateInput!) {
  surveyQuestionCreate(input: $input) {
    surveyErrors {
      ...SurveyErrorFragment
    }
    errors {
      ...SurveyErrorFragment
    }
    surveyQuestion {
      ...SurveyQuestionFragment
    }
  }
}
    ${SurveyErrorFragmentFragmentDoc}
${SurveyQuestionFragmentFragmentDoc}`;
export type SurveyQuestionCreateMutationFn = Apollo.MutationFunction<SurveyQuestionCreateMutation, SurveyQuestionCreateMutationVariables>;

/**
 * __useSurveyQuestionCreateMutation__
 *
 * To run a mutation, you first call `useSurveyQuestionCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSurveyQuestionCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [surveyQuestionCreateMutation, { data, loading, error }] = useSurveyQuestionCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSurveyQuestionCreateMutation(baseOptions?: Apollo.MutationHookOptions<SurveyQuestionCreateMutation, SurveyQuestionCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SurveyQuestionCreateMutation, SurveyQuestionCreateMutationVariables>(SurveyQuestionCreateDocument, options);
      }
export type SurveyQuestionCreateMutationHookResult = ReturnType<typeof useSurveyQuestionCreateMutation>;
export type SurveyQuestionCreateMutationResult = Apollo.MutationResult<SurveyQuestionCreateMutation>;
export type SurveyQuestionCreateMutationOptions = Apollo.BaseMutationOptions<SurveyQuestionCreateMutation, SurveyQuestionCreateMutationVariables>;
export const SurveyChannelCreateDocument = gql`
    mutation SurveyChannelCreate($input: SurveyChannelCreateInput!) {
  surveyChannelCreate(input: $input) {
    surveyChannel {
      ...SurveyChannelFragment
    }
    surveyErrors {
      ...SurveyErrorFragment
    }
    errors {
      ...SurveyErrorFragment
    }
  }
}
    ${SurveyChannelFragmentFragmentDoc}
${SurveyErrorFragmentFragmentDoc}`;
export type SurveyChannelCreateMutationFn = Apollo.MutationFunction<SurveyChannelCreateMutation, SurveyChannelCreateMutationVariables>;

/**
 * __useSurveyChannelCreateMutation__
 *
 * To run a mutation, you first call `useSurveyChannelCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSurveyChannelCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [surveyChannelCreateMutation, { data, loading, error }] = useSurveyChannelCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSurveyChannelCreateMutation(baseOptions?: Apollo.MutationHookOptions<SurveyChannelCreateMutation, SurveyChannelCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SurveyChannelCreateMutation, SurveyChannelCreateMutationVariables>(SurveyChannelCreateDocument, options);
      }
export type SurveyChannelCreateMutationHookResult = ReturnType<typeof useSurveyChannelCreateMutation>;
export type SurveyChannelCreateMutationResult = Apollo.MutationResult<SurveyChannelCreateMutation>;
export type SurveyChannelCreateMutationOptions = Apollo.BaseMutationOptions<SurveyChannelCreateMutation, SurveyChannelCreateMutationVariables>;
export const SurveyChannelUpdateDocument = gql`
    mutation SurveyChannelUpdate($id: ID!, $input: SurveyChannelUpdateInput!) {
  surveyChannelUpdate(id: $id, input: $input) {
    surveyChannel {
      ...SurveyChannelFragment
    }
    surveyErrors {
      ...SurveyErrorFragment
    }
    errors {
      ...SurveyErrorFragment
    }
  }
}
    ${SurveyChannelFragmentFragmentDoc}
${SurveyErrorFragmentFragmentDoc}`;
export type SurveyChannelUpdateMutationFn = Apollo.MutationFunction<SurveyChannelUpdateMutation, SurveyChannelUpdateMutationVariables>;

/**
 * __useSurveyChannelUpdateMutation__
 *
 * To run a mutation, you first call `useSurveyChannelUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSurveyChannelUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [surveyChannelUpdateMutation, { data, loading, error }] = useSurveyChannelUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSurveyChannelUpdateMutation(baseOptions?: Apollo.MutationHookOptions<SurveyChannelUpdateMutation, SurveyChannelUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SurveyChannelUpdateMutation, SurveyChannelUpdateMutationVariables>(SurveyChannelUpdateDocument, options);
      }
export type SurveyChannelUpdateMutationHookResult = ReturnType<typeof useSurveyChannelUpdateMutation>;
export type SurveyChannelUpdateMutationResult = Apollo.MutationResult<SurveyChannelUpdateMutation>;
export type SurveyChannelUpdateMutationOptions = Apollo.BaseMutationOptions<SurveyChannelUpdateMutation, SurveyChannelUpdateMutationVariables>;
export const SurveyChannelDeleteDocument = gql`
    mutation SurveyChannelDelete($id: ID!) {
  surveyChannelDelete(id: $id) {
    surveyChannel {
      ...SurveyChannelFragment
    }
    surveyErrors {
      ...SurveyErrorFragment
    }
    errors {
      ...SurveyErrorFragment
    }
  }
}
    ${SurveyChannelFragmentFragmentDoc}
${SurveyErrorFragmentFragmentDoc}`;
export type SurveyChannelDeleteMutationFn = Apollo.MutationFunction<SurveyChannelDeleteMutation, SurveyChannelDeleteMutationVariables>;

/**
 * __useSurveyChannelDeleteMutation__
 *
 * To run a mutation, you first call `useSurveyChannelDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSurveyChannelDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [surveyChannelDeleteMutation, { data, loading, error }] = useSurveyChannelDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSurveyChannelDeleteMutation(baseOptions?: Apollo.MutationHookOptions<SurveyChannelDeleteMutation, SurveyChannelDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SurveyChannelDeleteMutation, SurveyChannelDeleteMutationVariables>(SurveyChannelDeleteDocument, options);
      }
export type SurveyChannelDeleteMutationHookResult = ReturnType<typeof useSurveyChannelDeleteMutation>;
export type SurveyChannelDeleteMutationResult = Apollo.MutationResult<SurveyChannelDeleteMutation>;
export type SurveyChannelDeleteMutationOptions = Apollo.BaseMutationOptions<SurveyChannelDeleteMutation, SurveyChannelDeleteMutationVariables>;
export const SurveyDeleteDocument = gql`
    mutation SurveyDelete($id: ID!) {
  surveyDelete(id: $id) {
    surveyErrors {
      ...SurveyErrorFragment
    }
    errors {
      ...SurveyErrorFragment
    }
    survey {
      ...SurveyFragment
    }
  }
}
    ${SurveyErrorFragmentFragmentDoc}
${SurveyFragmentFragmentDoc}`;
export type SurveyDeleteMutationFn = Apollo.MutationFunction<SurveyDeleteMutation, SurveyDeleteMutationVariables>;

/**
 * __useSurveyDeleteMutation__
 *
 * To run a mutation, you first call `useSurveyDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSurveyDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [surveyDeleteMutation, { data, loading, error }] = useSurveyDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSurveyDeleteMutation(baseOptions?: Apollo.MutationHookOptions<SurveyDeleteMutation, SurveyDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SurveyDeleteMutation, SurveyDeleteMutationVariables>(SurveyDeleteDocument, options);
      }
export type SurveyDeleteMutationHookResult = ReturnType<typeof useSurveyDeleteMutation>;
export type SurveyDeleteMutationResult = Apollo.MutationResult<SurveyDeleteMutation>;
export type SurveyDeleteMutationOptions = Apollo.BaseMutationOptions<SurveyDeleteMutation, SurveyDeleteMutationVariables>;
export const SurveyCreateDocument = gql`
    mutation SurveyCreate($input: SurveyCreateInput!) {
  surveyCreate(input: $input) {
    surveyErrors {
      ...SurveyErrorFragment
    }
    errors {
      ...SurveyErrorFragment
    }
    survey {
      ...SurveyFragment
    }
  }
}
    ${SurveyErrorFragmentFragmentDoc}
${SurveyFragmentFragmentDoc}`;
export type SurveyCreateMutationFn = Apollo.MutationFunction<SurveyCreateMutation, SurveyCreateMutationVariables>;

/**
 * __useSurveyCreateMutation__
 *
 * To run a mutation, you first call `useSurveyCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSurveyCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [surveyCreateMutation, { data, loading, error }] = useSurveyCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSurveyCreateMutation(baseOptions?: Apollo.MutationHookOptions<SurveyCreateMutation, SurveyCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SurveyCreateMutation, SurveyCreateMutationVariables>(SurveyCreateDocument, options);
      }
export type SurveyCreateMutationHookResult = ReturnType<typeof useSurveyCreateMutation>;
export type SurveyCreateMutationResult = Apollo.MutationResult<SurveyCreateMutation>;
export type SurveyCreateMutationOptions = Apollo.BaseMutationOptions<SurveyCreateMutation, SurveyCreateMutationVariables>;
export const SurveyUpdateDocument = gql`
    mutation SurveyUpdate($id: ID!, $input: SurveyUpdateInput!) {
  surveyUpdate(id: $id, input: $input) {
    surveyErrors {
      ...SurveyErrorFragment
    }
    errors {
      ...SurveyErrorFragment
    }
    survey {
      ...SurveyFragment
    }
  }
}
    ${SurveyErrorFragmentFragmentDoc}
${SurveyFragmentFragmentDoc}`;
export type SurveyUpdateMutationFn = Apollo.MutationFunction<SurveyUpdateMutation, SurveyUpdateMutationVariables>;

/**
 * __useSurveyUpdateMutation__
 *
 * To run a mutation, you first call `useSurveyUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSurveyUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [surveyUpdateMutation, { data, loading, error }] = useSurveyUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSurveyUpdateMutation(baseOptions?: Apollo.MutationHookOptions<SurveyUpdateMutation, SurveyUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SurveyUpdateMutation, SurveyUpdateMutationVariables>(SurveyUpdateDocument, options);
      }
export type SurveyUpdateMutationHookResult = ReturnType<typeof useSurveyUpdateMutation>;
export type SurveyUpdateMutationResult = Apollo.MutationResult<SurveyUpdateMutation>;
export type SurveyUpdateMutationOptions = Apollo.BaseMutationOptions<SurveyUpdateMutation, SurveyUpdateMutationVariables>;
export const SurveyQuestionDeleteDocument = gql`
    mutation SurveyQuestionDelete($id: ID!) {
  surveyQuestionDelete(id: $id) {
    surveyErrors {
      ...SurveyErrorFragment
    }
    errors {
      ...SurveyErrorFragment
    }
    surveyQuestion {
      ...SurveyQuestionFragment
    }
  }
}
    ${SurveyErrorFragmentFragmentDoc}
${SurveyQuestionFragmentFragmentDoc}`;
export type SurveyQuestionDeleteMutationFn = Apollo.MutationFunction<SurveyQuestionDeleteMutation, SurveyQuestionDeleteMutationVariables>;

/**
 * __useSurveyQuestionDeleteMutation__
 *
 * To run a mutation, you first call `useSurveyQuestionDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSurveyQuestionDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [surveyQuestionDeleteMutation, { data, loading, error }] = useSurveyQuestionDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSurveyQuestionDeleteMutation(baseOptions?: Apollo.MutationHookOptions<SurveyQuestionDeleteMutation, SurveyQuestionDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SurveyQuestionDeleteMutation, SurveyQuestionDeleteMutationVariables>(SurveyQuestionDeleteDocument, options);
      }
export type SurveyQuestionDeleteMutationHookResult = ReturnType<typeof useSurveyQuestionDeleteMutation>;
export type SurveyQuestionDeleteMutationResult = Apollo.MutationResult<SurveyQuestionDeleteMutation>;
export type SurveyQuestionDeleteMutationOptions = Apollo.BaseMutationOptions<SurveyQuestionDeleteMutation, SurveyQuestionDeleteMutationVariables>;
export const SurveyQuestionUpdateDocument = gql`
    mutation SurveyQuestionUpdate($id: ID!, $input: SurveyQuestionUpdateInput!) {
  surveyQuestionUpdate(id: $id, input: $input) {
    surveyErrors {
      ...SurveyErrorFragment
    }
    errors {
      ...SurveyErrorFragment
    }
    surveyQuestion {
      ...SurveyQuestionFragment
    }
  }
}
    ${SurveyErrorFragmentFragmentDoc}
${SurveyQuestionFragmentFragmentDoc}`;
export type SurveyQuestionUpdateMutationFn = Apollo.MutationFunction<SurveyQuestionUpdateMutation, SurveyQuestionUpdateMutationVariables>;

/**
 * __useSurveyQuestionUpdateMutation__
 *
 * To run a mutation, you first call `useSurveyQuestionUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSurveyQuestionUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [surveyQuestionUpdateMutation, { data, loading, error }] = useSurveyQuestionUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSurveyQuestionUpdateMutation(baseOptions?: Apollo.MutationHookOptions<SurveyQuestionUpdateMutation, SurveyQuestionUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SurveyQuestionUpdateMutation, SurveyQuestionUpdateMutationVariables>(SurveyQuestionUpdateDocument, options);
      }
export type SurveyQuestionUpdateMutationHookResult = ReturnType<typeof useSurveyQuestionUpdateMutation>;
export type SurveyQuestionUpdateMutationResult = Apollo.MutationResult<SurveyQuestionUpdateMutation>;
export type SurveyQuestionUpdateMutationOptions = Apollo.BaseMutationOptions<SurveyQuestionUpdateMutation, SurveyQuestionUpdateMutationVariables>;
export const AudiencePropertiesDocument = gql`
    query audienceProperties {
  propertyDefinitions(first: 100, definitionType: PERSON) {
    edges {
      node {
        id
        name
        isNumerical
        type
        propertyType
      }
    }
  }
}
    `;

/**
 * __useAudiencePropertiesQuery__
 *
 * To run a query within a React component, call `useAudiencePropertiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAudiencePropertiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAudiencePropertiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAudiencePropertiesQuery(baseOptions?: Apollo.QueryHookOptions<AudiencePropertiesQuery, AudiencePropertiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AudiencePropertiesQuery, AudiencePropertiesQueryVariables>(AudiencePropertiesDocument, options);
      }
export function useAudiencePropertiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AudiencePropertiesQuery, AudiencePropertiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AudiencePropertiesQuery, AudiencePropertiesQueryVariables>(AudiencePropertiesDocument, options);
        }
export type AudiencePropertiesQueryHookResult = ReturnType<typeof useAudiencePropertiesQuery>;
export type AudiencePropertiesLazyQueryHookResult = ReturnType<typeof useAudiencePropertiesLazyQuery>;
export type AudiencePropertiesQueryResult = Apollo.QueryResult<AudiencePropertiesQuery, AudiencePropertiesQueryVariables>;
export const ChannelsDocument = gql`
    query channels($surveyId: ID!) {
  channels(id: $surveyId, first: 50) {
    edges {
      node {
        ...SurveyChannelFragment
      }
    }
  }
}
    ${SurveyChannelFragmentFragmentDoc}`;

/**
 * __useChannelsQuery__
 *
 * To run a query within a React component, call `useChannelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelsQuery({
 *   variables: {
 *      surveyId: // value for 'surveyId'
 *   },
 * });
 */
export function useChannelsQuery(baseOptions: Apollo.QueryHookOptions<ChannelsQuery, ChannelsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChannelsQuery, ChannelsQueryVariables>(ChannelsDocument, options);
      }
export function useChannelsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChannelsQuery, ChannelsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChannelsQuery, ChannelsQueryVariables>(ChannelsDocument, options);
        }
export type ChannelsQueryHookResult = ReturnType<typeof useChannelsQuery>;
export type ChannelsLazyQueryHookResult = ReturnType<typeof useChannelsLazyQuery>;
export type ChannelsQueryResult = Apollo.QueryResult<ChannelsQuery, ChannelsQueryVariables>;
export const GetQuestionsDocument = gql`
    query GetQuestions($id: ID!) {
  questions(id: $id, first: 50) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        ...SurveyQuestionFragment
      }
    }
    totalCount
  }
}
    ${SurveyQuestionFragmentFragmentDoc}`;

/**
 * __useGetQuestionsQuery__
 *
 * To run a query within a React component, call `useGetQuestionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQuestionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQuestionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetQuestionsQuery(baseOptions: Apollo.QueryHookOptions<GetQuestionsQuery, GetQuestionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetQuestionsQuery, GetQuestionsQueryVariables>(GetQuestionsDocument, options);
      }
export function useGetQuestionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetQuestionsQuery, GetQuestionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetQuestionsQuery, GetQuestionsQueryVariables>(GetQuestionsDocument, options);
        }
export type GetQuestionsQueryHookResult = ReturnType<typeof useGetQuestionsQuery>;
export type GetQuestionsLazyQueryHookResult = ReturnType<typeof useGetQuestionsLazyQuery>;
export type GetQuestionsQueryResult = Apollo.QueryResult<GetQuestionsQuery, GetQuestionsQueryVariables>;
export const GetSurveyDocument = gql`
    query GetSurvey($id: ID, $slug: String) {
  survey(id: $id, slug: $slug) {
    ...SurveyFragment
  }
}
    ${SurveyFragmentFragmentDoc}`;

/**
 * __useGetSurveyQuery__
 *
 * To run a query within a React component, call `useGetSurveyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSurveyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSurveyQuery({
 *   variables: {
 *      id: // value for 'id'
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetSurveyQuery(baseOptions?: Apollo.QueryHookOptions<GetSurveyQuery, GetSurveyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSurveyQuery, GetSurveyQueryVariables>(GetSurveyDocument, options);
      }
export function useGetSurveyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSurveyQuery, GetSurveyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSurveyQuery, GetSurveyQueryVariables>(GetSurveyDocument, options);
        }
export type GetSurveyQueryHookResult = ReturnType<typeof useGetSurveyQuery>;
export type GetSurveyLazyQueryHookResult = ReturnType<typeof useGetSurveyLazyQuery>;
export type GetSurveyQueryResult = Apollo.QueryResult<GetSurveyQuery, GetSurveyQueryVariables>;
export const GetSurveyListDocument = gql`
    query GetSurveyList($first: Int, $last: Int, $after: String, $before: String, $filter: SurveyFilterInput, $sortBy: SurveySortingInput) {
  surveys(
    first: $first
    last: $last
    after: $after
    before: $before
    filter: $filter
    sortBy: $sortBy
  ) {
    edges {
      node {
        ...SurveyCore
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }
    totalCount
  }
}
    ${SurveyCoreFragmentDoc}`;

/**
 * __useGetSurveyListQuery__
 *
 * To run a query within a React component, call `useGetSurveyListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSurveyListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSurveyListQuery({
 *   variables: {
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      after: // value for 'after'
 *      before: // value for 'before'
 *      filter: // value for 'filter'
 *      sortBy: // value for 'sortBy'
 *   },
 * });
 */
export function useGetSurveyListQuery(baseOptions?: Apollo.QueryHookOptions<GetSurveyListQuery, GetSurveyListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSurveyListQuery, GetSurveyListQueryVariables>(GetSurveyListDocument, options);
      }
export function useGetSurveyListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSurveyListQuery, GetSurveyListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSurveyListQuery, GetSurveyListQueryVariables>(GetSurveyListDocument, options);
        }
export type GetSurveyListQueryHookResult = ReturnType<typeof useGetSurveyListQuery>;
export type GetSurveyListLazyQueryHookResult = ReturnType<typeof useGetSurveyListLazyQuery>;
export type GetSurveyListQueryResult = Apollo.QueryResult<GetSurveyListQuery, GetSurveyListQueryVariables>;
export const ResponsesDocument = gql`
    query responses($id: ID, $filter: SurveyResponseFilterInput, $before: String, $after: String, $first: Int, $last: Int) {
  responses(
    id: $id
    filter: $filter
    before: $before
    after: $after
    first: $first
    last: $last
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
    nodes {
      ...SurveyResponseFragment
    }
  }
}
    ${SurveyResponseFragmentFragmentDoc}`;

/**
 * __useResponsesQuery__
 *
 * To run a query within a React component, call `useResponsesQuery` and pass it any options that fit your needs.
 * When your component renders, `useResponsesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResponsesQuery({
 *   variables: {
 *      id: // value for 'id'
 *      filter: // value for 'filter'
 *      before: // value for 'before'
 *      after: // value for 'after'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *   },
 * });
 */
export function useResponsesQuery(baseOptions?: Apollo.QueryHookOptions<ResponsesQuery, ResponsesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ResponsesQuery, ResponsesQueryVariables>(ResponsesDocument, options);
      }
export function useResponsesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResponsesQuery, ResponsesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ResponsesQuery, ResponsesQueryVariables>(ResponsesDocument, options);
        }
export type ResponsesQueryHookResult = ReturnType<typeof useResponsesQuery>;
export type ResponsesLazyQueryHookResult = ReturnType<typeof useResponsesLazyQuery>;
export type ResponsesQueryResult = Apollo.QueryResult<ResponsesQuery, ResponsesQueryVariables>;
export const ResponseMetricDocument = gql`
    query responseMetric($id: ID!, $date: DateRangeInput, $previousDate: DateRangeInput, $metric: SurveyResponseMetricEnum!) {
  responseMetric(
    id: $id
    date: $date
    previousDate: $previousDate
    metric: $metric
  ) {
    current
    previous
  }
}
    `;

/**
 * __useResponseMetricQuery__
 *
 * To run a query within a React component, call `useResponseMetricQuery` and pass it any options that fit your needs.
 * When your component renders, `useResponseMetricQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResponseMetricQuery({
 *   variables: {
 *      id: // value for 'id'
 *      date: // value for 'date'
 *      previousDate: // value for 'previousDate'
 *      metric: // value for 'metric'
 *   },
 * });
 */
export function useResponseMetricQuery(baseOptions: Apollo.QueryHookOptions<ResponseMetricQuery, ResponseMetricQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ResponseMetricQuery, ResponseMetricQueryVariables>(ResponseMetricDocument, options);
      }
export function useResponseMetricLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ResponseMetricQuery, ResponseMetricQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ResponseMetricQuery, ResponseMetricQueryVariables>(ResponseMetricDocument, options);
        }
export type ResponseMetricQueryHookResult = ReturnType<typeof useResponseMetricQuery>;
export type ResponseMetricLazyQueryHookResult = ReturnType<typeof useResponseMetricLazyQuery>;
export type ResponseMetricQueryResult = Apollo.QueryResult<ResponseMetricQuery, ResponseMetricQueryVariables>;
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
export const OrganizationUpdateDocument = gql`
    mutation organizationUpdate($input: OrganizationUpdateInput!) {
  organizationUpdate(input: $input) {
    ...OrganizationUpdateFragment
  }
}
    ${OrganizationUpdateFragmentFragmentDoc}`;
export type OrganizationUpdateMutationFn = Apollo.MutationFunction<OrganizationUpdateMutation, OrganizationUpdateMutationVariables>;

/**
 * __useOrganizationUpdateMutation__
 *
 * To run a mutation, you first call `useOrganizationUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrganizationUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [organizationUpdateMutation, { data, loading, error }] = useOrganizationUpdateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrganizationUpdateMutation(baseOptions?: Apollo.MutationHookOptions<OrganizationUpdateMutation, OrganizationUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<OrganizationUpdateMutation, OrganizationUpdateMutationVariables>(OrganizationUpdateDocument, options);
      }
export type OrganizationUpdateMutationHookResult = ReturnType<typeof useOrganizationUpdateMutation>;
export type OrganizationUpdateMutationResult = Apollo.MutationResult<OrganizationUpdateMutation>;
export type OrganizationUpdateMutationOptions = Apollo.BaseMutationOptions<OrganizationUpdateMutation, OrganizationUpdateMutationVariables>;
export const OrganizationLeaveDocument = gql`
    mutation OrganizationLeave($id: ID!) {
  organizationLeave(id: $id) {
    ...OrganizationLeaveFragment
  }
}
    ${OrganizationLeaveFragmentFragmentDoc}`;
export type OrganizationLeaveMutationFn = Apollo.MutationFunction<OrganizationLeaveMutation, OrganizationLeaveMutationVariables>;

/**
 * __useOrganizationLeaveMutation__
 *
 * To run a mutation, you first call `useOrganizationLeaveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrganizationLeaveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [organizationLeaveMutation, { data, loading, error }] = useOrganizationLeaveMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrganizationLeaveMutation(baseOptions?: Apollo.MutationHookOptions<OrganizationLeaveMutation, OrganizationLeaveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<OrganizationLeaveMutation, OrganizationLeaveMutationVariables>(OrganizationLeaveDocument, options);
      }
export type OrganizationLeaveMutationHookResult = ReturnType<typeof useOrganizationLeaveMutation>;
export type OrganizationLeaveMutationResult = Apollo.MutationResult<OrganizationLeaveMutation>;
export type OrganizationLeaveMutationOptions = Apollo.BaseMutationOptions<OrganizationLeaveMutation, OrganizationLeaveMutationVariables>;
export const OrganizationMemberLeaveDocument = gql`
    mutation OrganizationMemberLeave($id: ID!) {
  organizationMemberLeave(id: $id) {
    ...OrganizationMemberLeaveFragment
  }
}
    ${OrganizationMemberLeaveFragmentFragmentDoc}`;
export type OrganizationMemberLeaveMutationFn = Apollo.MutationFunction<OrganizationMemberLeaveMutation, OrganizationMemberLeaveMutationVariables>;

/**
 * __useOrganizationMemberLeaveMutation__
 *
 * To run a mutation, you first call `useOrganizationMemberLeaveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrganizationMemberLeaveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [organizationMemberLeaveMutation, { data, loading, error }] = useOrganizationMemberLeaveMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrganizationMemberLeaveMutation(baseOptions?: Apollo.MutationHookOptions<OrganizationMemberLeaveMutation, OrganizationMemberLeaveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<OrganizationMemberLeaveMutation, OrganizationMemberLeaveMutationVariables>(OrganizationMemberLeaveDocument, options);
      }
export type OrganizationMemberLeaveMutationHookResult = ReturnType<typeof useOrganizationMemberLeaveMutation>;
export type OrganizationMemberLeaveMutationResult = Apollo.MutationResult<OrganizationMemberLeaveMutation>;
export type OrganizationMemberLeaveMutationOptions = Apollo.BaseMutationOptions<OrganizationMemberLeaveMutation, OrganizationMemberLeaveMutationVariables>;
export const OrganizationMemberUpdateDocument = gql`
    mutation OrganizationMemberUpdate($id: ID!, $input: OrganizationMemberUpdateInput!) {
  organizationMemberUpdate(id: $id, input: $input) {
    ...OrganizationMemberUpdateFragment
  }
}
    ${OrganizationMemberUpdateFragmentFragmentDoc}`;
export type OrganizationMemberUpdateMutationFn = Apollo.MutationFunction<OrganizationMemberUpdateMutation, OrganizationMemberUpdateMutationVariables>;

/**
 * __useOrganizationMemberUpdateMutation__
 *
 * To run a mutation, you first call `useOrganizationMemberUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrganizationMemberUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [organizationMemberUpdateMutation, { data, loading, error }] = useOrganizationMemberUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrganizationMemberUpdateMutation(baseOptions?: Apollo.MutationHookOptions<OrganizationMemberUpdateMutation, OrganizationMemberUpdateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<OrganizationMemberUpdateMutation, OrganizationMemberUpdateMutationVariables>(OrganizationMemberUpdateDocument, options);
      }
export type OrganizationMemberUpdateMutationHookResult = ReturnType<typeof useOrganizationMemberUpdateMutation>;
export type OrganizationMemberUpdateMutationResult = Apollo.MutationResult<OrganizationMemberUpdateMutation>;
export type OrganizationMemberUpdateMutationOptions = Apollo.BaseMutationOptions<OrganizationMemberUpdateMutation, OrganizationMemberUpdateMutationVariables>;
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
export const OrganizationJoinDocument = gql`
    mutation OrganizationJoin($input: OrganizationJoinInput!) {
  organizationJoin(input: $input) {
    ...OrganizationJoinFragment
  }
}
    ${OrganizationJoinFragmentFragmentDoc}`;
export type OrganizationJoinMutationFn = Apollo.MutationFunction<OrganizationJoinMutation, OrganizationJoinMutationVariables>;

/**
 * __useOrganizationJoinMutation__
 *
 * To run a mutation, you first call `useOrganizationJoinMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrganizationJoinMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [organizationJoinMutation, { data, loading, error }] = useOrganizationJoinMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOrganizationJoinMutation(baseOptions?: Apollo.MutationHookOptions<OrganizationJoinMutation, OrganizationJoinMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<OrganizationJoinMutation, OrganizationJoinMutationVariables>(OrganizationJoinDocument, options);
      }
export type OrganizationJoinMutationHookResult = ReturnType<typeof useOrganizationJoinMutation>;
export type OrganizationJoinMutationResult = Apollo.MutationResult<OrganizationJoinMutation>;
export type OrganizationJoinMutationOptions = Apollo.BaseMutationOptions<OrganizationJoinMutation, OrganizationJoinMutationVariables>;
export const OrganizationInviteResendDocument = gql`
    mutation OrganizationInviteResend($id: ID!) {
  organizationInviteResend(id: $id) {
    ...ResendOrganizationInviteLinkFragment
  }
}
    ${ResendOrganizationInviteLinkFragmentFragmentDoc}`;
export type OrganizationInviteResendMutationFn = Apollo.MutationFunction<OrganizationInviteResendMutation, OrganizationInviteResendMutationVariables>;

/**
 * __useOrganizationInviteResendMutation__
 *
 * To run a mutation, you first call `useOrganizationInviteResendMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrganizationInviteResendMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [organizationInviteResendMutation, { data, loading, error }] = useOrganizationInviteResendMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrganizationInviteResendMutation(baseOptions?: Apollo.MutationHookOptions<OrganizationInviteResendMutation, OrganizationInviteResendMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<OrganizationInviteResendMutation, OrganizationInviteResendMutationVariables>(OrganizationInviteResendDocument, options);
      }
export type OrganizationInviteResendMutationHookResult = ReturnType<typeof useOrganizationInviteResendMutation>;
export type OrganizationInviteResendMutationResult = Apollo.MutationResult<OrganizationInviteResendMutation>;
export type OrganizationInviteResendMutationOptions = Apollo.BaseMutationOptions<OrganizationInviteResendMutation, OrganizationInviteResendMutationVariables>;
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
export const OrganizationInviteDeleteDocument = gql`
    mutation OrganizationInviteDelete($id: ID!) {
  organizationInviteDelete(id: $id) {
    ...OrganizationInviteDeleteFragment
  }
}
    ${OrganizationInviteDeleteFragmentFragmentDoc}`;
export type OrganizationInviteDeleteMutationFn = Apollo.MutationFunction<OrganizationInviteDeleteMutation, OrganizationInviteDeleteMutationVariables>;

/**
 * __useOrganizationInviteDeleteMutation__
 *
 * To run a mutation, you first call `useOrganizationInviteDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrganizationInviteDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [organizationInviteDeleteMutation, { data, loading, error }] = useOrganizationInviteDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrganizationInviteDeleteMutation(baseOptions?: Apollo.MutationHookOptions<OrganizationInviteDeleteMutation, OrganizationInviteDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<OrganizationInviteDeleteMutation, OrganizationInviteDeleteMutationVariables>(OrganizationInviteDeleteDocument, options);
      }
export type OrganizationInviteDeleteMutationHookResult = ReturnType<typeof useOrganizationInviteDeleteMutation>;
export type OrganizationInviteDeleteMutationResult = Apollo.MutationResult<OrganizationInviteDeleteMutation>;
export type OrganizationInviteDeleteMutationOptions = Apollo.BaseMutationOptions<OrganizationInviteDeleteMutation, OrganizationInviteDeleteMutationVariables>;
export const OrganizationInviteDetailsDocument = gql`
    query organizationInviteDetails($inviteLink: String!) {
  organizationInviteDetails(inviteLink: $inviteLink) {
    ...OrganizationInviteLinkDetailsFragment
    ...OrganizationInviteDetailsFragment
  }
}
    ${OrganizationInviteLinkDetailsFragmentFragmentDoc}
${OrganizationInviteDetailsFragmentFragmentDoc}`;

/**
 * __useOrganizationInviteDetailsQuery__
 *
 * To run a query within a React component, call `useOrganizationInviteDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrganizationInviteDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrganizationInviteDetailsQuery({
 *   variables: {
 *      inviteLink: // value for 'inviteLink'
 *   },
 * });
 */
export function useOrganizationInviteDetailsQuery(baseOptions: Apollo.QueryHookOptions<OrganizationInviteDetailsQuery, OrganizationInviteDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrganizationInviteDetailsQuery, OrganizationInviteDetailsQueryVariables>(OrganizationInviteDetailsDocument, options);
      }
export function useOrganizationInviteDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrganizationInviteDetailsQuery, OrganizationInviteDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrganizationInviteDetailsQuery, OrganizationInviteDetailsQueryVariables>(OrganizationInviteDetailsDocument, options);
        }
export type OrganizationInviteDetailsQueryHookResult = ReturnType<typeof useOrganizationInviteDetailsQuery>;
export type OrganizationInviteDetailsLazyQueryHookResult = ReturnType<typeof useOrganizationInviteDetailsLazyQuery>;
export type OrganizationInviteDetailsQueryResult = Apollo.QueryResult<OrganizationInviteDetailsQuery, OrganizationInviteDetailsQueryVariables>;
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