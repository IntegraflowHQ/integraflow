import { User, useUserUpdateMutation } from "@/generated/graphql";
import useRedirect from "@/modules/auth/hooks/useRedirect";
import useUserState from "@/modules/users/hooks/useUserState";
import useWorkspaceState from "@/modules/workspace/hooks/useWorkspaceState";
import { createSelectors } from "@/utils/selectors";
import { DeepOmit } from "@apollo/client/utilities";
import { useEffect, useMemo } from "react";
import { useOnboardingStore } from "../states/onboarding";

export const useOnboarding = () => {
    const { workspace } = useWorkspaceState();
    const { user, updateUser } = useUserState();
    const redirect = useRedirect();
    const onboarding = createSelectors(useOnboardingStore);
    const steps = onboarding.use.steps();
    const eventSource = onboarding.use.eventSource();
    const mobilePlatform = onboarding.use.mobilePlatform();
    const currentTab = onboarding.use.currentTab();
    const clearEventSource = onboarding.use.clearEventSource();
    const setEventSource = onboarding.use.setEventSource();
    const setMobilePlatform = onboarding.use.setMobilePlatform();
    const switchTab = onboarding.use.switchTab();

    const [onboardUser, { loading: updatingUser }] = useUserUpdateMutation();

    const completionRate = useMemo(() => {
        if (!workspace?.project.hasCompletedOnboardingFor) return 0;
        const completedKeys = JSON.parse(
            workspace?.project.hasCompletedOnboardingFor,
        );
        let completedSteps = 0;
        steps.forEach((step) => {
            if (completedKeys.includes(step.key)) completedSteps++;
        });
        return (completedSteps / steps.length) * 100;
    }, [workspace?.project.hasCompletedOnboardingFor, steps]);

    useEffect(() => {
        if (!user) return;
        if (!user.isOnboarded && completionRate === 100) {
            onboardUser({
                variables: {
                    input: {
                        isOnboarded: true,
                    },
                },
                onCompleted: (data) => {
                    if (data.userUpdate?.user?.isOnboarded) {
                        const newUser = {
                            ...user,
                            isOnboarded: data.userUpdate.user.isOnboarded,
                        } as DeepOmit<User, "__typename">;
                        updateUser(newUser);
                        redirect(newUser);
                    }
                },
            });
        }
    }, [completionRate, user]);

    return {
        steps,
        completionRate,
        eventSource,
        mobilePlatform,
        currentTab,
        updatingUser,
        clearEventSource,
        setEventSource,
        setMobilePlatform,
        switchTab,
    };
};
