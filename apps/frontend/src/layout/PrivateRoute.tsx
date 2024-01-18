import { NotFound } from "@/components/NotFound";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useProject } from "@/modules/projects/hooks/useProject";
import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser";
import { useWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import { ROUTES } from "@/routes";
import { GlobalSpinner } from "@/ui";
import { Navigate, useParams } from "react-router-dom";

type Props = {
    children: React.ReactNode;
};

export const PrivateRoute = ({ children }: Props) => {
    const { isAuthenticated } = useAuth();
    const { loading } = useCurrentUser();
    const { workspace } = useWorkspace();
    const { project } = useProject();
    const { orgSlug, projectSlug } = useParams();

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    if (loading) {
        return <GlobalSpinner />;
    }

    if (orgSlug && !workspace) {
        return <NotFound />;
    }

    if (orgSlug && projectSlug && (!workspace || !project)) {
        return <NotFound />;
    }

    if (orgSlug && !projectSlug && workspace?.slug && project?.slug) {
        return (
            <Navigate
                to={ROUTES.SURVEY_LIST.replace(
                    ":orgSlug",
                    workspace.slug,
                ).replace(":projectSlug", project.slug)}
            />
        );
    }

    return <>{children}</>;
};
