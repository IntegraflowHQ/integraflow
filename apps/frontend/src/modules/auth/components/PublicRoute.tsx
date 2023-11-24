import { GlobalSpinner } from "@/components";
import { User, useViewerLazyQuery } from "@/generated/graphql";
import useSession from "@/modules/users/hooks/useSession";
import { Session } from "@/modules/users/states/session";
import { omitTypename } from "@/utils";
import { logDebug } from "@/utils/log";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleRedirect } from "../helper";
import { useAuthToken } from "../hooks/useAuthToken";

export default function PublicRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const [ready, setReady] = useState(false);
    const { token } = useAuthToken();
    const { session, isValidSession, user, createSession, updateUser } =
        useSession();
    const navigate = useNavigate();
    const [fetchUser] = useViewerLazyQuery();

    useEffect(() => {
        if (!token) {
            setReady(true);
            return;
        }

        if (!user) {
            logDebug("No user, fetching user...");
            fetchUser({
                onCompleted: ({ viewer }) => {
                    if (viewer) {
                        logDebug("Gotten user, updating session...");
                        const newUser = omitTypename(viewer as User);
                        updateUser(newUser);
                        createSession({
                            organization: newUser?.organization,
                            project: newUser?.project,
                        } as Session);
                        handleRedirect(newUser, navigate);
                    }
                },
            });
        }

        if (!session && user) {
            logDebug("No session, creating session from user...");
            const newSession = {
                organization: user.organization,
                project: user.project,
            } as Session;

            createSession(newSession);
            handleRedirect(newSession, navigate);
        }

        if (session && isValidSession) {
            handleRedirect(session, navigate);
        }

        setReady(true);
    }, [session, user, isValidSession]);

    if (!ready) {
        return <GlobalSpinner />;
    }

    return <>{children}</>;
}
