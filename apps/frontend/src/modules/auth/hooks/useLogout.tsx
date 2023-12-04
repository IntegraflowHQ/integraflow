import useDatabase from "@/database/hooks/useDatabase";
import useSessionState from "@/modules/users/hooks/useSessionState";
import useUserState from "@/modules/users/hooks/useUserState";
import { useAuthToken } from "./useAuthToken";

const useLogout = () => {
    const { clearSession } = useSessionState();
    const { deleteUser } = useUserState();
    const { logout } = useAuthToken();
    const { clearDBs } = useDatabase();

    const handleLogout = async () => {
        await clearDBs();
        deleteUser();
        logout();
        clearSession();
    };

    return {
        handleLogout,
    };
};

export default useLogout;
