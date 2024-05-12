import { IntegraflowError, IntegraflowErrorType } from "@integraflow/sdk";
import { Event, EventProperties, ID, QueuedRequest, SurveyAnswer, UserAttributes } from "../types";
import { getEventAttributes, getUserAttributes, onDOMReady, parsedSurveys, uuidv4 } from "../utils";
import { Context } from "./context";
import { RequestQueue, RetryQueue } from "./queue";
import { getState, persistState, resetState } from "./storage";

export class SyncManager {
    private readonly context: Context;
    private syncId: number | null = null;

    requestQueue?: RequestQueue;
    retryQueue?: RetryQueue;

    constructor(ctx: Context) {
        this.context = ctx;

        onDOMReady(() => this.init());
    }

    init() {
        if (this.context.syncPolicy !== "off") {
            this.requestQueue = new RequestQueue(this.handleRequestQueue.bind(this));
            this.retryQueue = new RetryQueue(this.handleRequestQueue.bind(this));
            this.startSync();
        }

        // Use `onpagehide` if available, see https://calendar.perfplanet.com/2020/beaconing-in-practice/#beaconing-reliability-avoiding-abandons
        window?.addEventListener?.("onpagehide" in self ? "pagehide" : "unload", this.handleUnload.bind(this));
    }

    async startSync() {
        if (this.context.syncPolicy !== "polling") {
            return;
        }

        const interval = this.context.debug ? 1000 * 60 * 10 : 1000 * 60 * 30;

        if (this.syncId) {
            this.stopSync();
        }

        this.syncId = (setInterval(async () => {
            console.log("Syncing.");
            await this.sync();
        }, interval) as any) as number;

        await this.sync();
    }

    stopSync() {
        if (this.syncId) {
            clearInterval(this.syncId);
        }
    }

    async sync() {
        const state = await getState(this.context);
        try {
            const surveys = await this.context.client.activeSurveys({
                first: 100
            });
            const newSurveys = parsedSurveys(surveys);
            await persistState(this.context, {
                ...state,
                surveys: newSurveys
            });

            this.context.broadcast("eventTracked", {
                event: "$sync",
                uuid: uuidv4(),
                timestamp: Date.now()
            });
        } catch (e) {
            console.warn(e);
            // Noop (fallback to local)
        }
    }

    async getInstallId(): Promise<string | undefined> {
        const state = await getState(this.context);
        return state.installId;
    }

    async getUserId(): Promise<ID | undefined> {
        const state = await getState(this.context);
        if (!state || !state.user?.id) {
            return this.getInstallId();
        }

        return state.user.id;
    }

    async identifyUser(id: ID, attributes?: UserAttributes): Promise<UserAttributes> {
        const state = await getState(this.context);
        if (state.user?.id && state.user?.id !== id && state.user.id !== state.installId) {
            throw new Error("User ID cannot be changed after it has been set. You need to reset the user first.");
        }

        state.user = {
            ...(state.user ?? {}),
            ...(attributes ?? {}),
            ...getUserAttributes(),
            id
        };

        await persistState(this.context, state);
        this.context.broadcast("audienceUpdated", state.user);

        this.trackEvent("$identify", state.user);

        return state.user;
    }

    async updateUserAttribute(attributes: UserAttributes): Promise<UserAttributes> {
        const state = await getState(this.context);

        const userId = state.user?.id || state.installId;
        return this.identifyUser(userId!, attributes);
    }

    async reset(resetInstallId: boolean = false): Promise<void> {
        await resetState(this.context, resetInstallId);
        this.context.broadcast("audienceUpdated", {});
    }

    async trackEvent(name: string, properties?: EventProperties, attributes?: UserAttributes): Promise<Event> {
        const state = await getState(this.context);

        const event: Event = {
            event: name,
            uuid: uuidv4(),
            timestamp: Date.now(),
            properties,
            userId: state.user?.id,
            attributes: {
                ...(attributes ?? {}),
                ...getEventAttributes()
            }
        };

        this.context.broadcast("eventTracked", event);

        this.context.setState(state);

        this.requestQueue?.enqueue({
            id: uuidv4(),
            action: "captureEvent",
            batchKey: `captureEvent:${event.uuid}`,
            timestamp: new Date().getTime(),
            payload: {
                ...event,
                timestamp: new Date(event.timestamp),
                userId: typeof state.user?.id === "number" ? String(state.user?.id) : state.user?.id,
                properties: JSON.stringify(event.properties ?? {}),
                attributes: JSON.stringify(state.user ?? {})
            }
        });

        return event;
    }

    async markSurveyAsSeen(surveyId: ID, presentationTime: Date = new Date(), isRecurring: boolean = false) {
        const state = await getState(this.context);

        const {
            seenSurveyIds = new Set(),
            lastPresentationTimes = new Map<ID, Date>(),
            surveyResponses = new Map()
        } = state;

        if (!isRecurring && seenSurveyIds.has(surveyId)) {
            return;
        }

        if (lastPresentationTimes.has(surveyId)) {
            lastPresentationTimes.delete(surveyId);
        }

        if (surveyResponses.has(surveyId)) {
            surveyResponses.delete(surveyId);
        }

        const responseId = uuidv4();

        lastPresentationTimes.set(surveyId, presentationTime);
        seenSurveyIds.add(surveyId);
        surveyResponses.set(surveyId, responseId);

        state.seenSurveyIds = seenSurveyIds;
        state.lastPresentationTimes = lastPresentationTimes;
        state.surveyResponses = surveyResponses;

        await persistState(this.context, state);

        this.requestQueue?.enqueue({
            id: uuidv4(),
            action: "createSurveyResponse",
            batchKey: `createSurveyResponse:${responseId}`,
            timestamp: new Date().getTime(),
            payload: {
                id: responseId,
                surveyId,
                userId: typeof state.user?.id === "number" ? String(state.user?.id) : state.user?.id,
                attributes: JSON.stringify(state.user ?? {}),
                startedAt: new Date(),
            }
        });
    }

    async persistSurveyAnswers(surveyId: ID, questionId: ID, answers: SurveyAnswer[]) {
        const state = await getState(this.context);

        const { surveyAnswers = {}, surveyResponses = new Map() } = state;

        if (!surveyAnswers[surveyId]) {
            surveyAnswers[surveyId] = new Map();
        }

        const responseId = surveyResponses.get(surveyId);

        surveyAnswers[surveyId].set(questionId, answers);
        surveyResponses.set(questionId, responseId);
        state.surveyAnswers = surveyAnswers;

        await persistState(this.context, state);

        this.requestQueue?.enqueue({
            id: uuidv4(),
            action: "updateSurveyResponse",
            batchKey: `updateSurveyResponse:${responseId}`,
            timestamp: new Date().getTime(),
            payloadId: responseId,
            payload: {
                response: JSON.stringify([{ questionId, answers }]),
                userId: typeof state.user?.id === "number" ? String(state.user?.id) : state.user?.id,
                attributes: JSON.stringify(state.user ?? {})
            }
        });
    }

    async clearSurveyAnswers(surveyId: ID) {
        const state = await getState(this.context);

        const { surveyAnswers = {} } = state;

        if (surveyAnswers[surveyId]) {
            surveyAnswers[surveyId].clear();
            delete surveyAnswers[surveyId];
        }

        state.surveyAnswers = surveyAnswers;
        await persistState(this.context, state);
    }

    async markSurveyAsCompleted(surveyId: ID) {
        const state = await getState(this.context);
        this.clearSurveyAnswers(surveyId);
        const { surveyResponses = new Map() } = state;
        const responseId = surveyResponses.get(surveyId);
        await persistState(this.context, state);

        this.requestQueue?.enqueue({
            id: uuidv4(),
            action: "updateSurveyResponse",
            batchKey: `updateSurveyResponse:${responseId}`,
            timestamp: new Date().getTime(),
            payloadId: responseId,
            payload: {
                completedAt: new Date(),
                completed: true,
                userId: typeof state.user?.id === "number" ? String(state.user?.id) : state.user?.id,
                attributes: JSON.stringify(state.user ?? {})
            }
        });
    }

    private async handleRequestQueue(request: QueuedRequest) {
        try {
            if (request.payloadId) {
                await (this.context.client as any)[request.action](request.payloadId, request.payload);
                return;
            }

            await (this.context.client as any)[request.action](request.payload);
        } catch (e) {
            if (
                e instanceof IntegraflowError &&
                (e.type === IntegraflowErrorType.NetworkError || e.type === IntegraflowErrorType.Unknown)
            ) {
                this.retryQueue?.enqueue(request);
                return;
            }
        }
    }

    private handleUnload() {
        this.requestQueue?.unload();
        this.retryQueue?.unload();
        this.stopSync();
    }
}
