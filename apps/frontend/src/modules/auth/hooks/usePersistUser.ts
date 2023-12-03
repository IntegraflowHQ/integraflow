import { User, useViewerLazyQuery } from "@/generated/graphql";
import useSessionState from "@/modules/users/hooks/useSessionState";
import useUserState from "@/modules/users/hooks/useUserState";
import { Session } from "@/modules/users/states/session";
import { omitTypename } from "@/utils";
import useRedirect from "./useRedirect";

export const usePersistUser = () => {
    const { updateUser } = useUserState();
    const redirect = useRedirect();
    const { updateSession } = useSessionState();
    return useViewerLazyQuery({
        onCompleted: ({ viewer }) => {
            if (!viewer) {
                return;
            }

            const cleanViewer = omitTypename(viewer as User);
            updateUser(cleanViewer);
            if (cleanViewer.organization && cleanViewer.project) {
                updateSession({
                    organization: cleanViewer.organization,
                    project: cleanViewer.project,
                } as Session);
            } else {
                redirect(cleanViewer);
            }
        },
    });
};
