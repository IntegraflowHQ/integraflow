import { createSelectors } from "@/utils/selectors";
import { useWorkspaceStore } from "../states/workSpace";

export default function useWorkspaceState() {
    const workspaceStore = createSelectors(useWorkspaceStore);
    const workspace = workspaceStore.use.workspace();
    const updateWorkspace = workspaceStore.use.updateWorkspace();
    const clearWorkspace = workspaceStore.use.clearWorkspace();

    return { workspace, updateWorkspace, clearWorkspace };
}
