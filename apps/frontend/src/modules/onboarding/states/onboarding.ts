import { createSelectors } from "@/utils/selectors";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const status = {
    integrateSdk: {
        name: "Integrate SDK",
        completed: false,
    },
    identifyUsers: {
        name: "Identify your users",
        completed: false,
    },
    trackEvents: {
        name: "Track your events",
        completed: false,
    },
    publishFirstSurvey: {
        name: "Publish your first survey",
        completed: false,
    },
    connectIntegration: {
        name: "Connect your first integration",
        completed: false,
    },
};

export const onboardingSteps = Object.keys(status) as (keyof typeof status)[];
export type OnboardingStep = (typeof status)[keyof typeof status];

type EventSource = "web" | "mobile" | null;
type MobilePlatform = "android" | "ios" | "rn" | "flutter" | null;

export type OnboardingState = {
    status: typeof status;
    eventSource: EventSource;
    mobilePlatform: MobilePlatform;
};

export type OnboardingActions = {
    complete: (key: keyof typeof status) => void;
    clearEventSource: () => void;
    setEventSource: (eventSource: EventSource) => void;
    setMobilePlatform: (mobilePlatform: MobilePlatform) => void;
};

const initialState: OnboardingState = {
    status,
    eventSource: null,
    mobilePlatform: null,
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
    persist(
        (set, get) => ({
            ...initialState,
            complete: (key) => {
                const currentStatus = get().status;
                const currentStep = currentStatus[key];
                return set({
                    status: {
                        ...currentStatus,
                        [key]: {
                            ...currentStep,
                            completed: true,
                        },
                    },
                });
            },
            clearEventSource: () =>
                set({ eventSource: null, mobilePlatform: null }),
            setEventSource: (eventSource) => set({ eventSource }),
            setMobilePlatform: (mobilePlatform) => set({ mobilePlatform }),
        }),
        {
            name: "onboarding",
        },
    ),
);

export const useOnboarding = () => {
    const onboarding = createSelectors(useOnboardingStore);
    const status = onboarding.use.status();
    const eventSource = onboarding.use.eventSource();
    const mobilePlatform = onboarding.use.mobilePlatform();
    const complete = onboarding.use.complete();
    const clearEventSource = onboarding.use.clearEventSource();
    const setEventSource = onboarding.use.setEventSource();
    const setMobilePlatform = onboarding.use.setMobilePlatform();

    return {
        status,
        eventSource,
        mobilePlatform,
        complete,
        clearEventSource,
        setEventSource,
        setMobilePlatform,
    };
};
