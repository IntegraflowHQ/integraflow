import { DeepPartial } from "@apollo/client/utilities";
import { useNavigate } from "react-router-dom";

import { AuthUser, User } from "@/generated/graphql";
import { ROUTES } from "@/routes";

export const useRedirect = () => {
    const navigate = useNavigate();

    const handleRedirect = (user: DeepPartial<User | AuthUser>) => {
        if (!user.organization) {
            navigate("/create-workspace");
        } else if (
            user.organization.slug &&
            user.project?.slug &&
            user.isOnboarded
        ) {
            navigate(
                ROUTES.SURVEY_LIST.replace(
                    ":orgSlug",
                    user.organization.slug,
                ).replace(":projectSlug", user?.project?.slug),
            );
        } else if (
            user.organization.slug &&
            user.project?.slug &&
            !user.isOnboarded
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
};
