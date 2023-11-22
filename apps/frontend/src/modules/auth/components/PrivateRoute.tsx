import { GlobalSpinner, NotFound } from "@/components";
import { createOrgDbs } from "@/database";
import { useAuthToken } from "@/modules/auth/hooks/useAuthToken";
import { useSession } from "@/modules/users/hooks/useSession";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import useValidateOrgUrl from "../hooks/useValidateOrgUrl";

type Props = {
    children: React.ReactNode;
};

export const PrivateRoute = ({ children }: Props) => {
    const { token } = useAuthToken();
    const { viewer } = useSession();
    const { organizationSlug, projectSlug } = useParams();
    const { ready, loading, invalidUrl } = useValidateOrgUrl(
        organizationSlug,
        projectSlug,
    );

    useEffect(() => {
        if (viewer) {
            localStorage.setItem("viewer", JSON.stringify(viewer));
            createOrgDbs(viewer);
        }
    }, [viewer]);

    if (!token) {
        return <Navigate to="/" />;
    }

    if (!ready || loading) {
        return <GlobalSpinner />;
    }

    if (invalidUrl) {
        return <NotFound />;
    }

    return <>{children}</>;
};
