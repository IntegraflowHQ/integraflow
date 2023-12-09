import useDatabase from "@/database/hooks/useDatabase";
import useUserState from "@/modules/users/hooks/useUserState";
import useWorkspaceState from "@/modules/workspace/hooks/useWorkspaceState";
import { useAuthToken } from "./useAuthToken";

const useLogout = () => {
    const { leaveWorkspace } = useWorkspaceState();
    const { deleteUser } = useUserState();
    const { logout } = useAuthToken();
    const { clearDBs } = useDatabase();

    const handleLogout = async () => {
        await clearDBs();
        deleteUser();
        logout();
        leaveWorkspace();
    };

    return {
        handleLogout,
    };
};

export default useLogout;
