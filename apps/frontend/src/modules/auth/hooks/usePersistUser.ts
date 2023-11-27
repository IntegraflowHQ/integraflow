import { User, useViewerLazyQuery } from "@/generated/graphql";
import useSession from "@/modules/users/hooks/useSession";
import { omitTypename } from "@/utils";

export const usePersistUser = () => {
    const { updateUser } = useSession();
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
