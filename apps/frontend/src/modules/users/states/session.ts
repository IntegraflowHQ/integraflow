import { AuthOrganization, Project } from "@/generated/graphql";
import { DeepOmit } from "@apollo/client/utilities";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Session = {
    organization: DeepOmit<AuthOrganization, "__typename">;
    project: DeepOmit<Project, "__typename">;
};

export type SessionState = {
    session: Session | null;
};

export type SessionActions = {
    clearSession: () => void;
    updateSession: (data: Session) => void;
};

const initialState: SessionState = {
    session: null,
};

export const useSessionStore = create<SessionState & SessionActions>()(
    persist(
        (set) => ({
            ...initialState,
            clearSession: () => set(initialState),
            updateSession: (data) =>
                set({
                    session: {
                        ...data,
                    },
                }),
        }),
        {
            name: "authSession",
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
);
