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
export type OnboardingStepKey = keyof typeof status;

type EventSource = "web" | "mobile" | null;
type MobilePlatform = "android" | "ios" | "rn" | "flutter" | null;

export type OnboardingState = {
    status: typeof status;
    eventSource: EventSource;
    mobilePlatform: MobilePlatform;
    currentTab: OnboardingStepKey;
};

export type OnboardingActions = {
    complete: (key: OnboardingStepKey) => void;
    clearEventSource: () => void;
    setEventSource: (eventSource: EventSource) => void;
    setMobilePlatform: (mobilePlatform: MobilePlatform) => void;
    switchTab: (tab: OnboardingStepKey) => void;
};

const initialState: OnboardingState = {
    status,
    eventSource: null,
    mobilePlatform: null,
    currentTab: "integrateSdk",
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
            switchTab: (tab) => set({ currentTab: tab }),
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
    const currentTab = onboarding.use.currentTab();
    const complete = onboarding.use.complete();
    const clearEventSource = onboarding.use.clearEventSource();
    const setEventSource = onboarding.use.setEventSource();
    const setMobilePlatform = onboarding.use.setMobilePlatform();
    const switchTab = onboarding.use.switchTab();

    return {
        status,
        eventSource,
        mobilePlatform,
        currentTab,
        complete,
        clearEventSource,
        setEventSource,
        setMobilePlatform,
        switchTab,
    };
};
