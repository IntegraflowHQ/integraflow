import { useRedirect } from "@/modules/auth/hooks/useRedirect";
import { useProject } from "@/modules/projects/hooks/useProject";
import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useOnboardingStore } from "../states/onboarding";

export const useOnboarding = () => {
    const { project, updateProject } = useProject();
    const { user, updateUser } = useCurrentUser();
    const redirect = useRedirect();
    const {
        steps,
        eventSource,
        mobilePlatform,
        currentTab,
        clearEventSource,
        setEventSource,
        setMobilePlatform,
        switchTab
    } = useOnboardingStore();

    const [loading, setLoading] = useState(false);

    const completedKeys = useMemo(() => {
        if (!project?.hasCompletedOnboardingFor) {
            return [];
        }

        return JSON.parse(project.hasCompletedOnboardingFor) as string[];
    }, [project?.hasCompletedOnboardingFor]);

    const completionRate = useMemo(() => {
        if (!project?.hasCompletedOnboardingFor) {
            return 0;
        }

        let completedSteps = 0;
        steps.forEach((step) => {
            if (completedKeys.includes(step.key)) {
                completedSteps++;
            }
        });

        return (completedSteps / steps.length) * 100;
    }, [completedKeys, project?.hasCompletedOnboardingFor, steps]);

    const onboardUser = useCallback(async () => {
        setLoading(true);
        await updateUser({
            isOnboarded: true
        });

        setLoading(false);

        redirect({
            ...user,
            isOnboarded: true
        });
    }, [updateUser, user, redirect]);

    const markAsCompleted = useCallback(async (index: number) => {
        const updatedKeys = [...completedKeys];
        if (updatedKeys.includes(steps[index].key)) {
            return;
        }
        updatedKeys.push(steps[index].key);

        await updateProject({
            hasCompletedOnboardingFor: JSON.stringify(updatedKeys),
        });
    }, [completedKeys, steps, updateProject]);

    useEffect(() => {
        if (user.isOnboarded) {
            return;
        }

        if (!user.isOnboarded && completionRate === 100) {
            onboardUser();
        }
    }, [completionRate, onboardUser, user.isOnboarded]);

    return {
        steps,
        completedKeys,
        completionRate,
        eventSource,
        mobilePlatform,
        currentTab,
        loading,
        onboardUser,
        clearEventSource,
        setEventSource,
        setMobilePlatform,
        switchTab,
        markAsCompleted
    };
};
