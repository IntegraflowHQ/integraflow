import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { SessionViewer } from "@/types";

export type SessionState = {
    viewer: SessionViewer | null;
};

export type SessionActions = {
    createSession: (viewer: SessionViewer) => void;
    clearSession: () => void;
    updateSession: (data: Partial<SessionViewer>) => void;
};

const initialState: SessionState = {
    viewer: null,
};

export const useSessionStore = create<SessionState & SessionActions>()(
    persist(
        (set, get) => ({
            ...initialState,
            createSession: (viewer) => set({ viewer }),
            clearSession: () => set(initialState),
            updateSession: (data) =>
                set({
                    viewer: {
                        ...get().viewer,
                        ...data,
                    } as SessionViewer,
                }),
        }),
        {
            name: "authSession",
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
);
