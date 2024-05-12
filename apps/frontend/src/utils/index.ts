import { PROPERTY_FIELDS } from "@/constants";
import { ProjectTheme, SurveyChannel, SurveyQuestion } from "@/generated/graphql";
import { FilterOperator, ParsedChannel, ParsedQuestion, ParsedTheme, QuestionOption } from "@/types";
import { DeepOmit } from "@apollo/client/utilities";
import { toast } from "./toast";

export function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export function generateUniqueId() {
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substr(2, 5); // 5 character random string

    return `${timestamp}-${random}`;
}

export function omitTypename<T>(obj: T): DeepOmit<T, "__typename"> {
    return JSON.parse(JSON.stringify(obj), (key: string, value: any) => (key === "__typename" ? undefined : value));
}

export function isOver24Hours(previousTimestamp: number): boolean {
    const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
    const currentTimestamp = Date.now();
    const timeDifference = currentTimestamp - previousTimestamp;

    return timeDifference > twentyFourHoursInMilliseconds;
}

export function getAcronym(value: string) {
    return value.slice(0, 1).toUpperCase();
}

export const copyToClipboard = (textToCopy: string, toastMessage: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast.success(toastMessage);
};

export function addEllipsis(text: string, maxLength: number) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    } else {
        return text;
    }
}

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const generateRandomString = (length: number) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const getHighestOrderNumber = (array: QuestionOption[]) => {
    const orderNumbers = array.map((item) => item.orderNumber);
    return Math.max(...orderNumbers);
};

export const toSurveyChannel = (channel: ParsedChannel): SurveyChannel => {
    return {
        ...channel,
        settings: JSON.stringify(channel.settings ?? {}),
        triggers: JSON.stringify(channel.triggers ?? {}),
        conditions: JSON.stringify(channel.conditions ?? {}),
    };
};

export const fromSurveyChannel = (channel: SurveyChannel): ParsedChannel => {
    return {
        ...channel,
        settings: JSON.parse(channel.settings ?? "{}"),
        triggers: JSON.parse(channel.triggers ?? "{}"),
        conditions: JSON.parse(channel.conditions ?? "{}"),
    };
};

export const parseQuestion = (question: SurveyQuestion): ParsedQuestion => {
    let parsedSettings = question.settings ?? {};
    let parsedOptions = question.options ?? [];

    if (typeof parsedSettings === "string") {
        parsedSettings = JSON.parse(parsedSettings);
    }

    if (typeof parsedOptions === "string") {
        parsedOptions = JSON.parse(parsedOptions);
    }

    return {
        ...question,
        settings: parsedSettings,
        options: parsedOptions,
    } as ParsedQuestion;
};

export const getFilterLabel = (operator: FilterOperator) => {
    const operators = Object.values(PROPERTY_FIELDS).reduce((acc, curr) => [...acc, ...curr], []);
    const operatorObj = operators.find((o) => o.operator === operator);
    return operatorObj?.label;
};

export const stripHtmlTags = (value: string): string => {
    return value.replace(/<[^>]*>/g, "");
};

export const parseTheme = (theme: ProjectTheme) => {
    const newThemeData = { ...theme };
    if (typeof newThemeData.colorScheme === "string") {
        newThemeData.colorScheme = JSON.parse(theme.colorScheme);
    }
    return newThemeData as ParsedTheme;
};

export const themeKeys = ["background", "progressBar", "question", "answer", "button"] as const;
