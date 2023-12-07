import { AuthUser, User } from "@/generated/graphql";
import { Session } from "@/modules/users/states/session";
import { DeepOmit } from "@apollo/client/utilities";
import { useNavigate } from "react-router-dom";

export default function useRedirect() {
    const navigate = useNavigate();
    const handleRedirect = (
        user:
            | Session
            | DeepOmit<User | AuthUser, "__typename">
            | User
            | AuthUser,
    ) => {
        if (!user.organization) {
            navigate("/create-workspace");
        } else if (
            user.organization &&
            user.project &&
            user.project.hasCompletedOnboardingFor
        ) {
            navigate(
                `/${user.organization.slug}/projects/${user.project.slug}`,
            );
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
    return handleRedirect;
}
