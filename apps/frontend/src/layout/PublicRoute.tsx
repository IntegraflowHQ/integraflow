import React, { useEffect, useState } from "react";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import useRedirect from "@/modules/auth/hooks/useRedirect";
import { GlobalSpinner } from "@/ui";
import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser";

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
        const onMount = async () => {
            if (!isAuthenticated) {
                setReady(true);
                return;
            }

            if (isAuthenticated && user) {
                redirect(user);
            }
            setReady(true);
        };

        onMount();
    }, [isAuthenticated, redirect, user]);

    if (!ready) {
        return <GlobalSpinner />;
    }

    return <>{children}</>;
}
