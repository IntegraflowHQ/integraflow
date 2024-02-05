import {
    Event,
    EventProperties,
    ID,
    SurveyAnswer,
    UserAttributes
} from "../types";
import { parsedSurveys, uuidv4 } from "../utils";
import { Context } from "./context";
import { getState, persistState, resetState } from "./storage";

export class SyncManager {
    private readonly context: Context;

    private syncId: NodeJS.Timeout | null = null;

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
        console.debug("state: ", state);

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
            try {
                this.context.client.createSurveyResponse({
                    id: responseId,
                    surveyId: surveyId as string,
                    attributes: JSON.stringify(state.user ?? {}),
                    startedAt: presentationTime,
                    userId:
                        typeof state.user?.id === "number"
                            ? String(state.user?.id)
                            : state.user?.id
                });
            } catch (e) {
                console.warn(e);
                // Noop (fallback to local)
            }
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
            const surveyAnswers = Array.from(
                state.surveyAnswers[surveyId].entries()
            ).map(([questionId, answers]) => ({
                questionId,
                answers
            }));

            try {
                if (!responseId) {
                    throw new Error("Response ID not found");
                }

                this.context.client.updateSurveyResponse(responseId, {
                    attributes: JSON.stringify(state.user ?? {}),
                    userId:
                        typeof state.user?.id === "number"
                            ? String(state.user?.id)
                            : state.user?.id,
                    response: JSON.stringify(surveyAnswers)
                });
            } catch (e) {
                console.warn(e);
                // Noop (fallback to local)
            }
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

        // TODO: Sync survey status with the server.

        if (this.context.syncPolicy !== "off") {
            if (!responseId) {
                throw new Error("Response ID not found");
            }

            try {
                this.context.client.updateSurveyResponse(responseId, {
                    attributes: JSON.stringify(state.user ?? {}),
                    userId:
                        typeof state.user?.id === "number"
                            ? String(state.user?.id)
                            : state.user?.id,
                    completed: true,
                    completedAt: new Date()
                });

                surveyResponses.delete(surveyId);
                state.surveyResponses = surveyResponses;
                await persistState(this.context, state);
            } catch (e) {
                console.warn(e);
                // Noop (fallback to local)
            }
        }
    }
}
