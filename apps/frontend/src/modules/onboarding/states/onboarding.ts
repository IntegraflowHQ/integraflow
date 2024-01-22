import { create } from "zustand";

export type OnboardingStep = {
    key: string;
    name: string;
};

export const steps: OnboardingStep[] = [
    {
        key: "integrate",
        name: "Integrate SDK",
    },
    {
        key: "identify",
        name: "Identify your users",
    },
    {
        key: "track",
        name: "Track your events",
    },
    {
        key: "publish",
        name: "Publish your first survey",
    },
    {
        key: "connect",
        name: "Connect your first integration",
    },
];

type EventSource = "web" | "mobile" | null;
type MobilePlatform = "android" | "ios" | "rn" | "flutter" | null;

export type OnboardingState = {
    steps: OnboardingStep[];
    eventSource: EventSource;
    mobilePlatform: MobilePlatform;
    currentTab: string;
};

export type OnboardingActions = {
    clearEventSource: () => void;
    setEventSource: (eventSource: EventSource) => void;
    setMobilePlatform: (mobilePlatform: MobilePlatform) => void;
    switchTab: (tab: string) => void;
};

const initialState: OnboardingState = {
    steps,
    eventSource: null,
    mobilePlatform: null,
    currentTab: steps[0].name,
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
    (set) => ({
        ...initialState,
        clearEventSource: () =>
            set({ eventSource: null, mobilePlatform: null }),
        setEventSource: (eventSource) => set({ eventSource }),
        setMobilePlatform: (mobilePlatform) => set({ mobilePlatform }),
        switchTab: (tab) => set({ currentTab: tab }),
    }),
);
