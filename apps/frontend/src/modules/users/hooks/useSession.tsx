import { createSelectors } from "@/utils/selectors";
import { useSessionStore } from "../states/session";

export const useSession = () => {
    const viewerStore = createSelectors(useSessionStore);
    const viewer = viewerStore.use.viewer();
    const createSession = viewerStore.use.createSession();
    const clearSession = viewerStore.use.clearSession();
    const updateSession = viewerStore.use.updateSession();

    return { viewer, createSession, clearSession, updateSession };
};
