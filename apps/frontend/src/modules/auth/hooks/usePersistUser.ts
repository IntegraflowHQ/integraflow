import { User, useViewerLazyQuery } from "@/generated/graphql";
import useUserState from "@/modules/users/hooks/useUserState";
import { omitTypename } from "@/utils";
import useRedirect from "./useRedirect";

export const usePersistUser = () => {
    const { updateUser } = useUserState();
    const redirect = useRedirect();
    return useViewerLazyQuery({
        onCompleted: ({ viewer }) => {
            if (!viewer) {
                return;
            }

            const cleanViewer = omitTypename(viewer as User);
            updateUser(cleanViewer);
            redirect(cleanViewer);
        },
    });
};
