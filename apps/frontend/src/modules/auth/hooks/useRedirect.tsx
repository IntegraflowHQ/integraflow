import { AuthUser, User } from "@/generated/graphql";
import { Workspace } from "@/modules/workspace/states/workSpace";
import { ROUTES } from "@/routes";
import { DeepOmit } from "@apollo/client/utilities";
import { useNavigate } from "react-router-dom";

export default function useRedirect() {
    const navigate = useNavigate();
    const handleRedirect = (
        user:
            | Workspace
            | DeepOmit<User | AuthUser, "__typename">
            | User
            | AuthUser,
    ) => {
        if (!user.organization || !user.project) {
            navigate("/create-workspace");
        } else if (
            (user.organization &&
                user.project &&
                user.project.hasCompletedOnboardingFor) ||
            (user as User | AuthUser)?.isOnboarded
        ) {
            navigate(
                ROUTES.SURVEY_LIST.replace(
                    ":orgSlug",
                    user.organization.slug,
                ).replace(":projectSlug", user?.project?.slug),
            );
        } else if (
            user.organization &&
            user.project &&
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
