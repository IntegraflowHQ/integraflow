import { AuthOrganization, Project } from "@/generated/graphql";
import { DeepOmit } from "@apollo/client/utilities";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Workspace = {
    organization: DeepOmit<AuthOrganization, "__typename">;
    project: DeepOmit<Project, "__typename">;
};

export type WorkspaceState = {
    workspace: Workspace | null;
};

export type WorkSpaceActions = {
    clearWorkspace: () => void;
    updateWorkspace: (data: Workspace) => void;
};

const initialState: WorkspaceState = {
    workspace: null,
};

export const useWorkspaceStore = create<WorkspaceState & WorkSpaceActions>()(
    persist(
        (set) => ({
            ...initialState,
            clearWorkspace: () => set(initialState),
            updateWorkspace: (data) =>
                set({
                    workspace: {
                        ...data,
                    },
                }),
        }),
        {
            name: "workspace",
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
);
