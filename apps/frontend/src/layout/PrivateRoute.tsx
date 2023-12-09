import { NotFound } from "@/components/NotFound";
import { useAuthToken } from "@/modules/auth/hooks/useAuthToken";
import useWorkspace from "@/modules/workspace/hooks/useWorkspace";
import { GlobalSpinner } from "@/ui";
import { Navigate } from "react-router-dom";

type Props = {
    children: React.ReactNode;
};

export const PrivateRoute = ({ children }: Props) => {
    const { token } = useAuthToken();

    const { isValidating, isValidWorkspace } = useWorkspace();

    if (!token) {
        return <Navigate to="/" />;
    }

    if (isValidating) {
        return <GlobalSpinner />;
    }

    if (!isValidating && !isValidWorkspace) {
        return <NotFound />;
    }

    return <>{children}</>;
};
