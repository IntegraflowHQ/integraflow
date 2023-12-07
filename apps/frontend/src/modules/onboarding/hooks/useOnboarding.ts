import useSessionState from "@/modules/users/hooks/useSessionState";
import { createSelectors } from "@/utils/selectors";
import { useMemo } from "react";
import { useOnboardingStore } from "../states/onboarding";

export const useOnboarding = () => {
    const onboarding = createSelectors(useOnboardingStore);
    const steps = onboarding.use.steps();
    const eventSource = onboarding.use.eventSource();
    const mobilePlatform = onboarding.use.mobilePlatform();
    const currentTab = onboarding.use.currentTab();
    const clearEventSource = onboarding.use.clearEventSource();
    const setEventSource = onboarding.use.setEventSource();
    const setMobilePlatform = onboarding.use.setMobilePlatform();
    const switchTab = onboarding.use.switchTab();
    const { session } = useSessionState();
    const completionRate = useMemo(() => {
        if (!session?.project.hasCompletedOnboardingFor) return 0;
        const completedKeys = JSON.parse(
            session?.project.hasCompletedOnboardingFor,
        );
        let completedSteps = 0;
        steps.forEach((step) => {
            if (completedKeys.includes(step.key)) completedSteps++;
        });
        return (completedSteps / steps.length) * 100;
    }, [session?.project.hasCompletedOnboardingFor, steps]);

    return {
        steps,
        completionRate,
        eventSource,
        mobilePlatform,
        currentTab,
        clearEventSource,
        setEventSource,
        setMobilePlatform,
        switchTab,
    };
};
