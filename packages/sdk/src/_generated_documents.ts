import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
    DateTime: Date;
    JSONString: any;
    UUID: any;
    /** _Any value scalar as defined by Federation spec. */
    _Any: any;
};

/** Represents an organization. */
export type AuthOrganization = Node & {
    __typename?: "AuthOrganization";
    /** The ID of the organization. */
    id: Scalars["ID"];
    /**
     * Member count
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     */
    memberCount: Scalars["Int"];
    /**
     * Name of the organization.
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     */
    name: Scalars["String"];
    /** Slug of the organization. */
    slug: Scalars["String"];
};

/** Represents an authenticated user data. */
export type AuthUser = Node & {
    __typename?: "AuthUser";
    /** The email address of the user. */
    email: Scalars["String"];
    /** The given name of the user. */
    firstName: Scalars["String"];
    /** The ID of the user. */
    id: Scalars["ID"];
    /** Determine if the user is active. */
    isActive: Scalars["Boolean"];
    /** Determine if the user has finished onboarding. */
    isOnboarded: Scalars["Boolean"];
    /** Determine if the user is a staff admin. */
    isStaff: Scalars["Boolean"];
    /** The family name of the user. */
    lastName: Scalars["String"];
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
    __typename?: "BaseProject";
    /** API token for project. */
    apiToken: Scalars["String"];
    /** The ID of the project. */
    id: Scalars["ID"];
    /** Name of the project. */
    name: Scalars["String"];
};

/** Represents a theme. */
export type BaseProjectTheme = Node & {
    __typename?: "BaseProjectTheme";
    /** The settings of the theme. */
    colorScheme?: Maybe<Scalars["JSONString"]>;
    /** The ID of the theme. */
    id: Scalars["ID"];
    /** Name of the theme. */
    name: Scalars["String"];
    /** The settings of the theme. */
    settings?: Maybe<Scalars["JSONString"]>;
};

/** Represents a survey from used by our sdk. */
export type BaseSurvey = Node & {
    __typename?: "BaseSurvey";
    /** The distribution channels supported by the survey */
    channels: Array<BaseSurveyChannel>;
    /** The time at which the survey was created. */
    createdAt: Scalars["DateTime"];
    /** The date at which the survey was ended. */
    endDate?: Maybe<Scalars["DateTime"]>;
    /** The ID of the survey. */
    id: Scalars["ID"];
    /** Name of the survey. */
    name?: Maybe<Scalars["String"]>;
    /** The project the survey belongs to */
    project?: Maybe<BaseProject>;
    /** The questions in the the survey */
    questions: Array<BaseSurveyQuestion>;
    /** The settings of the survey. */
    settings?: Maybe<Scalars["JSONString"]>;
    /** Slug of the survey. */
    slug: Scalars["String"];
    /** The date at which the survey was started. */
    startDate?: Maybe<Scalars["DateTime"]>;
    /** The status of the survey */
    status: SurveyStatusEnum;
    /** The theme of the survey. */
    theme?: Maybe<BaseProjectTheme>;
};

/** Represents a survey from used by our sdk. */
export type BaseSurveyChannelsArgs = {
    channelType?: Maybe<SurveyChannelTypeEnum>;
};

/** Represents a survey channel. */
export type BaseSurveyChannel = Node & {
    __typename?: "BaseSurveyChannel";
    /** The settings of the question. */
    conditions?: Maybe<Scalars["JSONString"]>;
    /** The time at which the channel was created. */
    createdAt: Scalars["DateTime"];
    /** The ID of the channel. */
    id: Scalars["ID"];
    /** Unique link to the channel. */
    link: Scalars["String"];
    /** The settings of the question. */
    settings?: Maybe<Scalars["JSONString"]>;
    /** The options of the question. */
    triggers?: Maybe<Scalars["JSONString"]>;
    /** The type of the survey channel */
    type: SurveyChannelTypeEnum;
};

export type BaseSurveyCountableConnection = {
    __typename?: "BaseSurveyCountableConnection";
    edges: Array<BaseSurveyCountableEdge>;
    nodes: Array<BaseSurvey>;
    /** Pagination data for this connection. */
    pageInfo: PageInfo;
    /** A total count of items in the collection. */
    totalCount?: Maybe<Scalars["Int"]>;
};

export type BaseSurveyCountableEdge = {
    __typename?: "BaseSurveyCountableEdge";
    /** A cursor for use in pagination. */
    cursor: Scalars["String"];
    /** The item at the end of the edge. */
    node: BaseSurvey;
};

/** Represents a question. */
export type BaseSurveyQuestion = Node & {
    __typename?: "BaseSurveyQuestion";
    /** The time at which the question was created. */
    createdAt: Scalars["DateTime"];
    /** Description of the question. */
    description: Scalars["String"];
    /** The ID of the question. */
    id: Scalars["ID"];
    /** Label of the question. */
    label: Scalars["String"];
    /** The position of the question. */
    maxPath: Scalars["Int"];
    /** The options of the question. */
    options?: Maybe<Scalars["JSONString"]>;
    /** The position of the question. */
    orderNumber: Scalars["Int"];
    /** The settings of the question. */
    settings?: Maybe<Scalars["JSONString"]>;
    /** The type of the question */
    type: SurveyQuestionTypeEnum;
};

export type DateRangeInput = {
    /** Start date. */
    gte?: Maybe<Scalars["Date"]>;
    /** End date. */
    lte?: Maybe<Scalars["Date"]>;
};

export type DateTimeRangeInput = {
    /** Start date. */
    gte?: Maybe<Scalars["DateTime"]>;
    /** End date. */
    lte?: Maybe<Scalars["DateTime"]>;
};

/** Authenticates a user account via email and authentication token. */
export type EmailTokenUserAuth = {
    __typename?: "EmailTokenUserAuth";
    /** CSRF token required to re-generate access token. */
    csrfToken?: Maybe<Scalars["String"]>;
    errors: Array<UserError>;
    /** JWT refresh token, required to re-generate access token. */
    refreshToken?: Maybe<Scalars["String"]>;
    /** Access token to authenticate the user. */
    token?: Maybe<Scalars["String"]>;
    /** A user that has access to the the resources of an organization. */
    user?: Maybe<AuthUser>;
    userErrors: Array<UserError>;
};

/** Finds or creates a new user account by email and sends an email with token. */
export type EmailUserAuthChallenge = {
    __typename?: "EmailUserAuthChallenge";
    /** Supported challenge for this user. */
    authType?: Maybe<Scalars["String"]>;
    errors: Array<UserError>;
    /** Whether the operation was successful. */
    success?: Maybe<Scalars["Boolean"]>;
    userErrors: Array<UserError>;
};

/** Represents an event. */
export type Event = Node & {
    __typename?: "Event";
    /** The time the event was created */
    createdAt?: Maybe<Scalars["DateTime"]>;
    /** The event name */
    distinctId: Scalars["String"];
    /** The event name */
    event: Scalars["String"];
    /** The ID of the event. */
    id: Scalars["ID"];
    /**
     * The project the event belongs to
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    project: Project;
    /** The event properties */
    properties?: Maybe<Scalars["JSONString"]>;
    /** The time the event occurred */
    timestamp?: Maybe<Scalars["DateTime"]>;
};

/** Captures event. */
export type EventCapture = {
    __typename?: "EventCapture";
    errors: Array<EventError>;
    eventErrors: Array<EventError>;
    /** Whether the operation was successful. */
    status?: Maybe<Scalars["Boolean"]>;
};

export type EventCaptureInput = {
    /** The user attributes. */
    attributes?: Maybe<Scalars["JSONString"]>;
    /** The name of the event. */
    event: Scalars["String"];
    /** The event properties. */
    properties?: Maybe<Scalars["JSONString"]>;
    /** The time the event happened */
    timestamp: Scalars["DateTime"];
    /** The user distinct ID. */
    userId?: Maybe<Scalars["ID"]>;
    /** The event payload ID. */
    uuid?: Maybe<Scalars["UUID"]>;
};

export type EventCountableConnection = {
    __typename?: "EventCountableConnection";
    edges: Array<EventCountableEdge>;
    nodes: Array<Event>;
    /** Pagination data for this connection. */
    pageInfo: PageInfo;
    /** A total count of items in the collection. */
    totalCount?: Maybe<Scalars["Int"]>;
};

export type EventCountableEdge = {
    __typename?: "EventCountableEdge";
    /** A cursor for use in pagination. */
    cursor: Scalars["String"];
    /** The item at the end of the edge. */
    node: Event;
};

/** Represents an event definition. */
export type EventDefinition = Node & {
    __typename?: "EventDefinition";
    /** The time the event was created */
    createdAt?: Maybe<Scalars["DateTime"]>;
    /** The ID of the event definition. */
    id: Scalars["ID"];
    /** The time the event was last seen */
    lastSeenAt?: Maybe<Scalars["DateTime"]>;
    /** The name of the event definition */
    name: Scalars["String"];
    /**
     * The project the event definition belongs to
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    project: Project;
};

export type EventDefinitionCountableConnection = {
    __typename?: "EventDefinitionCountableConnection";
    edges: Array<EventDefinitionCountableEdge>;
    nodes: Array<EventDefinition>;
    /** Pagination data for this connection. */
    pageInfo: PageInfo;
    /** A total count of items in the collection. */
    totalCount?: Maybe<Scalars["Int"]>;
};

export type EventDefinitionCountableEdge = {
    __typename?: "EventDefinitionCountableEdge";
    /** A cursor for use in pagination. */
    cursor: Scalars["String"];
    /** The item at the end of the edge. */
    node: EventDefinition;
};

/** Represents errors in event mutations. */
export type EventError = {
    __typename?: "EventError";
    /** The error code. */
    code: EventErrorCode;
    /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
    field?: Maybe<Scalars["String"]>;
    /** The error message. */
    message?: Maybe<Scalars["String"]>;
};

/** An enumeration. */
export enum EventErrorCode {
    Forbidden = "FORBIDDEN",
    GraphqlError = "GRAPHQL_ERROR",
    Invalid = "INVALID"
}

/** Represents an event property. */
export type EventProperty = Node & {
    __typename?: "EventProperty";
    /** The name of the event */
    event: Scalars["String"];
    /** The ID of the event property. */
    id: Scalars["ID"];
    /**
     * The project the event property belongs to
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    project: Project;
    /** The property of the event */
    property: Scalars["String"];
};

export type EventPropertyCountableConnection = {
    __typename?: "EventPropertyCountableConnection";
    edges: Array<EventPropertyCountableEdge>;
    nodes: Array<EventProperty>;
    /** Pagination data for this connection. */
    pageInfo: PageInfo;
    /** A total count of items in the collection. */
    totalCount?: Maybe<Scalars["Int"]>;
};

export type EventPropertyCountableEdge = {
    __typename?: "EventPropertyCountableEdge";
    /** A cursor for use in pagination. */
    cursor: Scalars["String"];
    /** The item at the end of the edge. */
    node: EventProperty;
};

/** Finds or creates a new user account from google auth credentials. */
export type GoogleUserAuth = {
    __typename?: "GoogleUserAuth";
    /** CSRF token required to re-generate access token. */
    csrfToken?: Maybe<Scalars["String"]>;
    errors: Array<UserError>;
    /** JWT refresh token, required to re-generate access token. */
    refreshToken?: Maybe<Scalars["String"]>;
    /** Whether the operation was successful. */
    success?: Maybe<Scalars["Boolean"]>;
    /** Access token to authenticate the user. */
    token?: Maybe<Scalars["String"]>;
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
    __typename?: "Logout";
    errors: Array<UserError>;
    userErrors: Array<UserError>;
};

export type Mutation = {
    __typename?: "Mutation";
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
    email: Scalars["String"];
    inviteLink?: Maybe<Scalars["String"]>;
    token: Scalars["String"];
};

export type MutationEmailUserAuthChallengeArgs = {
    email: Scalars["String"];
    inviteLink?: Maybe<Scalars["String"]>;
};

export type MutationEventCaptureArgs = {
    batch?: Maybe<Array<EventCaptureInput>>;
    input?: Maybe<EventCaptureInput>;
    sentAt?: Maybe<Scalars["DateTime"]>;
};

export type MutationGoogleUserAuthArgs = {
    code: Scalars["String"];
    inviteLink?: Maybe<Scalars["String"]>;
};

export type MutationOrganizationCreateArgs = {
    input: OrganizationCreateInput;
    survey?: Maybe<OnboardingCustomerSurvey>;
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

export type MutationProjectThemeCreateArgs = {
    input: ProjectThemeCreateInput;
};

export type MutationProjectThemeDeleteArgs = {
    id: Scalars["ID"];
};

export type MutationProjectThemeUpdateArgs = {
    id: Scalars["ID"];
    input: ProjectThemeUpdateInput;
};

export type MutationProjectUpdateArgs = {
    input: ProjectUpdateInput;
};

export type MutationSurveyChannelCreateArgs = {
    input: SurveyChannelCreateInput;
};

export type MutationSurveyChannelDeleteArgs = {
    id: Scalars["ID"];
};

export type MutationSurveyChannelUpdateArgs = {
    id: Scalars["ID"];
    input: SurveyChannelUpdateInput;
};

export type MutationSurveyCreateArgs = {
    input: SurveyCreateInput;
};

export type MutationSurveyDeleteArgs = {
    id: Scalars["ID"];
};

export type MutationSurveyQuestionCreateArgs = {
    input: SurveyQuestionCreateInput;
};

export type MutationSurveyQuestionDeleteArgs = {
    id: Scalars["ID"];
};

export type MutationSurveyQuestionUpdateArgs = {
    id: Scalars["ID"];
    input: SurveyQuestionUpdateInput;
};

export type MutationSurveyResponseCreateArgs = {
    input: SurveyResponseCreateInput;
};

export type MutationSurveyResponseUpdateArgs = {
    id: Scalars["ID"];
    input: SurveyResponseUpdateInput;
};

export type MutationSurveyUpdateArgs = {
    id: Scalars["ID"];
    input: SurveyUpdateInput;
};

export type MutationTokenRefreshArgs = {
    csrfToken?: Maybe<Scalars["String"]>;
    refreshToken?: Maybe<Scalars["String"]>;
};

export type MutationUserUpdateArgs = {
    input: UserInput;
};

/** An object with an ID */
export type Node = {
    /** The ID of the object. */
    id: Scalars["ID"];
};

export type OnboardingCustomerSurvey = {
    /** Your role in your company */
    companyRole?: Maybe<Scalars["String"]>;
    /** Size of your company */
    companySize?: Maybe<Scalars["String"]>;
};

export enum OrderDirection {
    /** Specifies an ascending sort order. */
    Asc = "ASC",
    /** Specifies a descending sort order. */
    Desc = "DESC"
}

/** Represents an organization. */
export type Organization = Node & {
    __typename?: "Organization";
    /** The ID of the organization. */
    id: Scalars["ID"];
    /**
     * Member count
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     */
    memberCount: Scalars["Int"];
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
    name: Scalars["String"];
    /**
     * Projects associated with the organization.
     *
     * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
     */
    projects?: Maybe<ProjectCountableConnection>;
    /** Slug of the organization. */
    slug: Scalars["String"];
};

/** Represents an organization. */
export type OrganizationMembersArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
    orderBy?: Maybe<UserSortingInput>;
};

/** Represents an organization. */
export type OrganizationProjectsArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
    orderBy?: Maybe<UserSortingInput>;
};

export type OrganizationCountableConnection = {
    __typename?: "OrganizationCountableConnection";
    edges: Array<OrganizationCountableEdge>;
    nodes: Array<Organization>;
    /** Pagination data for this connection. */
    pageInfo: PageInfo;
    /** A total count of items in the collection. */
    totalCount?: Maybe<Scalars["Int"]>;
};

export type OrganizationCountableEdge = {
    __typename?: "OrganizationCountableEdge";
    /** A cursor for use in pagination. */
    cursor: Scalars["String"];
    /** The item at the end of the edge. */
    node: Organization;
};

/**
 * Creates new organization.
 *
 * Requires one of the following permissions: AUTHENTICATED_USER.
 */
export type OrganizationCreate = {
    __typename?: "OrganizationCreate";
    errors: Array<OrganizationError>;
    /** An organization. Organizations are root-level objects that contain users and projects. */
    organization?: Maybe<AuthOrganization>;
    organizationErrors: Array<OrganizationError>;
    /** A user that has access to the the resources of an organization. */
    user?: Maybe<AuthUser>;
};

export type OrganizationCreateInput = {
    /** The name of the organization. */
    name: Scalars["String"];
    /** The slug of the organization. */
    slug: Scalars["String"];
    /** The timezone of the organization, passed in by client. */
    timezone: Scalars["String"];
};

/** Represents errors in organization mutations. */
export type OrganizationError = {
    __typename?: "OrganizationError";
    /** The error code. */
    code: OrganizationErrorCode;
    /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
    field?: Maybe<Scalars["String"]>;
    /** The error message. */
    message?: Maybe<Scalars["String"]>;
};

/** An enumeration. */
export enum OrganizationErrorCode {
    AlreadyExists = "ALREADY_EXISTS",
    GraphqlError = "GRAPHQL_ERROR",
    Invalid = "INVALID",
    NotFound = "NOT_FOUND",
    Required = "REQUIRED",
    Unique = "UNIQUE"
}

/** The organization invite that was created or updated. */
export type OrganizationInvite = Node & {
    __typename?: "OrganizationInvite";
    /** The time at which the invite was created. */
    createdAt: Scalars["DateTime"];
    /** The invitees email address. */
    email: Scalars["String"];
    /** If the invite has expired. */
    expired: Scalars["Boolean"];
    /** First name of the invite. */
    firstName?: Maybe<Scalars["String"]>;
    /** The unique identifier of the invite. */
    id: Scalars["ID"];
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
    updatedAt: Scalars["DateTime"];
};

/**
 * Creates a new organization invite.
 *
 * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
 */
export type OrganizationInviteCreate = {
    __typename?: "OrganizationInviteCreate";
    errors: Array<OrganizationError>;
    organizationErrors: Array<OrganizationError>;
    organizationInvite?: Maybe<OrganizationInvite>;
};

export type OrganizationInviteCreateInput = {
    /** The email of the invitee. */
    email: Scalars["String"];
    /** The identifier in UUID v4 format. If none is provided, the backend will generate one. */
    id?: Maybe<Scalars["UUID"]>;
    /** The message to send to the invitee. */
    message?: Maybe<Scalars["String"]>;
    /** What member role the invite should grant. */
    role?: Maybe<RoleLevel>;
};

/** The organization invite that was created or updated. */
export type OrganizationInviteDetails = Node & {
    __typename?: "OrganizationInviteDetails";
    /** The time at which the invite was created. */
    createdAt: Scalars["DateTime"];
    /** The invitees email address. */
    email: Scalars["String"];
    /** If the invite has expired. */
    expired: Scalars["Boolean"];
    /** First name of the invite. */
    firstName?: Maybe<Scalars["String"]>;
    /** The unique identifier of the invite. */
    id: Scalars["ID"];
    /** The name/email of the inviter. */
    inviter: Scalars["String"];
    /** The ID of the organization the invite is for. */
    organizationId: Scalars["ID"];
    /** The logo of the organization the invite is for. */
    organizationLogo?: Maybe<Scalars["String"]>;
    /** The name of the organization the invite is for. */
    organizationName: Scalars["String"];
    /** The user role that the invitee will receive upon accepting the invite. */
    role: RoleLevel;
    /** The last time at which the invite was updated. */
    updatedAt: Scalars["DateTime"];
};

/** The organization invite link. */
export type OrganizationInviteLink = {
    __typename?: "OrganizationInviteLink";
    /**
     * The link of the organization the invite is for.
     *
     * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
     */
    inviteLink: Scalars["String"];
};

/** The organization invite that was created or updated. */
export type OrganizationInviteLinkDetails = Node & {
    __typename?: "OrganizationInviteLinkDetails";
    /** The ID of the object. */
    id: Scalars["ID"];
    /** The ID of the organization the invite is for. */
    organizationId: Scalars["ID"];
    /** The logo of the organization the invite is for. */
    organizationLogo?: Maybe<Scalars["String"]>;
    /** The name of the organization the invite is for. */
    organizationName: Scalars["String"];
};

/**
 * Reset the current organization invite link..
 *
 * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
 */
export type OrganizationInviteLinkReset = {
    __typename?: "OrganizationInviteLinkReset";
    errors: Array<OrganizationError>;
    /** The current organization invite link. */
    inviteLink?: Maybe<Scalars["String"]>;
    organizationErrors: Array<OrganizationError>;
    /** Whether the operation was successful. */
    success?: Maybe<Scalars["Boolean"]>;
};

/**
 * Joins an organization
 *
 * Requires one of the following permissions: AUTHENTICATED_USER.
 */
export type OrganizationJoin = {
    __typename?: "OrganizationJoin";
    errors: Array<OrganizationError>;
    organizationErrors: Array<OrganizationError>;
    /** A user that has access to the the resources of an organization. */
    user: AuthUser;
};

export type OrganizationJoinInput = {
    /** An invite link for an organization. */
    inviteLink: Scalars["String"];
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
    __typename?: "PageInfo";
    /** When paginating forwards, the cursor to continue. */
    endCursor?: Maybe<Scalars["String"]>;
    /** When paginating forwards, are there more items? */
    hasNextPage: Scalars["Boolean"];
    /** When paginating backwards, are there more items? */
    hasPreviousPage: Scalars["Boolean"];
    /** When paginating backwards, the cursor to continue. */
    startCursor?: Maybe<Scalars["String"]>;
};

/** Represents a person. */
export type Person = Node & {
    __typename?: "Person";
    /** The person's attributes */
    attributes?: Maybe<Scalars["JSONString"]>;
    /** The time the person was created */
    createdAt?: Maybe<Scalars["DateTime"]>;
    /** The person's distinct ids */
    distinctIds?: Maybe<Array<Scalars["String"]>>;
    /** The ID of the event property. */
    id: Scalars["ID"];
    /** Whether the person has been identified */
    isIdentified: Scalars["Boolean"];
    /**
     * The project the person belongs to
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    project: Project;
    /** The person's uuid */
    uuid: Scalars["UUID"];
};

export type PersonCountableConnection = {
    __typename?: "PersonCountableConnection";
    edges: Array<PersonCountableEdge>;
    nodes: Array<Person>;
    /** Pagination data for this connection. */
    pageInfo: PageInfo;
    /** A total count of items in the collection. */
    totalCount?: Maybe<Scalars["Int"]>;
};

export type PersonCountableEdge = {
    __typename?: "PersonCountableEdge";
    /** A cursor for use in pagination. */
    cursor: Scalars["String"];
    /** The item at the end of the edge. */
    node: Person;
};

/** Represents a project. */
export type Project = Node & {
    __typename?: "Project";
    /** Whether the project is private or not. */
    accessControl?: Maybe<Scalars["Boolean"]>;
    /** API token for project. */
    apiToken: Scalars["String"];
    /** The data required for the onboarding process */
    hasCompletedOnboardingFor?: Maybe<Scalars["JSONString"]>;
    /** The ID of the project. */
    id: Scalars["ID"];
    /** Name of the project. */
    name: Scalars["String"];
    /** Organization the project belongs to. */
    organization: AuthOrganization;
    /** Slug of the project. */
    slug: Scalars["String"];
    /** The timezone of the project. */
    timezone: Scalars["String"];
};

export type ProjectCountableConnection = {
    __typename?: "ProjectCountableConnection";
    edges: Array<ProjectCountableEdge>;
    nodes: Array<Project>;
    /** Pagination data for this connection. */
    pageInfo: PageInfo;
    /** A total count of items in the collection. */
    totalCount?: Maybe<Scalars["Int"]>;
};

export type ProjectCountableEdge = {
    __typename?: "ProjectCountableEdge";
    /** A cursor for use in pagination. */
    cursor: Scalars["String"];
    /** The item at the end of the edge. */
    node: Project;
};

/** Creates a new project */
export type ProjectCreate = {
    __typename?: "ProjectCreate";
    errors: Array<ProjectError>;
    project?: Maybe<Project>;
    projectErrors: Array<ProjectError>;
};

export type ProjectCreateInput = {
    /** The identifier in UUID v4 format. If none is provided, the backend will generate one. */
    id?: Maybe<Scalars["UUID"]>;
    /** The name of the project. */
    name: Scalars["String"];
    /** Whether the project is private or not. */
    private?: Maybe<Scalars["Boolean"]>;
    /** The timezone of the project. */
    timezone?: Maybe<Scalars["String"]>;
};

/** Represents errors in project mutations. */
export type ProjectError = {
    __typename?: "ProjectError";
    /** The error code. */
    code: ProjectErrorCode;
    /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
    field?: Maybe<Scalars["String"]>;
    /** The error message. */
    message?: Maybe<Scalars["String"]>;
};

/** An enumeration. */
export enum ProjectErrorCode {
    AlreadyExists = "ALREADY_EXISTS",
    GraphqlError = "GRAPHQL_ERROR",
    Invalid = "INVALID",
    InvalidPermission = "INVALID_PERMISSION",
    NotFound = "NOT_FOUND",
    Required = "REQUIRED",
    Unique = "UNIQUE"
}

export enum ProjectSortField {
    /** Sort projects by created at. */
    CreatedAt = "CREATED_AT",
    /** Sort projects by name. */
    Name = "NAME",
    /** Sort projects by updated at. */
    UpdatedAt = "UPDATED_AT"
}

export type ProjectSortingInput = {
    /** Specifies the direction in which to sort projects. */
    direction: OrderDirection;
    /** Sort projects by the selected field. */
    field: ProjectSortField;
};

/** Represents a theme. */
export type ProjectTheme = Node & {
    __typename?: "ProjectTheme";
    /** The settings of the theme. */
    colorScheme?: Maybe<Scalars["JSONString"]>;
    /** The time at which the invite was created. */
    createdAt: Scalars["DateTime"];
    /**
     * The user who created the theme.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    creator: User;
    /** The ID of the theme. */
    id: Scalars["ID"];
    /** Name of the theme. */
    name: Scalars["String"];
    /**
     * The project the theme belongs to.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    project: Project;
    /** For internal purpose. */
    reference?: Maybe<Scalars["ID"]>;
    /** The settings of the theme. */
    settings?: Maybe<Scalars["JSONString"]>;
    /** The last time at which the invite was updated. */
    updatedAt: Scalars["DateTime"];
};

export type ProjectThemeCountableConnection = {
    __typename?: "ProjectThemeCountableConnection";
    edges: Array<ProjectThemeCountableEdge>;
    nodes: Array<ProjectTheme>;
    /** Pagination data for this connection. */
    pageInfo: PageInfo;
    /** A total count of items in the collection. */
    totalCount?: Maybe<Scalars["Int"]>;
};

export type ProjectThemeCountableEdge = {
    __typename?: "ProjectThemeCountableEdge";
    /** A cursor for use in pagination. */
    cursor: Scalars["String"];
    /** The item at the end of the edge. */
    node: ProjectTheme;
};

/**
 * Creates a new theme
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type ProjectThemeCreate = {
    __typename?: "ProjectThemeCreate";
    errors: Array<ProjectError>;
    projectErrors: Array<ProjectError>;
    projectTheme?: Maybe<ProjectTheme>;
};

export type ProjectThemeCreateInput = {
    /** The color scheme of the theme. */
    colorScheme?: Maybe<Scalars["JSONString"]>;
    /** The id of the theme. */
    id?: Maybe<Scalars["UUID"]>;
    /** The name of the theme. */
    name: Scalars["String"];
};

/**
 * Deletes a theme.
 *
 * Requires one of the following permissions: PROJECT_ADMIN_ACCESS.
 */
export type ProjectThemeDelete = {
    __typename?: "ProjectThemeDelete";
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
    __typename?: "ProjectThemeUpdate";
    errors: Array<ProjectError>;
    projectErrors: Array<ProjectError>;
    projectTheme?: Maybe<ProjectTheme>;
};

export type ProjectThemeUpdateInput = {
    /** The color scheme of the theme. */
    colorScheme?: Maybe<Scalars["JSONString"]>;
    /** The name of the theme. */
    name?: Maybe<Scalars["String"]>;
};

/** Updates a project. */
export type ProjectUpdate = {
    __typename?: "ProjectUpdate";
    errors: Array<ProjectError>;
    project?: Maybe<Project>;
    projectErrors: Array<ProjectError>;
};

export type ProjectUpdateInput = {
    /** The data required for the onboarding process. */
    hasCompletedOnboardingFor?: Maybe<Scalars["JSONString"]>;
    /** The icon of the project. */
    icon?: Maybe<Scalars["String"]>;
    /** The name of the project. */
    name?: Maybe<Scalars["String"]>;
    /** Whether the project is private or not. */
    private?: Maybe<Scalars["Boolean"]>;
    /** The timezone of the project. */
    timezone?: Maybe<Scalars["String"]>;
};

/** Represents a property definition. */
export type PropertyDefinition = Node & {
    __typename?: "PropertyDefinition";
    /** The ID of the event property. */
    id: Scalars["ID"];
    /** Whether property accepts a numerical value */
    isNumerical: Scalars["Boolean"];
    /** The name of the property definition */
    name: Scalars["String"];
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
    __typename?: "PropertyDefinitionCountableConnection";
    edges: Array<PropertyDefinitionCountableEdge>;
    nodes: Array<PropertyDefinition>;
    /** Pagination data for this connection. */
    pageInfo: PageInfo;
    /** A total count of items in the collection. */
    totalCount?: Maybe<Scalars["Int"]>;
};

export type PropertyDefinitionCountableEdge = {
    __typename?: "PropertyDefinitionCountableEdge";
    /** A cursor for use in pagination. */
    cursor: Scalars["String"];
    /** The item at the end of the edge. */
    node: PropertyDefinition;
};

export enum PropertyDefinitionTypeEnum {
    Event = "EVENT",
    Group = "GROUP",
    Person = "PERSON"
}

export enum PropertyTypeEnum {
    Boolean = "Boolean",
    Datetime = "Datetime",
    Numeric = "Numeric",
    String = "String"
}

export type Query = {
    __typename?: "Query";
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
    representations?: Maybe<Array<Maybe<Scalars["_Any"]>>>;
};

export type QueryActiveSurveysArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    filter?: Maybe<SurveyFilterInput>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
    sortBy?: Maybe<SurveySortingInput>;
};

export type QueryChannelsArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    id: Scalars["ID"];
    last?: Maybe<Scalars["Int"]>;
};

export type QueryEventDefinitionsArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
};

export type QueryEventPropertiesArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    event?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
};

export type QueryEventsArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
};

export type QueryOrganizationInviteDetailsArgs = {
    inviteLink: Scalars["String"];
};

export type QueryPersonsArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
};

export type QueryPropertyDefinitionsArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    definitionType?: Maybe<PropertyDefinitionTypeEnum>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
};

export type QueryQuestionsArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    id: Scalars["ID"];
    last?: Maybe<Scalars["Int"]>;
};

export type QuerySurveyArgs = {
    id?: Maybe<Scalars["ID"]>;
    slug?: Maybe<Scalars["String"]>;
};

export type QuerySurveyByChannelArgs = {
    id?: Maybe<Scalars["ID"]>;
    link?: Maybe<Scalars["String"]>;
};

export type QuerySurveysArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    filter?: Maybe<SurveyFilterInput>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
    sortBy?: Maybe<SurveySortingInput>;
};

export type QueryThemesArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
};

/** Refresh JWT token. Mutation tries to take refreshToken from the input. If it fails it will try to take `refreshToken` from the http-only cookie `refreshToken`. `csrfToken` is required when `refreshToken` is provided as a cookie. */
export type RefreshToken = {
    __typename?: "RefreshToken";
    errors: Array<UserError>;
    /** Acess token to authenticate the user. */
    token?: Maybe<Scalars["String"]>;
    userErrors: Array<UserError>;
};

export enum RoleLevel {
    Admin = "ADMIN",
    Member = "MEMBER"
}

/** Represents a survey. */
export type Survey = Node & {
    __typename?: "Survey";
    /**
     * The distribution channels supported by the survey
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    channels: SurveyChannelCountableConnection;
    /** The time at which the survey was created. */
    createdAt: Scalars["DateTime"];
    /**
     * The user who created the theme.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    creator: User;
    /** The ID of the survey. */
    id: Scalars["ID"];
    /** Name of the survey. */
    name?: Maybe<Scalars["String"]>;
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
    reference?: Maybe<Scalars["ID"]>;
    /** The settings of the survey. */
    settings?: Maybe<Scalars["JSONString"]>;
    /** Slug of the survey. */
    slug: Scalars["String"];
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
    updatedAt: Scalars["DateTime"];
};

/** Represents a survey. */
export type SurveyChannelsArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
};

/** Represents a survey. */
export type SurveyQuestionsArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
};

/** Represents a survey channel. */
export type SurveyChannel = Node & {
    __typename?: "SurveyChannel";
    /** The settings of the question. */
    conditions?: Maybe<Scalars["JSONString"]>;
    /** The time at which the channel was created. */
    createdAt: Scalars["DateTime"];
    /** The ID of the channel. */
    id: Scalars["ID"];
    /** Unique link to the channel. */
    link: Scalars["String"];
    /** For internal purpose. */
    reference?: Maybe<Scalars["ID"]>;
    /** The settings of the question. */
    settings?: Maybe<Scalars["JSONString"]>;
    /**
     * The project the survey belongs to
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    survey?: Maybe<Survey>;
    /** The options of the question. */
    triggers?: Maybe<Scalars["JSONString"]>;
    /** The type of the survey channel */
    type: SurveyChannelTypeEnum;
};

export type SurveyChannelCountableConnection = {
    __typename?: "SurveyChannelCountableConnection";
    edges: Array<SurveyChannelCountableEdge>;
    nodes: Array<SurveyChannel>;
    /** Pagination data for this connection. */
    pageInfo: PageInfo;
    /** A total count of items in the collection. */
    totalCount?: Maybe<Scalars["Int"]>;
};

export type SurveyChannelCountableEdge = {
    __typename?: "SurveyChannelCountableEdge";
    /** A cursor for use in pagination. */
    cursor: Scalars["String"];
    /** The item at the end of the edge. */
    node: SurveyChannel;
};

/**
 * Creates a new distibution channel
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type SurveyChannelCreate = {
    __typename?: "SurveyChannelCreate";
    errors: Array<SurveyError>;
    /** The checkout with the added gift card or voucher. */
    surveyChannel?: Maybe<SurveyChannel>;
    surveyErrors: Array<SurveyError>;
};

export type SurveyChannelCreateInput = {
    /** The conditions for the channel. */
    conditions?: Maybe<Scalars["JSONString"]>;
    /** The id of the channel. */
    id?: Maybe<Scalars["UUID"]>;
    /** The settings of the channel. */
    settings?: Maybe<Scalars["JSONString"]>;
    /** The survey ID the channel belongs to. */
    surveyId: Scalars["ID"];
    /** The triggers for the channel. */
    triggers?: Maybe<Scalars["JSONString"]>;
    /** The type of the distribution channel */
    type?: Maybe<SurveyChannelTypeEnum>;
};

/**
 * Deletes a channel.
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type SurveyChannelDelete = {
    __typename?: "SurveyChannelDelete";
    errors: Array<SurveyError>;
    surveyChannel?: Maybe<SurveyChannel>;
    surveyErrors: Array<SurveyError>;
};

export enum SurveyChannelTypeEnum {
    Api = "API",
    Custom = "CUSTOM",
    Email = "EMAIL",
    Link = "LINK",
    MobileSdk = "MOBILE_SDK",
    WebSdk = "WEB_SDK"
}

/**
 * Updates a channel
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type SurveyChannelUpdate = {
    __typename?: "SurveyChannelUpdate";
    errors: Array<SurveyError>;
    surveyChannel?: Maybe<SurveyChannel>;
    surveyErrors: Array<SurveyError>;
};

export type SurveyChannelUpdateInput = {
    /** The conditions for the channel. */
    conditions?: Maybe<Scalars["JSONString"]>;
    /** The settings of the channel. */
    settings?: Maybe<Scalars["JSONString"]>;
    /** The triggers for the channel. */
    triggers?: Maybe<Scalars["JSONString"]>;
    /** The type of the distribution channel */
    type?: Maybe<SurveyChannelTypeEnum>;
};

export type SurveyCountableConnection = {
    __typename?: "SurveyCountableConnection";
    edges: Array<SurveyCountableEdge>;
    nodes: Array<Survey>;
    /** Pagination data for this connection. */
    pageInfo: PageInfo;
    /** A total count of items in the collection. */
    totalCount?: Maybe<Scalars["Int"]>;
};

export type SurveyCountableEdge = {
    __typename?: "SurveyCountableEdge";
    /** A cursor for use in pagination. */
    cursor: Scalars["String"];
    /** The item at the end of the edge. */
    node: Survey;
};

/**
 * Creates a new survey
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type SurveyCreate = {
    __typename?: "SurveyCreate";
    errors: Array<SurveyError>;
    survey?: Maybe<Survey>;
    surveyErrors: Array<SurveyError>;
};

export type SurveyCreateInput = {
    /** The id of the survey. */
    id?: Maybe<Scalars["UUID"]>;
    /** The name of the survey. */
    name?: Maybe<Scalars["String"]>;
    /** The settings of the survey. */
    settings?: Maybe<Scalars["JSONString"]>;
    /** The slug of the survey. */
    slug?: Maybe<Scalars["String"]>;
    /** The status of the survey */
    status?: Maybe<SurveyStatusEnum>;
    /** The theme of the survey. */
    themeId?: Maybe<Scalars["ID"]>;
    /** The type of the survey */
    type?: Maybe<SurveyTypeEnum>;
};

/**
 * Deletes a survey.
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type SurveyDelete = {
    __typename?: "SurveyDelete";
    errors: Array<SurveyError>;
    survey?: Maybe<Survey>;
    surveyErrors: Array<SurveyError>;
};

/** Represents errors in survey mutations. */
export type SurveyError = {
    __typename?: "SurveyError";
    /** The error code. */
    code: SurveyErrorCode;
    /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
    field?: Maybe<Scalars["String"]>;
    /** The error message. */
    message?: Maybe<Scalars["String"]>;
};

/** An enumeration. */
export enum SurveyErrorCode {
    GraphqlError = "GRAPHQL_ERROR",
    Inactive = "INACTIVE",
    Invalid = "INVALID",
    NotFound = "NOT_FOUND",
    Required = "REQUIRED",
    Unique = "UNIQUE"
}

export type SurveyFilterInput = {
    createdAt?: Maybe<DateRangeInput>;
    endDate?: Maybe<DateTimeRangeInput>;
    /** Filter by ids. */
    ids?: Maybe<Array<Scalars["ID"]>>;
    search?: Maybe<Scalars["String"]>;
    startDate?: Maybe<DateRangeInput>;
    status?: Maybe<SurveyStatusEnum>;
    /** Filter by type */
    type?: Maybe<SurveyTypeEnum>;
    updatedAt?: Maybe<DateTimeRangeInput>;
};

/** Represents a question. */
export type SurveyQuestion = Node & {
    __typename?: "SurveyQuestion";
    /** The time at which the question was created. */
    createdAt: Scalars["DateTime"];
    /** Description of the question. */
    description: Scalars["String"];
    /** The ID of the question. */
    id: Scalars["ID"];
    /** Label of the question. */
    label: Scalars["String"];
    /** The position of the question. */
    maxPath: Scalars["Int"];
    /** The options of the question. */
    options?: Maybe<Scalars["JSONString"]>;
    /** The position of the question. */
    orderNumber: Scalars["Int"];
    /** For internal purpose. */
    reference?: Maybe<Scalars["ID"]>;
    /** The settings of the question. */
    settings?: Maybe<Scalars["JSONString"]>;
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
    __typename?: "SurveyQuestionCountableConnection";
    edges: Array<SurveyQuestionCountableEdge>;
    nodes: Array<SurveyQuestion>;
    /** Pagination data for this connection. */
    pageInfo: PageInfo;
    /** A total count of items in the collection. */
    totalCount?: Maybe<Scalars["Int"]>;
};

export type SurveyQuestionCountableEdge = {
    __typename?: "SurveyQuestionCountableEdge";
    /** A cursor for use in pagination. */
    cursor: Scalars["String"];
    /** The item at the end of the edge. */
    node: SurveyQuestion;
};

/**
 * Creates a new question
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type SurveyQuestionCreate = {
    __typename?: "SurveyQuestionCreate";
    errors: Array<SurveyError>;
    surveyErrors: Array<SurveyError>;
    surveyQuestion?: Maybe<SurveyQuestion>;
};

export type SurveyQuestionCreateInput = {
    /** The description of the question. */
    description?: Maybe<Scalars["String"]>;
    /** The id of the question. */
    id?: Maybe<Scalars["UUID"]>;
    /** The label of the question. */
    label?: Maybe<Scalars["String"]>;
    /** The options of the question. */
    options?: Maybe<Scalars["JSONString"]>;
    /** The settings of the question. */
    orderNumber: Scalars["Int"];
    /** The settings of the question. */
    settings?: Maybe<Scalars["JSONString"]>;
    /** The survey ID the question belongs to. */
    surveyId: Scalars["ID"];
    /** The type of the question */
    type?: Maybe<SurveyQuestionTypeEnum>;
};

/**
 * Deletes a question.
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type SurveyQuestionDelete = {
    __typename?: "SurveyQuestionDelete";
    errors: Array<SurveyError>;
    surveyErrors: Array<SurveyError>;
    surveyQuestion?: Maybe<SurveyQuestion>;
};

export enum SurveyQuestionTypeEnum {
    Boolean = "BOOLEAN",
    Ces = "CES",
    Csat = "CSAT",
    Cta = "CTA",
    Custom = "CUSTOM",
    Date = "DATE",
    Dropdown = "DROPDOWN",
    Form = "FORM",
    Integration = "INTEGRATION",
    Multiple = "MULTIPLE",
    Nps = "NPS",
    NumericalScale = "NUMERICAL_SCALE",
    Rating = "RATING",
    Single = "SINGLE",
    SmileyScale = "SMILEY_SCALE",
    Text = "TEXT"
}

/**
 * Updates a question
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type SurveyQuestionUpdate = {
    __typename?: "SurveyQuestionUpdate";
    errors: Array<SurveyError>;
    surveyErrors: Array<SurveyError>;
    surveyQuestion?: Maybe<SurveyQuestion>;
};

export type SurveyQuestionUpdateInput = {
    /** The description of the question. */
    description?: Maybe<Scalars["String"]>;
    /** The label of the question. */
    label?: Maybe<Scalars["String"]>;
    /** The options of the question. */
    options?: Maybe<Scalars["JSONString"]>;
    /** The settings of the question. */
    orderNumber?: Maybe<Scalars["Int"]>;
    /** The settings of the question. */
    settings?: Maybe<Scalars["JSONString"]>;
    /** The type of the question */
    type?: Maybe<SurveyQuestionTypeEnum>;
};

/** Creates a response to survey. */
export type SurveyResponseCreate = {
    __typename?: "SurveyResponseCreate";
    errors: Array<SurveyError>;
    /** The ID of the response. */
    responseId?: Maybe<Scalars["ID"]>;
    /** Whether the operation was successful. */
    status?: Maybe<Scalars["Boolean"]>;
    surveyErrors: Array<SurveyError>;
};

export type SurveyResponseCreateInput = {
    /** The user attributes. */
    attributes?: Maybe<Scalars["JSONString"]>;
    /** Whether the response is completed. */
    completed?: Maybe<Scalars["Boolean"]>;
    /** The time the survey completed. */
    completedAt?: Maybe<Scalars["DateTime"]>;
    /** The ID of the response. */
    id?: Maybe<Scalars["UUID"]>;
    /** The response metadata. */
    metadata?: Maybe<Scalars["JSONString"]>;
    /** The partial response for the survey. */
    response?: Maybe<Scalars["JSONString"]>;
    /** The time the survey started. */
    startedAt?: Maybe<Scalars["DateTime"]>;
    /** The survey ID the response belongs to. */
    surveyId: Scalars["ID"];
    /** The user distinct ID. */
    userId?: Maybe<Scalars["ID"]>;
};

/** Updates a response. */
export type SurveyResponseUpdate = {
    __typename?: "SurveyResponseUpdate";
    errors: Array<SurveyError>;
    /** Whether the operation was successful. */
    status?: Maybe<Scalars["Boolean"]>;
    surveyErrors: Array<SurveyError>;
};

export type SurveyResponseUpdateInput = {
    /** The user attributes. */
    attributes?: Maybe<Scalars["JSONString"]>;
    /** Whether the response is completed. */
    completed?: Maybe<Scalars["Boolean"]>;
    /** The time the survey completed. */
    completedAt?: Maybe<Scalars["DateTime"]>;
    /** The response metadata. */
    metadata?: Maybe<Scalars["JSONString"]>;
    /** The partial response for the survey. */
    response?: Maybe<Scalars["JSONString"]>;
    /** The time the survey started. */
    startedAt?: Maybe<Scalars["DateTime"]>;
    /** The user distinct ID. */
    userId?: Maybe<Scalars["ID"]>;
};

export enum SurveySortField {
    /** Sort surveys by created at. */
    CreatedAt = "CREATED_AT",
    /** Sort surveys by last modified at. */
    LastModifiedAt = "LAST_MODIFIED_AT",
    /** Sort surveys by name. */
    Name = "NAME",
    /** Sort surveys by status. */
    Status = "STATUS",
    /** Sort surveys by type. */
    Type = "TYPE"
}

export type SurveySortingInput = {
    /** Specifies the direction in which to sort surveys. */
    direction: OrderDirection;
    /** Sort surveys by the selected field. */
    field: SurveySortField;
};

export enum SurveyStatusEnum {
    Active = "ACTIVE",
    Archived = "ARCHIVED",
    Completed = "COMPLETED",
    Draft = "DRAFT",
    InProgress = "IN_PROGRESS",
    Paused = "PAUSED"
}

export enum SurveyTypeEnum {
    Custom = "CUSTOM",
    Poll = "POLL",
    Quiz = "QUIZ",
    Survey = "SURVEY"
}

/**
 * Updates a survey
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 */
export type SurveyUpdate = {
    __typename?: "SurveyUpdate";
    errors: Array<SurveyError>;
    survey?: Maybe<Survey>;
    surveyErrors: Array<SurveyError>;
};

export type SurveyUpdateInput = {
    /** The name of the survey. */
    name?: Maybe<Scalars["String"]>;
    /** The settings of the survey. */
    settings?: Maybe<Scalars["JSONString"]>;
    /** The slug of the survey. */
    slug?: Maybe<Scalars["String"]>;
    /** The status of the survey */
    status?: Maybe<SurveyStatusEnum>;
    /** The theme of the survey. */
    themeId?: Maybe<Scalars["ID"]>;
    /** The type of the survey */
    type?: Maybe<SurveyTypeEnum>;
};

/** Represents user data. */
export type User = Node & {
    __typename?: "User";
    /** The email address of the user. */
    email: Scalars["String"];
    /** The given name of the user. */
    firstName: Scalars["String"];
    /** The ID of the user. */
    id: Scalars["ID"];
    /** Determine if the user is active. */
    isActive: Scalars["Boolean"];
    /** Determine if the user has finished onboarding. */
    isOnboarded: Scalars["Boolean"];
    /** Determine if the user is a staff admin. */
    isStaff: Scalars["Boolean"];
    /** The family name of the user. */
    lastName: Scalars["String"];
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
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
};

/** Represents user data. */
export type UserProjectsArgs = {
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
    orderBy?: Maybe<ProjectSortingInput>;
};

export type UserCountableConnection = {
    __typename?: "UserCountableConnection";
    edges: Array<UserCountableEdge>;
    nodes: Array<User>;
    /** Pagination data for this connection. */
    pageInfo: PageInfo;
    /** A total count of items in the collection. */
    totalCount?: Maybe<Scalars["Int"]>;
};

export type UserCountableEdge = {
    __typename?: "UserCountableEdge";
    /** A cursor for use in pagination. */
    cursor: Scalars["String"];
    /** The item at the end of the edge. */
    node: User;
};

/** Represents errors in user mutations. */
export type UserError = {
    __typename?: "UserError";
    /** The error code. */
    code: UserErrorCode;
    /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
    field?: Maybe<Scalars["String"]>;
    /** The error message. */
    message?: Maybe<Scalars["String"]>;
};

/** An enumeration. */
export enum UserErrorCode {
    GraphqlError = "GRAPHQL_ERROR",
    Inactive = "INACTIVE",
    Invalid = "INVALID",
    InvalidMagicCode = "INVALID_MAGIC_CODE",
    JwtDecodeError = "JWT_DECODE_ERROR",
    JwtInvalidCsrfToken = "JWT_INVALID_CSRF_TOKEN",
    JwtInvalidToken = "JWT_INVALID_TOKEN",
    JwtMissingToken = "JWT_MISSING_TOKEN",
    JwtSignatureExpired = "JWT_SIGNATURE_EXPIRED",
    MagicCodeExpired = "MAGIC_CODE_EXPIRED",
    NotFound = "NOT_FOUND",
    Required = "REQUIRED",
    Unique = "UNIQUE"
}

export type UserInput = {
    /** The avatar of the user. */
    avatar?: Maybe<Scalars["String"]>;
    /** The given name of the user. */
    firstName?: Maybe<Scalars["String"]>;
    /** Determine if the user has finished onboarding. */
    isOnboarded?: Maybe<Scalars["Boolean"]>;
    /** The family name of the user. */
    lastName?: Maybe<Scalars["String"]>;
};

export enum UserSortField {
    /** Sort users by created at. */
    CreatedAt = "CREATED_AT",
    /** Sort users by email. */
    Email = "EMAIL",
    /** Sort users by first name. */
    FirstName = "FIRST_NAME",
    /** Sort users by last name. */
    LastName = "LAST_NAME"
}

export type UserSortingInput = {
    /** Specifies the direction in which to sort users. */
    direction: OrderDirection;
    /** Sort users by the selected field. */
    field: UserSortField;
};

/**
 * Updates a user.
 *
 * Requires one of the following permissions: AUTHENTICATED_USER.
 */
export type UserUpdate = {
    __typename?: "UserUpdate";
    errors: Array<UserError>;
    user?: Maybe<User>;
    userErrors: Array<UserError>;
};

/** _Entity union as defined by Federation spec. */
export type _Entity = AuthUser | User;

/** _Service manifest as defined by Federation spec. */
export type _Service = {
    __typename?: "_Service";
    sdl?: Maybe<Scalars["String"]>;
};

type Node_AuthOrganization_Fragment = { __typename: "AuthOrganization" } & Pick<AuthOrganization, "id">;

type Node_AuthUser_Fragment = { __typename: "AuthUser" } & Pick<AuthUser, "id">;

type Node_BaseProject_Fragment = { __typename: "BaseProject" } & Pick<BaseProject, "id">;

type Node_BaseProjectTheme_Fragment = { __typename: "BaseProjectTheme" } & Pick<BaseProjectTheme, "id">;

type Node_BaseSurvey_Fragment = { __typename: "BaseSurvey" } & Pick<BaseSurvey, "id">;

type Node_BaseSurveyChannel_Fragment = { __typename: "BaseSurveyChannel" } & Pick<BaseSurveyChannel, "id">;

type Node_BaseSurveyQuestion_Fragment = { __typename: "BaseSurveyQuestion" } & Pick<BaseSurveyQuestion, "id">;

type Node_Event_Fragment = { __typename: "Event" } & Pick<Event, "id">;

type Node_EventDefinition_Fragment = { __typename: "EventDefinition" } & Pick<EventDefinition, "id">;

type Node_EventProperty_Fragment = { __typename: "EventProperty" } & Pick<EventProperty, "id">;

type Node_Organization_Fragment = { __typename: "Organization" } & Pick<Organization, "id">;

type Node_OrganizationInvite_Fragment = { __typename: "OrganizationInvite" } & Pick<OrganizationInvite, "id">;

type Node_OrganizationInviteDetails_Fragment = { __typename: "OrganizationInviteDetails" } & Pick<
    OrganizationInviteDetails,
    "id"
>;

type Node_OrganizationInviteLinkDetails_Fragment = { __typename: "OrganizationInviteLinkDetails" } & Pick<
    OrganizationInviteLinkDetails,
    "id"
>;

type Node_Person_Fragment = { __typename: "Person" } & Pick<Person, "id">;

type Node_Project_Fragment = { __typename: "Project" } & Pick<Project, "id">;

type Node_ProjectTheme_Fragment = { __typename: "ProjectTheme" } & Pick<ProjectTheme, "id">;

type Node_PropertyDefinition_Fragment = { __typename: "PropertyDefinition" } & Pick<PropertyDefinition, "id">;

type Node_Survey_Fragment = { __typename: "Survey" } & Pick<Survey, "id">;

type Node_SurveyChannel_Fragment = { __typename: "SurveyChannel" } & Pick<SurveyChannel, "id">;

type Node_SurveyQuestion_Fragment = { __typename: "SurveyQuestion" } & Pick<SurveyQuestion, "id">;

type Node_User_Fragment = { __typename: "User" } & Pick<User, "id">;

export type NodeFragment =
    | Node_AuthOrganization_Fragment
    | Node_AuthUser_Fragment
    | Node_BaseProject_Fragment
    | Node_BaseProjectTheme_Fragment
    | Node_BaseSurvey_Fragment
    | Node_BaseSurveyChannel_Fragment
    | Node_BaseSurveyQuestion_Fragment
    | Node_Event_Fragment
    | Node_EventDefinition_Fragment
    | Node_EventProperty_Fragment
    | Node_Organization_Fragment
    | Node_OrganizationInvite_Fragment
    | Node_OrganizationInviteDetails_Fragment
    | Node_OrganizationInviteLinkDetails_Fragment
    | Node_Person_Fragment
    | Node_Project_Fragment
    | Node_ProjectTheme_Fragment
    | Node_PropertyDefinition_Fragment
    | Node_Survey_Fragment
    | Node_SurveyChannel_Fragment
    | Node_SurveyQuestion_Fragment
    | Node_User_Fragment;

export type EmailTokenUserAuthFragment = { __typename: "EmailTokenUserAuth" } & Pick<
    EmailTokenUserAuth,
    "token" | "csrfToken" | "refreshToken"
> & {
        user?: Maybe<{ __typename?: "AuthUser" } & AuthUserFragment>;
        errors: Array<{ __typename?: "UserError" } & UserErrorFragment>;
        userErrors: Array<{ __typename?: "UserError" } & UserErrorFragment>;
    };

export type EventCaptureFragment = { __typename: "EventCapture" } & Pick<EventCapture, "status"> & {
        errors: Array<{ __typename?: "EventError" } & EventErrorFragment>;
        eventErrors: Array<{ __typename?: "EventError" } & EventErrorFragment>;
    };

export type SurveyChannelCreateFragment = { __typename: "SurveyChannelCreate" } & {
    surveyChannel?: Maybe<{ __typename?: "SurveyChannel" } & SurveyChannelFragment>;
    errors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
    surveyErrors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
};

export type OrganizationInviteCreateFragment = { __typename: "OrganizationInviteCreate" } & {
    errors: Array<{ __typename?: "OrganizationError" } & OrganizationErrorFragment>;
    organizationErrors: Array<{ __typename?: "OrganizationError" } & OrganizationErrorFragment>;
    organizationInvite?: Maybe<{ __typename?: "OrganizationInvite" } & OrganizationInviteFragment>;
};

export type ProjectCreateFragment = { __typename: "ProjectCreate" } & {
    errors: Array<{ __typename?: "ProjectError" } & ProjectErrorFragment>;
    project?: Maybe<{ __typename?: "Project" } & ProjectFragment>;
    projectErrors: Array<{ __typename?: "ProjectError" } & ProjectErrorFragment>;
};

export type SurveyQuestionCreateFragment = { __typename: "SurveyQuestionCreate" } & {
    errors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
    surveyErrors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
    surveyQuestion?: Maybe<{ __typename?: "SurveyQuestion" } & SurveyQuestionFragment>;
};

export type SurveyCreateFragment = { __typename: "SurveyCreate" } & {
    errors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
    survey?: Maybe<{ __typename?: "Survey" } & SurveyFragment>;
    surveyErrors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
};

export type ProjectThemeCreateFragment = { __typename: "ProjectThemeCreate" } & {
    errors: Array<{ __typename?: "ProjectError" } & ProjectErrorFragment>;
    projectErrors: Array<{ __typename?: "ProjectError" } & ProjectErrorFragment>;
    projectTheme?: Maybe<{ __typename?: "ProjectTheme" } & ProjectThemeFragment>;
};

export type SurveyResponseCreateFragment = { __typename: "SurveyResponseCreate" } & Pick<
    SurveyResponseCreate,
    "responseId" | "status"
> & {
        errors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
        surveyErrors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
    };

export type OrganizationCreateFragment = { __typename: "OrganizationCreate" } & {
    user?: Maybe<{ __typename?: "AuthUser" } & AuthUserFragment>;
    organization?: Maybe<{ __typename?: "AuthOrganization" } & AuthOrganizationFragment>;
    errors: Array<{ __typename?: "OrganizationError" } & OrganizationErrorFragment>;
    organizationErrors: Array<{ __typename?: "OrganizationError" } & OrganizationErrorFragment>;
};

export type LogoutFragment = { __typename: "Logout" } & {
    errors: Array<{ __typename?: "UserError" } & UserErrorFragment>;
    userErrors: Array<{ __typename?: "UserError" } & UserErrorFragment>;
};

export type SurveyChannelDeleteFragment = { __typename: "SurveyChannelDelete" } & {
    errors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
    surveyChannel?: Maybe<{ __typename?: "SurveyChannel" } & SurveyChannelFragment>;
    surveyErrors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
};

export type SurveyQuestionDeleteFragment = { __typename: "SurveyQuestionDelete" } & {
    errors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
    surveyErrors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
    surveyQuestion?: Maybe<{ __typename?: "SurveyQuestion" } & SurveyQuestionFragment>;
};

export type SurveyDeleteFragment = { __typename: "SurveyDelete" } & {
    errors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
    survey?: Maybe<{ __typename?: "Survey" } & SurveyFragment>;
    surveyErrors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
};

export type ProjectThemeDeleteFragment = { __typename: "ProjectThemeDelete" } & {
    errors: Array<{ __typename?: "ProjectError" } & ProjectErrorFragment>;
    projectErrors: Array<{ __typename?: "ProjectError" } & ProjectErrorFragment>;
    projectTheme?: Maybe<{ __typename?: "ProjectTheme" } & ProjectThemeFragment>;
};

export type EmailUserAuthChallengeFragment = { __typename: "EmailUserAuthChallenge" } & Pick<
    EmailUserAuthChallenge,
    "authType" | "success"
> & {
        errors: Array<{ __typename?: "UserError" } & UserErrorFragment>;
        userErrors: Array<{ __typename?: "UserError" } & UserErrorFragment>;
    };

export type GoogleUserAuthFragment = { __typename: "GoogleUserAuth" } & Pick<
    GoogleUserAuth,
    "token" | "csrfToken" | "refreshToken" | "success"
> & {
        user?: Maybe<{ __typename?: "AuthUser" } & AuthUserFragment>;
        errors: Array<{ __typename?: "UserError" } & UserErrorFragment>;
        userErrors: Array<{ __typename?: "UserError" } & UserErrorFragment>;
    };

export type OrganizationJoinFragment = { __typename: "OrganizationJoin" } & {
    user: { __typename?: "AuthUser" } & AuthUserFragment;
    errors: Array<{ __typename?: "OrganizationError" } & OrganizationErrorFragment>;
    organizationErrors: Array<{ __typename?: "OrganizationError" } & OrganizationErrorFragment>;
};

export type RefreshTokenFragment = { __typename: "RefreshToken" } & Pick<RefreshToken, "token"> & {
        errors: Array<{ __typename?: "UserError" } & UserErrorFragment>;
        userErrors: Array<{ __typename?: "UserError" } & UserErrorFragment>;
    };

export type PersonFragment = { __typename: "Person" } & Pick<
    Person,
    "id" | "attributes" | "distinctIds" | "uuid" | "createdAt" | "isIdentified"
> & { project: { __typename?: "Project" } & ProjectFragment };

export type BaseProjectFragment = { __typename: "BaseProject" } & Pick<BaseProject, "apiToken" | "name" | "id">;

export type ProjectFragment = { __typename: "Project" } & Pick<
    Project,
    "apiToken" | "name" | "slug" | "id" | "hasCompletedOnboardingFor" | "timezone" | "accessControl"
> & { organization: { __typename?: "AuthOrganization" } & AuthOrganizationFragment };

export type PropertyDefinitionFragment = { __typename: "PropertyDefinition" } & Pick<
    PropertyDefinition,
    "id" | "name" | "propertyType" | "type" | "isNumerical"
> & { project: { __typename?: "Project" } & ProjectFragment };

export type BaseSurveyQuestionFragment = { __typename: "BaseSurveyQuestion" } & Pick<
    BaseSurveyQuestion,
    "description" | "label" | "id" | "options" | "maxPath" | "orderNumber" | "settings" | "createdAt" | "type"
>;

export type SurveyQuestionFragment = { __typename: "SurveyQuestion" } & Pick<
    SurveyQuestion,
    | "description"
    | "reference"
    | "label"
    | "id"
    | "options"
    | "maxPath"
    | "orderNumber"
    | "settings"
    | "createdAt"
    | "type"
> & { survey?: Maybe<{ __typename?: "Survey" } & SurveyFragment> };

export type BaseSurveyChannelFragment = { __typename: "BaseSurveyChannel" } & Pick<
    BaseSurveyChannel,
    "id" | "triggers" | "conditions" | "settings" | "createdAt" | "type" | "link"
>;

export type SurveyChannelFragment = { __typename: "SurveyChannel" } & Pick<
    SurveyChannel,
    "reference" | "id" | "triggers" | "conditions" | "settings" | "createdAt" | "type" | "link"
> & { survey?: Maybe<{ __typename?: "Survey" } & SurveyFragment> };

export type BaseSurveyFragment = { __typename: "BaseSurvey" } & Pick<
    BaseSurvey,
    "name" | "slug" | "id" | "endDate" | "startDate" | "settings" | "status" | "createdAt"
> & {
        channels: Array<{ __typename?: "BaseSurveyChannel" } & BaseSurveyChannelFragment>;
        project?: Maybe<{ __typename?: "BaseProject" } & BaseProjectFragment>;
        questions: Array<{ __typename?: "BaseSurveyQuestion" } & BaseSurveyQuestionFragment>;
        theme?: Maybe<{ __typename?: "BaseProjectTheme" } & BaseProjectThemeFragment>;
    };

export type SurveyFragment = { __typename: "Survey" } & Pick<
    Survey,
    "reference" | "name" | "slug" | "id" | "updatedAt" | "settings" | "status" | "createdAt" | "type"
> & {
        project?: Maybe<{ __typename?: "Project" } & ProjectFragment>;
        theme?: Maybe<{ __typename?: "ProjectTheme" } & ProjectThemeFragment>;
        creator: { __typename?: "User" } & UserFragment;
    };

export type BaseProjectThemeFragment = { __typename: "BaseProjectTheme" } & Pick<
    BaseProjectTheme,
    "name" | "id" | "colorScheme" | "settings"
>;

export type ProjectThemeFragment = { __typename: "ProjectTheme" } & Pick<
    ProjectTheme,
    "reference" | "name" | "id" | "updatedAt" | "colorScheme" | "settings" | "createdAt"
> & { project: { __typename?: "Project" } & ProjectFragment; creator: { __typename?: "User" } & UserFragment };

export type AuthUserFragment = { __typename: "AuthUser" } & Pick<
    AuthUser,
    "isOnboarded" | "isStaff" | "isActive" | "id" | "email" | "lastName" | "firstName"
> & {
        organization?: Maybe<{ __typename?: "AuthOrganization" } & AuthOrganizationFragment>;
        project?: Maybe<{ __typename?: "Project" } & ProjectFragment>;
    };

export type EventDefinitionFragment = { __typename: "EventDefinition" } & Pick<
    EventDefinition,
    "id" | "name" | "createdAt" | "lastSeenAt"
> & { project: { __typename?: "Project" } & ProjectFragment };

export type EventPropertyFragment = { __typename: "EventProperty" } & Pick<
    EventProperty,
    "id" | "event" | "property"
> & { project: { __typename?: "Project" } & ProjectFragment };

export type EventFragment = { __typename: "Event" } & Pick<
    Event,
    "id" | "distinctId" | "event" | "properties" | "timestamp" | "createdAt"
> & { project: { __typename?: "Project" } & ProjectFragment };

export type AuthOrganizationFragment = { __typename: "AuthOrganization" } & Pick<
    AuthOrganization,
    "memberCount" | "name" | "slug" | "id"
>;

export type OrganizationFragment = { __typename: "Organization" } & Pick<
    Organization,
    "memberCount" | "name" | "slug" | "id"
>;

export type EventErrorFragment = { __typename: "EventError" } & Pick<EventError, "field" | "code" | "message">;

export type OrganizationErrorFragment = { __typename: "OrganizationError" } & Pick<
    OrganizationError,
    "field" | "code" | "message"
>;

export type ProjectErrorFragment = { __typename: "ProjectError" } & Pick<ProjectError, "field" | "code" | "message">;

export type SurveyErrorFragment = { __typename: "SurveyError" } & Pick<SurveyError, "field" | "code" | "message">;

export type UserErrorFragment = { __typename: "UserError" } & Pick<UserError, "field" | "code" | "message">;

export type UserFragment = { __typename: "User" } & Pick<
    User,
    "isOnboarded" | "isStaff" | "isActive" | "id" | "email" | "lastName" | "firstName"
> & {
        organization?: Maybe<{ __typename?: "AuthOrganization" } & AuthOrganizationFragment>;
        project?: Maybe<{ __typename?: "Project" } & ProjectFragment>;
    };

export type OrganizationInviteLinkResetFragment = { __typename: "OrganizationInviteLinkReset" } & Pick<
    OrganizationInviteLinkReset,
    "inviteLink" | "success"
> & {
        errors: Array<{ __typename?: "OrganizationError" } & OrganizationErrorFragment>;
        organizationErrors: Array<{ __typename?: "OrganizationError" } & OrganizationErrorFragment>;
    };

export type PageInfoFragment = { __typename: "PageInfo" } & Pick<
    PageInfo,
    "hasPreviousPage" | "startCursor" | "hasNextPage" | "endCursor"
>;

export type OrganizationInviteLinkFragment = { __typename: "OrganizationInviteLink" } & Pick<
    OrganizationInviteLink,
    "inviteLink"
>;

export type OrganizationInviteFragment = { __typename: "OrganizationInvite" } & Pick<
    OrganizationInvite,
    "firstName" | "expired" | "email" | "updatedAt" | "createdAt" | "id" | "role"
> & {
        organization: { __typename?: "Organization" } & OrganizationFragment;
        inviter: { __typename?: "User" } & UserFragment;
    };

export type OrganizationInviteDetailsFragment = { __typename: "OrganizationInviteDetails" } & Pick<
    OrganizationInviteDetails,
    | "firstName"
    | "expired"
    | "organizationId"
    | "email"
    | "updatedAt"
    | "organizationLogo"
    | "organizationName"
    | "inviter"
    | "createdAt"
    | "id"
    | "role"
>;

export type OrganizationInviteLinkDetailsFragment = { __typename: "OrganizationInviteLinkDetails" } & Pick<
    OrganizationInviteLinkDetails,
    "id" | "organizationId" | "organizationLogo" | "organizationName"
>;

export type SurveyChannelUpdateFragment = { __typename: "SurveyChannelUpdate" } & {
    errors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
    surveyChannel?: Maybe<{ __typename?: "SurveyChannel" } & SurveyChannelFragment>;
    surveyErrors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
};

export type ProjectUpdateFragment = { __typename: "ProjectUpdate" } & {
    errors: Array<{ __typename?: "ProjectError" } & ProjectErrorFragment>;
    project?: Maybe<{ __typename?: "Project" } & ProjectFragment>;
    projectErrors: Array<{ __typename?: "ProjectError" } & ProjectErrorFragment>;
};

export type SurveyQuestionUpdateFragment = { __typename: "SurveyQuestionUpdate" } & {
    errors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
    surveyErrors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
    surveyQuestion?: Maybe<{ __typename?: "SurveyQuestion" } & SurveyQuestionFragment>;
};

export type SurveyResponseUpdateFragment = { __typename: "SurveyResponseUpdate" } & Pick<
    SurveyResponseUpdate,
    "status"
> & {
        errors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
        surveyErrors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
    };

export type SurveyUpdateFragment = { __typename: "SurveyUpdate" } & {
    errors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
    survey?: Maybe<{ __typename?: "Survey" } & SurveyFragment>;
    surveyErrors: Array<{ __typename?: "SurveyError" } & SurveyErrorFragment>;
};

export type UserUpdateFragment = { __typename: "UserUpdate" } & {
    errors: Array<{ __typename?: "UserError" } & UserErrorFragment>;
    user?: Maybe<{ __typename?: "User" } & UserFragment>;
    userErrors: Array<{ __typename?: "UserError" } & UserErrorFragment>;
};

export type ProjectThemeUpdateFragment = { __typename: "ProjectThemeUpdate" } & {
    errors: Array<{ __typename?: "ProjectError" } & ProjectErrorFragment>;
    projectErrors: Array<{ __typename?: "ProjectError" } & ProjectErrorFragment>;
    projectTheme?: Maybe<{ __typename?: "ProjectTheme" } & ProjectThemeFragment>;
};

export type _ServiceFragment = { __typename: "_Service" } & Pick<_Service, "sdl">;

export type BaseSurveyCountableConnectionFragment = { __typename: "BaseSurveyCountableConnection" } & Pick<
    BaseSurveyCountableConnection,
    "totalCount"
> & {
        pageInfo: { __typename?: "PageInfo" } & PageInfoFragment;
        nodes: Array<{ __typename?: "BaseSurvey" } & BaseSurveyFragment>;
    };

export type EventCountableConnectionFragment = { __typename: "EventCountableConnection" } & Pick<
    EventCountableConnection,
    "totalCount"
> & {
        pageInfo: { __typename?: "PageInfo" } & PageInfoFragment;
        nodes: Array<{ __typename?: "Event" } & EventFragment>;
    };

export type EventDefinitionCountableConnectionFragment = { __typename: "EventDefinitionCountableConnection" } & Pick<
    EventDefinitionCountableConnection,
    "totalCount"
> & {
        pageInfo: { __typename?: "PageInfo" } & PageInfoFragment;
        nodes: Array<{ __typename?: "EventDefinition" } & EventDefinitionFragment>;
    };

export type EventPropertyCountableConnectionFragment = { __typename: "EventPropertyCountableConnection" } & Pick<
    EventPropertyCountableConnection,
    "totalCount"
> & {
        pageInfo: { __typename?: "PageInfo" } & PageInfoFragment;
        nodes: Array<{ __typename?: "EventProperty" } & EventPropertyFragment>;
    };

export type OrganizationCountableConnectionFragment = { __typename: "OrganizationCountableConnection" } & Pick<
    OrganizationCountableConnection,
    "totalCount"
> & {
        pageInfo: { __typename?: "PageInfo" } & PageInfoFragment;
        nodes: Array<{ __typename?: "Organization" } & OrganizationFragment>;
    };

export type PersonCountableConnectionFragment = { __typename: "PersonCountableConnection" } & Pick<
    PersonCountableConnection,
    "totalCount"
> & {
        pageInfo: { __typename?: "PageInfo" } & PageInfoFragment;
        nodes: Array<{ __typename?: "Person" } & PersonFragment>;
    };

export type ProjectCountableConnectionFragment = { __typename: "ProjectCountableConnection" } & Pick<
    ProjectCountableConnection,
    "totalCount"
> & {
        pageInfo: { __typename?: "PageInfo" } & PageInfoFragment;
        nodes: Array<{ __typename?: "Project" } & ProjectFragment>;
    };

export type ProjectThemeCountableConnectionFragment = { __typename: "ProjectThemeCountableConnection" } & Pick<
    ProjectThemeCountableConnection,
    "totalCount"
> & {
        pageInfo: { __typename?: "PageInfo" } & PageInfoFragment;
        nodes: Array<{ __typename?: "ProjectTheme" } & ProjectThemeFragment>;
    };

export type PropertyDefinitionCountableConnectionFragment = {
    __typename: "PropertyDefinitionCountableConnection";
} & Pick<PropertyDefinitionCountableConnection, "totalCount"> & {
        pageInfo: { __typename?: "PageInfo" } & PageInfoFragment;
        nodes: Array<{ __typename?: "PropertyDefinition" } & PropertyDefinitionFragment>;
    };

export type SurveyChannelCountableConnectionFragment = { __typename: "SurveyChannelCountableConnection" } & Pick<
    SurveyChannelCountableConnection,
    "totalCount"
> & {
        pageInfo: { __typename?: "PageInfo" } & PageInfoFragment;
        nodes: Array<{ __typename?: "SurveyChannel" } & SurveyChannelFragment>;
    };

export type SurveyCountableConnectionFragment = { __typename: "SurveyCountableConnection" } & Pick<
    SurveyCountableConnection,
    "totalCount"
> & {
        pageInfo: { __typename?: "PageInfo" } & PageInfoFragment;
        nodes: Array<{ __typename?: "Survey" } & SurveyFragment>;
    };

export type SurveyQuestionCountableConnectionFragment = { __typename: "SurveyQuestionCountableConnection" } & Pick<
    SurveyQuestionCountableConnection,
    "totalCount"
> & {
        pageInfo: { __typename?: "PageInfo" } & PageInfoFragment;
        nodes: Array<{ __typename?: "SurveyQuestion" } & SurveyQuestionFragment>;
    };

export type UserCountableConnectionFragment = { __typename: "UserCountableConnection" } & Pick<
    UserCountableConnection,
    "totalCount"
> & { pageInfo: { __typename?: "PageInfo" } & PageInfoFragment; nodes: Array<{ __typename?: "User" } & UserFragment> };

export type EmailTokenUserAuthMutationVariables = Exact<{
    email: Scalars["String"];
    inviteLink?: Maybe<Scalars["String"]>;
    token: Scalars["String"];
}>;

export type EmailTokenUserAuthMutation = { __typename?: "Mutation" } & {
    emailTokenUserAuth?: Maybe<{ __typename?: "EmailTokenUserAuth" } & EmailTokenUserAuthFragment>;
};

export type EmailUserAuthChallengeMutationVariables = Exact<{
    email: Scalars["String"];
    inviteLink?: Maybe<Scalars["String"]>;
}>;

export type EmailUserAuthChallengeMutation = { __typename?: "Mutation" } & {
    emailUserAuthChallenge?: Maybe<{ __typename?: "EmailUserAuthChallenge" } & EmailUserAuthChallengeFragment>;
};

export type CaptureEventMutationVariables = Exact<{
    batch?: Maybe<Array<EventCaptureInput> | EventCaptureInput>;
    input?: Maybe<EventCaptureInput>;
    sentAt?: Maybe<Scalars["DateTime"]>;
}>;

export type CaptureEventMutation = { __typename?: "Mutation" } & {
    eventCapture?: Maybe<{ __typename?: "EventCapture" } & EventCaptureFragment>;
};

export type GoogleUserAuthMutationVariables = Exact<{
    code: Scalars["String"];
    inviteLink?: Maybe<Scalars["String"]>;
}>;

export type GoogleUserAuthMutation = { __typename?: "Mutation" } & {
    googleUserAuth?: Maybe<{ __typename?: "GoogleUserAuth" } & GoogleUserAuthFragment>;
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation" } & {
    logout?: Maybe<{ __typename?: "Logout" } & LogoutFragment>;
};

export type CreateOrganizationMutationVariables = Exact<{
    input: OrganizationCreateInput;
    survey?: Maybe<OnboardingCustomerSurvey>;
}>;

export type CreateOrganizationMutation = { __typename?: "Mutation" } & {
    organizationCreate?: Maybe<{ __typename?: "OrganizationCreate" } & OrganizationCreateFragment>;
};

export type CreateOrganizationInviteMutationVariables = Exact<{
    input: OrganizationInviteCreateInput;
}>;

export type CreateOrganizationInviteMutation = { __typename?: "Mutation" } & {
    organizationInviteCreate?: Maybe<{ __typename?: "OrganizationInviteCreate" } & OrganizationInviteCreateFragment>;
};

export type ResetOrganizationInviteLinkMutationVariables = Exact<{ [key: string]: never }>;

export type ResetOrganizationInviteLinkMutation = { __typename?: "Mutation" } & {
    organizationInviteLinkReset?: Maybe<
        { __typename?: "OrganizationInviteLinkReset" } & OrganizationInviteLinkResetFragment
    >;
};

export type JoinOrganizationMutationVariables = Exact<{
    input: OrganizationJoinInput;
}>;

export type JoinOrganizationMutation = { __typename?: "Mutation" } & {
    organizationJoin?: Maybe<{ __typename?: "OrganizationJoin" } & OrganizationJoinFragment>;
};

export type CreateProjectMutationVariables = Exact<{
    input: ProjectCreateInput;
}>;

export type CreateProjectMutation = { __typename?: "Mutation" } & {
    projectCreate?: Maybe<{ __typename?: "ProjectCreate" } & ProjectCreateFragment>;
};

export type CreateProjectThemeMutationVariables = Exact<{
    input: ProjectThemeCreateInput;
}>;

export type CreateProjectThemeMutation = { __typename?: "Mutation" } & {
    projectThemeCreate?: Maybe<{ __typename?: "ProjectThemeCreate" } & ProjectThemeCreateFragment>;
};

export type DeleteProjectThemeMutationVariables = Exact<{
    id: Scalars["ID"];
}>;

export type DeleteProjectThemeMutation = { __typename?: "Mutation" } & {
    projectThemeDelete?: Maybe<{ __typename?: "ProjectThemeDelete" } & ProjectThemeDeleteFragment>;
};

export type UpdateProjectThemeMutationVariables = Exact<{
    id: Scalars["ID"];
    input: ProjectThemeUpdateInput;
}>;

export type UpdateProjectThemeMutation = { __typename?: "Mutation" } & {
    projectThemeUpdate?: Maybe<{ __typename?: "ProjectThemeUpdate" } & ProjectThemeUpdateFragment>;
};

export type UpdateProjectMutationVariables = Exact<{
    input: ProjectUpdateInput;
}>;

export type UpdateProjectMutation = { __typename?: "Mutation" } & {
    projectUpdate?: Maybe<{ __typename?: "ProjectUpdate" } & ProjectUpdateFragment>;
};

export type CreateSurveyChannelMutationVariables = Exact<{
    input: SurveyChannelCreateInput;
}>;

export type CreateSurveyChannelMutation = { __typename?: "Mutation" } & {
    surveyChannelCreate?: Maybe<{ __typename?: "SurveyChannelCreate" } & SurveyChannelCreateFragment>;
};

export type DeleteSurveyChannelMutationVariables = Exact<{
    id: Scalars["ID"];
}>;

export type DeleteSurveyChannelMutation = { __typename?: "Mutation" } & {
    surveyChannelDelete?: Maybe<{ __typename?: "SurveyChannelDelete" } & SurveyChannelDeleteFragment>;
};

export type UpdateSurveyChannelMutationVariables = Exact<{
    id: Scalars["ID"];
    input: SurveyChannelUpdateInput;
}>;

export type UpdateSurveyChannelMutation = { __typename?: "Mutation" } & {
    surveyChannelUpdate?: Maybe<{ __typename?: "SurveyChannelUpdate" } & SurveyChannelUpdateFragment>;
};

export type CreateSurveyMutationVariables = Exact<{
    input: SurveyCreateInput;
}>;

export type CreateSurveyMutation = { __typename?: "Mutation" } & {
    surveyCreate?: Maybe<{ __typename?: "SurveyCreate" } & SurveyCreateFragment>;
};

export type DeleteSurveyMutationVariables = Exact<{
    id: Scalars["ID"];
}>;

export type DeleteSurveyMutation = { __typename?: "Mutation" } & {
    surveyDelete?: Maybe<{ __typename?: "SurveyDelete" } & SurveyDeleteFragment>;
};

export type CreateSurveyQuestionMutationVariables = Exact<{
    input: SurveyQuestionCreateInput;
}>;

export type CreateSurveyQuestionMutation = { __typename?: "Mutation" } & {
    surveyQuestionCreate?: Maybe<{ __typename?: "SurveyQuestionCreate" } & SurveyQuestionCreateFragment>;
};

export type DeleteSurveyQuestionMutationVariables = Exact<{
    id: Scalars["ID"];
}>;

export type DeleteSurveyQuestionMutation = { __typename?: "Mutation" } & {
    surveyQuestionDelete?: Maybe<{ __typename?: "SurveyQuestionDelete" } & SurveyQuestionDeleteFragment>;
};

export type UpdateSurveyQuestionMutationVariables = Exact<{
    id: Scalars["ID"];
    input: SurveyQuestionUpdateInput;
}>;

export type UpdateSurveyQuestionMutation = { __typename?: "Mutation" } & {
    surveyQuestionUpdate?: Maybe<{ __typename?: "SurveyQuestionUpdate" } & SurveyQuestionUpdateFragment>;
};

export type CreateSurveyResponseMutationVariables = Exact<{
    input: SurveyResponseCreateInput;
}>;

export type CreateSurveyResponseMutation = { __typename?: "Mutation" } & {
    surveyResponseCreate?: Maybe<{ __typename?: "SurveyResponseCreate" } & SurveyResponseCreateFragment>;
};

export type UpdateSurveyResponseMutationVariables = Exact<{
    id: Scalars["ID"];
    input: SurveyResponseUpdateInput;
}>;

export type UpdateSurveyResponseMutation = { __typename?: "Mutation" } & {
    surveyResponseUpdate?: Maybe<{ __typename?: "SurveyResponseUpdate" } & SurveyResponseUpdateFragment>;
};

export type UpdateSurveyMutationVariables = Exact<{
    id: Scalars["ID"];
    input: SurveyUpdateInput;
}>;

export type UpdateSurveyMutation = { __typename?: "Mutation" } & {
    surveyUpdate?: Maybe<{ __typename?: "SurveyUpdate" } & SurveyUpdateFragment>;
};

export type RefreshTokenMutationVariables = Exact<{
    csrfToken?: Maybe<Scalars["String"]>;
    refreshToken?: Maybe<Scalars["String"]>;
}>;

export type RefreshTokenMutation = { __typename?: "Mutation" } & {
    tokenRefresh?: Maybe<{ __typename?: "RefreshToken" } & RefreshTokenFragment>;
};

export type UpdateUserMutationVariables = Exact<{
    input: UserInput;
}>;

export type UpdateUserMutation = { __typename?: "Mutation" } & {
    userUpdate?: Maybe<{ __typename?: "UserUpdate" } & UserUpdateFragment>;
};

export type _ServiceQueryVariables = Exact<{ [key: string]: never }>;

export type _ServiceQuery = { __typename?: "Query" } & {
    _service?: Maybe<{ __typename?: "_Service" } & _ServiceFragment>;
};

export type ActiveSurveysQueryVariables = Exact<{
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    filter?: Maybe<SurveyFilterInput>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
    sortBy?: Maybe<SurveySortingInput>;
}>;

export type ActiveSurveysQuery = { __typename?: "Query" } & {
    activeSurveys?: Maybe<{ __typename?: "BaseSurveyCountableConnection" } & BaseSurveyCountableConnectionFragment>;
};

export type ChannelsQueryVariables = Exact<{
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    id: Scalars["ID"];
    last?: Maybe<Scalars["Int"]>;
}>;

export type ChannelsQuery = { __typename?: "Query" } & {
    channels?: Maybe<{ __typename?: "SurveyChannelCountableConnection" } & SurveyChannelCountableConnectionFragment>;
};

export type EventDefinitionsQueryVariables = Exact<{
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
}>;

export type EventDefinitionsQuery = { __typename?: "Query" } & {
    eventDefinitions?: Maybe<
        { __typename?: "EventDefinitionCountableConnection" } & EventDefinitionCountableConnectionFragment
    >;
};

export type EventPropertiesQueryVariables = Exact<{
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    event?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
}>;

export type EventPropertiesQuery = { __typename?: "Query" } & {
    eventProperties?: Maybe<
        { __typename?: "EventPropertyCountableConnection" } & EventPropertyCountableConnectionFragment
    >;
};

export type EventsQueryVariables = Exact<{
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
}>;

export type EventsQuery = { __typename?: "Query" } & {
    events?: Maybe<{ __typename?: "EventCountableConnection" } & EventCountableConnectionFragment>;
};

export type OrganizationInviteLinkQueryVariables = Exact<{ [key: string]: never }>;

export type OrganizationInviteLinkQuery = { __typename?: "Query" } & {
    organizationInviteLink?: Maybe<{ __typename?: "OrganizationInviteLink" } & OrganizationInviteLinkFragment>;
};

export type PersonsQueryVariables = Exact<{
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
}>;

export type PersonsQuery = { __typename?: "Query" } & {
    persons?: Maybe<{ __typename?: "PersonCountableConnection" } & PersonCountableConnectionFragment>;
};

export type PropertyDefinitionsQueryVariables = Exact<{
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    definitionType?: Maybe<PropertyDefinitionTypeEnum>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
}>;

export type PropertyDefinitionsQuery = { __typename?: "Query" } & {
    propertyDefinitions?: Maybe<
        { __typename?: "PropertyDefinitionCountableConnection" } & PropertyDefinitionCountableConnectionFragment
    >;
};

export type QuestionsQueryVariables = Exact<{
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    id: Scalars["ID"];
    last?: Maybe<Scalars["Int"]>;
}>;

export type QuestionsQuery = { __typename?: "Query" } & {
    questions?: Maybe<{ __typename?: "SurveyQuestionCountableConnection" } & SurveyQuestionCountableConnectionFragment>;
};

export type SurveyQueryVariables = Exact<{
    id?: Maybe<Scalars["ID"]>;
    slug?: Maybe<Scalars["String"]>;
}>;

export type SurveyQuery = { __typename?: "Query" } & { survey?: Maybe<{ __typename?: "Survey" } & SurveyFragment> };

export type Survey_ChannelsQueryVariables = Exact<{
    id?: Maybe<Scalars["ID"]>;
    slug?: Maybe<Scalars["String"]>;
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
}>;

export type Survey_ChannelsQuery = { __typename?: "Query" } & {
    survey?: Maybe<
        { __typename?: "Survey" } & {
            channels: { __typename?: "SurveyChannelCountableConnection" } & SurveyChannelCountableConnectionFragment;
        }
    >;
};

export type Survey_ProjectQueryVariables = Exact<{
    id?: Maybe<Scalars["ID"]>;
    slug?: Maybe<Scalars["String"]>;
}>;

export type Survey_ProjectQuery = { __typename?: "Query" } & {
    survey?: Maybe<{ __typename?: "Survey" } & { project?: Maybe<{ __typename?: "Project" } & ProjectFragment> }>;
};

export type Survey_Project_OrganizationQueryVariables = Exact<{
    id?: Maybe<Scalars["ID"]>;
    slug?: Maybe<Scalars["String"]>;
}>;

export type Survey_Project_OrganizationQuery = { __typename?: "Query" } & {
    survey?: Maybe<
        { __typename?: "Survey" } & {
            project?: Maybe<
                { __typename?: "Project" } & {
                    organization: { __typename?: "AuthOrganization" } & AuthOrganizationFragment;
                }
            >;
        }
    >;
};

export type Survey_QuestionsQueryVariables = Exact<{
    id?: Maybe<Scalars["ID"]>;
    slug?: Maybe<Scalars["String"]>;
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
}>;

export type Survey_QuestionsQuery = { __typename?: "Query" } & {
    survey?: Maybe<
        { __typename?: "Survey" } & {
            questions: { __typename?: "SurveyQuestionCountableConnection" } & SurveyQuestionCountableConnectionFragment;
        }
    >;
};

export type Survey_ThemeQueryVariables = Exact<{
    id?: Maybe<Scalars["ID"]>;
    slug?: Maybe<Scalars["String"]>;
}>;

export type Survey_ThemeQuery = { __typename?: "Query" } & {
    survey?: Maybe<
        { __typename?: "Survey" } & { theme?: Maybe<{ __typename?: "ProjectTheme" } & ProjectThemeFragment> }
    >;
};

export type Survey_Theme_ProjectQueryVariables = Exact<{
    id?: Maybe<Scalars["ID"]>;
    slug?: Maybe<Scalars["String"]>;
}>;

export type Survey_Theme_ProjectQuery = { __typename?: "Query" } & {
    survey?: Maybe<
        { __typename?: "Survey" } & {
            theme?: Maybe<{ __typename?: "ProjectTheme" } & { project: { __typename?: "Project" } & ProjectFragment }>;
        }
    >;
};

export type Survey_Theme_Project_OrganizationQueryVariables = Exact<{
    id?: Maybe<Scalars["ID"]>;
    slug?: Maybe<Scalars["String"]>;
}>;

export type Survey_Theme_Project_OrganizationQuery = { __typename?: "Query" } & {
    survey?: Maybe<
        { __typename?: "Survey" } & {
            theme?: Maybe<
                { __typename?: "ProjectTheme" } & {
                    project: { __typename?: "Project" } & {
                        organization: { __typename?: "AuthOrganization" } & AuthOrganizationFragment;
                    };
                }
            >;
        }
    >;
};

export type SurveyByChannelQueryVariables = Exact<{
    id?: Maybe<Scalars["ID"]>;
    link?: Maybe<Scalars["String"]>;
}>;

export type SurveyByChannelQuery = { __typename?: "Query" } & {
    surveyByChannel?: Maybe<{ __typename?: "BaseSurvey" } & BaseSurveyFragment>;
};

export type SurveyByChannel_ProjectQueryVariables = Exact<{
    id?: Maybe<Scalars["ID"]>;
    link?: Maybe<Scalars["String"]>;
}>;

export type SurveyByChannel_ProjectQuery = { __typename?: "Query" } & {
    surveyByChannel?: Maybe<
        { __typename?: "BaseSurvey" } & { project?: Maybe<{ __typename?: "BaseProject" } & BaseProjectFragment> }
    >;
};

export type SurveyByChannel_ThemeQueryVariables = Exact<{
    id?: Maybe<Scalars["ID"]>;
    link?: Maybe<Scalars["String"]>;
}>;

export type SurveyByChannel_ThemeQuery = { __typename?: "Query" } & {
    surveyByChannel?: Maybe<
        { __typename?: "BaseSurvey" } & {
            theme?: Maybe<{ __typename?: "BaseProjectTheme" } & BaseProjectThemeFragment>;
        }
    >;
};

export type SurveysQueryVariables = Exact<{
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    filter?: Maybe<SurveyFilterInput>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
    sortBy?: Maybe<SurveySortingInput>;
}>;

export type SurveysQuery = { __typename?: "Query" } & {
    surveys?: Maybe<{ __typename?: "SurveyCountableConnection" } & SurveyCountableConnectionFragment>;
};

export type ThemesQueryVariables = Exact<{
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
}>;

export type ThemesQuery = { __typename?: "Query" } & {
    themes?: Maybe<{ __typename?: "ProjectThemeCountableConnection" } & ProjectThemeCountableConnectionFragment>;
};

export type ViewerQueryVariables = Exact<{ [key: string]: never }>;

export type ViewerQuery = { __typename?: "Query" } & { viewer?: Maybe<{ __typename?: "User" } & UserFragment> };

export type Viewer_OrganizationQueryVariables = Exact<{ [key: string]: never }>;

export type Viewer_OrganizationQuery = { __typename?: "Query" } & {
    viewer?: Maybe<
        { __typename?: "User" } & {
            organization?: Maybe<{ __typename?: "AuthOrganization" } & AuthOrganizationFragment>;
        }
    >;
};

export type Viewer_OrganizationsQueryVariables = Exact<{
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
}>;

export type Viewer_OrganizationsQuery = { __typename?: "Query" } & {
    viewer?: Maybe<
        { __typename?: "User" } & {
            organizations?: Maybe<
                { __typename?: "OrganizationCountableConnection" } & OrganizationCountableConnectionFragment
            >;
        }
    >;
};

export type Viewer_ProjectQueryVariables = Exact<{ [key: string]: never }>;

export type Viewer_ProjectQuery = { __typename?: "Query" } & {
    viewer?: Maybe<{ __typename?: "User" } & { project?: Maybe<{ __typename?: "Project" } & ProjectFragment> }>;
};

export type Viewer_Project_OrganizationQueryVariables = Exact<{ [key: string]: never }>;

export type Viewer_Project_OrganizationQuery = { __typename?: "Query" } & {
    viewer?: Maybe<
        { __typename?: "User" } & {
            project?: Maybe<
                { __typename?: "Project" } & {
                    organization: { __typename?: "AuthOrganization" } & AuthOrganizationFragment;
                }
            >;
        }
    >;
};

export type Viewer_ProjectsQueryVariables = Exact<{
    after?: Maybe<Scalars["String"]>;
    before?: Maybe<Scalars["String"]>;
    first?: Maybe<Scalars["Int"]>;
    last?: Maybe<Scalars["Int"]>;
    orderBy?: Maybe<ProjectSortingInput>;
}>;

export type Viewer_ProjectsQuery = { __typename?: "Query" } & {
    viewer?: Maybe<
        { __typename?: "User" } & {
            projects?: Maybe<{ __typename?: "ProjectCountableConnection" } & ProjectCountableConnectionFragment>;
        }
    >;
};

export const NodeFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "Node" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Node" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<NodeFragment, unknown>;
export const AuthOrganizationFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "AuthOrganization" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "AuthOrganization" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "memberCount" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "slug" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<AuthOrganizationFragment, unknown>;
export const ProjectFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "Project" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Project" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "apiToken" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "organization" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "AuthOrganization" } }]
                        }
                    },
                    { kind: "Field", name: { kind: "Name", value: "slug" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "hasCompletedOnboardingFor" } },
                    { kind: "Field", name: { kind: "Name", value: "timezone" } },
                    { kind: "Field", name: { kind: "Name", value: "accessControl" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<ProjectFragment, unknown>;
export const AuthUserFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "AuthUser" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "AuthUser" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "isOnboarded" } },
                    { kind: "Field", name: { kind: "Name", value: "isStaff" } },
                    { kind: "Field", name: { kind: "Name", value: "isActive" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "organization" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "AuthOrganization" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Project" } }]
                        }
                    },
                    { kind: "Field", name: { kind: "Name", value: "email" } },
                    { kind: "Field", name: { kind: "Name", value: "lastName" } },
                    { kind: "Field", name: { kind: "Name", value: "firstName" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<AuthUserFragment, unknown>;
export const UserErrorFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "UserError" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "UserError" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "field" } },
                    { kind: "Field", name: { kind: "Name", value: "code" } },
                    { kind: "Field", name: { kind: "Name", value: "message" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<UserErrorFragment, unknown>;
export const EmailTokenUserAuthFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "EmailTokenUserAuth" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "EmailTokenUserAuth" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "user" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "AuthUser" } }]
                        }
                    },
                    { kind: "Field", name: { kind: "Name", value: "token" } },
                    { kind: "Field", name: { kind: "Name", value: "csrfToken" } },
                    { kind: "Field", name: { kind: "Name", value: "refreshToken" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "userErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<EmailTokenUserAuthFragment, unknown>;
export const EventErrorFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "EventError" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "EventError" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "field" } },
                    { kind: "Field", name: { kind: "Name", value: "code" } },
                    { kind: "Field", name: { kind: "Name", value: "message" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<EventErrorFragment, unknown>;
export const EventCaptureFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "EventCapture" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "EventCapture" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "status" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "EventError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "eventErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "EventError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<EventCaptureFragment, unknown>;
export const UserFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "User" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "User" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "isOnboarded" } },
                    { kind: "Field", name: { kind: "Name", value: "isStaff" } },
                    { kind: "Field", name: { kind: "Name", value: "isActive" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "organization" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "AuthOrganization" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Project" } }]
                        }
                    },
                    { kind: "Field", name: { kind: "Name", value: "email" } },
                    { kind: "Field", name: { kind: "Name", value: "lastName" } },
                    { kind: "Field", name: { kind: "Name", value: "firstName" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<UserFragment, unknown>;
export const ProjectThemeFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ProjectTheme" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "ProjectTheme" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "reference" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Project" } }]
                        }
                    },
                    { kind: "Field", name: { kind: "Name", value: "colorScheme" } },
                    { kind: "Field", name: { kind: "Name", value: "settings" } },
                    { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "creator" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "User" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<ProjectThemeFragment, unknown>;
export const SurveyFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "Survey" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Survey" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "reference" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "slug" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Project" } }]
                        }
                    },
                    { kind: "Field", name: { kind: "Name", value: "settings" } },
                    { kind: "Field", name: { kind: "Name", value: "status" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "theme" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "ProjectTheme" } }]
                        }
                    },
                    { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                    { kind: "Field", name: { kind: "Name", value: "type" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "creator" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "User" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<SurveyFragment, unknown>;
export const SurveyChannelFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "SurveyChannel" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SurveyChannel" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "reference" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "triggers" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "survey" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Survey" } }]
                        }
                    },
                    { kind: "Field", name: { kind: "Name", value: "conditions" } },
                    { kind: "Field", name: { kind: "Name", value: "settings" } },
                    { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                    { kind: "Field", name: { kind: "Name", value: "type" } },
                    { kind: "Field", name: { kind: "Name", value: "link" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<SurveyChannelFragment, unknown>;
export const SurveyErrorFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "SurveyError" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SurveyError" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "field" } },
                    { kind: "Field", name: { kind: "Name", value: "code" } },
                    { kind: "Field", name: { kind: "Name", value: "message" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<SurveyErrorFragment, unknown>;
export const SurveyChannelCreateFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "SurveyChannelCreate" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SurveyChannelCreate" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyChannel" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyChannel" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<SurveyChannelCreateFragment, unknown>;
export const OrganizationErrorFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "OrganizationError" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "OrganizationError" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "field" } },
                    { kind: "Field", name: { kind: "Name", value: "code" } },
                    { kind: "Field", name: { kind: "Name", value: "message" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<OrganizationErrorFragment, unknown>;
export const OrganizationFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "Organization" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Organization" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "memberCount" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "slug" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<OrganizationFragment, unknown>;
export const OrganizationInviteFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "OrganizationInvite" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "OrganizationInvite" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "firstName" } },
                    { kind: "Field", name: { kind: "Name", value: "expired" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "organization" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Organization" } }]
                        }
                    },
                    { kind: "Field", name: { kind: "Name", value: "email" } },
                    { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                    { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "role" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "inviter" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "User" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<OrganizationInviteFragment, unknown>;
export const OrganizationInviteCreateFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "OrganizationInviteCreate" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "OrganizationInviteCreate" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "OrganizationError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "organizationErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "OrganizationError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "organizationInvite" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "OrganizationInvite" } }
                            ]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<OrganizationInviteCreateFragment, unknown>;
export const ProjectErrorFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ProjectError" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "ProjectError" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "field" } },
                    { kind: "Field", name: { kind: "Name", value: "code" } },
                    { kind: "Field", name: { kind: "Name", value: "message" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<ProjectErrorFragment, unknown>;
export const ProjectCreateFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ProjectCreate" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "ProjectCreate" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "ProjectError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Project" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "projectErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "ProjectError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<ProjectCreateFragment, unknown>;
export const SurveyQuestionFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "SurveyQuestion" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SurveyQuestion" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "reference" } },
                    { kind: "Field", name: { kind: "Name", value: "label" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "options" } },
                    { kind: "Field", name: { kind: "Name", value: "maxPath" } },
                    { kind: "Field", name: { kind: "Name", value: "orderNumber" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "survey" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Survey" } }]
                        }
                    },
                    { kind: "Field", name: { kind: "Name", value: "settings" } },
                    { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                    { kind: "Field", name: { kind: "Name", value: "type" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<SurveyQuestionFragment, unknown>;
export const SurveyQuestionCreateFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "SurveyQuestionCreate" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SurveyQuestionCreate" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyQuestion" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyQuestion" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<SurveyQuestionCreateFragment, unknown>;
export const SurveyCreateFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "SurveyCreate" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SurveyCreate" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "survey" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Survey" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<SurveyCreateFragment, unknown>;
export const ProjectThemeCreateFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ProjectThemeCreate" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "ProjectThemeCreate" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "ProjectError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "projectErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "ProjectError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "projectTheme" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "ProjectTheme" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<ProjectThemeCreateFragment, unknown>;
export const SurveyResponseCreateFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "SurveyResponseCreate" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SurveyResponseCreate" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "responseId" } },
                    { kind: "Field", name: { kind: "Name", value: "status" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<SurveyResponseCreateFragment, unknown>;
export const OrganizationCreateFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "OrganizationCreate" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "OrganizationCreate" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "user" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "AuthUser" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "organization" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "AuthOrganization" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "OrganizationError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "organizationErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "OrganizationError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<OrganizationCreateFragment, unknown>;
export const LogoutFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "Logout" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Logout" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "userErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<LogoutFragment, unknown>;
export const SurveyChannelDeleteFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "SurveyChannelDelete" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SurveyChannelDelete" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyChannel" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyChannel" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<SurveyChannelDeleteFragment, unknown>;
export const SurveyQuestionDeleteFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "SurveyQuestionDelete" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SurveyQuestionDelete" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyQuestion" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyQuestion" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<SurveyQuestionDeleteFragment, unknown>;
export const SurveyDeleteFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "SurveyDelete" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SurveyDelete" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "survey" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Survey" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<SurveyDeleteFragment, unknown>;
export const ProjectThemeDeleteFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ProjectThemeDelete" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "ProjectThemeDelete" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "ProjectError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "projectErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "ProjectError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "projectTheme" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "ProjectTheme" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<ProjectThemeDeleteFragment, unknown>;
export const EmailUserAuthChallengeFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "EmailUserAuthChallenge" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "EmailUserAuthChallenge" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "authType" } },
                    { kind: "Field", name: { kind: "Name", value: "success" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "userErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<EmailUserAuthChallengeFragment, unknown>;
export const GoogleUserAuthFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "GoogleUserAuth" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "GoogleUserAuth" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "user" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "AuthUser" } }]
                        }
                    },
                    { kind: "Field", name: { kind: "Name", value: "token" } },
                    { kind: "Field", name: { kind: "Name", value: "csrfToken" } },
                    { kind: "Field", name: { kind: "Name", value: "refreshToken" } },
                    { kind: "Field", name: { kind: "Name", value: "success" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "userErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<GoogleUserAuthFragment, unknown>;
export const OrganizationJoinFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "OrganizationJoin" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "OrganizationJoin" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "user" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "AuthUser" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "OrganizationError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "organizationErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "OrganizationError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<OrganizationJoinFragment, unknown>;
export const RefreshTokenFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "RefreshToken" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "RefreshToken" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "token" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "userErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<RefreshTokenFragment, unknown>;
export const OrganizationInviteLinkResetFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "OrganizationInviteLinkReset" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "OrganizationInviteLinkReset" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "inviteLink" } },
                    { kind: "Field", name: { kind: "Name", value: "success" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "OrganizationError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "organizationErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "OrganizationError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<OrganizationInviteLinkResetFragment, unknown>;
export const OrganizationInviteLinkFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "OrganizationInviteLink" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "OrganizationInviteLink" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "inviteLink" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<OrganizationInviteLinkFragment, unknown>;
export const OrganizationInviteDetailsFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "OrganizationInviteDetails" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "OrganizationInviteDetails" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "firstName" } },
                    { kind: "Field", name: { kind: "Name", value: "expired" } },
                    { kind: "Field", name: { kind: "Name", value: "organizationId" } },
                    { kind: "Field", name: { kind: "Name", value: "email" } },
                    { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                    { kind: "Field", name: { kind: "Name", value: "organizationLogo" } },
                    { kind: "Field", name: { kind: "Name", value: "organizationName" } },
                    { kind: "Field", name: { kind: "Name", value: "inviter" } },
                    { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "role" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<OrganizationInviteDetailsFragment, unknown>;
export const OrganizationInviteLinkDetailsFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "OrganizationInviteLinkDetails" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "OrganizationInviteLinkDetails" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "organizationId" } },
                    { kind: "Field", name: { kind: "Name", value: "organizationLogo" } },
                    { kind: "Field", name: { kind: "Name", value: "organizationName" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<OrganizationInviteLinkDetailsFragment, unknown>;
export const SurveyChannelUpdateFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "SurveyChannelUpdate" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SurveyChannelUpdate" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyChannel" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyChannel" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<SurveyChannelUpdateFragment, unknown>;
export const ProjectUpdateFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ProjectUpdate" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "ProjectUpdate" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "ProjectError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Project" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "projectErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "ProjectError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<ProjectUpdateFragment, unknown>;
export const SurveyQuestionUpdateFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "SurveyQuestionUpdate" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SurveyQuestionUpdate" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyQuestion" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyQuestion" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<SurveyQuestionUpdateFragment, unknown>;
export const SurveyResponseUpdateFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "SurveyResponseUpdate" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SurveyResponseUpdate" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "status" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<SurveyResponseUpdateFragment, unknown>;
export const SurveyUpdateFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "SurveyUpdate" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SurveyUpdate" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "survey" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Survey" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<SurveyUpdateFragment, unknown>;
export const UserUpdateFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "UserUpdate" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "UserUpdate" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "user" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "User" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "userErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserError" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<UserUpdateFragment, unknown>;
export const ProjectThemeUpdateFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ProjectThemeUpdate" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "ProjectThemeUpdate" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "errors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "ProjectError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "projectErrors" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "ProjectError" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "projectTheme" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "ProjectTheme" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<ProjectThemeUpdateFragment, unknown>;
export const _ServiceFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "_Service" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "_Service" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "sdl" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<_ServiceFragment, unknown>;
export const PageInfoFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PageInfo" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "PageInfo" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "hasPreviousPage" } },
                    { kind: "Field", name: { kind: "Name", value: "startCursor" } },
                    { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
                    { kind: "Field", name: { kind: "Name", value: "endCursor" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<PageInfoFragment, unknown>;
export const BaseSurveyChannelFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "BaseSurveyChannel" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "BaseSurveyChannel" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "triggers" } },
                    { kind: "Field", name: { kind: "Name", value: "conditions" } },
                    { kind: "Field", name: { kind: "Name", value: "settings" } },
                    { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                    { kind: "Field", name: { kind: "Name", value: "type" } },
                    { kind: "Field", name: { kind: "Name", value: "link" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<BaseSurveyChannelFragment, unknown>;
export const BaseProjectFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "BaseProject" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "BaseProject" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "apiToken" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<BaseProjectFragment, unknown>;
export const BaseSurveyQuestionFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "BaseSurveyQuestion" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "BaseSurveyQuestion" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "description" } },
                    { kind: "Field", name: { kind: "Name", value: "label" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "options" } },
                    { kind: "Field", name: { kind: "Name", value: "maxPath" } },
                    { kind: "Field", name: { kind: "Name", value: "orderNumber" } },
                    { kind: "Field", name: { kind: "Name", value: "settings" } },
                    { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                    { kind: "Field", name: { kind: "Name", value: "type" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<BaseSurveyQuestionFragment, unknown>;
export const BaseProjectThemeFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "BaseProjectTheme" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "BaseProjectTheme" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "colorScheme" } },
                    { kind: "Field", name: { kind: "Name", value: "settings" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<BaseProjectThemeFragment, unknown>;
export const BaseSurveyFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "BaseSurvey" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "BaseSurvey" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    { kind: "Field", name: { kind: "Name", value: "slug" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "endDate" } },
                    { kind: "Field", name: { kind: "Name", value: "startDate" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "channels" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "BaseSurveyChannel" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "BaseProject" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "questions" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "BaseSurveyQuestion" } }
                            ]
                        }
                    },
                    { kind: "Field", name: { kind: "Name", value: "settings" } },
                    { kind: "Field", name: { kind: "Name", value: "status" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "theme" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "BaseProjectTheme" } }]
                        }
                    },
                    { kind: "Field", name: { kind: "Name", value: "createdAt" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<BaseSurveyFragment, unknown>;
export const BaseSurveyCountableConnectionFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "BaseSurveyCountableConnection" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "BaseSurveyCountableConnection" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "pageInfo" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "PageInfo" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "BaseSurvey" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<BaseSurveyCountableConnectionFragment, unknown>;
export const EventFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "Event" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Event" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "distinctId" } },
                    { kind: "Field", name: { kind: "Name", value: "event" } },
                    { kind: "Field", name: { kind: "Name", value: "properties" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Project" } }]
                        }
                    },
                    { kind: "Field", name: { kind: "Name", value: "timestamp" } },
                    { kind: "Field", name: { kind: "Name", value: "createdAt" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<EventFragment, unknown>;
export const EventCountableConnectionFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "EventCountableConnection" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "EventCountableConnection" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "pageInfo" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "PageInfo" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Event" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<EventCountableConnectionFragment, unknown>;
export const EventDefinitionFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "EventDefinition" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "EventDefinition" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Project" } }]
                        }
                    },
                    { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                    { kind: "Field", name: { kind: "Name", value: "lastSeenAt" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<EventDefinitionFragment, unknown>;
export const EventDefinitionCountableConnectionFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "EventDefinitionCountableConnection" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "EventDefinitionCountableConnection" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "pageInfo" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "PageInfo" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "EventDefinition" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<EventDefinitionCountableConnectionFragment, unknown>;
export const EventPropertyFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "EventProperty" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "EventProperty" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "event" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Project" } }]
                        }
                    },
                    { kind: "Field", name: { kind: "Name", value: "property" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<EventPropertyFragment, unknown>;
export const EventPropertyCountableConnectionFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "EventPropertyCountableConnection" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "EventPropertyCountableConnection" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "pageInfo" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "PageInfo" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "EventProperty" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<EventPropertyCountableConnectionFragment, unknown>;
export const OrganizationCountableConnectionFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "OrganizationCountableConnection" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "OrganizationCountableConnection" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "pageInfo" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "PageInfo" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Organization" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<OrganizationCountableConnectionFragment, unknown>;
export const PersonFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "Person" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Person" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "attributes" } },
                    { kind: "Field", name: { kind: "Name", value: "distinctIds" } },
                    { kind: "Field", name: { kind: "Name", value: "uuid" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Project" } }]
                        }
                    },
                    { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                    { kind: "Field", name: { kind: "Name", value: "isIdentified" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<PersonFragment, unknown>;
export const PersonCountableConnectionFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PersonCountableConnection" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "PersonCountableConnection" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "pageInfo" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "PageInfo" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Person" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<PersonCountableConnectionFragment, unknown>;
export const ProjectCountableConnectionFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ProjectCountableConnection" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "ProjectCountableConnection" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "pageInfo" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "PageInfo" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Project" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<ProjectCountableConnectionFragment, unknown>;
export const ProjectThemeCountableConnectionFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "ProjectThemeCountableConnection" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "ProjectThemeCountableConnection" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "pageInfo" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "PageInfo" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "ProjectTheme" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<ProjectThemeCountableConnectionFragment, unknown>;
export const PropertyDefinitionFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PropertyDefinition" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "PropertyDefinition" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "id" } },
                    { kind: "Field", name: { kind: "Name", value: "name" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Project" } }]
                        }
                    },
                    { kind: "Field", name: { kind: "Name", value: "propertyType" } },
                    { kind: "Field", name: { kind: "Name", value: "type" } },
                    { kind: "Field", name: { kind: "Name", value: "isNumerical" } }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<PropertyDefinitionFragment, unknown>;
export const PropertyDefinitionCountableConnectionFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "PropertyDefinitionCountableConnection" },
            typeCondition: {
                kind: "NamedType",
                name: { kind: "Name", value: "PropertyDefinitionCountableConnection" }
            },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "pageInfo" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "PageInfo" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "PropertyDefinition" } }
                            ]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<PropertyDefinitionCountableConnectionFragment, unknown>;
export const SurveyChannelCountableConnectionFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "SurveyChannelCountableConnection" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SurveyChannelCountableConnection" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "pageInfo" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "PageInfo" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyChannel" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<SurveyChannelCountableConnectionFragment, unknown>;
export const SurveyCountableConnectionFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "SurveyCountableConnection" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SurveyCountableConnection" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "pageInfo" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "PageInfo" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Survey" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<SurveyCountableConnectionFragment, unknown>;
export const SurveyQuestionCountableConnectionFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "SurveyQuestionCountableConnection" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "SurveyQuestionCountableConnection" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "pageInfo" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "PageInfo" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyQuestion" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<SurveyQuestionCountableConnectionFragment, unknown>;
export const UserCountableConnectionFragmentDoc = ({
    kind: "Document",
    definitions: [
        {
            kind: "FragmentDefinition",
            name: { kind: "Name", value: "UserCountableConnection" },
            typeCondition: { kind: "NamedType", name: { kind: "Name", value: "UserCountableConnection" } },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    { kind: "Field", name: { kind: "Name", value: "__typename" } },
                    { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "pageInfo" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "PageInfo" } }]
                        }
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "User" } }]
                        }
                    }
                ]
            }
        }
    ]
} as unknown) as DocumentNode<UserCountableConnectionFragment, unknown>;
export const EmailTokenUserAuthDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "emailTokenUserAuth" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "email" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "inviteLink" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "token" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "emailTokenUserAuth" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "email" },
                                value: { kind: "Variable", name: { kind: "Name", value: "email" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "inviteLink" },
                                value: { kind: "Variable", name: { kind: "Name", value: "inviteLink" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "token" },
                                value: { kind: "Variable", name: { kind: "Name", value: "token" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "EmailTokenUserAuth" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...EmailTokenUserAuthFragmentDoc.definitions,
        ...AuthUserFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...UserErrorFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<EmailTokenUserAuthMutation, EmailTokenUserAuthMutationVariables>;
export const EmailUserAuthChallengeDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "emailUserAuthChallenge" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "email" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "inviteLink" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "emailUserAuthChallenge" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "email" },
                                value: { kind: "Variable", name: { kind: "Name", value: "email" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "inviteLink" },
                                value: { kind: "Variable", name: { kind: "Name", value: "inviteLink" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "EmailUserAuthChallenge" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...EmailUserAuthChallengeFragmentDoc.definitions,
        ...UserErrorFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<EmailUserAuthChallengeMutation, EmailUserAuthChallengeMutationVariables>;
export const CaptureEventDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "captureEvent" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "batch" } },
                    type: {
                        kind: "ListType",
                        type: {
                            kind: "NonNullType",
                            type: { kind: "NamedType", name: { kind: "Name", value: "EventCaptureInput" } }
                        }
                    }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "EventCaptureInput" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "sentAt" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "DateTime" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "eventCapture" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "batch" },
                                value: { kind: "Variable", name: { kind: "Name", value: "batch" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "sentAt" },
                                value: { kind: "Variable", name: { kind: "Name", value: "sentAt" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "EventCapture" } }]
                        }
                    }
                ]
            }
        },
        ...EventCaptureFragmentDoc.definitions,
        ...EventErrorFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<CaptureEventMutation, CaptureEventMutationVariables>;
export const GoogleUserAuthDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "googleUserAuth" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "code" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "inviteLink" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "googleUserAuth" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "code" },
                                value: { kind: "Variable", name: { kind: "Name", value: "code" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "inviteLink" },
                                value: { kind: "Variable", name: { kind: "Name", value: "inviteLink" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "GoogleUserAuth" } }]
                        }
                    }
                ]
            }
        },
        ...GoogleUserAuthFragmentDoc.definitions,
        ...AuthUserFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...UserErrorFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<GoogleUserAuthMutation, GoogleUserAuthMutationVariables>;
export const LogoutDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "logout" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "logout" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Logout" } }]
                        }
                    }
                ]
            }
        },
        ...LogoutFragmentDoc.definitions,
        ...UserErrorFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const CreateOrganizationDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "createOrganization" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "OrganizationCreateInput" } }
                    }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "survey" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "OnboardingCustomerSurvey" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "organizationCreate" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "survey" },
                                value: { kind: "Variable", name: { kind: "Name", value: "survey" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "OrganizationCreate" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...OrganizationCreateFragmentDoc.definitions,
        ...AuthUserFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...OrganizationErrorFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<CreateOrganizationMutation, CreateOrganizationMutationVariables>;
export const CreateOrganizationInviteDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "createOrganizationInvite" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "OrganizationInviteCreateInput" } }
                    }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "organizationInviteCreate" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "OrganizationInviteCreate" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...OrganizationInviteCreateFragmentDoc.definitions,
        ...OrganizationErrorFragmentDoc.definitions,
        ...OrganizationInviteFragmentDoc.definitions,
        ...OrganizationFragmentDoc.definitions,
        ...UserFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<CreateOrganizationInviteMutation, CreateOrganizationInviteMutationVariables>;
export const ResetOrganizationInviteLinkDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "resetOrganizationInviteLink" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "organizationInviteLinkReset" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "OrganizationInviteLinkReset" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...OrganizationInviteLinkResetFragmentDoc.definitions,
        ...OrganizationErrorFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<ResetOrganizationInviteLinkMutation, ResetOrganizationInviteLinkMutationVariables>;
export const JoinOrganizationDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "joinOrganization" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "OrganizationJoinInput" } }
                    }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "organizationJoin" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "OrganizationJoin" } }]
                        }
                    }
                ]
            }
        },
        ...OrganizationJoinFragmentDoc.definitions,
        ...AuthUserFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...OrganizationErrorFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<JoinOrganizationMutation, JoinOrganizationMutationVariables>;
export const CreateProjectDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "createProject" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "ProjectCreateInput" } }
                    }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "projectCreate" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "ProjectCreate" } }]
                        }
                    }
                ]
            }
        },
        ...ProjectCreateFragmentDoc.definitions,
        ...ProjectErrorFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<CreateProjectMutation, CreateProjectMutationVariables>;
export const CreateProjectThemeDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "createProjectTheme" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "ProjectThemeCreateInput" } }
                    }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "projectThemeCreate" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "ProjectThemeCreate" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...ProjectThemeCreateFragmentDoc.definitions,
        ...ProjectErrorFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<CreateProjectThemeMutation, CreateProjectThemeMutationVariables>;
export const DeleteProjectThemeDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "deleteProjectTheme" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "projectThemeDelete" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "ProjectThemeDelete" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...ProjectThemeDeleteFragmentDoc.definitions,
        ...ProjectErrorFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<DeleteProjectThemeMutation, DeleteProjectThemeMutationVariables>;
export const UpdateProjectThemeDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "updateProjectTheme" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "ProjectThemeUpdateInput" } }
                    }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "projectThemeUpdate" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "ProjectThemeUpdate" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...ProjectThemeUpdateFragmentDoc.definitions,
        ...ProjectErrorFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<UpdateProjectThemeMutation, UpdateProjectThemeMutationVariables>;
export const UpdateProjectDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "updateProject" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "ProjectUpdateInput" } }
                    }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "projectUpdate" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "ProjectUpdate" } }]
                        }
                    }
                ]
            }
        },
        ...ProjectUpdateFragmentDoc.definitions,
        ...ProjectErrorFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const CreateSurveyChannelDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "createSurveyChannel" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "SurveyChannelCreateInput" } }
                    }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyChannelCreate" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "SurveyChannelCreate" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...SurveyChannelCreateFragmentDoc.definitions,
        ...SurveyChannelFragmentDoc.definitions,
        ...SurveyFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...UserFragmentDoc.definitions,
        ...SurveyErrorFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<CreateSurveyChannelMutation, CreateSurveyChannelMutationVariables>;
export const DeleteSurveyChannelDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "deleteSurveyChannel" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyChannelDelete" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "SurveyChannelDelete" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...SurveyChannelDeleteFragmentDoc.definitions,
        ...SurveyErrorFragmentDoc.definitions,
        ...SurveyChannelFragmentDoc.definitions,
        ...SurveyFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<DeleteSurveyChannelMutation, DeleteSurveyChannelMutationVariables>;
export const UpdateSurveyChannelDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "updateSurveyChannel" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "SurveyChannelUpdateInput" } }
                    }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyChannelUpdate" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "SurveyChannelUpdate" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...SurveyChannelUpdateFragmentDoc.definitions,
        ...SurveyErrorFragmentDoc.definitions,
        ...SurveyChannelFragmentDoc.definitions,
        ...SurveyFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<UpdateSurveyChannelMutation, UpdateSurveyChannelMutationVariables>;
export const CreateSurveyDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "createSurvey" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "SurveyCreateInput" } }
                    }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyCreate" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyCreate" } }]
                        }
                    }
                ]
            }
        },
        ...SurveyCreateFragmentDoc.definitions,
        ...SurveyErrorFragmentDoc.definitions,
        ...SurveyFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<CreateSurveyMutation, CreateSurveyMutationVariables>;
export const DeleteSurveyDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "deleteSurvey" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyDelete" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyDelete" } }]
                        }
                    }
                ]
            }
        },
        ...SurveyDeleteFragmentDoc.definitions,
        ...SurveyErrorFragmentDoc.definitions,
        ...SurveyFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<DeleteSurveyMutation, DeleteSurveyMutationVariables>;
export const CreateSurveyQuestionDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "createSurveyQuestion" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "SurveyQuestionCreateInput" } }
                    }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyQuestionCreate" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "SurveyQuestionCreate" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...SurveyQuestionCreateFragmentDoc.definitions,
        ...SurveyErrorFragmentDoc.definitions,
        ...SurveyQuestionFragmentDoc.definitions,
        ...SurveyFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<CreateSurveyQuestionMutation, CreateSurveyQuestionMutationVariables>;
export const DeleteSurveyQuestionDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "deleteSurveyQuestion" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyQuestionDelete" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "SurveyQuestionDelete" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...SurveyQuestionDeleteFragmentDoc.definitions,
        ...SurveyErrorFragmentDoc.definitions,
        ...SurveyQuestionFragmentDoc.definitions,
        ...SurveyFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<DeleteSurveyQuestionMutation, DeleteSurveyQuestionMutationVariables>;
export const UpdateSurveyQuestionDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "updateSurveyQuestion" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "SurveyQuestionUpdateInput" } }
                    }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyQuestionUpdate" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "SurveyQuestionUpdate" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...SurveyQuestionUpdateFragmentDoc.definitions,
        ...SurveyErrorFragmentDoc.definitions,
        ...SurveyQuestionFragmentDoc.definitions,
        ...SurveyFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<UpdateSurveyQuestionMutation, UpdateSurveyQuestionMutationVariables>;
export const CreateSurveyResponseDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "createSurveyResponse" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "SurveyResponseCreateInput" } }
                    }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyResponseCreate" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "SurveyResponseCreate" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...SurveyResponseCreateFragmentDoc.definitions,
        ...SurveyErrorFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<CreateSurveyResponseMutation, CreateSurveyResponseMutationVariables>;
export const UpdateSurveyResponseDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "updateSurveyResponse" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "SurveyResponseUpdateInput" } }
                    }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyResponseUpdate" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "SurveyResponseUpdate" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...SurveyResponseUpdateFragmentDoc.definitions,
        ...SurveyErrorFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<UpdateSurveyResponseMutation, UpdateSurveyResponseMutationVariables>;
export const UpdateSurveyDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "updateSurvey" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "SurveyUpdateInput" } }
                    }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyUpdate" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "SurveyUpdate" } }]
                        }
                    }
                ]
            }
        },
        ...SurveyUpdateFragmentDoc.definitions,
        ...SurveyErrorFragmentDoc.definitions,
        ...SurveyFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<UpdateSurveyMutation, UpdateSurveyMutationVariables>;
export const RefreshTokenDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "refreshToken" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "csrfToken" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "refreshToken" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "tokenRefresh" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "csrfToken" },
                                value: { kind: "Variable", name: { kind: "Name", value: "csrfToken" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "refreshToken" },
                                value: { kind: "Variable", name: { kind: "Name", value: "refreshToken" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "RefreshToken" } }]
                        }
                    }
                ]
            }
        },
        ...RefreshTokenFragmentDoc.definitions,
        ...UserErrorFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const UpdateUserDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "updateUser" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
                    type: {
                        kind: "NonNullType",
                        type: { kind: "NamedType", name: { kind: "Name", value: "UserInput" } }
                    }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "userUpdate" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "input" },
                                value: { kind: "Variable", name: { kind: "Name", value: "input" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "UserUpdate" } }]
                        }
                    }
                ]
            }
        },
        ...UserUpdateFragmentDoc.definitions,
        ...UserErrorFragmentDoc.definitions,
        ...UserFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const _ServiceDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "_service" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "_service" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "_Service" } }]
                        }
                    }
                ]
            }
        },
        ..._ServiceFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<_ServiceQuery, _ServiceQueryVariables>;
export const ActiveSurveysDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "activeSurveys" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "before" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "filter" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "SurveyFilterInput" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "sortBy" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "SurveySortingInput" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "activeSurveys" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "after" },
                                value: { kind: "Variable", name: { kind: "Name", value: "after" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "before" },
                                value: { kind: "Variable", name: { kind: "Name", value: "before" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "filter" },
                                value: { kind: "Variable", name: { kind: "Name", value: "filter" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "first" },
                                value: { kind: "Variable", name: { kind: "Name", value: "first" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "last" },
                                value: { kind: "Variable", name: { kind: "Name", value: "last" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "sortBy" },
                                value: { kind: "Variable", name: { kind: "Name", value: "sortBy" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "BaseSurveyCountableConnection" }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...BaseSurveyCountableConnectionFragmentDoc.definitions,
        ...PageInfoFragmentDoc.definitions,
        ...BaseSurveyFragmentDoc.definitions,
        ...BaseSurveyChannelFragmentDoc.definitions,
        ...BaseProjectFragmentDoc.definitions,
        ...BaseSurveyQuestionFragmentDoc.definitions,
        ...BaseProjectThemeFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<ActiveSurveysQuery, ActiveSurveysQueryVariables>;
export const ChannelsDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "channels" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "before" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "channels" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "after" },
                                value: { kind: "Variable", name: { kind: "Name", value: "after" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "before" },
                                value: { kind: "Variable", name: { kind: "Name", value: "before" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "first" },
                                value: { kind: "Variable", name: { kind: "Name", value: "first" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "last" },
                                value: { kind: "Variable", name: { kind: "Name", value: "last" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "SurveyChannelCountableConnection" }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...SurveyChannelCountableConnectionFragmentDoc.definitions,
        ...PageInfoFragmentDoc.definitions,
        ...SurveyChannelFragmentDoc.definitions,
        ...SurveyFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<ChannelsQuery, ChannelsQueryVariables>;
export const EventDefinitionsDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "eventDefinitions" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "before" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "eventDefinitions" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "after" },
                                value: { kind: "Variable", name: { kind: "Name", value: "after" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "before" },
                                value: { kind: "Variable", name: { kind: "Name", value: "before" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "first" },
                                value: { kind: "Variable", name: { kind: "Name", value: "first" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "last" },
                                value: { kind: "Variable", name: { kind: "Name", value: "last" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "EventDefinitionCountableConnection" }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...EventDefinitionCountableConnectionFragmentDoc.definitions,
        ...PageInfoFragmentDoc.definitions,
        ...EventDefinitionFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<EventDefinitionsQuery, EventDefinitionsQueryVariables>;
export const EventPropertiesDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "eventProperties" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "before" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "event" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "eventProperties" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "after" },
                                value: { kind: "Variable", name: { kind: "Name", value: "after" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "before" },
                                value: { kind: "Variable", name: { kind: "Name", value: "before" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "event" },
                                value: { kind: "Variable", name: { kind: "Name", value: "event" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "first" },
                                value: { kind: "Variable", name: { kind: "Name", value: "first" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "last" },
                                value: { kind: "Variable", name: { kind: "Name", value: "last" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "EventPropertyCountableConnection" }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...EventPropertyCountableConnectionFragmentDoc.definitions,
        ...PageInfoFragmentDoc.definitions,
        ...EventPropertyFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<EventPropertiesQuery, EventPropertiesQueryVariables>;
export const EventsDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "events" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "before" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "events" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "after" },
                                value: { kind: "Variable", name: { kind: "Name", value: "after" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "before" },
                                value: { kind: "Variable", name: { kind: "Name", value: "before" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "first" },
                                value: { kind: "Variable", name: { kind: "Name", value: "first" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "last" },
                                value: { kind: "Variable", name: { kind: "Name", value: "last" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "EventCountableConnection" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...EventCountableConnectionFragmentDoc.definitions,
        ...PageInfoFragmentDoc.definitions,
        ...EventFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<EventsQuery, EventsQueryVariables>;
export const OrganizationInviteLinkDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "organizationInviteLink" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "organizationInviteLink" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "OrganizationInviteLink" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...OrganizationInviteLinkFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<OrganizationInviteLinkQuery, OrganizationInviteLinkQueryVariables>;
export const PersonsDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "persons" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "before" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "persons" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "after" },
                                value: { kind: "Variable", name: { kind: "Name", value: "after" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "before" },
                                value: { kind: "Variable", name: { kind: "Name", value: "before" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "first" },
                                value: { kind: "Variable", name: { kind: "Name", value: "first" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "last" },
                                value: { kind: "Variable", name: { kind: "Name", value: "last" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "PersonCountableConnection" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...PersonCountableConnectionFragmentDoc.definitions,
        ...PageInfoFragmentDoc.definitions,
        ...PersonFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<PersonsQuery, PersonsQueryVariables>;
export const PropertyDefinitionsDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "propertyDefinitions" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "before" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "definitionType" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "PropertyDefinitionTypeEnum" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "propertyDefinitions" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "after" },
                                value: { kind: "Variable", name: { kind: "Name", value: "after" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "before" },
                                value: { kind: "Variable", name: { kind: "Name", value: "before" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "definitionType" },
                                value: { kind: "Variable", name: { kind: "Name", value: "definitionType" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "first" },
                                value: { kind: "Variable", name: { kind: "Name", value: "first" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "last" },
                                value: { kind: "Variable", name: { kind: "Name", value: "last" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "PropertyDefinitionCountableConnection" }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...PropertyDefinitionCountableConnectionFragmentDoc.definitions,
        ...PageInfoFragmentDoc.definitions,
        ...PropertyDefinitionFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<PropertyDefinitionsQuery, PropertyDefinitionsQueryVariables>;
export const QuestionsDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "questions" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "before" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "questions" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "after" },
                                value: { kind: "Variable", name: { kind: "Name", value: "after" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "before" },
                                value: { kind: "Variable", name: { kind: "Name", value: "before" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "first" },
                                value: { kind: "Variable", name: { kind: "Name", value: "first" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "last" },
                                value: { kind: "Variable", name: { kind: "Name", value: "last" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "SurveyQuestionCountableConnection" }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...SurveyQuestionCountableConnectionFragmentDoc.definitions,
        ...PageInfoFragmentDoc.definitions,
        ...SurveyQuestionFragmentDoc.definitions,
        ...SurveyFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<QuestionsQuery, QuestionsQueryVariables>;
export const SurveyDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "survey" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "slug" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "survey" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "slug" },
                                value: { kind: "Variable", name: { kind: "Name", value: "slug" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "Survey" } }]
                        }
                    }
                ]
            }
        },
        ...SurveyFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<SurveyQuery, SurveyQueryVariables>;
export const Survey_ChannelsDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "survey_channels" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "slug" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "before" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "survey" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "slug" },
                                value: { kind: "Variable", name: { kind: "Name", value: "slug" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "channels" },
                                    arguments: [
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "after" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "after" } }
                                        },
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "before" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "before" } }
                                        },
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "first" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "first" } }
                                        },
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "last" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "last" } }
                                        }
                                    ],
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "SurveyChannelCountableConnection" }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...SurveyChannelCountableConnectionFragmentDoc.definitions,
        ...PageInfoFragmentDoc.definitions,
        ...SurveyChannelFragmentDoc.definitions,
        ...SurveyFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<Survey_ChannelsQuery, Survey_ChannelsQueryVariables>;
export const Survey_ProjectDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "survey_project" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "slug" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "survey" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "slug" },
                                value: { kind: "Variable", name: { kind: "Name", value: "slug" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "project" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "FragmentSpread", name: { kind: "Name", value: "Project" } }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<Survey_ProjectQuery, Survey_ProjectQueryVariables>;
export const Survey_Project_OrganizationDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "survey_project_organization" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "slug" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "survey" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "slug" },
                                value: { kind: "Variable", name: { kind: "Name", value: "slug" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "project" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "organization" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: { kind: "Name", value: "AuthOrganization" }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...AuthOrganizationFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<Survey_Project_OrganizationQuery, Survey_Project_OrganizationQueryVariables>;
export const Survey_QuestionsDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "survey_questions" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "slug" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "before" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "survey" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "slug" },
                                value: { kind: "Variable", name: { kind: "Name", value: "slug" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "questions" },
                                    arguments: [
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "after" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "after" } }
                                        },
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "before" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "before" } }
                                        },
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "first" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "first" } }
                                        },
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "last" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "last" } }
                                        }
                                    ],
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "SurveyQuestionCountableConnection" }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...SurveyQuestionCountableConnectionFragmentDoc.definitions,
        ...PageInfoFragmentDoc.definitions,
        ...SurveyQuestionFragmentDoc.definitions,
        ...SurveyFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<Survey_QuestionsQuery, Survey_QuestionsQueryVariables>;
export const Survey_ThemeDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "survey_theme" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "slug" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "survey" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "slug" },
                                value: { kind: "Variable", name: { kind: "Name", value: "slug" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "theme" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "FragmentSpread", name: { kind: "Name", value: "ProjectTheme" } }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...ProjectThemeFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<Survey_ThemeQuery, Survey_ThemeQueryVariables>;
export const Survey_Theme_ProjectDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "survey_theme_project" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "slug" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "survey" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "slug" },
                                value: { kind: "Variable", name: { kind: "Name", value: "slug" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "theme" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "project" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: { kind: "Name", value: "Project" }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<Survey_Theme_ProjectQuery, Survey_Theme_ProjectQueryVariables>;
export const Survey_Theme_Project_OrganizationDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "survey_theme_project_organization" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "slug" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "survey" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "slug" },
                                value: { kind: "Variable", name: { kind: "Name", value: "slug" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "theme" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "project" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "organization" },
                                                            selectionSet: {
                                                                kind: "SelectionSet",
                                                                selections: [
                                                                    {
                                                                        kind: "FragmentSpread",
                                                                        name: {
                                                                            kind: "Name",
                                                                            value: "AuthOrganization"
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...AuthOrganizationFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<Survey_Theme_Project_OrganizationQuery, Survey_Theme_Project_OrganizationQueryVariables>;
export const SurveyByChannelDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "surveyByChannel" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "link" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyByChannel" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "link" },
                                value: { kind: "Variable", name: { kind: "Name", value: "link" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "BaseSurvey" } }]
                        }
                    }
                ]
            }
        },
        ...BaseSurveyFragmentDoc.definitions,
        ...BaseSurveyChannelFragmentDoc.definitions,
        ...BaseProjectFragmentDoc.definitions,
        ...BaseSurveyQuestionFragmentDoc.definitions,
        ...BaseProjectThemeFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<SurveyByChannelQuery, SurveyByChannelQueryVariables>;
export const SurveyByChannel_ProjectDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "surveyByChannel_project" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "link" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyByChannel" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "link" },
                                value: { kind: "Variable", name: { kind: "Name", value: "link" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "project" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "FragmentSpread", name: { kind: "Name", value: "BaseProject" } }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...BaseProjectFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<SurveyByChannel_ProjectQuery, SurveyByChannel_ProjectQueryVariables>;
export const SurveyByChannel_ThemeDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "surveyByChannel_theme" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ID" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "link" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveyByChannel" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: { kind: "Variable", name: { kind: "Name", value: "id" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "link" },
                                value: { kind: "Variable", name: { kind: "Name", value: "link" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "theme" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "BaseProjectTheme" }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...BaseProjectThemeFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<SurveyByChannel_ThemeQuery, SurveyByChannel_ThemeQueryVariables>;
export const SurveysDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "surveys" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "before" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "filter" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "SurveyFilterInput" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "sortBy" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "SurveySortingInput" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "surveys" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "after" },
                                value: { kind: "Variable", name: { kind: "Name", value: "after" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "before" },
                                value: { kind: "Variable", name: { kind: "Name", value: "before" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "filter" },
                                value: { kind: "Variable", name: { kind: "Name", value: "filter" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "first" },
                                value: { kind: "Variable", name: { kind: "Name", value: "first" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "last" },
                                value: { kind: "Variable", name: { kind: "Name", value: "last" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "sortBy" },
                                value: { kind: "Variable", name: { kind: "Name", value: "sortBy" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                { kind: "FragmentSpread", name: { kind: "Name", value: "SurveyCountableConnection" } }
                            ]
                        }
                    }
                ]
            }
        },
        ...SurveyCountableConnectionFragmentDoc.definitions,
        ...PageInfoFragmentDoc.definitions,
        ...SurveyFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<SurveysQuery, SurveysQueryVariables>;
export const ThemesDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "themes" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "before" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "themes" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "after" },
                                value: { kind: "Variable", name: { kind: "Name", value: "after" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "before" },
                                value: { kind: "Variable", name: { kind: "Name", value: "before" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "first" },
                                value: { kind: "Variable", name: { kind: "Name", value: "first" } }
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "last" },
                                value: { kind: "Variable", name: { kind: "Name", value: "last" } }
                            }
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "FragmentSpread",
                                    name: { kind: "Name", value: "ProjectThemeCountableConnection" }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...ProjectThemeCountableConnectionFragmentDoc.definitions,
        ...PageInfoFragmentDoc.definitions,
        ...ProjectThemeFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...UserFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<ThemesQuery, ThemesQueryVariables>;
export const ViewerDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "viewer" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "viewer" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [{ kind: "FragmentSpread", name: { kind: "Name", value: "User" } }]
                        }
                    }
                ]
            }
        },
        ...UserFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<ViewerQuery, ViewerQueryVariables>;
export const Viewer_OrganizationDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "viewer_organization" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "viewer" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "organization" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "AuthOrganization" }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...AuthOrganizationFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<Viewer_OrganizationQuery, Viewer_OrganizationQueryVariables>;
export const Viewer_OrganizationsDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "viewer_organizations" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "before" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "viewer" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "organizations" },
                                    arguments: [
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "after" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "after" } }
                                        },
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "before" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "before" } }
                                        },
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "first" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "first" } }
                                        },
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "last" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "last" } }
                                        }
                                    ],
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "OrganizationCountableConnection" }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...OrganizationCountableConnectionFragmentDoc.definitions,
        ...PageInfoFragmentDoc.definitions,
        ...OrganizationFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<Viewer_OrganizationsQuery, Viewer_OrganizationsQueryVariables>;
export const Viewer_ProjectDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "viewer_project" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "viewer" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "project" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            { kind: "FragmentSpread", name: { kind: "Name", value: "Project" } }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<Viewer_ProjectQuery, Viewer_ProjectQueryVariables>;
export const Viewer_Project_OrganizationDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "viewer_project_organization" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "viewer" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "project" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: { kind: "Name", value: "organization" },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "FragmentSpread",
                                                            name: { kind: "Name", value: "AuthOrganization" }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...AuthOrganizationFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<Viewer_Project_OrganizationQuery, Viewer_Project_OrganizationQueryVariables>;
export const Viewer_ProjectsDocument = ({
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "viewer_projects" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "before" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "String" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "Int" } }
                },
                {
                    kind: "VariableDefinition",
                    variable: { kind: "Variable", name: { kind: "Name", value: "orderBy" } },
                    type: { kind: "NamedType", name: { kind: "Name", value: "ProjectSortingInput" } }
                }
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "viewer" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "projects" },
                                    arguments: [
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "after" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "after" } }
                                        },
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "before" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "before" } }
                                        },
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "first" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "first" } }
                                        },
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "last" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "last" } }
                                        },
                                        {
                                            kind: "Argument",
                                            name: { kind: "Name", value: "orderBy" },
                                            value: { kind: "Variable", name: { kind: "Name", value: "orderBy" } }
                                        }
                                    ],
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "FragmentSpread",
                                                name: { kind: "Name", value: "ProjectCountableConnection" }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        ...ProjectCountableConnectionFragmentDoc.definitions,
        ...PageInfoFragmentDoc.definitions,
        ...ProjectFragmentDoc.definitions,
        ...AuthOrganizationFragmentDoc.definitions
    ]
} as unknown) as DocumentNode<Viewer_ProjectsQuery, Viewer_ProjectsQueryVariables>;
