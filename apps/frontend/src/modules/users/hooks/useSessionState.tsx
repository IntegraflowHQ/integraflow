import { createSelectors } from "@/utils/selectors";
import { useSessionStore } from "../states/session";

export default function useSessionState() {
    const sessionStore = createSelectors(useSessionStore);
    const session = sessionStore.use.session();
    const clearSession = sessionStore.use.clearSession();
    const updateSession = sessionStore.use.updateSession();

    return { session, clearSession, updateSession };
}
