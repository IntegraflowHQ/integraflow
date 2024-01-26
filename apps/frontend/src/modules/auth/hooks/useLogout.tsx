import useUserState from "@/modules/users/hooks/useUserState";
import useWorkspaceState from "@/modules/workspace/hooks/useWorkspaceState";
import { useAuthToken } from "./useAuthToken";

const useLogout = () => {
    const { clearWorkspace } = useWorkspaceState();
    const { deleteUser } = useUserState();
    const { logout } = useAuthToken();

    const handleLogout = () => {
        deleteUser();
        logout();
        clearWorkspace();
    };

    return {
        handleLogout,
    };
};

export default useLogout;
