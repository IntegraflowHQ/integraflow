import React, { useEffect, useState } from "react";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useRedirect } from "@/modules/auth/hooks/useRedirect";
import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser";
import { GlobalSpinner } from "@/ui";

export default function PublicRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const [ready, setReady] = useState(false);
    const { isAuthenticated } = useAuth();
    const { user } = useCurrentUser();
    const redirect = useRedirect();

    useEffect(() => {
        if (!isAuthenticated) {
            setReady(true);
            return;
        }

        if (isAuthenticated && user) {
            redirect(user);
        }
        setReady(true);
    }, [isAuthenticated, redirect, user]);

    if (!ready) {
        return <GlobalSpinner />;
    }

    return <>{children}</>;
}
