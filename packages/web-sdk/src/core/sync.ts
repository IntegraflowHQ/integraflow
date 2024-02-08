import {
    CompleteResponsePayload,
    CreateResponsePayload,
    Event,
    EventProperties,
    ID,
    ResponseAction,
    ResponseTask,
    SurveyAnswer,
    UpdateResponsePayload,
    UserAttributes
} from "../types";
import { parsedSurveys, uuidv4 } from "../utils";
import { Context } from "./context";
import { getState, persistState, resetState } from "./storage";

export class SyncManager {
    private readonly context: Context;

    private syncId: NodeJS.Timeout | null = null;
    private answerSyncId: NodeJS.Timeout | null = null;
    private responseQueue: ResponseTask[] = [];

    constructor(ctx: Context) {
        this.context = ctx;
        this.startSync();
    }

    async startSync() {
        const interval = this.context.debug ? 1000 * 30 : 1000 * 60 * 2;

        if (this.syncId) {
            this.stopSync();
        }

        this.syncId = setInterval(async () => {
            console.log("Syncing.");
            await this.sync();
        }, interval);

        if (typeof window !== "undefined") {
            window.addEventListener("beforeunload", () => this.stopSync());
        }

        await this.sync();
    }

    async sync() {
        const state = await getState(this.context);

        if (this.context.syncPolicy === "polling") {
            try {
                const surveys = await this.context.client.activeSurveys({
                    first: 100
                });
                const newSurveys = parsedSurveys(surveys);
                await persistState(this.context, {
                    ...state,
                    surveys: newSurveys
                });

                this.context.setState({ ...state, surveys: newSurveys });
            } catch (e) {
                console.warn(e);
                // Noop (fallback to local)
            }
        }
    }

    stopSync() {
        if (this.syncId) {
            clearInterval(this.syncId);
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

    async identifyUser(
        id: ID,
        attributes?: UserAttributes
    ): Promise<UserAttributes> {
        const state = await getState(this.context);
        if (
            state.user?.id &&
            state.user?.id !== id &&
            state.user.id !== state.installId
        ) {
            throw new Error(
                "User ID cannot be changed after it has been set. You need to reset the user first."
            );
        }

        state.user = {
            ...(state.user ?? {}),
            ...(attributes ?? {}),
            id
        };

        await persistState(this.context, state);

        await this.trackEvent("$identify", state.user);

        this.context.setState(state);
        this.context.broadcast("audienceUpdated", state.user);

        return state.user;
    }

    async updateUserAttribute(
        attributes: UserAttributes
    ): Promise<UserAttributes> {
        const state = await getState(this.context);

        const userId = state.user?.id || state.installId;
        return this.identifyUser(userId!, attributes);
    }

    async reset(resetInstallId: boolean = false): Promise<void> {
        await resetState(this.context, resetInstallId);

        this.context.broadcast("audienceUpdated", {});
    }

    async trackEvent(
        name: string,
        properties?: EventProperties,
        attributes?: UserAttributes
    ): Promise<Event> {
        const state = await getState(this.context);

        const event: Event = {
            event: name,
            uuid: uuidv4(),
            timestamp: Date.now(),
            properties,
            userId: state.user?.id,
            attributes: {
                ...(attributes ?? {})
            }
        };

        this.context.broadcast("eventTracked", event);

        this.context.setState(state);

        if (state.user?.id && this.context.syncPolicy !== "off") {
            try {
                this.context.client.captureEvent({
                    input: {
                        ...event,
                        timestamp: new Date(event.timestamp),
                        userId:
                            typeof state.user?.id === "number"
                                ? String(state.user?.id)
                                : state.user?.id,
                        properties: JSON.stringify(event.properties ?? {}),
                        attributes: JSON.stringify(state.user ?? {})
                    }
                });
            } catch (e) {
                console.warn(e);
                // Noop (fallback to local)
            }
        }

        return event;
    }

    async createSurveyResponse(
        payload: CreateResponsePayload
    ): Promise<boolean> {
        try {
            const res = await this.context.client.createSurveyResponse({
                ...payload,
                attributes: JSON.stringify(payload.attributes)
            });

            return res?.status ?? false;
        } catch (e) {
            console.warn(e);
            return false;
        }
    }

    async updateSurveyResponse({
        type,
        payload
    }:
        | { type: "update"; payload: UpdateResponsePayload }
        | { type: "complete"; payload: CompleteResponsePayload }): Promise<
        boolean
    > {
        try {
            if (type === "update") {
                const res = await this.context.client.updateSurveyResponse(
                    payload.id,
                    {
                        response: JSON.stringify(payload.response)
                    }
                );
                return res?.status ?? false;
            }

            const res = await this.context.client.updateSurveyResponse(
                payload.id,
                {
                    completedAt: payload.completedAt,
                    completed: true
                }
            );
            return res?.status ?? false;
        } catch (e) {
            console.warn(e);
            return false;
        }
    }

    async removeTask(ids: string[]) {
        this.responseQueue = this.responseQueue.filter(
            task => !ids.includes(task.id)
        );
    }

    async handleTasks(tasks: ResponseTask[], actionType: ResponseAction) {
        if (tasks.length === 0) {
            return;
        }

        const maxRetries = 2;

        this.answerSyncId = setTimeout(async () => {
            for (const task of tasks) {
                let successful = false;
                let retries = 0;

                while (!successful && retries <= maxRetries) {
                    switch (actionType) {
                        case "create":
                            successful = await this.createSurveyResponse(
                                task.payload as CreateResponsePayload
                            );
                            break;
                        case "complete":
                            successful = await this.updateSurveyResponse({
                                type: "complete",
                                payload: task.payload as CompleteResponsePayload
                            });
                            break;
                        case "update":
                            successful = await this.updateSurveyResponse({
                                type: "update",
                                payload: task.payload as UpdateResponsePayload
                            });
                            break;
                        default:
                            break;
                    }

                    if (!successful) {
                        retries++;
                    }
                }

                this.removeTask([task.id]);
            }

            this.stopAnswerSync();
            this.syncAnswers();
        }, 0);
    }

    async syncAnswers() {
        if (this.answerSyncId) {
            return;
        }

        const actionTypes = ["create", "update", "complete"] as const;

        for (const actionType of actionTypes) {
            const tasks = this.responseQueue.filter(
                task => task.action === actionType
            );
            await this.handleTasks(tasks, actionType);
        }

        if (typeof window !== "undefined") {
            window.addEventListener("beforeunload", () =>
                this.stopAnswerSync()
            );
        }
    }

    stopAnswerSync() {
        if (this.answerSyncId) {
            clearTimeout(this.answerSyncId);
            this.answerSyncId = null;
        }
    }

    async markSurveyAsSeen(
        surveyId: ID,
        presentationTime: Date = new Date(),
        isRecurring: boolean = false
    ) {
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
        this.context.setState(state);

        if (this.context.syncPolicy !== "off") {
            this.responseQueue.push({
                id: uuidv4(),
                action: "create",
                payload: {
                    id: responseId,
                    surveyId,
                    userId:
                        typeof state.user?.id === "number"
                            ? String(state.user?.id)
                            : state.user?.id,
                    attributes: state.user
                } as CreateResponsePayload
            });

            this.syncAnswers();
        }
    }

    async persistSurveyAnswers(
        surveyId: ID,
        questionId: ID,
        answers: SurveyAnswer[]
    ) {
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
        this.context.setState(state);

        if (this.context.syncPolicy !== "off") {
            this.responseQueue.push({
                id: uuidv4(),
                action: "update",
                payload: {
                    response: [{ questionId, answers }],
                    surveyId,
                    id: responseId
                } as UpdateResponsePayload
            });
            this.syncAnswers();
        }
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
        this.context.setState(state);
    }

    async markSurveyAsCompleted(surveyId: ID) {
        const state = await getState(this.context);
        this.clearSurveyAnswers(surveyId);
        const { surveyResponses = new Map() } = state;
        const responseId = surveyResponses.get(surveyId);
        await persistState(this.context, state);
        this.context.setState(state);

        if (this.context.syncPolicy !== "off") {
            this.responseQueue.push({
                id: uuidv4(),
                action: "complete",
                payload: {
                    id: responseId,
                    completedAt: new Date()
                } as CompleteResponsePayload
            });
            this.syncAnswers();
        }
    }
}
