import { Context, RootFrame, SyncManager } from "./core";
import { SurveyManager } from "./surveys";
import { Configuration, EventProperties, ID, SurveyAnswer, UserAttributes } from "./types";

export default class Integraflow {
    private readonly config: Configuration;
    private static client: Integraflow;
    private static initialized: boolean = false;
    private readonly surveyManager: SurveyManager;
    private readonly syncManager: SyncManager;

    private readonly context: Context;

    private readonly rootFrame: RootFrame;

    constructor(config: Configuration) {
        this.config = config;
        this.context = new Context(config);

        this.rootFrame = new RootFrame();

        this.surveyManager = new SurveyManager(this, this.context, this.rootFrame);

        this.syncManager = new SyncManager(this.context);
    }

    static init(config: Configuration) {
        if (!this.client) {
            this.client = new Integraflow(config);
            this.initialized = true;
        } else {
            this.client.context.surveys = config.surveys ?? [];
            if (config.syncPolicy === "off") {
                this.client.context.fullScreen = config.fullScreen ?? this.client.context.fullScreen;
            }
        }

        return this.client;
    }

    static getClient() {
        if (!this.client || !this.initialized) {
            throw new Error("You need to initialise the SDK before using its methods.");
        }

        return this.client;
    }

    async getInstallId(): Promise<string | undefined> {
        let installId = this.context.state?.installId;
        if (!installId) {
            installId = await this.syncManager.getInstallId();
        }

        return installId;
    }

    async getUserId(): Promise<ID | undefined> {
        let userId = this.context.state?.user?.id;
        if (!userId) {
            userId = await this.syncManager.getUserId();
        }

        return userId;
    }

    async identify(identifier: string, attributes?: UserAttributes): Promise<void> {
        const user = await this.syncManager.identifyUser(identifier, attributes);
        this.context.listeners.onAudienceChanged?.(user);
    }

    async updateUserAttribute(attributes: UserAttributes): Promise<void> {
        const user = await this.syncManager.updateUserAttribute(attributes);
        this.context.listeners.onAudienceChanged?.(user);
    }

    async reset(resetInstallId?: boolean): Promise<void> {
        await this.syncManager.reset(resetInstallId);
    }

    async track(event: string, properties?: EventProperties): Promise<void> {
        const trackedEvent = await this.syncManager.trackEvent(event, properties);
        this.context.listeners.onEventTracked?.(trackedEvent);
    }

    async trackRouteChange() {
        if (typeof window === "undefined") return;

        await this.syncManager.trackEvent("pageView", {
            title: document.title,
            url: window.location.href
        });
    }

    async registerRouteChange() {
        if (typeof window === "undefined") return;

        window.addEventListener("hashchange", this.trackRouteChange);
        window.addEventListener("popstate", this.trackRouteChange);
        window.addEventListener("pushstate", this.trackRouteChange);
        window.addEventListener("replacestate", this.trackRouteChange);
        window.addEventListener("load", this.trackRouteChange);
    }

    showSurvey(surveyId: ID, startFrom?: ID) {
        this.surveyManager.showSurvey(surveyId, startFrom);
    }

    async closeSurvey(surveyId: ID) {
        this.surveyManager.hideSurvey(surveyId);

        await this.syncManager.clearSurveyAnswers(surveyId);
        this.context.listeners.onSurveyClosed?.(surveyId);
    }

    async markSurveyAsSeen(surveyId: ID, presentationTime?: Date, isRecurring?: boolean) {
        await this.syncManager.markSurveyAsSeen(surveyId, presentationTime, isRecurring);
        this.context.listeners.onSurveyDisplayed?.(surveyId);
    }

    async markSurveyAsCompleted(surveyId: ID) {
        await this.syncManager.markSurveyAsCompleted(surveyId);
        this.context.listeners.onSurveyCompleted?.(surveyId);
    }

    async persistSurveyAnswers(surveyId: ID, questionId: ID, answers: SurveyAnswer[]) {
        await this.syncManager.persistSurveyAnswers(surveyId, questionId, answers);
        this.context.listeners.onQuestionAnswered?.(surveyId, questionId, answers);
    }
}

export * from "./types";
