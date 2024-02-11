import { IntegraflowClient } from "@integraflow/sdk";
import { Configuration, Listeners, State, Survey } from "../types";

type SdkEventType = "eventTracked" | "audienceUpdated";
export type SdkEvent<T = any> = { type: SdkEventType; data: T };
type SdkEventHandler = (event: SdkEvent) => void;

export class Context {
    readonly debug: boolean;
    readonly listeners: Listeners;
    client: IntegraflowClient;

    private readonly subscribers: { [key: string]: SdkEventHandler[] };

    surveys: Survey[];
    state: State | null;
    syncPolicy: Configuration["syncPolicy"];
    fullScreen: boolean;

    constructor(config: Configuration) {
        this.surveys = config.surveys ?? [];

        this.debug = config.debug || false;
        this.listeners = {
            onAudienceChanged: config.onAudienceChanged,
            onEventTracked: config.onEventTracked,
            onSurveyDisplayed: config.onSurveyDisplayed,
            onSurveyClosed: config.onSurveyClosed,
            onQuestionAnswered: config.onQuestionAnswered,
            onSurveyCompleted: config.onSurveyCompleted
        };

        this.client = new IntegraflowClient({
            apiUrl: config.apiHost ? `${config.apiHost}/graphql` : undefined,
            apiKey: config.appKey
        });

        this.subscribers = {};
        this.state = null;
        this.syncPolicy = config.syncPolicy ?? "polling";
        this.fullScreen = config.fullScreen ?? false;
    }

    setState(state: State) {
        this.state = state;
    }

    subscribe(event: SdkEventType, handler: SdkEventHandler) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }

        if (this.subscribers[event].indexOf(handler) > -1) {
            return;
        }

        this.subscribers[event].push(handler);
    }

    broadcast(event: SdkEventType, data: any) {
        if (!this.subscribers[event]) {
            return;
        }

        for (let i = 0; i < this.subscribers[event].length; ++i) {
            this.subscribers[event][i]({
                type: event,
                data
            });
        }
    }
}
