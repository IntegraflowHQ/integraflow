import { DocumentNode } from "graphql/language/ast";
import * as I from "./_generated_documents";

/** The function for calling the graphql client */
export type IntegraflowRequest = <
    Response,
    Variables extends Record<string, unknown>
>(
    doc: DocumentNode,
    variables?: Variables
) => Promise<Response>;

/**
 * Base class to provide a request function
 *
 * @param request - function to call the graphql client
 */
export class Request {
    protected _request: IntegraflowRequest;

    public constructor(request: IntegraflowRequest) {
        this._request = request;
    }
}

/** Fetch return type wrapped in a promise */
export type IntegraflowFetch<Response> = Promise<Response>;

/**
 * Variables required for pagination
 * Follows the Relay spec
 */
export type IntegraflowConnectionVariables = {
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};

/**
 * Default connection variables required for pagination
 * Defaults to 50 as per the Integraflow API
 */
function defaultConnection<Variables extends IntegraflowConnectionVariables>(
    variables: Variables
): Variables {
    return {
        ...variables,
        first: variables.first ?? (variables.after ? 100 : undefined),
        last: variables.last ?? (variables.before ? 100 : undefined)
    };
}

/**
 * Connection models containing a list of nodes and pagination information
 * Follows the Relay spec
 */
export class IntegraflowConnection<Node> extends Request {
    public pageInfo: PageInfo;
    public nodes: Node[];

    public constructor(request: IntegraflowRequest) {
        super(request);
        this.pageInfo = new PageInfo(request, {
            hasNextPage: false,
            hasPreviousPage: false,
            __typename: "PageInfo"
        });
        this.nodes = [];
    }
}

/**
 * The base connection class to provide pagination
 * Follows the Relay spec
 *
 * @param request - function to call the graphql client
 * @param fetch - Function to refetch the connection given different pagination variables
 * @param nodes - The list of models to initialize the connection
 * @param pageInfo - The pagination information to initialize the connection
 */
export class Connection<Node> extends IntegraflowConnection<Node> {
    private _fetch: (
        variables?: IntegraflowConnectionVariables
    ) => IntegraflowFetch<IntegraflowConnection<Node> | undefined>;

    public constructor(
        request: IntegraflowRequest,
        fetch: (
            variables?: IntegraflowConnectionVariables
        ) => IntegraflowFetch<IntegraflowConnection<Node> | undefined>,
        nodes: Node[],
        pageInfo: PageInfo
    ) {
        super(request);
        this._fetch = fetch;
        this.nodes = nodes;
        this.pageInfo = pageInfo;
    }

    /** Add nodes to the end of the existing nodes */
    private _appendNodes(nodes?: Node[]) {
        this.nodes = nodes ? [...(this.nodes ?? []), ...nodes] : this.nodes;
    }

    /** Add nodes to the start of the existing nodes */
    private _prependNodes(nodes?: Node[]) {
        this.nodes = nodes ? [...nodes, ...(this.nodes ?? [])] : this.nodes;
    }

    /** Update the pagination end cursor */
    private _appendPageInfo(pageInfo?: PageInfo) {
        if (this.pageInfo) {
            this.pageInfo.endCursor =
                pageInfo?.endCursor ?? this.pageInfo.startCursor;
            this.pageInfo.hasNextPage =
                pageInfo?.hasNextPage ?? this.pageInfo.hasNextPage;
        }
    }

    /** Update the pagination start cursor */
    private _prependPageInfo(pageInfo?: PageInfo) {
        if (this.pageInfo) {
            this.pageInfo.startCursor =
                pageInfo?.startCursor ?? this.pageInfo.startCursor;
            this.pageInfo.hasPreviousPage =
                pageInfo?.hasPreviousPage ?? this.pageInfo.hasPreviousPage;
        }
    }

    /** Fetch the next page of results and append to nodes */
    public async fetchNext(): Promise<this> {
        if (this.pageInfo?.hasNextPage) {
            const response = await this._fetch({
                after: this.pageInfo?.endCursor
            });
            this._appendNodes(response?.nodes);
            this._appendPageInfo(response?.pageInfo);
        }
        return Promise.resolve(this);
    }

    /** Fetch the previous page of results and prepend to nodes */
    public async fetchPrevious(): Promise<this> {
        if (this.pageInfo?.hasPreviousPage) {
            const response = await this._fetch({
                before: this.pageInfo?.startCursor
            });
            this._prependNodes(response?.nodes);
            this._prependPageInfo(response?.pageInfo);
        }
        return Promise.resolve(this);
    }
}

/**
 * Function to parse custom scalars into Date types
 *
 * @param value - value to parse
 */
function parseDate(value?: any): Date | undefined {
    try {
        return value ? new Date(value) : undefined;
    } catch (e) {
        return undefined;
    }
}

/**
 * Function to parse custom scalars into JSON objects
 *
 * @param value - value to parse
 */
function parseJson(value?: any): Record<string, unknown> | undefined {
    try {
        return value ? JSON.parse(value) : undefined;
    } catch (e) {
        return undefined;
    }
}

/**
 * Represents an organization.
 *
 * @param request - function to call the graphql client
 * @param data - I.AuthOrganizationFragment response data
 */
export class AuthOrganization extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.AuthOrganizationFragment
    ) {
        super(request);
        this.id = data.id;
        this.memberCount = data.memberCount;
        this.name = data.name;
        this.slug = data.slug;
    }

    /** The ID of the organization. */
    public id: string;
    /**
     * Member count
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     */
    public memberCount: number;
    /**
     * Name of the organization.
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     */
    public name: string;
    /** Slug of the organization. */
    public slug: string;
}
/**
 * Represents an authenticated user data.
 *
 * @param request - function to call the graphql client
 * @param data - I.AuthUserFragment response data
 */
export class AuthUser extends Request {
    public constructor(request: IntegraflowRequest, data: I.AuthUserFragment) {
        super(request);
        this.email = data.email;
        this.firstName = data.firstName;
        this.id = data.id;
        this.isActive = data.isActive;
        this.isOnboarded = data.isOnboarded;
        this.isStaff = data.isStaff;
        this.lastName = data.lastName;
        this.organization = data.organization
            ? new AuthOrganization(request, data.organization)
            : undefined;
        this.project = data.project
            ? new Project(request, data.project)
            : undefined;
    }

    /** The email address of the user. */
    public email: string;
    /** The given name of the user. */
    public firstName: string;
    /** The ID of the user. */
    public id: string;
    /** Determine if the user is active. */
    public isActive: boolean;
    /** Determine if the user has finished onboarding. */
    public isOnboarded: boolean;
    /** Determine if the user is a staff admin. */
    public isStaff: boolean;
    /** The family name of the user. */
    public lastName: string;
    /**
     * The current organization of the user.
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     */
    public organization?: AuthOrganization;
    /**
     * The current project of the user.
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     */
    public project?: Project;
}
/**
 * Represents a project.
 *
 * @param request - function to call the graphql client
 * @param data - I.BaseProjectFragment response data
 */
export class BaseProject extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.BaseProjectFragment
    ) {
        super(request);
        this.apiToken = data.apiToken;
        this.id = data.id;
        this.name = data.name;
    }

    /** API token for project. */
    public apiToken: string;
    /** The ID of the project. */
    public id: string;
    /** Name of the project. */
    public name: string;
}
/**
 * Represents a theme.
 *
 * @param request - function to call the graphql client
 * @param data - I.BaseProjectThemeFragment response data
 */
export class BaseProjectTheme extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.BaseProjectThemeFragment
    ) {
        super(request);
        this.colorScheme = data.colorScheme ?? undefined;
        this.id = data.id;
        this.name = data.name;
        this.settings = data.settings ?? undefined;
    }

    /** The settings of the theme. */
    public colorScheme?: I.Scalars["JSONString"];
    /** The ID of the theme. */
    public id: string;
    /** Name of the theme. */
    public name: string;
    /** The settings of the theme. */
    public settings?: I.Scalars["JSONString"];
}
/**
 * Represents a survey from used by our sdk.
 *
 * @param request - function to call the graphql client
 * @param data - I.BaseSurveyFragment response data
 */
export class BaseSurvey extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.BaseSurveyFragment
    ) {
        super(request);
        this.createdAt = parseDate(data.createdAt) ?? new Date();
        this.endDate = parseDate(data.endDate) ?? undefined;
        this.id = data.id;
        this.name = data.name ?? undefined;
        this.settings = data.settings ?? undefined;
        this.slug = data.slug;
        this.startDate = parseDate(data.startDate) ?? undefined;
        this.project = data.project
            ? new BaseProject(request, data.project)
            : undefined;
        this.theme = data.theme
            ? new BaseProjectTheme(request, data.theme)
            : undefined;
        this.status = data.status;
        this.channels = data.channels.map(
            node => new BaseSurveyChannel(request, node)
        );
        this.questions = data.questions.map(
            node => new BaseSurveyQuestion(request, node)
        );
    }

    /** The time at which the survey was created. */
    public createdAt: Date;
    /** The date at which the survey was ended. */
    public endDate?: Date;
    /** The ID of the survey. */
    public id: string;
    /** Name of the survey. */
    public name?: string;
    /** The settings of the survey. */
    public settings?: I.Scalars["JSONString"];
    /** Slug of the survey. */
    public slug: string;
    /** The date at which the survey was started. */
    public startDate?: Date;
    /** The distribution channels supported by the survey */
    public channels: BaseSurveyChannel[];
    /** The questions in the the survey */
    public questions: BaseSurveyQuestion[];
    /** The project the survey belongs to */
    public project?: BaseProject;
    /** The theme of the survey. */
    public theme?: BaseProjectTheme;
    /** The status of the survey */
    public status: I.SurveyStatusEnum;
}
/**
 * Represents a survey channel.
 *
 * @param request - function to call the graphql client
 * @param data - I.BaseSurveyChannelFragment response data
 */
export class BaseSurveyChannel extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.BaseSurveyChannelFragment
    ) {
        super(request);
        this.conditions = data.conditions ?? undefined;
        this.createdAt = parseDate(data.createdAt) ?? new Date();
        this.id = data.id;
        this.link = data.link;
        this.settings = data.settings ?? undefined;
        this.triggers = data.triggers ?? undefined;
        this.type = data.type;
    }

    /** The settings of the question. */
    public conditions?: I.Scalars["JSONString"];
    /** The time at which the channel was created. */
    public createdAt: Date;
    /** The ID of the channel. */
    public id: string;
    /** Unique link to the channel. */
    public link: string;
    /** The settings of the question. */
    public settings?: I.Scalars["JSONString"];
    /** The options of the question. */
    public triggers?: I.Scalars["JSONString"];
    /** The type of the survey channel */
    public type: I.SurveyChannelTypeEnum;
}
/**
 * BaseSurveyCountableConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this BaseSurveyCountableConnection model
 * @param data - BaseSurveyCountableConnection response data
 */
export class BaseSurveyCountableConnection extends Connection<BaseSurvey> {
    public constructor(
        request: IntegraflowRequest,
        fetch: (
            connection?: IntegraflowConnectionVariables
        ) => IntegraflowFetch<IntegraflowConnection<BaseSurvey> | undefined>,
        data: I.BaseSurveyCountableConnectionFragment
    ) {
        super(
            request,
            fetch,
            data.nodes.map(node => new BaseSurvey(request, node)),
            new PageInfo(request, data.pageInfo)
        );
    }
}
/**
 * Represents a question.
 *
 * @param request - function to call the graphql client
 * @param data - I.BaseSurveyQuestionFragment response data
 */
export class BaseSurveyQuestion extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.BaseSurveyQuestionFragment
    ) {
        super(request);
        this.createdAt = parseDate(data.createdAt) ?? new Date();
        this.description = data.description;
        this.id = data.id;
        this.label = data.label;
        this.maxPath = data.maxPath;
        this.options = data.options ?? undefined;
        this.orderNumber = data.orderNumber;
        this.settings = data.settings ?? undefined;
        this.type = data.type;
    }

    /** The time at which the question was created. */
    public createdAt: Date;
    /** Description of the question. */
    public description: string;
    /** The ID of the question. */
    public id: string;
    /** Label of the question. */
    public label: string;
    /** The position of the question. */
    public maxPath: number;
    /** The options of the question. */
    public options?: I.Scalars["JSONString"];
    /** The position of the question. */
    public orderNumber: number;
    /** The settings of the question. */
    public settings?: I.Scalars["JSONString"];
    /** The type of the question */
    public type: I.SurveyQuestionTypeEnum;
}
/**
 * Authenticates a user account via email and authentication token.
 *
 * @param request - function to call the graphql client
 * @param data - I.EmailTokenUserAuthFragment response data
 */
export class EmailTokenUserAuth extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.EmailTokenUserAuthFragment
    ) {
        super(request);
        this.csrfToken = data.csrfToken ?? undefined;
        this.refreshToken = data.refreshToken ?? undefined;
        this.token = data.token ?? undefined;
        this.user = data.user ? new AuthUser(request, data.user) : undefined;
        this.errors = data.errors.map(node => new UserError(request, node));
        this.userErrors = data.userErrors.map(
            node => new UserError(request, node)
        );
    }

    /** CSRF token required to re-generate access token. */
    public csrfToken?: string;
    /** JWT refresh token, required to re-generate access token. */
    public refreshToken?: string;
    /** Access token to authenticate the user. */
    public token?: string;
    public errors: UserError[];
    public userErrors: UserError[];
    /** A user that has access to the the resources of an organization. */
    public user?: AuthUser;
}
/**
 * Finds or creates a new user account by email and sends an email with token.
 *
 * @param request - function to call the graphql client
 * @param data - I.EmailUserAuthChallengeFragment response data
 */
export class EmailUserAuthChallenge extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.EmailUserAuthChallengeFragment
    ) {
        super(request);
        this.authType = data.authType ?? undefined;
        this.success = data.success ?? undefined;
        this.errors = data.errors.map(node => new UserError(request, node));
        this.userErrors = data.userErrors.map(
            node => new UserError(request, node)
        );
    }

    /** Supported challenge for this user. */
    public authType?: string;
    /** Whether the operation was successful. */
    public success?: boolean;
    public errors: UserError[];
    public userErrors: UserError[];
}
/**
 * Represents an event.
 *
 * @param request - function to call the graphql client
 * @param data - I.EventFragment response data
 */
export class Event extends Request {
    public constructor(request: IntegraflowRequest, data: I.EventFragment) {
        super(request);
        this.createdAt = parseDate(data.createdAt) ?? undefined;
        this.distinctId = data.distinctId;
        this.event = data.event;
        this.id = data.id;
        this.properties = data.properties ?? undefined;
        this.timestamp = parseDate(data.timestamp) ?? undefined;
        this.project = new Project(request, data.project);
    }

    /** The time the event was created */
    public createdAt?: Date;
    /** The event name */
    public distinctId: string;
    /** The event name */
    public event: string;
    /** The ID of the event. */
    public id: string;
    /** The event properties */
    public properties?: I.Scalars["JSONString"];
    /** The time the event occurred */
    public timestamp?: Date;
    /**
     * The project the event belongs to
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public project: Project;

    /** Captures event. */
    public capture(variables?: I.CaptureEventMutationVariables) {
        return new CaptureEventMutation(this._request).fetch(variables);
    }
}
/**
 * Captures event.
 *
 * @param request - function to call the graphql client
 * @param data - I.EventCaptureFragment response data
 */
export class EventCapture extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.EventCaptureFragment
    ) {
        super(request);
        this.status = data.status ?? undefined;
        this.errors = data.errors.map(node => new EventError(request, node));
        this.eventErrors = data.eventErrors.map(
            node => new EventError(request, node)
        );
    }

    /** Whether the operation was successful. */
    public status?: boolean;
    public errors: EventError[];
    public eventErrors: EventError[];
}
/**
 * EventCountableConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this EventCountableConnection model
 * @param data - EventCountableConnection response data
 */
export class EventCountableConnection extends Connection<Event> {
    public constructor(
        request: IntegraflowRequest,
        fetch: (
            connection?: IntegraflowConnectionVariables
        ) => IntegraflowFetch<IntegraflowConnection<Event> | undefined>,
        data: I.EventCountableConnectionFragment
    ) {
        super(
            request,
            fetch,
            data.nodes.map(node => new Event(request, node)),
            new PageInfo(request, data.pageInfo)
        );
    }
}
/**
 * Represents an event definition.
 *
 * @param request - function to call the graphql client
 * @param data - I.EventDefinitionFragment response data
 */
export class EventDefinition extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.EventDefinitionFragment
    ) {
        super(request);
        this.createdAt = parseDate(data.createdAt) ?? undefined;
        this.id = data.id;
        this.lastSeenAt = parseDate(data.lastSeenAt) ?? undefined;
        this.name = data.name;
        this.project = new Project(request, data.project);
    }

    /** The time the event was created */
    public createdAt?: Date;
    /** The ID of the event definition. */
    public id: string;
    /** The time the event was last seen */
    public lastSeenAt?: Date;
    /** The name of the event definition */
    public name: string;
    /**
     * The project the event definition belongs to
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public project: Project;
}
/**
 * EventDefinitionCountableConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this EventDefinitionCountableConnection model
 * @param data - EventDefinitionCountableConnection response data
 */
export class EventDefinitionCountableConnection extends Connection<
    EventDefinition
> {
    public constructor(
        request: IntegraflowRequest,
        fetch: (
            connection?: IntegraflowConnectionVariables
        ) => IntegraflowFetch<
            IntegraflowConnection<EventDefinition> | undefined
        >,
        data: I.EventDefinitionCountableConnectionFragment
    ) {
        super(
            request,
            fetch,
            data.nodes.map(node => new EventDefinition(request, node)),
            new PageInfo(request, data.pageInfo)
        );
    }
}
/**
 * Represents errors in event mutations.
 *
 * @param request - function to call the graphql client
 * @param data - I.EventErrorFragment response data
 */
export class EventError extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.EventErrorFragment
    ) {
        super(request);
        this.field = data.field ?? undefined;
        this.message = data.message ?? undefined;
        this.code = data.code;
    }

    /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
    public field?: string;
    /** The error message. */
    public message?: string;
    /** The error code. */
    public code: I.EventErrorCode;
}
/**
 * Represents an event property.
 *
 * @param request - function to call the graphql client
 * @param data - I.EventPropertyFragment response data
 */
export class EventProperty extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.EventPropertyFragment
    ) {
        super(request);
        this.event = data.event;
        this.id = data.id;
        this.property = data.property;
        this.project = new Project(request, data.project);
    }

    /** The name of the event */
    public event: string;
    /** The ID of the event property. */
    public id: string;
    /** The property of the event */
    public property: string;
    /**
     * The project the event property belongs to
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public project: Project;
}
/**
 * EventPropertyCountableConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this EventPropertyCountableConnection model
 * @param data - EventPropertyCountableConnection response data
 */
export class EventPropertyCountableConnection extends Connection<
    EventProperty
> {
    public constructor(
        request: IntegraflowRequest,
        fetch: (
            connection?: IntegraflowConnectionVariables
        ) => IntegraflowFetch<IntegraflowConnection<EventProperty> | undefined>,
        data: I.EventPropertyCountableConnectionFragment
    ) {
        super(
            request,
            fetch,
            data.nodes.map(node => new EventProperty(request, node)),
            new PageInfo(request, data.pageInfo)
        );
    }
}
/**
 * Finds or creates a new user account from google auth credentials.
 *
 * @param request - function to call the graphql client
 * @param data - I.GoogleUserAuthFragment response data
 */
export class GoogleUserAuth extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.GoogleUserAuthFragment
    ) {
        super(request);
        this.csrfToken = data.csrfToken ?? undefined;
        this.refreshToken = data.refreshToken ?? undefined;
        this.success = data.success ?? undefined;
        this.token = data.token ?? undefined;
        this.user = data.user ? new AuthUser(request, data.user) : undefined;
        this.errors = data.errors.map(node => new UserError(request, node));
        this.userErrors = data.userErrors.map(
            node => new UserError(request, node)
        );
    }

    /** CSRF token required to re-generate access token. */
    public csrfToken?: string;
    /** JWT refresh token, required to re-generate access token. */
    public refreshToken?: string;
    /** Whether the operation was successful. */
    public success?: boolean;
    /** Access token to authenticate the user. */
    public token?: string;
    public errors: UserError[];
    public userErrors: UserError[];
    /** A user that has access to the the resources of an organization. */
    public user?: AuthUser;
}
/**
 * Deactivate all JWT tokens of the currently authenticated user.
 *
 * Requires one of the following permissions: AUTHENTICATED_USER.
 *
 * @param request - function to call the graphql client
 * @param data - I.LogoutFragment response data
 */
export class Logout extends Request {
    public constructor(request: IntegraflowRequest, data: I.LogoutFragment) {
        super(request);
        this.errors = data.errors.map(node => new UserError(request, node));
        this.userErrors = data.userErrors.map(
            node => new UserError(request, node)
        );
    }

    public errors: UserError[];
    public userErrors: UserError[];
}
/**
 * An object with an ID
 *
 * @param request - function to call the graphql client
 * @param data - I.NodeFragment response data
 */
export class Node extends Request {
    public constructor(request: IntegraflowRequest, data: I.NodeFragment) {
        super(request);
        this.id = data.id;
    }

    /** The ID of the object. */
    public id: string;
}
/**
 * Represents an organization.
 *
 * @param request - function to call the graphql client
 * @param data - I.OrganizationFragment response data
 */
export class Organization extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.OrganizationFragment
    ) {
        super(request);
        this.id = data.id;
        this.memberCount = data.memberCount;
        this.name = data.name;
        this.slug = data.slug;
    }

    /** The ID of the organization. */
    public id: string;
    /**
     * Member count
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     */
    public memberCount: number;
    /**
     * Name of the organization.
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     */
    public name: string;
    /** Slug of the organization. */
    public slug: string;

    /**
     * Creates new organization.
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     */
    public create(
        input: I.OrganizationCreateInput,
        variables?: Omit<I.CreateOrganizationMutationVariables, "input">
    ) {
        return new CreateOrganizationMutation(this._request).fetch(
            input,
            variables
        );
    }
    /**
     * Joins an organization
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     */
    public join(input: I.OrganizationJoinInput) {
        return new JoinOrganizationMutation(this._request).fetch(input);
    }
}
/**
 * OrganizationCountableConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this OrganizationCountableConnection model
 * @param data - OrganizationCountableConnection response data
 */
export class OrganizationCountableConnection extends Connection<Organization> {
    public constructor(
        request: IntegraflowRequest,
        fetch: (
            connection?: IntegraflowConnectionVariables
        ) => IntegraflowFetch<IntegraflowConnection<Organization> | undefined>,
        data: I.OrganizationCountableConnectionFragment
    ) {
        super(
            request,
            fetch,
            data.nodes.map(node => new Organization(request, node)),
            new PageInfo(request, data.pageInfo)
        );
    }
}
/**
 * Creates new organization.
 *
 * Requires one of the following permissions: AUTHENTICATED_USER.
 *
 * @param request - function to call the graphql client
 * @param data - I.OrganizationCreateFragment response data
 */
export class OrganizationCreate extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.OrganizationCreateFragment
    ) {
        super(request);
        this.organization = data.organization
            ? new AuthOrganization(request, data.organization)
            : undefined;
        this.user = data.user ? new AuthUser(request, data.user) : undefined;
        this.errors = data.errors.map(
            node => new OrganizationError(request, node)
        );
        this.organizationErrors = data.organizationErrors.map(
            node => new OrganizationError(request, node)
        );
    }

    public errors: OrganizationError[];
    public organizationErrors: OrganizationError[];
    /** An organization. Organizations are root-level objects that contain users and projects. */
    public organization?: AuthOrganization;
    /** A user that has access to the the resources of an organization. */
    public user?: AuthUser;
}
/**
 * Represents errors in organization mutations.
 *
 * @param request - function to call the graphql client
 * @param data - I.OrganizationErrorFragment response data
 */
export class OrganizationError extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.OrganizationErrorFragment
    ) {
        super(request);
        this.field = data.field ?? undefined;
        this.message = data.message ?? undefined;
        this.code = data.code;
    }

    /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
    public field?: string;
    /** The error message. */
    public message?: string;
    /** The error code. */
    public code: I.OrganizationErrorCode;
}
/**
 * The organization invite that was created or updated.
 *
 * @param request - function to call the graphql client
 * @param data - I.OrganizationInviteFragment response data
 */
export class OrganizationInvite extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.OrganizationInviteFragment
    ) {
        super(request);
        this.createdAt = parseDate(data.createdAt) ?? new Date();
        this.email = data.email;
        this.expired = data.expired;
        this.firstName = data.firstName ?? undefined;
        this.id = data.id;
        this.updatedAt = parseDate(data.updatedAt) ?? new Date();
        this.inviter = new User(request, data.inviter);
        this.organization = new Organization(request, data.organization);
        this.role = data.role;
    }

    /** The time at which the invite was created. */
    public createdAt: Date;
    /** The invitees email address. */
    public email: string;
    /** If the invite has expired. */
    public expired: boolean;
    /** First name of the invite. */
    public firstName?: string;
    /** The unique identifier of the invite. */
    public id: string;
    /** The last time at which the invite was updated. */
    public updatedAt: Date;
    /**
     * The user who created the invitation.
     *
     * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
     */
    public inviter: User;
    /**
     * The current project of the user.
     *
     * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
     */
    public organization: Organization;
    /** The user role that the invitee will receive upon accepting the invite. */
    public role: I.RoleLevel;

    /**
     * Creates a new organization invite.
     *
     * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
     */
    public create(input: I.OrganizationInviteCreateInput) {
        return new CreateOrganizationInviteMutation(this._request).fetch(input);
    }
}
/**
 * Creates a new organization invite.
 *
 * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
 *
 * @param request - function to call the graphql client
 * @param data - I.OrganizationInviteCreateFragment response data
 */
export class OrganizationInviteCreate extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.OrganizationInviteCreateFragment
    ) {
        super(request);
        this.organizationInvite = data.organizationInvite
            ? new OrganizationInvite(request, data.organizationInvite)
            : undefined;
        this.errors = data.errors.map(
            node => new OrganizationError(request, node)
        );
        this.organizationErrors = data.organizationErrors.map(
            node => new OrganizationError(request, node)
        );
    }

    public errors: OrganizationError[];
    public organizationErrors: OrganizationError[];
    public organizationInvite?: OrganizationInvite;
}
/**
 * The organization invite that was created or updated.
 *
 * @param request - function to call the graphql client
 * @param data - I.OrganizationInviteDetailsFragment response data
 */
export class OrganizationInviteDetails extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.OrganizationInviteDetailsFragment
    ) {
        super(request);
        this.createdAt = parseDate(data.createdAt) ?? new Date();
        this.email = data.email;
        this.expired = data.expired;
        this.firstName = data.firstName ?? undefined;
        this.id = data.id;
        this.inviter = data.inviter;
        this.organizationId = data.organizationId;
        this.organizationLogo = data.organizationLogo ?? undefined;
        this.organizationName = data.organizationName;
        this.updatedAt = parseDate(data.updatedAt) ?? new Date();
        this.role = data.role;
    }

    /** The time at which the invite was created. */
    public createdAt: Date;
    /** The invitees email address. */
    public email: string;
    /** If the invite has expired. */
    public expired: boolean;
    /** First name of the invite. */
    public firstName?: string;
    /** The unique identifier of the invite. */
    public id: string;
    /** The name/email of the inviter. */
    public inviter: string;
    /** The ID of the organization the invite is for. */
    public organizationId: string;
    /** The logo of the organization the invite is for. */
    public organizationLogo?: string;
    /** The name of the organization the invite is for. */
    public organizationName: string;
    /** The last time at which the invite was updated. */
    public updatedAt: Date;
    /** The user role that the invitee will receive upon accepting the invite. */
    public role: I.RoleLevel;
}
/**
 * The organization invite link.
 *
 * @param request - function to call the graphql client
 * @param data - I.OrganizationInviteLinkFragment response data
 */
export class OrganizationInviteLink extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.OrganizationInviteLinkFragment
    ) {
        super(request);
        this.inviteLink = data.inviteLink;
    }

    /**
     * The link of the organization the invite is for.
     *
     * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
     */
    public inviteLink: string;

    /**
     * Reset the current organization invite link..
     *
     * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
     */
    public reset() {
        return new ResetOrganizationInviteLinkMutation(this._request).fetch();
    }
}
/**
 * The organization invite that was created or updated.
 *
 * @param request - function to call the graphql client
 * @param data - I.OrganizationInviteLinkDetailsFragment response data
 */
export class OrganizationInviteLinkDetails extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.OrganizationInviteLinkDetailsFragment
    ) {
        super(request);
        this.id = data.id;
        this.organizationId = data.organizationId;
        this.organizationLogo = data.organizationLogo ?? undefined;
        this.organizationName = data.organizationName;
    }

    /** The ID of the object. */
    public id: string;
    /** The ID of the organization the invite is for. */
    public organizationId: string;
    /** The logo of the organization the invite is for. */
    public organizationLogo?: string;
    /** The name of the organization the invite is for. */
    public organizationName: string;
}
/**
 * Reset the current organization invite link..
 *
 * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
 *
 * @param request - function to call the graphql client
 * @param data - I.OrganizationInviteLinkResetFragment response data
 */
export class OrganizationInviteLinkReset extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.OrganizationInviteLinkResetFragment
    ) {
        super(request);
        this.inviteLink = data.inviteLink ?? undefined;
        this.success = data.success ?? undefined;
        this.errors = data.errors.map(
            node => new OrganizationError(request, node)
        );
        this.organizationErrors = data.organizationErrors.map(
            node => new OrganizationError(request, node)
        );
    }

    /** The current organization invite link. */
    public inviteLink?: string;
    /** Whether the operation was successful. */
    public success?: boolean;
    public errors: OrganizationError[];
    public organizationErrors: OrganizationError[];
}
/**
 * Joins an organization
 *
 * Requires one of the following permissions: AUTHENTICATED_USER.
 *
 * @param request - function to call the graphql client
 * @param data - I.OrganizationJoinFragment response data
 */
export class OrganizationJoin extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.OrganizationJoinFragment
    ) {
        super(request);
        this.user = new AuthUser(request, data.user);
        this.errors = data.errors.map(
            node => new OrganizationError(request, node)
        );
        this.organizationErrors = data.organizationErrors.map(
            node => new OrganizationError(request, node)
        );
    }

    public errors: OrganizationError[];
    public organizationErrors: OrganizationError[];
    /** A user that has access to the the resources of an organization. */
    public user: AuthUser;
}
/**
 * The Relay compliant `PageInfo` type, containing data necessary to paginate this connection.
 *
 * @param request - function to call the graphql client
 * @param data - I.PageInfoFragment response data
 */
export class PageInfo extends Request {
    public constructor(request: IntegraflowRequest, data: I.PageInfoFragment) {
        super(request);
        this.endCursor = data.endCursor ?? undefined;
        this.hasNextPage = data.hasNextPage;
        this.hasPreviousPage = data.hasPreviousPage;
        this.startCursor = data.startCursor ?? undefined;
    }

    /** When paginating forwards, the cursor to continue. */
    public endCursor?: string;
    /** When paginating forwards, are there more items? */
    public hasNextPage: boolean;
    /** When paginating backwards, are there more items? */
    public hasPreviousPage: boolean;
    /** When paginating backwards, the cursor to continue. */
    public startCursor?: string;
}
/**
 * Represents a person.
 *
 * @param request - function to call the graphql client
 * @param data - I.PersonFragment response data
 */
export class Person extends Request {
    public constructor(request: IntegraflowRequest, data: I.PersonFragment) {
        super(request);
        this.attributes = data.attributes ?? undefined;
        this.createdAt = parseDate(data.createdAt) ?? undefined;
        this.distinctIds = data.distinctIds ?? undefined;
        this.id = data.id;
        this.isIdentified = data.isIdentified;
        this.uuid = data.uuid;
        this.project = new Project(request, data.project);
    }

    /** The person's attributes */
    public attributes?: I.Scalars["JSONString"];
    /** The time the person was created */
    public createdAt?: Date;
    /** The person's distinct ids */
    public distinctIds?: string[];
    /** The ID of the event property. */
    public id: string;
    /** Whether the person has been identified */
    public isIdentified: boolean;
    /** The person's uuid */
    public uuid: I.Scalars["UUID"];
    /**
     * The project the person belongs to
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public project: Project;
}
/**
 * PersonCountableConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this PersonCountableConnection model
 * @param data - PersonCountableConnection response data
 */
export class PersonCountableConnection extends Connection<Person> {
    public constructor(
        request: IntegraflowRequest,
        fetch: (
            connection?: IntegraflowConnectionVariables
        ) => IntegraflowFetch<IntegraflowConnection<Person> | undefined>,
        data: I.PersonCountableConnectionFragment
    ) {
        super(
            request,
            fetch,
            data.nodes.map(node => new Person(request, node)),
            new PageInfo(request, data.pageInfo)
        );
    }
}
/**
 * Represents a project.
 *
 * @param request - function to call the graphql client
 * @param data - I.ProjectFragment response data
 */
export class Project extends Request {
    public constructor(request: IntegraflowRequest, data: I.ProjectFragment) {
        super(request);
        this.accessControl = data.accessControl ?? undefined;
        this.apiToken = data.apiToken;
        this.hasCompletedOnboardingFor =
            data.hasCompletedOnboardingFor ?? undefined;
        this.id = data.id;
        this.name = data.name;
        this.slug = data.slug;
        this.timezone = data.timezone;
        this.organization = new AuthOrganization(request, data.organization);
    }

    /** Whether the project is private or not. */
    public accessControl?: boolean;
    /** API token for project. */
    public apiToken: string;
    /** The data required for the onboarding process */
    public hasCompletedOnboardingFor?: I.Scalars["JSONString"];
    /** The ID of the project. */
    public id: string;
    /** Name of the project. */
    public name: string;
    /** Slug of the project. */
    public slug: string;
    /** The timezone of the project. */
    public timezone: string;
    /** Organization the project belongs to. */
    public organization: AuthOrganization;

    /** Creates a new project */
    public create(input: I.ProjectCreateInput) {
        return new CreateProjectMutation(this._request).fetch(input);
    }
    /** Updates a project. */
    public update(input: I.ProjectUpdateInput) {
        return new UpdateProjectMutation(this._request).fetch(input);
    }
}
/**
 * ProjectCountableConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this ProjectCountableConnection model
 * @param data - ProjectCountableConnection response data
 */
export class ProjectCountableConnection extends Connection<Project> {
    public constructor(
        request: IntegraflowRequest,
        fetch: (
            connection?: IntegraflowConnectionVariables
        ) => IntegraflowFetch<IntegraflowConnection<Project> | undefined>,
        data: I.ProjectCountableConnectionFragment
    ) {
        super(
            request,
            fetch,
            data.nodes.map(node => new Project(request, node)),
            new PageInfo(request, data.pageInfo)
        );
    }
}
/**
 * Creates a new project
 *
 * @param request - function to call the graphql client
 * @param data - I.ProjectCreateFragment response data
 */
export class ProjectCreate extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.ProjectCreateFragment
    ) {
        super(request);
        this.project = data.project
            ? new Project(request, data.project)
            : undefined;
        this.errors = data.errors.map(node => new ProjectError(request, node));
        this.projectErrors = data.projectErrors.map(
            node => new ProjectError(request, node)
        );
    }

    public errors: ProjectError[];
    public projectErrors: ProjectError[];
    public project?: Project;
}
/**
 * Represents errors in project mutations.
 *
 * @param request - function to call the graphql client
 * @param data - I.ProjectErrorFragment response data
 */
export class ProjectError extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.ProjectErrorFragment
    ) {
        super(request);
        this.field = data.field ?? undefined;
        this.message = data.message ?? undefined;
        this.code = data.code;
    }

    /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
    public field?: string;
    /** The error message. */
    public message?: string;
    /** The error code. */
    public code: I.ProjectErrorCode;
}
/**
 * Represents a theme.
 *
 * @param request - function to call the graphql client
 * @param data - I.ProjectThemeFragment response data
 */
export class ProjectTheme extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.ProjectThemeFragment
    ) {
        super(request);
        this.colorScheme = data.colorScheme ?? undefined;
        this.createdAt = parseDate(data.createdAt) ?? new Date();
        this.id = data.id;
        this.name = data.name;
        this.reference = data.reference ?? undefined;
        this.settings = data.settings ?? undefined;
        this.updatedAt = parseDate(data.updatedAt) ?? new Date();
        this.creator = new User(request, data.creator);
        this.project = new Project(request, data.project);
    }

    /** The settings of the theme. */
    public colorScheme?: I.Scalars["JSONString"];
    /** The time at which the invite was created. */
    public createdAt: Date;
    /** The ID of the theme. */
    public id: string;
    /** Name of the theme. */
    public name: string;
    /** For internal purpose. */
    public reference?: string;
    /** The settings of the theme. */
    public settings?: I.Scalars["JSONString"];
    /** The last time at which the invite was updated. */
    public updatedAt: Date;
    /**
     * The user who created the theme.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public creator: User;
    /**
     * The project the theme belongs to.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public project: Project;

    /**
     * Creates a new theme
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public create(input: I.ProjectThemeCreateInput) {
        return new CreateProjectThemeMutation(this._request).fetch(input);
    }
    /**
     * Deletes a theme.
     *
     * Requires one of the following permissions: PROJECT_ADMIN_ACCESS.
     */
    public delete() {
        return this.id
            ? new DeleteProjectThemeMutation(this._request).fetch(this.id)
            : undefined;
    }
    /**
     * Updates an existing theme
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public update(input: I.ProjectThemeUpdateInput) {
        return this.id
            ? new UpdateProjectThemeMutation(this._request).fetch(
                  this.id,
                  input
              )
            : undefined;
    }
}
/**
 * ProjectThemeCountableConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this ProjectThemeCountableConnection model
 * @param data - ProjectThemeCountableConnection response data
 */
export class ProjectThemeCountableConnection extends Connection<ProjectTheme> {
    public constructor(
        request: IntegraflowRequest,
        fetch: (
            connection?: IntegraflowConnectionVariables
        ) => IntegraflowFetch<IntegraflowConnection<ProjectTheme> | undefined>,
        data: I.ProjectThemeCountableConnectionFragment
    ) {
        super(
            request,
            fetch,
            data.nodes.map(node => new ProjectTheme(request, node)),
            new PageInfo(request, data.pageInfo)
        );
    }
}
/**
 * Creates a new theme
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 *
 * @param request - function to call the graphql client
 * @param data - I.ProjectThemeCreateFragment response data
 */
export class ProjectThemeCreate extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.ProjectThemeCreateFragment
    ) {
        super(request);
        this.projectTheme = data.projectTheme
            ? new ProjectTheme(request, data.projectTheme)
            : undefined;
        this.errors = data.errors.map(node => new ProjectError(request, node));
        this.projectErrors = data.projectErrors.map(
            node => new ProjectError(request, node)
        );
    }

    public errors: ProjectError[];
    public projectErrors: ProjectError[];
    public projectTheme?: ProjectTheme;
}
/**
 * Deletes a theme.
 *
 * Requires one of the following permissions: PROJECT_ADMIN_ACCESS.
 *
 * @param request - function to call the graphql client
 * @param data - I.ProjectThemeDeleteFragment response data
 */
export class ProjectThemeDelete extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.ProjectThemeDeleteFragment
    ) {
        super(request);
        this.projectTheme = data.projectTheme
            ? new ProjectTheme(request, data.projectTheme)
            : undefined;
        this.errors = data.errors.map(node => new ProjectError(request, node));
        this.projectErrors = data.projectErrors.map(
            node => new ProjectError(request, node)
        );
    }

    public errors: ProjectError[];
    public projectErrors: ProjectError[];
    public projectTheme?: ProjectTheme;
}
/**
 * Updates an existing theme
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 *
 * @param request - function to call the graphql client
 * @param data - I.ProjectThemeUpdateFragment response data
 */
export class ProjectThemeUpdate extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.ProjectThemeUpdateFragment
    ) {
        super(request);
        this.projectTheme = data.projectTheme
            ? new ProjectTheme(request, data.projectTheme)
            : undefined;
        this.errors = data.errors.map(node => new ProjectError(request, node));
        this.projectErrors = data.projectErrors.map(
            node => new ProjectError(request, node)
        );
    }

    public errors: ProjectError[];
    public projectErrors: ProjectError[];
    public projectTheme?: ProjectTheme;
}
/**
 * Updates a project.
 *
 * @param request - function to call the graphql client
 * @param data - I.ProjectUpdateFragment response data
 */
export class ProjectUpdate extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.ProjectUpdateFragment
    ) {
        super(request);
        this.project = data.project
            ? new Project(request, data.project)
            : undefined;
        this.errors = data.errors.map(node => new ProjectError(request, node));
        this.projectErrors = data.projectErrors.map(
            node => new ProjectError(request, node)
        );
    }

    public errors: ProjectError[];
    public projectErrors: ProjectError[];
    public project?: Project;
}
/**
 * Represents a property definition.
 *
 * @param request - function to call the graphql client
 * @param data - I.PropertyDefinitionFragment response data
 */
export class PropertyDefinition extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.PropertyDefinitionFragment
    ) {
        super(request);
        this.id = data.id;
        this.isNumerical = data.isNumerical;
        this.name = data.name;
        this.project = new Project(request, data.project);
        this.propertyType = data.propertyType;
        this.type = data.type;
    }

    /** The ID of the event property. */
    public id: string;
    /** Whether property accepts a numerical value */
    public isNumerical: boolean;
    /** The name of the property definition */
    public name: string;
    /**
     * The project the person belongs to
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public project: Project;
    /** The property type */
    public propertyType: I.PropertyTypeEnum;
    /** The type of the property definition */
    public type: I.PropertyDefinitionTypeEnum;
}
/**
 * PropertyDefinitionCountableConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this PropertyDefinitionCountableConnection model
 * @param data - PropertyDefinitionCountableConnection response data
 */
export class PropertyDefinitionCountableConnection extends Connection<
    PropertyDefinition
> {
    public constructor(
        request: IntegraflowRequest,
        fetch: (
            connection?: IntegraflowConnectionVariables
        ) => IntegraflowFetch<
            IntegraflowConnection<PropertyDefinition> | undefined
        >,
        data: I.PropertyDefinitionCountableConnectionFragment
    ) {
        super(
            request,
            fetch,
            data.nodes.map(node => new PropertyDefinition(request, node)),
            new PageInfo(request, data.pageInfo)
        );
    }
}
/**
 * Refresh JWT token. Mutation tries to take refreshToken from the input. If it fails it will try to take `refreshToken` from the http-only cookie `refreshToken`. `csrfToken` is required when `refreshToken` is provided as a cookie.
 *
 * @param request - function to call the graphql client
 * @param data - I.RefreshTokenFragment response data
 */
export class RefreshToken extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.RefreshTokenFragment
    ) {
        super(request);
        this.token = data.token ?? undefined;
        this.errors = data.errors.map(node => new UserError(request, node));
        this.userErrors = data.userErrors.map(
            node => new UserError(request, node)
        );
    }

    /** Acess token to authenticate the user. */
    public token?: string;
    public errors: UserError[];
    public userErrors: UserError[];
}
/**
 * Represents a survey.
 *
 * @param request - function to call the graphql client
 * @param data - I.SurveyFragment response data
 */
export class Survey extends Request {
    public constructor(request: IntegraflowRequest, data: I.SurveyFragment) {
        super(request);
        this.createdAt = parseDate(data.createdAt) ?? new Date();
        this.id = data.id;
        this.name = data.name ?? undefined;
        this.reference = data.reference ?? undefined;
        this.settings = data.settings ?? undefined;
        this.slug = data.slug;
        this.updatedAt = parseDate(data.updatedAt) ?? new Date();
        this.creator = new User(request, data.creator);
        this.project = data.project
            ? new Project(request, data.project)
            : undefined;
        this.theme = data.theme
            ? new ProjectTheme(request, data.theme)
            : undefined;
        this.status = data.status;
        this.type = data.type;
    }

    /** The time at which the survey was created. */
    public createdAt: Date;
    /** The ID of the survey. */
    public id: string;
    /** Name of the survey. */
    public name?: string;
    /** For internal purpose. */
    public reference?: string;
    /** The settings of the survey. */
    public settings?: I.Scalars["JSONString"];
    /** Slug of the survey. */
    public slug: string;
    /** The last time at which the survey was updated. */
    public updatedAt: Date;
    /**
     * The user who created the theme.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public creator: User;
    /**
     * The project the survey belongs to
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public project?: Project;
    /**
     * The theme of the survey.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public theme?: ProjectTheme;
    /** The status of the survey */
    public status: I.SurveyStatusEnum;
    /** The type of the survey */
    public type: I.SurveyTypeEnum;

    /**
     * The distribution channels supported by the survey
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public channels(variables?: I.Survey_ChannelsQueryVariables) {
        return new Survey_ChannelsQuery(this._request, variables).fetch(
            variables
        );
    }
    /**
     * The questions in the the survey
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public questions(variables?: I.Survey_QuestionsQueryVariables) {
        return new Survey_QuestionsQuery(this._request, variables).fetch(
            variables
        );
    }
    /**
     * Creates a new survey
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public create(input: I.SurveyCreateInput) {
        return new CreateSurveyMutation(this._request).fetch(input);
    }
    /**
     * Deletes a survey.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public delete() {
        return this.id
            ? new DeleteSurveyMutation(this._request).fetch(this.id)
            : undefined;
    }
    /**
     * Updates a survey
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public update(input: I.SurveyUpdateInput) {
        return this.id
            ? new UpdateSurveyMutation(this._request).fetch(this.id, input)
            : undefined;
    }
}
/**
 * Represents a survey channel.
 *
 * @param request - function to call the graphql client
 * @param data - I.SurveyChannelFragment response data
 */
export class SurveyChannel extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.SurveyChannelFragment
    ) {
        super(request);
        this.conditions = data.conditions ?? undefined;
        this.createdAt = parseDate(data.createdAt) ?? new Date();
        this.id = data.id;
        this.link = data.link;
        this.reference = data.reference ?? undefined;
        this.settings = data.settings ?? undefined;
        this.triggers = data.triggers ?? undefined;
        this.survey = data.survey
            ? new Survey(request, data.survey)
            : undefined;
        this.type = data.type;
    }

    /** The settings of the question. */
    public conditions?: I.Scalars["JSONString"];
    /** The time at which the channel was created. */
    public createdAt: Date;
    /** The ID of the channel. */
    public id: string;
    /** Unique link to the channel. */
    public link: string;
    /** For internal purpose. */
    public reference?: string;
    /** The settings of the question. */
    public settings?: I.Scalars["JSONString"];
    /** The options of the question. */
    public triggers?: I.Scalars["JSONString"];
    /**
     * The project the survey belongs to
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public survey?: Survey;
    /** The type of the survey channel */
    public type: I.SurveyChannelTypeEnum;

    /**
     * Creates a new distibution channel
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public create(input: I.SurveyChannelCreateInput) {
        return new CreateSurveyChannelMutation(this._request).fetch(input);
    }
    /**
     * Deletes a channel.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public delete() {
        return this.id
            ? new DeleteSurveyChannelMutation(this._request).fetch(this.id)
            : undefined;
    }
    /**
     * Updates a channel
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public update(input: I.SurveyChannelUpdateInput) {
        return this.id
            ? new UpdateSurveyChannelMutation(this._request).fetch(
                  this.id,
                  input
              )
            : undefined;
    }
}
/**
 * SurveyChannelCountableConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this SurveyChannelCountableConnection model
 * @param data - SurveyChannelCountableConnection response data
 */
export class SurveyChannelCountableConnection extends Connection<
    SurveyChannel
> {
    public constructor(
        request: IntegraflowRequest,
        fetch: (
            connection?: IntegraflowConnectionVariables
        ) => IntegraflowFetch<IntegraflowConnection<SurveyChannel> | undefined>,
        data: I.SurveyChannelCountableConnectionFragment
    ) {
        super(
            request,
            fetch,
            data.nodes.map(node => new SurveyChannel(request, node)),
            new PageInfo(request, data.pageInfo)
        );
    }
}
/**
 * Creates a new distibution channel
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 *
 * @param request - function to call the graphql client
 * @param data - I.SurveyChannelCreateFragment response data
 */
export class SurveyChannelCreate extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.SurveyChannelCreateFragment
    ) {
        super(request);
        this.surveyChannel = data.surveyChannel
            ? new SurveyChannel(request, data.surveyChannel)
            : undefined;
        this.errors = data.errors.map(node => new SurveyError(request, node));
        this.surveyErrors = data.surveyErrors.map(
            node => new SurveyError(request, node)
        );
    }

    public errors: SurveyError[];
    public surveyErrors: SurveyError[];
    /** The checkout with the added gift card or voucher. */
    public surveyChannel?: SurveyChannel;
}
/**
 * Deletes a channel.
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 *
 * @param request - function to call the graphql client
 * @param data - I.SurveyChannelDeleteFragment response data
 */
export class SurveyChannelDelete extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.SurveyChannelDeleteFragment
    ) {
        super(request);
        this.surveyChannel = data.surveyChannel
            ? new SurveyChannel(request, data.surveyChannel)
            : undefined;
        this.errors = data.errors.map(node => new SurveyError(request, node));
        this.surveyErrors = data.surveyErrors.map(
            node => new SurveyError(request, node)
        );
    }

    public errors: SurveyError[];
    public surveyErrors: SurveyError[];
    public surveyChannel?: SurveyChannel;
}
/**
 * Updates a channel
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 *
 * @param request - function to call the graphql client
 * @param data - I.SurveyChannelUpdateFragment response data
 */
export class SurveyChannelUpdate extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.SurveyChannelUpdateFragment
    ) {
        super(request);
        this.surveyChannel = data.surveyChannel
            ? new SurveyChannel(request, data.surveyChannel)
            : undefined;
        this.errors = data.errors.map(node => new SurveyError(request, node));
        this.surveyErrors = data.surveyErrors.map(
            node => new SurveyError(request, node)
        );
    }

    public errors: SurveyError[];
    public surveyErrors: SurveyError[];
    public surveyChannel?: SurveyChannel;
}
/**
 * SurveyCountableConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this SurveyCountableConnection model
 * @param data - SurveyCountableConnection response data
 */
export class SurveyCountableConnection extends Connection<Survey> {
    public constructor(
        request: IntegraflowRequest,
        fetch: (
            connection?: IntegraflowConnectionVariables
        ) => IntegraflowFetch<IntegraflowConnection<Survey> | undefined>,
        data: I.SurveyCountableConnectionFragment
    ) {
        super(
            request,
            fetch,
            data.nodes.map(node => new Survey(request, node)),
            new PageInfo(request, data.pageInfo)
        );
    }
}
/**
 * Creates a new survey
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 *
 * @param request - function to call the graphql client
 * @param data - I.SurveyCreateFragment response data
 */
export class SurveyCreate extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.SurveyCreateFragment
    ) {
        super(request);
        this.survey = data.survey
            ? new Survey(request, data.survey)
            : undefined;
        this.errors = data.errors.map(node => new SurveyError(request, node));
        this.surveyErrors = data.surveyErrors.map(
            node => new SurveyError(request, node)
        );
    }

    public errors: SurveyError[];
    public surveyErrors: SurveyError[];
    public survey?: Survey;
}
/**
 * Deletes a survey.
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 *
 * @param request - function to call the graphql client
 * @param data - I.SurveyDeleteFragment response data
 */
export class SurveyDelete extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.SurveyDeleteFragment
    ) {
        super(request);
        this.survey = data.survey
            ? new Survey(request, data.survey)
            : undefined;
        this.errors = data.errors.map(node => new SurveyError(request, node));
        this.surveyErrors = data.surveyErrors.map(
            node => new SurveyError(request, node)
        );
    }

    public errors: SurveyError[];
    public surveyErrors: SurveyError[];
    public survey?: Survey;
}
/**
 * Represents errors in survey mutations.
 *
 * @param request - function to call the graphql client
 * @param data - I.SurveyErrorFragment response data
 */
export class SurveyError extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.SurveyErrorFragment
    ) {
        super(request);
        this.field = data.field ?? undefined;
        this.message = data.message ?? undefined;
        this.code = data.code;
    }

    /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
    public field?: string;
    /** The error message. */
    public message?: string;
    /** The error code. */
    public code: I.SurveyErrorCode;
}
/**
 * Represents a question.
 *
 * @param request - function to call the graphql client
 * @param data - I.SurveyQuestionFragment response data
 */
export class SurveyQuestion extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.SurveyQuestionFragment
    ) {
        super(request);
        this.createdAt = parseDate(data.createdAt) ?? new Date();
        this.description = data.description;
        this.id = data.id;
        this.label = data.label;
        this.maxPath = data.maxPath;
        this.options = data.options ?? undefined;
        this.orderNumber = data.orderNumber;
        this.reference = data.reference ?? undefined;
        this.settings = data.settings ?? undefined;
        this.survey = data.survey
            ? new Survey(request, data.survey)
            : undefined;
        this.type = data.type;
    }

    /** The time at which the question was created. */
    public createdAt: Date;
    /** Description of the question. */
    public description: string;
    /** The ID of the question. */
    public id: string;
    /** Label of the question. */
    public label: string;
    /** The position of the question. */
    public maxPath: number;
    /** The options of the question. */
    public options?: I.Scalars["JSONString"];
    /** The position of the question. */
    public orderNumber: number;
    /** For internal purpose. */
    public reference?: string;
    /** The settings of the question. */
    public settings?: I.Scalars["JSONString"];
    /**
     * The project the survey belongs to
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public survey?: Survey;
    /** The type of the question */
    public type: I.SurveyQuestionTypeEnum;

    /**
     * Creates a new question
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public create(input: I.SurveyQuestionCreateInput) {
        return new CreateSurveyQuestionMutation(this._request).fetch(input);
    }
    /**
     * Deletes a question.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public delete() {
        return this.id
            ? new DeleteSurveyQuestionMutation(this._request).fetch(this.id)
            : undefined;
    }
    /**
     * Updates a question
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     */
    public update(input: I.SurveyQuestionUpdateInput) {
        return this.id
            ? new UpdateSurveyQuestionMutation(this._request).fetch(
                  this.id,
                  input
              )
            : undefined;
    }
}
/**
 * SurveyQuestionCountableConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this SurveyQuestionCountableConnection model
 * @param data - SurveyQuestionCountableConnection response data
 */
export class SurveyQuestionCountableConnection extends Connection<
    SurveyQuestion
> {
    public constructor(
        request: IntegraflowRequest,
        fetch: (
            connection?: IntegraflowConnectionVariables
        ) => IntegraflowFetch<
            IntegraflowConnection<SurveyQuestion> | undefined
        >,
        data: I.SurveyQuestionCountableConnectionFragment
    ) {
        super(
            request,
            fetch,
            data.nodes.map(node => new SurveyQuestion(request, node)),
            new PageInfo(request, data.pageInfo)
        );
    }
}
/**
 * Creates a new question
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 *
 * @param request - function to call the graphql client
 * @param data - I.SurveyQuestionCreateFragment response data
 */
export class SurveyQuestionCreate extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.SurveyQuestionCreateFragment
    ) {
        super(request);
        this.surveyQuestion = data.surveyQuestion
            ? new SurveyQuestion(request, data.surveyQuestion)
            : undefined;
        this.errors = data.errors.map(node => new SurveyError(request, node));
        this.surveyErrors = data.surveyErrors.map(
            node => new SurveyError(request, node)
        );
    }

    public errors: SurveyError[];
    public surveyErrors: SurveyError[];
    public surveyQuestion?: SurveyQuestion;
}
/**
 * Deletes a question.
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 *
 * @param request - function to call the graphql client
 * @param data - I.SurveyQuestionDeleteFragment response data
 */
export class SurveyQuestionDelete extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.SurveyQuestionDeleteFragment
    ) {
        super(request);
        this.surveyQuestion = data.surveyQuestion
            ? new SurveyQuestion(request, data.surveyQuestion)
            : undefined;
        this.errors = data.errors.map(node => new SurveyError(request, node));
        this.surveyErrors = data.surveyErrors.map(
            node => new SurveyError(request, node)
        );
    }

    public errors: SurveyError[];
    public surveyErrors: SurveyError[];
    public surveyQuestion?: SurveyQuestion;
}
/**
 * Updates a question
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 *
 * @param request - function to call the graphql client
 * @param data - I.SurveyQuestionUpdateFragment response data
 */
export class SurveyQuestionUpdate extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.SurveyQuestionUpdateFragment
    ) {
        super(request);
        this.surveyQuestion = data.surveyQuestion
            ? new SurveyQuestion(request, data.surveyQuestion)
            : undefined;
        this.errors = data.errors.map(node => new SurveyError(request, node));
        this.surveyErrors = data.surveyErrors.map(
            node => new SurveyError(request, node)
        );
    }

    public errors: SurveyError[];
    public surveyErrors: SurveyError[];
    public surveyQuestion?: SurveyQuestion;
}
/**
 * Updates a survey
 *
 * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
 *
 * @param request - function to call the graphql client
 * @param data - I.SurveyUpdateFragment response data
 */
export class SurveyUpdate extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.SurveyUpdateFragment
    ) {
        super(request);
        this.survey = data.survey
            ? new Survey(request, data.survey)
            : undefined;
        this.errors = data.errors.map(node => new SurveyError(request, node));
        this.surveyErrors = data.surveyErrors.map(
            node => new SurveyError(request, node)
        );
    }

    public errors: SurveyError[];
    public surveyErrors: SurveyError[];
    public survey?: Survey;
}
/**
 * Represents user data.
 *
 * @param request - function to call the graphql client
 * @param data - I.UserFragment response data
 */
export class User extends Request {
    public constructor(request: IntegraflowRequest, data: I.UserFragment) {
        super(request);
        this.email = data.email;
        this.firstName = data.firstName;
        this.id = data.id;
        this.isActive = data.isActive;
        this.isOnboarded = data.isOnboarded;
        this.isStaff = data.isStaff;
        this.lastName = data.lastName;
        this.organization = data.organization
            ? new AuthOrganization(request, data.organization)
            : undefined;
        this.project = data.project
            ? new Project(request, data.project)
            : undefined;
    }

    /** The email address of the user. */
    public email: string;
    /** The given name of the user. */
    public firstName: string;
    /** The ID of the user. */
    public id: string;
    /** Determine if the user is active. */
    public isActive: boolean;
    /** Determine if the user has finished onboarding. */
    public isOnboarded: boolean;
    /** Determine if the user is a staff admin. */
    public isStaff: boolean;
    /** The family name of the user. */
    public lastName: string;
    /**
     * The current organization of the user.
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     */
    public organization?: AuthOrganization;
    /**
     * The current project of the user.
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     */
    public project?: Project;

    /**
     * Updates a user.
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     */
    public update(input: I.UserInput) {
        return new UpdateUserMutation(this._request).fetch(input);
    }
}
/**
 * UserCountableConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this UserCountableConnection model
 * @param data - UserCountableConnection response data
 */
export class UserCountableConnection extends Connection<User> {
    public constructor(
        request: IntegraflowRequest,
        fetch: (
            connection?: IntegraflowConnectionVariables
        ) => IntegraflowFetch<IntegraflowConnection<User> | undefined>,
        data: I.UserCountableConnectionFragment
    ) {
        super(
            request,
            fetch,
            data.nodes.map(node => new User(request, node)),
            new PageInfo(request, data.pageInfo)
        );
    }
}
/**
 * Represents errors in user mutations.
 *
 * @param request - function to call the graphql client
 * @param data - I.UserErrorFragment response data
 */
export class UserError extends Request {
    public constructor(request: IntegraflowRequest, data: I.UserErrorFragment) {
        super(request);
        this.field = data.field ?? undefined;
        this.message = data.message ?? undefined;
        this.code = data.code;
    }

    /** Name of a field that caused the error. A value of `null` indicates that the error isn't associated with a particular field. */
    public field?: string;
    /** The error message. */
    public message?: string;
    /** The error code. */
    public code: I.UserErrorCode;
}
/**
 * Updates a user.
 *
 * Requires one of the following permissions: AUTHENTICATED_USER.
 *
 * @param request - function to call the graphql client
 * @param data - I.UserUpdateFragment response data
 */
export class UserUpdate extends Request {
    public constructor(
        request: IntegraflowRequest,
        data: I.UserUpdateFragment
    ) {
        super(request);
        this.user = data.user ? new User(request, data.user) : undefined;
        this.errors = data.errors.map(node => new UserError(request, node));
        this.userErrors = data.userErrors.map(
            node => new UserError(request, node)
        );
    }

    public errors: UserError[];
    public userErrors: UserError[];
    public user?: User;
}
/**
 * _Service manifest as defined by Federation spec.
 *
 * @param request - function to call the graphql client
 * @param data - I._ServiceFragment response data
 */
export class _Service extends Request {
    public constructor(request: IntegraflowRequest, data: I._ServiceFragment) {
        super(request);
        this.sdl = data.sdl ?? undefined;
    }

    public sdl?: string;
}
/**
 * A fetchable EmailTokenUserAuth Mutation
 *
 * @param request - function to call the graphql client
 */
export class EmailTokenUserAuthMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the EmailTokenUserAuth mutation and return a EmailTokenUserAuth
     *
     * @param email - required email to pass to emailTokenUserAuth
     * @param token - required token to pass to emailTokenUserAuth
     * @param variables - variables without 'email', 'token' to pass into the EmailTokenUserAuthMutation
     * @returns parsed response from EmailTokenUserAuthMutation
     */
    public async fetch(
        email: string,
        token: string,
        variables?: Omit<
            I.EmailTokenUserAuthMutationVariables,
            "email" | "token"
        >
    ): IntegraflowFetch<EmailTokenUserAuth | undefined> {
        const response = await this._request<
            I.EmailTokenUserAuthMutation,
            I.EmailTokenUserAuthMutationVariables
        >(I.EmailTokenUserAuthDocument, {
            email,
            token,
            ...variables
        });
        const data = response.emailTokenUserAuth;

        return data ? new EmailTokenUserAuth(this._request, data) : undefined;
    }
}

/**
 * A fetchable EmailUserAuthChallenge Mutation
 *
 * @param request - function to call the graphql client
 */
export class EmailUserAuthChallengeMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the EmailUserAuthChallenge mutation and return a EmailUserAuthChallenge
     *
     * @param email - required email to pass to emailUserAuthChallenge
     * @param variables - variables without 'email' to pass into the EmailUserAuthChallengeMutation
     * @returns parsed response from EmailUserAuthChallengeMutation
     */
    public async fetch(
        email: string,
        variables?: Omit<I.EmailUserAuthChallengeMutationVariables, "email">
    ): IntegraflowFetch<EmailUserAuthChallenge | undefined> {
        const response = await this._request<
            I.EmailUserAuthChallengeMutation,
            I.EmailUserAuthChallengeMutationVariables
        >(I.EmailUserAuthChallengeDocument, {
            email,
            ...variables
        });
        const data = response.emailUserAuthChallenge;

        return data
            ? new EmailUserAuthChallenge(this._request, data)
            : undefined;
    }
}

/**
 * A fetchable CaptureEvent Mutation
 *
 * @param request - function to call the graphql client
 */
export class CaptureEventMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the CaptureEvent mutation and return a EventCapture
     *
     * @param variables - variables to pass into the CaptureEventMutation
     * @returns parsed response from CaptureEventMutation
     */
    public async fetch(
        variables?: I.CaptureEventMutationVariables
    ): IntegraflowFetch<EventCapture | undefined> {
        const response = await this._request<
            I.CaptureEventMutation,
            I.CaptureEventMutationVariables
        >(I.CaptureEventDocument, variables);
        const data = response.eventCapture;

        return data ? new EventCapture(this._request, data) : undefined;
    }
}

/**
 * A fetchable GoogleUserAuth Mutation
 *
 * @param request - function to call the graphql client
 */
export class GoogleUserAuthMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the GoogleUserAuth mutation and return a GoogleUserAuth
     *
     * @param code - required code to pass to googleUserAuth
     * @param variables - variables without 'code' to pass into the GoogleUserAuthMutation
     * @returns parsed response from GoogleUserAuthMutation
     */
    public async fetch(
        code: string,
        variables?: Omit<I.GoogleUserAuthMutationVariables, "code">
    ): IntegraflowFetch<GoogleUserAuth | undefined> {
        const response = await this._request<
            I.GoogleUserAuthMutation,
            I.GoogleUserAuthMutationVariables
        >(I.GoogleUserAuthDocument, {
            code,
            ...variables
        });
        const data = response.googleUserAuth;

        return data ? new GoogleUserAuth(this._request, data) : undefined;
    }
}

/**
 * A fetchable Logout Mutation
 *
 * @param request - function to call the graphql client
 */
export class LogoutMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the Logout mutation and return a Logout
     *
     * @returns parsed response from LogoutMutation
     */
    public async fetch(): IntegraflowFetch<Logout | undefined> {
        const response = await this._request<
            I.LogoutMutation,
            I.LogoutMutationVariables
        >(I.LogoutDocument, {});
        const data = response.logout;

        return data ? new Logout(this._request, data) : undefined;
    }
}

/**
 * A fetchable CreateOrganization Mutation
 *
 * @param request - function to call the graphql client
 */
export class CreateOrganizationMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the CreateOrganization mutation and return a OrganizationCreate
     *
     * @param input - required input to pass to createOrganization
     * @param variables - variables without 'input' to pass into the CreateOrganizationMutation
     * @returns parsed response from CreateOrganizationMutation
     */
    public async fetch(
        input: I.OrganizationCreateInput,
        variables?: Omit<I.CreateOrganizationMutationVariables, "input">
    ): IntegraflowFetch<OrganizationCreate | undefined> {
        const response = await this._request<
            I.CreateOrganizationMutation,
            I.CreateOrganizationMutationVariables
        >(I.CreateOrganizationDocument, {
            input,
            ...variables
        });
        const data = response.organizationCreate;

        return data ? new OrganizationCreate(this._request, data) : undefined;
    }
}

/**
 * A fetchable CreateOrganizationInvite Mutation
 *
 * @param request - function to call the graphql client
 */
export class CreateOrganizationInviteMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the CreateOrganizationInvite mutation and return a OrganizationInviteCreate
     *
     * @param input - required input to pass to createOrganizationInvite
     * @returns parsed response from CreateOrganizationInviteMutation
     */
    public async fetch(
        input: I.OrganizationInviteCreateInput
    ): IntegraflowFetch<OrganizationInviteCreate | undefined> {
        const response = await this._request<
            I.CreateOrganizationInviteMutation,
            I.CreateOrganizationInviteMutationVariables
        >(I.CreateOrganizationInviteDocument, {
            input
        });
        const data = response.organizationInviteCreate;

        return data
            ? new OrganizationInviteCreate(this._request, data)
            : undefined;
    }
}

/**
 * A fetchable ResetOrganizationInviteLink Mutation
 *
 * @param request - function to call the graphql client
 */
export class ResetOrganizationInviteLinkMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the ResetOrganizationInviteLink mutation and return a OrganizationInviteLinkReset
     *
     * @returns parsed response from ResetOrganizationInviteLinkMutation
     */
    public async fetch(): IntegraflowFetch<
        OrganizationInviteLinkReset | undefined
    > {
        const response = await this._request<
            I.ResetOrganizationInviteLinkMutation,
            I.ResetOrganizationInviteLinkMutationVariables
        >(I.ResetOrganizationInviteLinkDocument, {});
        const data = response.organizationInviteLinkReset;

        return data
            ? new OrganizationInviteLinkReset(this._request, data)
            : undefined;
    }
}

/**
 * A fetchable JoinOrganization Mutation
 *
 * @param request - function to call the graphql client
 */
export class JoinOrganizationMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the JoinOrganization mutation and return a OrganizationJoin
     *
     * @param input - required input to pass to joinOrganization
     * @returns parsed response from JoinOrganizationMutation
     */
    public async fetch(
        input: I.OrganizationJoinInput
    ): IntegraflowFetch<OrganizationJoin | undefined> {
        const response = await this._request<
            I.JoinOrganizationMutation,
            I.JoinOrganizationMutationVariables
        >(I.JoinOrganizationDocument, {
            input
        });
        const data = response.organizationJoin;

        return data ? new OrganizationJoin(this._request, data) : undefined;
    }
}

/**
 * A fetchable CreateProject Mutation
 *
 * @param request - function to call the graphql client
 */
export class CreateProjectMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the CreateProject mutation and return a ProjectCreate
     *
     * @param input - required input to pass to createProject
     * @returns parsed response from CreateProjectMutation
     */
    public async fetch(
        input: I.ProjectCreateInput
    ): IntegraflowFetch<ProjectCreate | undefined> {
        const response = await this._request<
            I.CreateProjectMutation,
            I.CreateProjectMutationVariables
        >(I.CreateProjectDocument, {
            input
        });
        const data = response.projectCreate;

        return data ? new ProjectCreate(this._request, data) : undefined;
    }
}

/**
 * A fetchable CreateProjectTheme Mutation
 *
 * @param request - function to call the graphql client
 */
export class CreateProjectThemeMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the CreateProjectTheme mutation and return a ProjectThemeCreate
     *
     * @param input - required input to pass to createProjectTheme
     * @returns parsed response from CreateProjectThemeMutation
     */
    public async fetch(
        input: I.ProjectThemeCreateInput
    ): IntegraflowFetch<ProjectThemeCreate | undefined> {
        const response = await this._request<
            I.CreateProjectThemeMutation,
            I.CreateProjectThemeMutationVariables
        >(I.CreateProjectThemeDocument, {
            input
        });
        const data = response.projectThemeCreate;

        return data ? new ProjectThemeCreate(this._request, data) : undefined;
    }
}

/**
 * A fetchable DeleteProjectTheme Mutation
 *
 * @param request - function to call the graphql client
 */
export class DeleteProjectThemeMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the DeleteProjectTheme mutation and return a ProjectThemeDelete
     *
     * @param id - required id to pass to deleteProjectTheme
     * @returns parsed response from DeleteProjectThemeMutation
     */
    public async fetch(
        id: string
    ): IntegraflowFetch<ProjectThemeDelete | undefined> {
        const response = await this._request<
            I.DeleteProjectThemeMutation,
            I.DeleteProjectThemeMutationVariables
        >(I.DeleteProjectThemeDocument, {
            id
        });
        const data = response.projectThemeDelete;

        return data ? new ProjectThemeDelete(this._request, data) : undefined;
    }
}

/**
 * A fetchable UpdateProjectTheme Mutation
 *
 * @param request - function to call the graphql client
 */
export class UpdateProjectThemeMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the UpdateProjectTheme mutation and return a ProjectThemeUpdate
     *
     * @param id - required id to pass to updateProjectTheme
     * @param input - required input to pass to updateProjectTheme
     * @returns parsed response from UpdateProjectThemeMutation
     */
    public async fetch(
        id: string,
        input: I.ProjectThemeUpdateInput
    ): IntegraflowFetch<ProjectThemeUpdate | undefined> {
        const response = await this._request<
            I.UpdateProjectThemeMutation,
            I.UpdateProjectThemeMutationVariables
        >(I.UpdateProjectThemeDocument, {
            id,
            input
        });
        const data = response.projectThemeUpdate;

        return data ? new ProjectThemeUpdate(this._request, data) : undefined;
    }
}

/**
 * A fetchable UpdateProject Mutation
 *
 * @param request - function to call the graphql client
 */
export class UpdateProjectMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the UpdateProject mutation and return a ProjectUpdate
     *
     * @param input - required input to pass to updateProject
     * @returns parsed response from UpdateProjectMutation
     */
    public async fetch(
        input: I.ProjectUpdateInput
    ): IntegraflowFetch<ProjectUpdate | undefined> {
        const response = await this._request<
            I.UpdateProjectMutation,
            I.UpdateProjectMutationVariables
        >(I.UpdateProjectDocument, {
            input
        });
        const data = response.projectUpdate;

        return data ? new ProjectUpdate(this._request, data) : undefined;
    }
}

/**
 * A fetchable CreateSurveyChannel Mutation
 *
 * @param request - function to call the graphql client
 */
export class CreateSurveyChannelMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the CreateSurveyChannel mutation and return a SurveyChannelCreate
     *
     * @param input - required input to pass to createSurveyChannel
     * @returns parsed response from CreateSurveyChannelMutation
     */
    public async fetch(
        input: I.SurveyChannelCreateInput
    ): IntegraflowFetch<SurveyChannelCreate | undefined> {
        const response = await this._request<
            I.CreateSurveyChannelMutation,
            I.CreateSurveyChannelMutationVariables
        >(I.CreateSurveyChannelDocument, {
            input
        });
        const data = response.surveyChannelCreate;

        return data ? new SurveyChannelCreate(this._request, data) : undefined;
    }
}

/**
 * A fetchable DeleteSurveyChannel Mutation
 *
 * @param request - function to call the graphql client
 */
export class DeleteSurveyChannelMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the DeleteSurveyChannel mutation and return a SurveyChannelDelete
     *
     * @param id - required id to pass to deleteSurveyChannel
     * @returns parsed response from DeleteSurveyChannelMutation
     */
    public async fetch(
        id: string
    ): IntegraflowFetch<SurveyChannelDelete | undefined> {
        const response = await this._request<
            I.DeleteSurveyChannelMutation,
            I.DeleteSurveyChannelMutationVariables
        >(I.DeleteSurveyChannelDocument, {
            id
        });
        const data = response.surveyChannelDelete;

        return data ? new SurveyChannelDelete(this._request, data) : undefined;
    }
}

/**
 * A fetchable UpdateSurveyChannel Mutation
 *
 * @param request - function to call the graphql client
 */
export class UpdateSurveyChannelMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the UpdateSurveyChannel mutation and return a SurveyChannelUpdate
     *
     * @param id - required id to pass to updateSurveyChannel
     * @param input - required input to pass to updateSurveyChannel
     * @returns parsed response from UpdateSurveyChannelMutation
     */
    public async fetch(
        id: string,
        input: I.SurveyChannelUpdateInput
    ): IntegraflowFetch<SurveyChannelUpdate | undefined> {
        const response = await this._request<
            I.UpdateSurveyChannelMutation,
            I.UpdateSurveyChannelMutationVariables
        >(I.UpdateSurveyChannelDocument, {
            id,
            input
        });
        const data = response.surveyChannelUpdate;

        return data ? new SurveyChannelUpdate(this._request, data) : undefined;
    }
}

/**
 * A fetchable CreateSurvey Mutation
 *
 * @param request - function to call the graphql client
 */
export class CreateSurveyMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the CreateSurvey mutation and return a SurveyCreate
     *
     * @param input - required input to pass to createSurvey
     * @returns parsed response from CreateSurveyMutation
     */
    public async fetch(
        input: I.SurveyCreateInput
    ): IntegraflowFetch<SurveyCreate | undefined> {
        const response = await this._request<
            I.CreateSurveyMutation,
            I.CreateSurveyMutationVariables
        >(I.CreateSurveyDocument, {
            input
        });
        const data = response.surveyCreate;

        return data ? new SurveyCreate(this._request, data) : undefined;
    }
}

/**
 * A fetchable DeleteSurvey Mutation
 *
 * @param request - function to call the graphql client
 */
export class DeleteSurveyMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the DeleteSurvey mutation and return a SurveyDelete
     *
     * @param id - required id to pass to deleteSurvey
     * @returns parsed response from DeleteSurveyMutation
     */
    public async fetch(id: string): IntegraflowFetch<SurveyDelete | undefined> {
        const response = await this._request<
            I.DeleteSurveyMutation,
            I.DeleteSurveyMutationVariables
        >(I.DeleteSurveyDocument, {
            id
        });
        const data = response.surveyDelete;

        return data ? new SurveyDelete(this._request, data) : undefined;
    }
}

/**
 * A fetchable CreateSurveyQuestion Mutation
 *
 * @param request - function to call the graphql client
 */
export class CreateSurveyQuestionMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the CreateSurveyQuestion mutation and return a SurveyQuestionCreate
     *
     * @param input - required input to pass to createSurveyQuestion
     * @returns parsed response from CreateSurveyQuestionMutation
     */
    public async fetch(
        input: I.SurveyQuestionCreateInput
    ): IntegraflowFetch<SurveyQuestionCreate | undefined> {
        const response = await this._request<
            I.CreateSurveyQuestionMutation,
            I.CreateSurveyQuestionMutationVariables
        >(I.CreateSurveyQuestionDocument, {
            input
        });
        const data = response.surveyQuestionCreate;

        return data ? new SurveyQuestionCreate(this._request, data) : undefined;
    }
}

/**
 * A fetchable DeleteSurveyQuestion Mutation
 *
 * @param request - function to call the graphql client
 */
export class DeleteSurveyQuestionMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the DeleteSurveyQuestion mutation and return a SurveyQuestionDelete
     *
     * @param id - required id to pass to deleteSurveyQuestion
     * @returns parsed response from DeleteSurveyQuestionMutation
     */
    public async fetch(
        id: string
    ): IntegraflowFetch<SurveyQuestionDelete | undefined> {
        const response = await this._request<
            I.DeleteSurveyQuestionMutation,
            I.DeleteSurveyQuestionMutationVariables
        >(I.DeleteSurveyQuestionDocument, {
            id
        });
        const data = response.surveyQuestionDelete;

        return data ? new SurveyQuestionDelete(this._request, data) : undefined;
    }
}

/**
 * A fetchable UpdateSurveyQuestion Mutation
 *
 * @param request - function to call the graphql client
 */
export class UpdateSurveyQuestionMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the UpdateSurveyQuestion mutation and return a SurveyQuestionUpdate
     *
     * @param id - required id to pass to updateSurveyQuestion
     * @param input - required input to pass to updateSurveyQuestion
     * @returns parsed response from UpdateSurveyQuestionMutation
     */
    public async fetch(
        id: string,
        input: I.SurveyQuestionUpdateInput
    ): IntegraflowFetch<SurveyQuestionUpdate | undefined> {
        const response = await this._request<
            I.UpdateSurveyQuestionMutation,
            I.UpdateSurveyQuestionMutationVariables
        >(I.UpdateSurveyQuestionDocument, {
            id,
            input
        });
        const data = response.surveyQuestionUpdate;

        return data ? new SurveyQuestionUpdate(this._request, data) : undefined;
    }
}

/**
 * A fetchable UpdateSurvey Mutation
 *
 * @param request - function to call the graphql client
 */
export class UpdateSurveyMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the UpdateSurvey mutation and return a SurveyUpdate
     *
     * @param id - required id to pass to updateSurvey
     * @param input - required input to pass to updateSurvey
     * @returns parsed response from UpdateSurveyMutation
     */
    public async fetch(
        id: string,
        input: I.SurveyUpdateInput
    ): IntegraflowFetch<SurveyUpdate | undefined> {
        const response = await this._request<
            I.UpdateSurveyMutation,
            I.UpdateSurveyMutationVariables
        >(I.UpdateSurveyDocument, {
            id,
            input
        });
        const data = response.surveyUpdate;

        return data ? new SurveyUpdate(this._request, data) : undefined;
    }
}

/**
 * A fetchable RefreshToken Mutation
 *
 * @param request - function to call the graphql client
 */
export class RefreshTokenMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the RefreshToken mutation and return a RefreshToken
     *
     * @param variables - variables to pass into the RefreshTokenMutation
     * @returns parsed response from RefreshTokenMutation
     */
    public async fetch(
        variables?: I.RefreshTokenMutationVariables
    ): IntegraflowFetch<RefreshToken | undefined> {
        const response = await this._request<
            I.RefreshTokenMutation,
            I.RefreshTokenMutationVariables
        >(I.RefreshTokenDocument, variables);
        const data = response.tokenRefresh;

        return data ? new RefreshToken(this._request, data) : undefined;
    }
}

/**
 * A fetchable UpdateUser Mutation
 *
 * @param request - function to call the graphql client
 */
export class UpdateUserMutation extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the UpdateUser mutation and return a UserUpdate
     *
     * @param input - required input to pass to updateUser
     * @returns parsed response from UpdateUserMutation
     */
    public async fetch(
        input: I.UserInput
    ): IntegraflowFetch<UserUpdate | undefined> {
        const response = await this._request<
            I.UpdateUserMutation,
            I.UpdateUserMutationVariables
        >(I.UpdateUserDocument, {
            input
        });
        const data = response.userUpdate;

        return data ? new UserUpdate(this._request, data) : undefined;
    }
}

/**
 * A fetchable ActiveSurveys Query
 *
 * @param request - function to call the graphql client
 */
export class ActiveSurveysQuery extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the ActiveSurveys query and return a BaseSurveyCountableConnection
     *
     * @param variables - variables to pass into the ActiveSurveysQuery
     * @returns parsed response from ActiveSurveysQuery
     */
    public async fetch(
        variables?: I.ActiveSurveysQueryVariables
    ): IntegraflowFetch<BaseSurveyCountableConnection | undefined> {
        const response = await this._request<
            I.ActiveSurveysQuery,
            I.ActiveSurveysQueryVariables
        >(I.ActiveSurveysDocument, variables);
        const data = response.activeSurveys;
        if (data) {
            return new BaseSurveyCountableConnection(
                this._request,
                connection =>
                    this.fetch(
                        defaultConnection({
                            ...variables,
                            ...connection
                        })
                    ),
                data
            );
        } else {
            return undefined;
        }
    }
}

/**
 * A fetchable Channels Query
 *
 * @param request - function to call the graphql client
 */
export class ChannelsQuery extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the Channels query and return a SurveyChannelCountableConnection
     *
     * @param id - required id to pass to channels
     * @param variables - variables without 'id' to pass into the ChannelsQuery
     * @returns parsed response from ChannelsQuery
     */
    public async fetch(
        id: string,
        variables?: Omit<I.ChannelsQueryVariables, "id">
    ): IntegraflowFetch<SurveyChannelCountableConnection | undefined> {
        const response = await this._request<
            I.ChannelsQuery,
            I.ChannelsQueryVariables
        >(I.ChannelsDocument, {
            id,
            ...variables
        });
        const data = response.channels;
        if (data) {
            return new SurveyChannelCountableConnection(
                this._request,
                connection =>
                    this.fetch(
                        id,
                        defaultConnection({
                            ...variables,
                            ...connection
                        })
                    ),
                data
            );
        } else {
            return undefined;
        }
    }
}

/**
 * A fetchable EventDefinitions Query
 *
 * @param request - function to call the graphql client
 */
export class EventDefinitionsQuery extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the EventDefinitions query and return a EventDefinitionCountableConnection
     *
     * @param variables - variables to pass into the EventDefinitionsQuery
     * @returns parsed response from EventDefinitionsQuery
     */
    public async fetch(
        variables?: I.EventDefinitionsQueryVariables
    ): IntegraflowFetch<EventDefinitionCountableConnection | undefined> {
        const response = await this._request<
            I.EventDefinitionsQuery,
            I.EventDefinitionsQueryVariables
        >(I.EventDefinitionsDocument, variables);
        const data = response.eventDefinitions;
        if (data) {
            return new EventDefinitionCountableConnection(
                this._request,
                connection =>
                    this.fetch(
                        defaultConnection({
                            ...variables,
                            ...connection
                        })
                    ),
                data
            );
        } else {
            return undefined;
        }
    }
}

/**
 * A fetchable EventProperties Query
 *
 * @param request - function to call the graphql client
 */
export class EventPropertiesQuery extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the EventProperties query and return a EventPropertyCountableConnection
     *
     * @param variables - variables to pass into the EventPropertiesQuery
     * @returns parsed response from EventPropertiesQuery
     */
    public async fetch(
        variables?: I.EventPropertiesQueryVariables
    ): IntegraflowFetch<EventPropertyCountableConnection | undefined> {
        const response = await this._request<
            I.EventPropertiesQuery,
            I.EventPropertiesQueryVariables
        >(I.EventPropertiesDocument, variables);
        const data = response.eventProperties;
        if (data) {
            return new EventPropertyCountableConnection(
                this._request,
                connection =>
                    this.fetch(
                        defaultConnection({
                            ...variables,
                            ...connection
                        })
                    ),
                data
            );
        } else {
            return undefined;
        }
    }
}

/**
 * A fetchable Events Query
 *
 * @param request - function to call the graphql client
 */
export class EventsQuery extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the Events query and return a EventCountableConnection
     *
     * @param variables - variables to pass into the EventsQuery
     * @returns parsed response from EventsQuery
     */
    public async fetch(
        variables?: I.EventsQueryVariables
    ): IntegraflowFetch<EventCountableConnection | undefined> {
        const response = await this._request<
            I.EventsQuery,
            I.EventsQueryVariables
        >(I.EventsDocument, variables);
        const data = response.events;
        if (data) {
            return new EventCountableConnection(
                this._request,
                connection =>
                    this.fetch(
                        defaultConnection({
                            ...variables,
                            ...connection
                        })
                    ),
                data
            );
        } else {
            return undefined;
        }
    }
}

/**
 * A fetchable OrganizationInviteLink Query
 *
 * @param request - function to call the graphql client
 */
export class OrganizationInviteLinkQuery extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the OrganizationInviteLink query and return a OrganizationInviteLink
     *
     * @returns parsed response from OrganizationInviteLinkQuery
     */
    public async fetch(): IntegraflowFetch<OrganizationInviteLink | undefined> {
        const response = await this._request<
            I.OrganizationInviteLinkQuery,
            I.OrganizationInviteLinkQueryVariables
        >(I.OrganizationInviteLinkDocument, {});
        const data = response.organizationInviteLink;

        return data
            ? new OrganizationInviteLink(this._request, data)
            : undefined;
    }
}

/**
 * A fetchable Persons Query
 *
 * @param request - function to call the graphql client
 */
export class PersonsQuery extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the Persons query and return a PersonCountableConnection
     *
     * @param variables - variables to pass into the PersonsQuery
     * @returns parsed response from PersonsQuery
     */
    public async fetch(
        variables?: I.PersonsQueryVariables
    ): IntegraflowFetch<PersonCountableConnection | undefined> {
        const response = await this._request<
            I.PersonsQuery,
            I.PersonsQueryVariables
        >(I.PersonsDocument, variables);
        const data = response.persons;
        if (data) {
            return new PersonCountableConnection(
                this._request,
                connection =>
                    this.fetch(
                        defaultConnection({
                            ...variables,
                            ...connection
                        })
                    ),
                data
            );
        } else {
            return undefined;
        }
    }
}

/**
 * A fetchable PropertyDefinitions Query
 *
 * @param request - function to call the graphql client
 */
export class PropertyDefinitionsQuery extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the PropertyDefinitions query and return a PropertyDefinitionCountableConnection
     *
     * @param variables - variables to pass into the PropertyDefinitionsQuery
     * @returns parsed response from PropertyDefinitionsQuery
     */
    public async fetch(
        variables?: I.PropertyDefinitionsQueryVariables
    ): IntegraflowFetch<PropertyDefinitionCountableConnection | undefined> {
        const response = await this._request<
            I.PropertyDefinitionsQuery,
            I.PropertyDefinitionsQueryVariables
        >(I.PropertyDefinitionsDocument, variables);
        const data = response.propertyDefinitions;
        if (data) {
            return new PropertyDefinitionCountableConnection(
                this._request,
                connection =>
                    this.fetch(
                        defaultConnection({
                            ...variables,
                            ...connection
                        })
                    ),
                data
            );
        } else {
            return undefined;
        }
    }
}

/**
 * A fetchable Questions Query
 *
 * @param request - function to call the graphql client
 */
export class QuestionsQuery extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the Questions query and return a SurveyQuestionCountableConnection
     *
     * @param id - required id to pass to questions
     * @param variables - variables without 'id' to pass into the QuestionsQuery
     * @returns parsed response from QuestionsQuery
     */
    public async fetch(
        id: string,
        variables?: Omit<I.QuestionsQueryVariables, "id">
    ): IntegraflowFetch<SurveyQuestionCountableConnection | undefined> {
        const response = await this._request<
            I.QuestionsQuery,
            I.QuestionsQueryVariables
        >(I.QuestionsDocument, {
            id,
            ...variables
        });
        const data = response.questions;
        if (data) {
            return new SurveyQuestionCountableConnection(
                this._request,
                connection =>
                    this.fetch(
                        id,
                        defaultConnection({
                            ...variables,
                            ...connection
                        })
                    ),
                data
            );
        } else {
            return undefined;
        }
    }
}

/**
 * A fetchable Survey Query
 *
 * @param request - function to call the graphql client
 */
export class SurveyQuery extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the Survey query and return a Survey
     *
     * @param variables - variables to pass into the SurveyQuery
     * @returns parsed response from SurveyQuery
     */
    public async fetch(
        variables?: I.SurveyQueryVariables
    ): IntegraflowFetch<Survey | undefined> {
        const response = await this._request<
            I.SurveyQuery,
            I.SurveyQueryVariables
        >(I.SurveyDocument, variables);
        const data = response.survey;

        return data ? new Survey(this._request, data) : undefined;
    }
}

/**
 * A fetchable SurveyByChannel Query
 *
 * @param request - function to call the graphql client
 */
export class SurveyByChannelQuery extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the SurveyByChannel query and return a BaseSurvey
     *
     * @param variables - variables to pass into the SurveyByChannelQuery
     * @returns parsed response from SurveyByChannelQuery
     */
    public async fetch(
        variables?: I.SurveyByChannelQueryVariables
    ): IntegraflowFetch<BaseSurvey | undefined> {
        const response = await this._request<
            I.SurveyByChannelQuery,
            I.SurveyByChannelQueryVariables
        >(I.SurveyByChannelDocument, variables);
        const data = response.surveyByChannel;

        return data ? new BaseSurvey(this._request, data) : undefined;
    }
}

/**
 * A fetchable Surveys Query
 *
 * @param request - function to call the graphql client
 */
export class SurveysQuery extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the Surveys query and return a SurveyCountableConnection
     *
     * @param variables - variables to pass into the SurveysQuery
     * @returns parsed response from SurveysQuery
     */
    public async fetch(
        variables?: I.SurveysQueryVariables
    ): IntegraflowFetch<SurveyCountableConnection | undefined> {
        const response = await this._request<
            I.SurveysQuery,
            I.SurveysQueryVariables
        >(I.SurveysDocument, variables);
        const data = response.surveys;
        if (data) {
            return new SurveyCountableConnection(
                this._request,
                connection =>
                    this.fetch(
                        defaultConnection({
                            ...variables,
                            ...connection
                        })
                    ),
                data
            );
        } else {
            return undefined;
        }
    }
}

/**
 * A fetchable Themes Query
 *
 * @param request - function to call the graphql client
 */
export class ThemesQuery extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the Themes query and return a ProjectThemeCountableConnection
     *
     * @param variables - variables to pass into the ThemesQuery
     * @returns parsed response from ThemesQuery
     */
    public async fetch(
        variables?: I.ThemesQueryVariables
    ): IntegraflowFetch<ProjectThemeCountableConnection | undefined> {
        const response = await this._request<
            I.ThemesQuery,
            I.ThemesQueryVariables
        >(I.ThemesDocument, variables);
        const data = response.themes;
        if (data) {
            return new ProjectThemeCountableConnection(
                this._request,
                connection =>
                    this.fetch(
                        defaultConnection({
                            ...variables,
                            ...connection
                        })
                    ),
                data
            );
        } else {
            return undefined;
        }
    }
}

/**
 * A fetchable Viewer Query
 *
 * @param request - function to call the graphql client
 */
export class ViewerQuery extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the Viewer query and return a User
     *
     * @returns parsed response from ViewerQuery
     */
    public async fetch(): IntegraflowFetch<User | undefined> {
        const response = await this._request<
            I.ViewerQuery,
            I.ViewerQueryVariables
        >(I.ViewerDocument, {});
        const data = response.viewer;

        return data ? new User(this._request, data) : undefined;
    }
}

/**
 * A fetchable Survey_Channels Query
 *
 * @param request - function to call the graphql client
 * @param variables - variables to pass into the Survey_ChannelsQuery
 */
export class Survey_ChannelsQuery extends Request {
    private _variables?: I.Survey_ChannelsQueryVariables;

    public constructor(
        request: IntegraflowRequest,
        variables?: I.Survey_ChannelsQueryVariables
    ) {
        super(request);

        this._variables = variables;
    }

    /**
     * Call the Survey_Channels query and return a SurveyChannelCountableConnection
     *
     * @param variables - variables to pass into the Survey_ChannelsQuery
     * @returns parsed response from Survey_ChannelsQuery
     */
    public async fetch(
        variables?: I.Survey_ChannelsQueryVariables
    ): IntegraflowFetch<SurveyChannelCountableConnection | undefined> {
        const response = await this._request<
            I.Survey_ChannelsQuery,
            I.Survey_ChannelsQueryVariables
        >(I.Survey_ChannelsDocument, variables);
        const data = response.survey?.channels;
        if (data) {
            return new SurveyChannelCountableConnection(
                this._request,
                connection =>
                    this.fetch(
                        defaultConnection({
                            ...this._variables,
                            ...variables,
                            ...connection
                        })
                    ),
                data
            );
        } else {
            return undefined;
        }
    }
}

/**
 * A fetchable Survey_Project Query
 *
 * @param request - function to call the graphql client
 * @param variables - variables to pass into the Survey_ProjectQuery
 */
export class Survey_ProjectQuery extends Request {
    private _variables?: I.Survey_ProjectQueryVariables;

    public constructor(
        request: IntegraflowRequest,
        variables?: I.Survey_ProjectQueryVariables
    ) {
        super(request);

        this._variables = variables;
    }

    /**
     * Call the Survey_Project query and return a Project
     *
     * @param variables - variables to pass into the Survey_ProjectQuery
     * @returns parsed response from Survey_ProjectQuery
     */
    public async fetch(
        variables?: I.Survey_ProjectQueryVariables
    ): IntegraflowFetch<Project | undefined> {
        const response = await this._request<
            I.Survey_ProjectQuery,
            I.Survey_ProjectQueryVariables
        >(I.Survey_ProjectDocument, variables);
        const data = response.survey?.project;

        return data ? new Project(this._request, data) : undefined;
    }
}

/**
 * A fetchable Survey_Questions Query
 *
 * @param request - function to call the graphql client
 * @param variables - variables to pass into the Survey_QuestionsQuery
 */
export class Survey_QuestionsQuery extends Request {
    private _variables?: I.Survey_QuestionsQueryVariables;

    public constructor(
        request: IntegraflowRequest,
        variables?: I.Survey_QuestionsQueryVariables
    ) {
        super(request);

        this._variables = variables;
    }

    /**
     * Call the Survey_Questions query and return a SurveyQuestionCountableConnection
     *
     * @param variables - variables to pass into the Survey_QuestionsQuery
     * @returns parsed response from Survey_QuestionsQuery
     */
    public async fetch(
        variables?: I.Survey_QuestionsQueryVariables
    ): IntegraflowFetch<SurveyQuestionCountableConnection | undefined> {
        const response = await this._request<
            I.Survey_QuestionsQuery,
            I.Survey_QuestionsQueryVariables
        >(I.Survey_QuestionsDocument, variables);
        const data = response.survey?.questions;
        if (data) {
            return new SurveyQuestionCountableConnection(
                this._request,
                connection =>
                    this.fetch(
                        defaultConnection({
                            ...this._variables,
                            ...variables,
                            ...connection
                        })
                    ),
                data
            );
        } else {
            return undefined;
        }
    }
}

/**
 * A fetchable Survey_Theme Query
 *
 * @param request - function to call the graphql client
 * @param variables - variables to pass into the Survey_ThemeQuery
 */
export class Survey_ThemeQuery extends Request {
    private _variables?: I.Survey_ThemeQueryVariables;

    public constructor(
        request: IntegraflowRequest,
        variables?: I.Survey_ThemeQueryVariables
    ) {
        super(request);

        this._variables = variables;
    }

    /**
     * Call the Survey_Theme query and return a ProjectTheme
     *
     * @param variables - variables to pass into the Survey_ThemeQuery
     * @returns parsed response from Survey_ThemeQuery
     */
    public async fetch(
        variables?: I.Survey_ThemeQueryVariables
    ): IntegraflowFetch<ProjectTheme | undefined> {
        const response = await this._request<
            I.Survey_ThemeQuery,
            I.Survey_ThemeQueryVariables
        >(I.Survey_ThemeDocument, variables);
        const data = response.survey?.theme;

        return data ? new ProjectTheme(this._request, data) : undefined;
    }
}

/**
 * A fetchable Survey_Project_Organization Query
 *
 * @param request - function to call the graphql client
 * @param variables - variables to pass into the Survey_Project_OrganizationQuery
 */
export class Survey_Project_OrganizationQuery extends Request {
    private _variables?: I.Survey_Project_OrganizationQueryVariables;

    public constructor(
        request: IntegraflowRequest,
        variables?: I.Survey_Project_OrganizationQueryVariables
    ) {
        super(request);

        this._variables = variables;
    }

    /**
     * Call the Survey_Project_Organization query and return a AuthOrganization
     *
     * @param variables - variables to pass into the Survey_Project_OrganizationQuery
     * @returns parsed response from Survey_Project_OrganizationQuery
     */
    public async fetch(
        variables?: I.Survey_Project_OrganizationQueryVariables
    ): IntegraflowFetch<AuthOrganization | undefined> {
        const response = await this._request<
            I.Survey_Project_OrganizationQuery,
            I.Survey_Project_OrganizationQueryVariables
        >(I.Survey_Project_OrganizationDocument, variables);
        const data = response.survey?.project?.organization;

        return data ? new AuthOrganization(this._request, data) : undefined;
    }
}

/**
 * A fetchable Survey_Theme_Project Query
 *
 * @param request - function to call the graphql client
 * @param variables - variables to pass into the Survey_Theme_ProjectQuery
 */
export class Survey_Theme_ProjectQuery extends Request {
    private _variables?: I.Survey_Theme_ProjectQueryVariables;

    public constructor(
        request: IntegraflowRequest,
        variables?: I.Survey_Theme_ProjectQueryVariables
    ) {
        super(request);

        this._variables = variables;
    }

    /**
     * Call the Survey_Theme_Project query and return a Project
     *
     * @param variables - variables to pass into the Survey_Theme_ProjectQuery
     * @returns parsed response from Survey_Theme_ProjectQuery
     */
    public async fetch(
        variables?: I.Survey_Theme_ProjectQueryVariables
    ): IntegraflowFetch<Project | undefined> {
        const response = await this._request<
            I.Survey_Theme_ProjectQuery,
            I.Survey_Theme_ProjectQueryVariables
        >(I.Survey_Theme_ProjectDocument, variables);
        const data = response.survey?.theme?.project;

        return data ? new Project(this._request, data) : undefined;
    }
}

/**
 * A fetchable Survey_Theme_Project_Organization Query
 *
 * @param request - function to call the graphql client
 * @param variables - variables to pass into the Survey_Theme_Project_OrganizationQuery
 */
export class Survey_Theme_Project_OrganizationQuery extends Request {
    private _variables?: I.Survey_Theme_Project_OrganizationQueryVariables;

    public constructor(
        request: IntegraflowRequest,
        variables?: I.Survey_Theme_Project_OrganizationQueryVariables
    ) {
        super(request);

        this._variables = variables;
    }

    /**
     * Call the Survey_Theme_Project_Organization query and return a AuthOrganization
     *
     * @param variables - variables to pass into the Survey_Theme_Project_OrganizationQuery
     * @returns parsed response from Survey_Theme_Project_OrganizationQuery
     */
    public async fetch(
        variables?: I.Survey_Theme_Project_OrganizationQueryVariables
    ): IntegraflowFetch<AuthOrganization | undefined> {
        const response = await this._request<
            I.Survey_Theme_Project_OrganizationQuery,
            I.Survey_Theme_Project_OrganizationQueryVariables
        >(I.Survey_Theme_Project_OrganizationDocument, variables);
        const data = response.survey?.theme?.project?.organization;

        return data ? new AuthOrganization(this._request, data) : undefined;
    }
}

/**
 * A fetchable SurveyByChannel_Project Query
 *
 * @param request - function to call the graphql client
 * @param variables - variables to pass into the SurveyByChannel_ProjectQuery
 */
export class SurveyByChannel_ProjectQuery extends Request {
    private _variables?: I.SurveyByChannel_ProjectQueryVariables;

    public constructor(
        request: IntegraflowRequest,
        variables?: I.SurveyByChannel_ProjectQueryVariables
    ) {
        super(request);

        this._variables = variables;
    }

    /**
     * Call the SurveyByChannel_Project query and return a BaseProject
     *
     * @param variables - variables to pass into the SurveyByChannel_ProjectQuery
     * @returns parsed response from SurveyByChannel_ProjectQuery
     */
    public async fetch(
        variables?: I.SurveyByChannel_ProjectQueryVariables
    ): IntegraflowFetch<BaseProject | undefined> {
        const response = await this._request<
            I.SurveyByChannel_ProjectQuery,
            I.SurveyByChannel_ProjectQueryVariables
        >(I.SurveyByChannel_ProjectDocument, variables);
        const data = response.surveyByChannel?.project;

        return data ? new BaseProject(this._request, data) : undefined;
    }
}

/**
 * A fetchable SurveyByChannel_Theme Query
 *
 * @param request - function to call the graphql client
 * @param variables - variables to pass into the SurveyByChannel_ThemeQuery
 */
export class SurveyByChannel_ThemeQuery extends Request {
    private _variables?: I.SurveyByChannel_ThemeQueryVariables;

    public constructor(
        request: IntegraflowRequest,
        variables?: I.SurveyByChannel_ThemeQueryVariables
    ) {
        super(request);

        this._variables = variables;
    }

    /**
     * Call the SurveyByChannel_Theme query and return a BaseProjectTheme
     *
     * @param variables - variables to pass into the SurveyByChannel_ThemeQuery
     * @returns parsed response from SurveyByChannel_ThemeQuery
     */
    public async fetch(
        variables?: I.SurveyByChannel_ThemeQueryVariables
    ): IntegraflowFetch<BaseProjectTheme | undefined> {
        const response = await this._request<
            I.SurveyByChannel_ThemeQuery,
            I.SurveyByChannel_ThemeQueryVariables
        >(I.SurveyByChannel_ThemeDocument, variables);
        const data = response.surveyByChannel?.theme;

        return data ? new BaseProjectTheme(this._request, data) : undefined;
    }
}

/**
 * A fetchable Viewer_Organization Query
 *
 * @param request - function to call the graphql client
 */
export class Viewer_OrganizationQuery extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the Viewer_Organization query and return a AuthOrganization
     *
     * @returns parsed response from Viewer_OrganizationQuery
     */
    public async fetch(): IntegraflowFetch<AuthOrganization | undefined> {
        const response = await this._request<
            I.Viewer_OrganizationQuery,
            I.Viewer_OrganizationQueryVariables
        >(I.Viewer_OrganizationDocument, {});
        const data = response.viewer?.organization;

        return data ? new AuthOrganization(this._request, data) : undefined;
    }
}

/**
 * A fetchable Viewer_Organizations Query
 *
 * @param request - function to call the graphql client
 * @param variables - variables to pass into the Viewer_OrganizationsQuery
 */
export class Viewer_OrganizationsQuery extends Request {
    private _variables?: I.Viewer_OrganizationsQueryVariables;

    public constructor(
        request: IntegraflowRequest,
        variables?: I.Viewer_OrganizationsQueryVariables
    ) {
        super(request);

        this._variables = variables;
    }

    /**
     * Call the Viewer_Organizations query and return a OrganizationCountableConnection
     *
     * @param variables - variables to pass into the Viewer_OrganizationsQuery
     * @returns parsed response from Viewer_OrganizationsQuery
     */
    public async fetch(
        variables?: I.Viewer_OrganizationsQueryVariables
    ): IntegraflowFetch<OrganizationCountableConnection | undefined> {
        const response = await this._request<
            I.Viewer_OrganizationsQuery,
            I.Viewer_OrganizationsQueryVariables
        >(I.Viewer_OrganizationsDocument, variables);
        const data = response.viewer?.organizations;
        if (data) {
            return new OrganizationCountableConnection(
                this._request,
                connection =>
                    this.fetch(
                        defaultConnection({
                            ...this._variables,
                            ...variables,
                            ...connection
                        })
                    ),
                data
            );
        } else {
            return undefined;
        }
    }
}

/**
 * A fetchable Viewer_Project Query
 *
 * @param request - function to call the graphql client
 */
export class Viewer_ProjectQuery extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the Viewer_Project query and return a Project
     *
     * @returns parsed response from Viewer_ProjectQuery
     */
    public async fetch(): IntegraflowFetch<Project | undefined> {
        const response = await this._request<
            I.Viewer_ProjectQuery,
            I.Viewer_ProjectQueryVariables
        >(I.Viewer_ProjectDocument, {});
        const data = response.viewer?.project;

        return data ? new Project(this._request, data) : undefined;
    }
}

/**
 * A fetchable Viewer_Projects Query
 *
 * @param request - function to call the graphql client
 * @param variables - variables to pass into the Viewer_ProjectsQuery
 */
export class Viewer_ProjectsQuery extends Request {
    private _variables?: I.Viewer_ProjectsQueryVariables;

    public constructor(
        request: IntegraflowRequest,
        variables?: I.Viewer_ProjectsQueryVariables
    ) {
        super(request);

        this._variables = variables;
    }

    /**
     * Call the Viewer_Projects query and return a ProjectCountableConnection
     *
     * @param variables - variables to pass into the Viewer_ProjectsQuery
     * @returns parsed response from Viewer_ProjectsQuery
     */
    public async fetch(
        variables?: I.Viewer_ProjectsQueryVariables
    ): IntegraflowFetch<ProjectCountableConnection | undefined> {
        const response = await this._request<
            I.Viewer_ProjectsQuery,
            I.Viewer_ProjectsQueryVariables
        >(I.Viewer_ProjectsDocument, variables);
        const data = response.viewer?.projects;
        if (data) {
            return new ProjectCountableConnection(
                this._request,
                connection =>
                    this.fetch(
                        defaultConnection({
                            ...this._variables,
                            ...variables,
                            ...connection
                        })
                    ),
                data
            );
        } else {
            return undefined;
        }
    }
}

/**
 * A fetchable Viewer_Project_Organization Query
 *
 * @param request - function to call the graphql client
 */
export class Viewer_Project_OrganizationQuery extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Call the Viewer_Project_Organization query and return a AuthOrganization
     *
     * @returns parsed response from Viewer_Project_OrganizationQuery
     */
    public async fetch(): IntegraflowFetch<AuthOrganization | undefined> {
        const response = await this._request<
            I.Viewer_Project_OrganizationQuery,
            I.Viewer_Project_OrganizationQueryVariables
        >(I.Viewer_Project_OrganizationDocument, {});
        const data = response.viewer?.project?.organization;

        return data ? new AuthOrganization(this._request, data) : undefined;
    }
}

/**
 * The SDK class containing all root operations
 *
 * @param request - function to call the graphql client
 */
export class IntegraflowSdk extends Request {
    public constructor(request: IntegraflowRequest) {
        super(request);
    }

    /**
     * Authenticates a user account via email and authentication token.
     *
     * @param email - required email to pass to emailTokenUserAuth
     * @param token - required token to pass to emailTokenUserAuth
     * @param variables - variables without 'email', 'token' to pass into the EmailTokenUserAuthMutation
     * @returns EmailTokenUserAuth
     */
    public emailTokenUserAuth(
        email: string,
        token: string,
        variables?: Omit<
            I.EmailTokenUserAuthMutationVariables,
            "email" | "token"
        >
    ): IntegraflowFetch<EmailTokenUserAuth | undefined> {
        return new EmailTokenUserAuthMutation(this._request).fetch(
            email,
            token,
            variables
        );
    }
    /**
     * Finds or creates a new user account by email and sends an email with token.
     *
     * @param email - required email to pass to emailUserAuthChallenge
     * @param variables - variables without 'email' to pass into the EmailUserAuthChallengeMutation
     * @returns EmailUserAuthChallenge
     */
    public emailUserAuthChallenge(
        email: string,
        variables?: Omit<I.EmailUserAuthChallengeMutationVariables, "email">
    ): IntegraflowFetch<EmailUserAuthChallenge | undefined> {
        return new EmailUserAuthChallengeMutation(this._request).fetch(
            email,
            variables
        );
    }
    /**
     * Captures event.
     *
     * @param variables - variables to pass into the CaptureEventMutation
     * @returns EventCapture
     */
    public captureEvent(
        variables?: I.CaptureEventMutationVariables
    ): IntegraflowFetch<EventCapture | undefined> {
        return new CaptureEventMutation(this._request).fetch(variables);
    }
    /**
     * Finds or creates a new user account from google auth credentials.
     *
     * @param code - required code to pass to googleUserAuth
     * @param variables - variables without 'code' to pass into the GoogleUserAuthMutation
     * @returns GoogleUserAuth
     */
    public googleUserAuth(
        code: string,
        variables?: Omit<I.GoogleUserAuthMutationVariables, "code">
    ): IntegraflowFetch<GoogleUserAuth | undefined> {
        return new GoogleUserAuthMutation(this._request).fetch(code, variables);
    }
    /**
     * Deactivate all JWT tokens of the currently authenticated user.
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     *
     * @returns Logout
     */
    public get logout(): IntegraflowFetch<Logout | undefined> {
        return new LogoutMutation(this._request).fetch();
    }
    /**
     * Creates new organization.
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     *
     * @param input - required input to pass to createOrganization
     * @param variables - variables without 'input' to pass into the CreateOrganizationMutation
     * @returns OrganizationCreate
     */
    public createOrganization(
        input: I.OrganizationCreateInput,
        variables?: Omit<I.CreateOrganizationMutationVariables, "input">
    ): IntegraflowFetch<OrganizationCreate | undefined> {
        return new CreateOrganizationMutation(this._request).fetch(
            input,
            variables
        );
    }
    /**
     * Creates a new organization invite.
     *
     * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
     *
     * @param input - required input to pass to createOrganizationInvite
     * @returns OrganizationInviteCreate
     */
    public createOrganizationInvite(
        input: I.OrganizationInviteCreateInput
    ): IntegraflowFetch<OrganizationInviteCreate | undefined> {
        return new CreateOrganizationInviteMutation(this._request).fetch(input);
    }
    /**
     * Reset the current organization invite link..
     *
     * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
     *
     * @returns OrganizationInviteLinkReset
     */
    public get resetOrganizationInviteLink(): IntegraflowFetch<
        OrganizationInviteLinkReset | undefined
    > {
        return new ResetOrganizationInviteLinkMutation(this._request).fetch();
    }
    /**
     * Joins an organization
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     *
     * @param input - required input to pass to joinOrganization
     * @returns OrganizationJoin
     */
    public joinOrganization(
        input: I.OrganizationJoinInput
    ): IntegraflowFetch<OrganizationJoin | undefined> {
        return new JoinOrganizationMutation(this._request).fetch(input);
    }
    /**
     * Creates a new project
     *
     * @param input - required input to pass to createProject
     * @returns ProjectCreate
     */
    public createProject(
        input: I.ProjectCreateInput
    ): IntegraflowFetch<ProjectCreate | undefined> {
        return new CreateProjectMutation(this._request).fetch(input);
    }
    /**
     * Creates a new theme
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param input - required input to pass to createProjectTheme
     * @returns ProjectThemeCreate
     */
    public createProjectTheme(
        input: I.ProjectThemeCreateInput
    ): IntegraflowFetch<ProjectThemeCreate | undefined> {
        return new CreateProjectThemeMutation(this._request).fetch(input);
    }
    /**
     * Deletes a theme.
     *
     * Requires one of the following permissions: PROJECT_ADMIN_ACCESS.
     *
     * @param id - required id to pass to deleteProjectTheme
     * @returns ProjectThemeDelete
     */
    public deleteProjectTheme(
        id: string
    ): IntegraflowFetch<ProjectThemeDelete | undefined> {
        return new DeleteProjectThemeMutation(this._request).fetch(id);
    }
    /**
     * Updates an existing theme
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param id - required id to pass to updateProjectTheme
     * @param input - required input to pass to updateProjectTheme
     * @returns ProjectThemeUpdate
     */
    public updateProjectTheme(
        id: string,
        input: I.ProjectThemeUpdateInput
    ): IntegraflowFetch<ProjectThemeUpdate | undefined> {
        return new UpdateProjectThemeMutation(this._request).fetch(id, input);
    }
    /**
     * Updates a project.
     *
     * @param input - required input to pass to updateProject
     * @returns ProjectUpdate
     */
    public updateProject(
        input: I.ProjectUpdateInput
    ): IntegraflowFetch<ProjectUpdate | undefined> {
        return new UpdateProjectMutation(this._request).fetch(input);
    }
    /**
     * Creates a new distibution channel
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param input - required input to pass to createSurveyChannel
     * @returns SurveyChannelCreate
     */
    public createSurveyChannel(
        input: I.SurveyChannelCreateInput
    ): IntegraflowFetch<SurveyChannelCreate | undefined> {
        return new CreateSurveyChannelMutation(this._request).fetch(input);
    }
    /**
     * Deletes a channel.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param id - required id to pass to deleteSurveyChannel
     * @returns SurveyChannelDelete
     */
    public deleteSurveyChannel(
        id: string
    ): IntegraflowFetch<SurveyChannelDelete | undefined> {
        return new DeleteSurveyChannelMutation(this._request).fetch(id);
    }
    /**
     * Updates a channel
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param id - required id to pass to updateSurveyChannel
     * @param input - required input to pass to updateSurveyChannel
     * @returns SurveyChannelUpdate
     */
    public updateSurveyChannel(
        id: string,
        input: I.SurveyChannelUpdateInput
    ): IntegraflowFetch<SurveyChannelUpdate | undefined> {
        return new UpdateSurveyChannelMutation(this._request).fetch(id, input);
    }
    /**
     * Creates a new survey
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param input - required input to pass to createSurvey
     * @returns SurveyCreate
     */
    public createSurvey(
        input: I.SurveyCreateInput
    ): IntegraflowFetch<SurveyCreate | undefined> {
        return new CreateSurveyMutation(this._request).fetch(input);
    }
    /**
     * Deletes a survey.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param id - required id to pass to deleteSurvey
     * @returns SurveyDelete
     */
    public deleteSurvey(
        id: string
    ): IntegraflowFetch<SurveyDelete | undefined> {
        return new DeleteSurveyMutation(this._request).fetch(id);
    }
    /**
     * Creates a new question
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param input - required input to pass to createSurveyQuestion
     * @returns SurveyQuestionCreate
     */
    public createSurveyQuestion(
        input: I.SurveyQuestionCreateInput
    ): IntegraflowFetch<SurveyQuestionCreate | undefined> {
        return new CreateSurveyQuestionMutation(this._request).fetch(input);
    }
    /**
     * Deletes a question.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param id - required id to pass to deleteSurveyQuestion
     * @returns SurveyQuestionDelete
     */
    public deleteSurveyQuestion(
        id: string
    ): IntegraflowFetch<SurveyQuestionDelete | undefined> {
        return new DeleteSurveyQuestionMutation(this._request).fetch(id);
    }
    /**
     * Updates a question
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param id - required id to pass to updateSurveyQuestion
     * @param input - required input to pass to updateSurveyQuestion
     * @returns SurveyQuestionUpdate
     */
    public updateSurveyQuestion(
        id: string,
        input: I.SurveyQuestionUpdateInput
    ): IntegraflowFetch<SurveyQuestionUpdate | undefined> {
        return new UpdateSurveyQuestionMutation(this._request).fetch(id, input);
    }
    /**
     * Updates a survey
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param id - required id to pass to updateSurvey
     * @param input - required input to pass to updateSurvey
     * @returns SurveyUpdate
     */
    public updateSurvey(
        id: string,
        input: I.SurveyUpdateInput
    ): IntegraflowFetch<SurveyUpdate | undefined> {
        return new UpdateSurveyMutation(this._request).fetch(id, input);
    }
    /**
     * Refresh JWT token. Mutation tries to take refreshToken from the input. If it fails it will try to take `refreshToken` from the http-only cookie `refreshToken`. `csrfToken` is required when `refreshToken` is provided as a cookie.
     *
     * @param variables - variables to pass into the RefreshTokenMutation
     * @returns RefreshToken
     */
    public refreshToken(
        variables?: I.RefreshTokenMutationVariables
    ): IntegraflowFetch<RefreshToken | undefined> {
        return new RefreshTokenMutation(this._request).fetch(variables);
    }
    /**
     * Updates a user.
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     *
     * @param input - required input to pass to updateUser
     * @returns UserUpdate
     */
    public updateUser(
        input: I.UserInput
    ): IntegraflowFetch<UserUpdate | undefined> {
        return new UpdateUserMutation(this._request).fetch(input);
    }
    /**
     * List of the project's surveys.
     *
     * Requires one of the following permissions: AUTHENTICATED_API.
     *
     * @param variables - variables to pass into the ActiveSurveysQuery
     * @returns BaseSurveyCountableConnection
     */
    public activeSurveys(
        variables?: I.ActiveSurveysQueryVariables
    ): IntegraflowFetch<BaseSurveyCountableConnection | undefined> {
        return new ActiveSurveysQuery(this._request).fetch(variables);
    }
    /**
     * List of channels for a specific survey.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param id - required id to pass to channels
     * @param variables - variables without 'id' to pass into the ChannelsQuery
     * @returns SurveyChannelCountableConnection
     */
    public channels(
        id: string,
        variables?: Omit<I.ChannelsQueryVariables, "id">
    ): IntegraflowFetch<SurveyChannelCountableConnection | undefined> {
        return new ChannelsQuery(this._request).fetch(id, variables);
    }
    /**
     * List of event's definitions.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param variables - variables to pass into the EventDefinitionsQuery
     * @returns EventDefinitionCountableConnection
     */
    public eventDefinitions(
        variables?: I.EventDefinitionsQueryVariables
    ): IntegraflowFetch<EventDefinitionCountableConnection | undefined> {
        return new EventDefinitionsQuery(this._request).fetch(variables);
    }
    /**
     * List of event's properties.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param variables - variables to pass into the EventPropertiesQuery
     * @returns EventPropertyCountableConnection
     */
    public eventProperties(
        variables?: I.EventPropertiesQueryVariables
    ): IntegraflowFetch<EventPropertyCountableConnection | undefined> {
        return new EventPropertiesQuery(this._request).fetch(variables);
    }
    /**
     * List of triggered events.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param variables - variables to pass into the EventsQuery
     * @returns EventCountableConnection
     */
    public events(
        variables?: I.EventsQueryVariables
    ): IntegraflowFetch<EventCountableConnection | undefined> {
        return new EventsQuery(this._request).fetch(variables);
    }
    /**
     * The current organization invite link.
     *
     * Requires one of the following permissions: ORGANIZATION_MEMBER_ACCESS.
     *
     * @returns OrganizationInviteLink
     */
    public get organizationInviteLink(): IntegraflowFetch<
        OrganizationInviteLink | undefined
    > {
        return new OrganizationInviteLinkQuery(this._request).fetch();
    }
    /**
     * List of persons.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param variables - variables to pass into the PersonsQuery
     * @returns PersonCountableConnection
     */
    public persons(
        variables?: I.PersonsQueryVariables
    ): IntegraflowFetch<PersonCountableConnection | undefined> {
        return new PersonsQuery(this._request).fetch(variables);
    }
    /**
     * List of the property definitions.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param variables - variables to pass into the PropertyDefinitionsQuery
     * @returns PropertyDefinitionCountableConnection
     */
    public propertyDefinitions(
        variables?: I.PropertyDefinitionsQueryVariables
    ): IntegraflowFetch<PropertyDefinitionCountableConnection | undefined> {
        return new PropertyDefinitionsQuery(this._request).fetch(variables);
    }
    /**
     * List of questions for a specific survey.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param id - required id to pass to questions
     * @param variables - variables without 'id' to pass into the QuestionsQuery
     * @returns SurveyQuestionCountableConnection
     */
    public questions(
        id: string,
        variables?: Omit<I.QuestionsQueryVariables, "id">
    ): IntegraflowFetch<SurveyQuestionCountableConnection | undefined> {
        return new QuestionsQuery(this._request).fetch(id, variables);
    }
    /**
     * Look up a survey by ID or slug.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS, AUTHENTICATED_API.
     *
     * @param variables - variables to pass into the SurveyQuery
     * @returns Survey
     */
    public survey(
        variables?: I.SurveyQueryVariables
    ): IntegraflowFetch<Survey | undefined> {
        return new SurveyQuery(this._request).fetch(variables);
    }
    /**
     * Look up a survey by channel ID or link.
     *
     * Requires one of the following permissions: AUTHENTICATED_API.
     *
     * @param variables - variables to pass into the SurveyByChannelQuery
     * @returns BaseSurvey
     */
    public surveyByChannel(
        variables?: I.SurveyByChannelQueryVariables
    ): IntegraflowFetch<BaseSurvey | undefined> {
        return new SurveyByChannelQuery(this._request).fetch(variables);
    }
    /**
     * List of the project's surveys.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param variables - variables to pass into the SurveysQuery
     * @returns SurveyCountableConnection
     */
    public surveys(
        variables?: I.SurveysQueryVariables
    ): IntegraflowFetch<SurveyCountableConnection | undefined> {
        return new SurveysQuery(this._request).fetch(variables);
    }
    /**
     * List of the project's themes.
     *
     * Requires one of the following permissions: PROJECT_MEMBER_ACCESS.
     *
     * @param variables - variables to pass into the ThemesQuery
     * @returns ProjectThemeCountableConnection
     */
    public themes(
        variables?: I.ThemesQueryVariables
    ): IntegraflowFetch<ProjectThemeCountableConnection | undefined> {
        return new ThemesQuery(this._request).fetch(variables);
    }
    /**
     * Return the currently authenticated user.
     *
     * Requires one of the following permissions: AUTHENTICATED_USER.
     *
     * @returns User
     */
    public get viewer(): IntegraflowFetch<User | undefined> {
        return new ViewerQuery(this._request).fetch();
    }
}
