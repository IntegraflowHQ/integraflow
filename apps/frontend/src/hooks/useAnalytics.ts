import { useAuth } from "@/modules/auth/hooks/useAuth";
import posthog from "posthog-js";
import { useCallback } from "react";

export enum AnalyticsEnum {
    NOTIFY_ME = "Notify Me",
    UPDATE_SURVEY_STATUS = "Update Survey Status",
    CREATE_SURVEY = "Create Survey",
}

type Props = {
    screen?: string;
    feature?: string;
    component?: string;
};
export const useAnalytics = () => {
    const { user } = useAuth();

    const capture = useCallback(
        (action: string, properties: Props) => {
            if (user) {
                posthog.capture(action, properties, {
                    $set_once: {
                        email: user.email,
                    },
                    $set: {
                        organization: { name: user.organization?.name, slug: user.organization?.slug },
                        project: { name: user.project?.name, slug: user.project?.slug },
                        name: { firstName: user.firstName, lastName: user.lastName },
                    },
                });
            }
        },
        [user],
    );

    return { capture };
};
