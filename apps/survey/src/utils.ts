import { BaseSurvey, IntegraflowDocument } from "@integraflow/client";
import { Audience, Question, QuestionOption, Survey, SurveySettings, Theme, Trigger } from "integraflow-js";

export const parsedSurveys = (
    survey?: BaseSurvey,
    options?: { mode?: "sdk" | "link"; backgroundImage?: string; link?: string }
): Survey[] => {
    if (!survey) {
        return [] as Survey[];
    }

    const surveyList: Survey[] = [];

    const questions: Question[] = survey.questions.map((question) => {
        let parsedSettings = question.settings ?? {};
        let parsedOptions = question.options ?? [];

        if (typeof parsedSettings === "string") {
            parsedSettings = JSON.parse(parsedSettings);
        }

        if (typeof parsedOptions === "string") {
            parsedOptions = JSON.parse(parsedOptions) as QuestionOption[];
        }

        return {
            ...question,
            type: question.type.toLowerCase(),
            settings: parsedSettings,
            options: parsedOptions,
        } as unknown as Question;
    });

    const channel = survey.channels.find((channel) => {
        if (options?.link) {
            return channel.link === options.link;
        }
        return channel.type === IntegraflowDocument.SurveyChannelTypeEnum.WebSdk;
    }) || { settings: "{}", conditions: "{}", triggers: "{}" };
    const channelSettings = JSON.parse(channel?.settings ?? "{}");
    const settings = JSON.parse(survey.settings ?? "{}");
    const surveySettings: SurveySettings = {
        placement: channelSettings.placement ?? "bottomRight",
        recurring: !options?.link ? true : channelSettings.recurring ?? false,
        recurringPeriod: channelSettings.recurringPeriod ?? 0,
        showProgressBar: settings.showProgressBar ?? true,
        close: settings.close,
        submitText: settings.submitText,
        showBranding: settings.showBranding,
        backgroundOverlay: options?.mode === "sdk" ? channelSettings.backgroundOverlay : "none",
        backgroundImage: options?.mode === "link" ? options?.backgroundImage ?? "" : "",
    };

    const audience: Audience = JSON.parse(channel.conditions ?? "{}");
    const trigger: Trigger = JSON.parse(channel.triggers ?? "{}");
    const theme: Theme = JSON.parse(survey.theme?.colorScheme ?? "{}");

    surveyList.push({
        id: survey.id,
        name: survey.name,
        questions: questions,
        trigger: trigger,
        audience: audience,
        settings: surveySettings,
        theme,
    });

    return JSON.parse(JSON.stringify(surveyList));
};
