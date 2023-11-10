import { useAuthToken } from "@/modules/auth/hooks/useAuthToken";
import { Navigate } from "react-router-dom";

type Props = {
    children: React.ReactNode;
};
export const PrivateRoute = ({ children }: Props) => {
    const { token } = useAuthToken();

    return <>{!token ? <Navigate to="/" /> : children}</>;
};
