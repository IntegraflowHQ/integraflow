import { AuthUser } from "@/generated/graphql";
import { NavigateFunction } from "react-router-dom";

export const handleLoginRedirect = (
    user: AuthUser,
    navigate: NavigateFunction,
) => {
    if (!user.organization) {
        navigate("/create-workspace");
    } else if (
        user.organization &&
        user.project &&
        user.project.hasCompletedOnboardingFor
    ) {
        navigate(`${user.organization.slug}/projects/${user.project.id}`);
    } else if (
        user.organization &&
        user.project &&
        !user.project.hasCompletedOnboardingFor
    ) {
        navigate(
            `/${user.organization.slug}/projects/${user.project.id}/get-started`,
        );
    }
};
