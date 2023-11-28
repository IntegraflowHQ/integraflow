import { User, useViewerLazyQuery } from "@/generated/graphql";
import useUserState from "@/modules/users/hooks/useUserState";
import { omitTypename } from "@/utils";

export const usePersistUser = () => {
    const { updateUser } = useUserState();
    return useViewerLazyQuery({
        onCompleted: ({ viewer }) => {
            if (!viewer) {
                return;
            }

            const cleanViewer = omitTypename(viewer as User);
            updateUser(cleanViewer);
        },
    });
};
