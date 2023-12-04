import { NotFound } from "@/components/NotFound";
import { useAuthToken } from "@/modules/auth/hooks/useAuthToken";
import useSession from "@/modules/users/hooks/useSession";
import { GlobalSpinner } from "@/ui";
import { Navigate } from "react-router-dom";

type Props = {
    children: React.ReactNode;
};

export const PrivateRoute = ({ children }: Props) => {
    const { token } = useAuthToken();

    const { isValidating, isValidSession } = useSession();

    if (!token) {
        return <Navigate to="/" />;
    }

    if (isValidating) {
        return <GlobalSpinner />;
    }

    if (!isValidSession) {
        return <NotFound />;
    }

    return <>{children}</>;
};
