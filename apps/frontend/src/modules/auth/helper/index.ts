import { User } from "@/generated/graphql";
import { Session } from "@/modules/users/states/session";
import { DeepOmit } from "@apollo/client/utilities";
import { NavigateFunction } from "react-router-dom";

export const handleRedirect = (
    user: Session | DeepOmit<User, "__typename">,
    navigate: NavigateFunction,
) => {
    if (!user.organization) {
        navigate("/create-workspace");
    } else if (
        user.organization &&
        user.project &&
        user.project.hasCompletedOnboardingFor
    ) {
        navigate(`${user.organization.slug}/projects/${user.project.slug}`);
    } else if (
        user.organization &&
        user.project &&
        !user.project.hasCompletedOnboardingFor
    ) {
        navigate(
            `/${user.organization.slug}/projects/${user.project.slug}/get-started`,
        );
    }
};
