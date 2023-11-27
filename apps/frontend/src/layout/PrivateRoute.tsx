import { GlobalSpinner, NotFound } from "@/components";
import { createOrgDbs } from "@/database";
import { useAuthToken } from "@/modules/auth/hooks/useAuthToken";
import useSession from "@/modules/users/hooks/useSession";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

type Props = {
    children: React.ReactNode;
};

export const PrivateRoute = ({ children }: Props) => {
    const { token } = useAuthToken();

    const { isValidating, isValidSession, user } = useSession();

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
