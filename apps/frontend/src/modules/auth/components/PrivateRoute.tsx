import { GlobalSpinner, NotFound } from "@/components";
import { createOrgDbs } from "@/database";
import { useAuthToken } from "@/modules/auth/hooks/useAuthToken";
import useUser from "@/modules/users/hooks/useSession";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";

type Props = {
    children: React.ReactNode;
};

export const PrivateRoute = ({ children }: Props) => {
    const { token } = useAuthToken();
    const { organizationSlug, projectSlug } = useParams();
    const { isValidating, isValidSession, user } = useUser(
        organizationSlug,
        projectSlug,
    );

    useEffect(() => {
        if (user) {
            createOrgDbs(user);
        }
    }, [user]);

    if (!token) {
        return <Navigate to="/" />;
    }

    if (isValidating) {
        return <GlobalSpinner />;
    }

    if (!isValidSession) {
        return <NotFound />;
    }

    return <>{children}</>;
};
