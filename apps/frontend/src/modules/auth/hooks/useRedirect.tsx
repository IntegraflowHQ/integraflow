import { DeepPartial } from "@apollo/client/utilities";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/routes";
import { AuthUser, User } from "@/generated/graphql";

export default function useRedirect() {
    const navigate = useNavigate();

    const handleRedirect = (user: DeepPartial<User | AuthUser>) => {
        if (!user.organization) {
            navigate("/create-workspace");
        } else if (
            user.organization.slug &&
            user.project?.slug &&
            (user.project.hasCompletedOnboardingFor || user.isOnboarded)
        ) {
            navigate(
                ROUTES.SURVEY_LIST.replace(
                    ":orgSlug",
                    user.organization.slug,
                ).replace(":projectSlug", user.project.slug),
            );
        } else if (
            user.organization.slug &&
            user.project?.slug &&
            !user.project.hasCompletedOnboardingFor
        ) {
            navigate(
                ROUTES.GET_STARTED.replace(
                    ":orgSlug",
                    user.organization.slug,
                ).replace(":projectSlug", user.project.slug),
            );
        }
    };

    return handleRedirect;
}
