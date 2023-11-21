import { GlobalSpinner } from "@/components";
import { useSession } from "@/modules/users/hooks/useSession";
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
    const navigate = useNavigate();
    const { viewer, createSession } = useSession();

    useEffect(() => {
        if (!token) {
            setReady(true);
            return;
        }
        if (viewer) {
            handleRedirect(viewer, navigate);
        } else {
            const getCachedViewer = localStorage.getItem("viewer");
            if (getCachedViewer) {
                const cachedViewer = JSON.parse(getCachedViewer);
                createSession(cachedViewer);
                handleRedirect(cachedViewer, navigate);
            }
        }

        setReady(true);
    }, []);

    if (!ready) {
        return <GlobalSpinner />;
    }

    return <>{children}</>;
}
