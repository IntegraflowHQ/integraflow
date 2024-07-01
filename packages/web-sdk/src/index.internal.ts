import Integraflow from ".";
import { _SurveyManager } from "./surveys/index.internal";
import { Configuration, ID, Survey } from "./types";

export default class _Integraflow extends Integraflow {
    protected readonly surveyManager: _SurveyManager;
    protected static client: _Integraflow;

    constructor(config: Configuration) {
        super(config);
        this.surveyManager = new _SurveyManager(this, this.context, this.rootFrame);
    }

    static init(config: Configuration) {
        if (!this.client) {
            this.client = new _Integraflow(config);
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

    updateSurvey(survey: Survey, startFrom?: ID) {
        this.surveyManager.updateActiveSurvey(survey, startFrom);
    }
}

export * from "./types";
