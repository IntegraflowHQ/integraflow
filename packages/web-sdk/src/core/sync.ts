import { IntegraflowClient } from "@integraflow/sdk";
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
    private readonly api: IntegraflowClient;

    private syncId: NodeJS.Timeout | null = null;

    constructor(ctx: Context) {
        this.context = ctx;
        this.api = new IntegraflowClient({
            apiUrl: this.context.credentials.apiHost
                ? `${this.context.credentials.apiHost}/graphql`
                : undefined,
            accessToken: this.context.credentials.accessToken,
            apiKey: this.context.credentials.appKey
        });

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
        const surveys = await this.api.activeSurveys({ first: 100 });
        const newSurveys = parsedSurveys(surveys);
        await persistState(this.context, { ...state, surveys: newSurveys });
        this.context.setState({ ...state, surveys: newSurveys });
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
        properties?: EventProperties
    ): Promise<Event> {
        const state = await getState(this.context);

        const event: Event = {
            event: name,
            uuid: uuidv4(),
            timestamp: Date.now(),
            properties,
            userId: state.user?.id
        };

        this.context.broadcast("eventTracked", event);

        this.context.setState(state);

        await this.api.captureEvent({
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
            lastPresentationTimes = new Map<ID, Date>()
        } = state;
        if (!isRecurring && seenSurveyIds.has(surveyId)) {
            return;
        }

        if (lastPresentationTimes.has(surveyId)) {
            lastPresentationTimes.delete(surveyId);
        }

        lastPresentationTimes.set(surveyId, presentationTime);
        seenSurveyIds.add(surveyId);

        state.seenSurveyIds = seenSurveyIds;
        state.lastPresentationTimes = lastPresentationTimes;
        await persistState(this.context, state);

        this.context.setState(state);

        // TODO: Sync survey status with the server.
    }

    async persistSurveyAnswers(
        surveyId: ID,
        questionId: ID,
        answers: SurveyAnswer[]
    ) {
        const state = await getState(this.context);

        const { surveyAnswers = {} } = state;

        if (!surveyAnswers[surveyId]) {
            surveyAnswers[surveyId] = new Map();
        }

        surveyAnswers[surveyId].set(questionId, answers);
        state.surveyAnswers = surveyAnswers;

        await persistState(this.context, state);
        this.context.setState(state);

        // TODO: Send survey answers to the server.
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
        this.clearSurveyAnswers(surveyId);

        // TODO: Sync survey status with the server.
    }
}
