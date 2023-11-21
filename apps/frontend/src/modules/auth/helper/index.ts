import { SessionViewer } from "@/types";
import { NavigateFunction } from "react-router-dom";

export const handleRedirect = (
    user: SessionViewer,
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
