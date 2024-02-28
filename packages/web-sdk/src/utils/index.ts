import { BaseSurveyCountableConnection, IntegraflowDocument } from "@integraflow/sdk";
import { Audience, LogicOperator, Question, QuestionOption, Survey, SurveySettings, Theme, Trigger } from "../types";

export function onDOMReady(fn: () => void) {
    if (document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

export function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export function deferSurveyActivation(survey: Survey, activateFn: (survey: Survey) => void) {
    if (survey.trigger?.delay === undefined || survey.trigger.delay < 0) {
        return false;
    }

    console.info("Deferring survey activation by " + survey.trigger.delay);

    setTimeout(activateFn, survey.trigger.delay * 1000, survey);

    return true;
}

// See: https://stackoverflow.com/a/2117523
export function uuidv4() {
    if (typeof crypto === "undefined") {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    return ((1e7).toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16)
    );
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
export function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function propConditionsMatched(conditions: boolean[], operator: LogicOperator) {
    let conditionMatched = conditions.some(matched => matched);
    if (operator === LogicOperator.AND) {
        conditionMatched = conditions.every(matched => matched);
    }

    return conditionMatched;
}

function shuffle(options: QuestionOption[]) {
    for (let i = 0; i < options.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
}

export function shuffleArray(options: QuestionOption[], shuffleOption: "all" | "exceptLast") {
    const optionsCopy = [...options];

    if (shuffleOption === "all") {
        shuffle(optionsCopy);
    } else if (shuffleOption === "exceptLast") {
        const lastElement = optionsCopy.pop();
        shuffle(optionsCopy);

        optionsCopy.push(lastElement as QuestionOption);
    }

    return optionsCopy;
}

export function calculateTextColor(color: string) {
    let r: number = 0,
        g: number = 0,
        b: number = 0;
    if (color.length === 4) {
        r = parseInt(color[1] + color[1], 16);
        g = parseInt(color[2] + color[2], 16);
        b = parseInt(color[3] + color[3], 16);
    } else if (color.length === 7) {
        r = parseInt(color[1] + color[2], 16);
        g = parseInt(color[3] + color[4], 16);
        b = parseInt(color[5] + color[6], 16);
    }

    const luminance = r * 0.299 + g * 0.587 + b * 0.114 > 128;
    return luminance ? "#000" : "#fff";
}

export function hexToRgba(hex: string, opacity: number): string {
    let hexWithoutHash = hex.startsWith("#") ? hex.slice(1) : hex;

    if (hexWithoutHash.length === 3) {
        // Expand short hex format (#RGB) to full format (#RRGGBB)
        hexWithoutHash = hexWithoutHash
            .split("")
            .map(char => char + char)
            .join("");
    }

    const red = parseInt(hexWithoutHash.slice(0, 2), 16);
    const green = parseInt(hexWithoutHash.slice(2, 4), 16);
    const blue = parseInt(hexWithoutHash.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

export const parsedSurveys = (surveys?: BaseSurveyCountableConnection): Survey[] => {
    if (!surveys) {
        return [] as Survey[];
    }

    const surveyList: Survey[] = [];

    for (let i = 0; i < surveys.nodes.length; i++) {
        const survey = surveys.nodes[i];

        const questions: Question[] = survey.questions.map(question => {
            let parsedSettings = question.settings ?? {};
            let parsedOptions = question.options ?? [];

            if (typeof parsedSettings === "string") {
                parsedSettings = JSON.parse(parsedSettings);
            }

            if (typeof parsedOptions === "string") {
                parsedOptions = JSON.parse(parsedOptions) as QuestionOption[];
            }

            return ({
                ...question,
                type: question.type.toLowerCase(),
                settings: parsedSettings,
                options: parsedOptions
            } as unknown) as Question;
        });

        const channel = survey.channels.find(channel => {
            return channel.type === IntegraflowDocument.SurveyChannelTypeEnum.WebSdk;
        }) || { settings: "{}", conditions: "{}", triggers: "{}" };
        const channelSettings = JSON.parse(channel?.settings ?? "{}");
        const settings = JSON.parse(survey.settings ?? "{}");
        const surveySettings: SurveySettings = {
            placement: channelSettings.placement,
            recurring: channelSettings.recurring ?? false,
            recurringPeriod: channelSettings.recurringPeriod ?? 0,
            showProgressBar: settings.showProgressBar ?? true,
            close: settings.close,
            submitText: settings.submitText,
            showBranding: settings.showBranding
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
            theme
        });
    }

    return JSON.parse(JSON.stringify(surveyList));
};

function getDeviceType() {
    const ua: string = navigator.userAgent.toLowerCase();

    if (/mobile|iphone|ipod|android|blackberry|opera mini|opera mobi|iemobile|windows phone|kindle/i.test(ua)) {
        return "Mobile";
    } else if (/ipad|tablet/i.test(ua)) {
        return "Tablet";
    } else if (/win|mac|linux|x11/i.test(ua)) {
        return "Desktop";
    } else {
        return "Unknown";
    }
}

function getOperatingSystem() {
    const ua: string = navigator.userAgent;
    let os: string = "Unknown";
    let version: string = "Unknown";

    if (/Windows/.test(ua)) {
        os = "Windows";
        const match = /Windows NT (\d+\.\d+)/.exec(ua);
        version = match ? match[1] : "Unknown";
    } else if (/Mac OS X/.test(ua)) {
        os = "Mac OS X";
        const match = /Mac OS X (\d+[\._]\d+)/.exec(ua);
        version = match ? match[1].replace("_", ".") : "Unknown";
    } else if (/Linux/.test(ua)) {
        os = "Linux";
        const match = /Linux(?: x86_64)?(?:; ([^;]+))?/.exec(ua);
        version = match ? match[1] || "Unknown" : "Unknown";
    } else if (/Android/.test(ua)) {
        os = "Android";
        const match = /Android ([^;)]+)/.exec(ua);
        version = match ? match[1] : "Unknown";
    } else if (/iOS|iPhone|iPad/.test(ua)) {
        os = "iOS";
        const match = /OS (\d+[_\d]*)/.exec(ua);
        version = match ? match[1].replace("_", ".") : "Unknown";
    }

    return {
        os,
        version
    };
}

function getBrowser() {
    const ua: string = navigator.userAgent;
    let tem: RegExpMatchArray | null;
    let browser: string;
    let version: string;

    const matchArray = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(matchArray[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua);
        browser = "IE";
        version = tem ? tem[1] : "";
    } else if (matchArray[1] === "Chrome") {
        tem = ua.match(/\b(OPR|Edg)\/(\d+)/);
        if (tem !== null) {
            browser = tem[1].replace("OPR", "Opera").replace("Edg", "Edge");
            version = tem[2];
        } else {
            browser = matchArray[1];
            version = matchArray[2] || "";
        }
    } else {
        browser = matchArray[1];
        version = matchArray[2] || "";
    }

    return {
        browser,
        version
    };
}

export function getEventAttributes() {
    if (typeof window === "undefined") {
        return {};
    }

    const browser = getBrowser();
    const os = getOperatingSystem();

    return {
        os: os.os,
        os_version: os.version,
        browser: browser.browser,
        browser_version: browser.version,
        device_type: getDeviceType()
    };
}

export function getUserAttributes() {
    if (typeof window === "undefined") {
        return {};
    }

    const browser = getBrowser();
    const os = getOperatingSystem();

    return {
        os: os.os,
        os_version: os.version,
        browser: browser.browser,
        browser_version: browser.version,
        browser_language: navigator.language,
        device_type: getDeviceType(),
        screen_height: window.screen.height.toString(),
        screen_width: window.screen.width.toString(),
        viewport_height: window.innerHeight.toString(),
        viewport_width: window.innerWidth.toString(),
        raw_user_agent: navigator.userAgent,
        current_url: window.location.href,
        host: window.location.host,
        pathname: window.location.pathname,
        time: new Date().toISOString(),
        lib: "web-sdk",
        lib_version: process.env.VERSION ?? "Unknown",
        bucket: Math.ceil(Math.random() * 1000)
    };
}
