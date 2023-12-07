import { createSelectors } from "@/utils/selectors";
import { useUserStore } from "../states/user";

export default function useUserState() {
    const userStore = createSelectors(useUserStore);
    const user = userStore.use.user();
    const lastUpdate = userStore.use.lastUpdate();
    const addProject = userStore.use.addProject();
    const updateProject = userStore.use.updateProject();
    const updateUser = userStore.use.updateUser();
    const deleteUser = userStore.use.deleteUser();
    const addWorkSpace = userStore.use.addWorkspace();

    return {
        user,
        lastUpdate,
        addProject,
        updateProject,
        addWorkSpace,
        updateUser,
        deleteUser,
    };
}
