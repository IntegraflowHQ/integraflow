import { GlobalSpinner } from "@/components";
import { useAuthToken } from "@/modules/auth/hooks/useAuthToken";
import useRedirect from "@/modules/auth/hooks/useRedirect";
import useSession from "@/modules/users/hooks/useSession";
import React, { useEffect, useState } from "react";

export default function PublicRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const [ready, setReady] = useState(false);
    const { token } = useAuthToken();
    const { session, isValidSession, createValidSessionData, createSession } =
        useSession();
    const redirect = useRedirect();

    useEffect(() => {
        const onMount = async () => {
            if (!token) {
                setReady(true);
                return;
            }

            if (session && isValidSession) {
                redirect(session);
            } else {
                const newSession = await createValidSessionData();
                if (newSession) {
                    createSession(newSession);
                }
            }
            setReady(true);
        };

        onMount();
    }, [session, isValidSession]);

    if (!ready) {
        return <GlobalSpinner />;
    }

    return <>{children}</>;
}
