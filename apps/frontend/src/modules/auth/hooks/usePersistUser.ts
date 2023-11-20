import { createOrgDbs } from "@/database";
import { useViewerLazyQuery } from "@/generated/graphql";
import { useSession } from "@/modules/users/hooks/useSession";
import { omitTypename } from "@/utils";
import { useNavigate } from "react-router-dom";
import { handleRedirect } from "../helper";

export const usePersistUser = () => {
    const navigate = useNavigate();
    const { createSession } = useSession();
    return useViewerLazyQuery({
        onCompleted: ({ viewer }) => {
            if (!viewer) {
                return;
            }

            const cleanViewer = omitTypename(viewer);
            createSession(cleanViewer);
            createOrgDbs(cleanViewer);
            handleRedirect(cleanViewer, navigate);
        },
    });
};
