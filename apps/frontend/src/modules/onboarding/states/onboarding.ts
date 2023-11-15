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

export type OnboardingState = {
    status: typeof status;
};

export type OnboardingActions = {
    complete: (key: keyof typeof status) => void;
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
    persist(
        (set, get) => ({
            status,
            complete: (key) => {
                const currentStatus = get().status;
                const currentStep = currentStatus[key];
                set({
                    status: {
                        ...currentStatus,
                        [key]: {
                            ...currentStep,
                            completed: true,
                        },
                    },
                });
            },
        }),
        {
            name: "onboarding",
        },
    ),
);

export const useOnboarding = () => {
    const onboarding = createSelectors(useOnboardingStore);
    const status = onboarding.use.status();
    const complete = onboarding.use.complete();

    return { status, complete };
};
