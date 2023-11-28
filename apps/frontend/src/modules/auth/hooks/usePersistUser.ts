import { User, useViewerLazyQuery } from "@/generated/graphql";
import useSessionState from "@/modules/users/hooks/useSessionState";
import useUserState from "@/modules/users/hooks/useUserState";
import { Session } from "@/modules/users/states/session";
import { omitTypename } from "@/utils";

export const usePersistUser = () => {
    const { updateUser } = useUserState();
    const { updateSession } = useSessionState();
    return useViewerLazyQuery({
        onCompleted: ({ viewer }) => {
            if (!viewer) {
                return;
            }

            const cleanViewer = omitTypename(viewer as User);
            updateUser(cleanViewer);
            updateSession({
                organization: cleanViewer.organization,
                project: cleanViewer.project,
            } as Session);
        },
    });
};
