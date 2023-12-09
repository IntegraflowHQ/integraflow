import { useAuthToken } from "@/modules/auth/hooks/useAuthToken";
import useRedirect from "@/modules/auth/hooks/useRedirect";
import useUserState from "@/modules/users/hooks/useUserState";
import useWorkspace from "@/modules/workspace/hooks/useWorkspace";
import { GlobalSpinner } from "@/ui";
import React, { useEffect, useState } from "react";

export default function PublicRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const [ready, setReady] = useState(false);
    const { token } = useAuthToken();
    const { user } = useUserState();
    const {
        workspace,
        isValidWorkspace,
        createValidWorkspaceData,
        switchWorkspace,
    } = useWorkspace();
    const redirect = useRedirect();

    useEffect(() => {
        const onMount = async () => {
            if (!token) {
                setReady(true);
                return;
            }

            if (workspace && isValidWorkspace) {
                redirect(workspace);
            } else {
                const newWorkspace = await createValidWorkspaceData();
                if (newWorkspace) {
                    switchWorkspace(newWorkspace);
                } else if (user) {
                    redirect(user);
                }
            }
            setReady(true);
        };

        onMount();
    }, [workspace, isValidWorkspace, user]);

    if (!ready) {
        return <GlobalSpinner />;
    }

    return <>{children}</>;
}
