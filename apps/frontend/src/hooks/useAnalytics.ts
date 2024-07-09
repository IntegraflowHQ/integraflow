import { useAuth } from "@/modules/auth/hooks/useAuth";
import { toast } from "@/utils/toast";
import posthog from "posthog-js";
import { useCallback } from "react";

type Props = {
    screen: string;
    feature: string;
    component: string;
};
export const useAnalytics = () => {
    const { user } = useAuth();

    const handleAnalytics = useCallback(
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

                toast.custom("We will let you know when this feature is implemented");
            }
        },
        [user],
    );

    return { handleAnalytics };
};
