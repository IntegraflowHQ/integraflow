import { useViewerLazyQuery } from "@/generated/graphql";
import { SessionViewer } from "@/types";
import { omitTypename } from "@/utils";
import { logDebug } from "@/utils/log";
import { useEffect, useState } from "react";
import { useSession } from "./useSession";

export default function useUser() {
    const { viewer, createSession } = useSession();
    const [user, setUser] = useState(viewer);
    const [isLatest, setIsLatest] = useState(false);
    const [fetchViewer] = useViewerLazyQuery();

    useEffect(() => {
        const getUser = async () => {
            if (!user) {
                logDebug("No viewer, checking local storage...");
                const getCachedViewer = localStorage.getItem("viewer");
                if (getCachedViewer) {
                    const localStorageUser = JSON.parse(
                        getCachedViewer,
                    ) as SessionViewer;
                    setUser(localStorageUser);
                    createSession(localStorageUser);
                } else {
                    logDebug("No viewer in local storage, fetching viewer...");
                    await fetchViewer({
                        onCompleted: ({ viewer }) => {
                            logDebug("Gotten viewer, updating session...");
                            setUser(omitTypename(viewer));
                            createSession(omitTypename(viewer));
                            setIsLatest(true);
                        },
                    });
                }
            }
        };

        getUser();
    }, []);

    return { user, isLatest };
}
