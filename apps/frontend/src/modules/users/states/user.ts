import {
    AuthUser,
    OrganizationCountableEdge,
    Project,
    ProjectCountableEdge,
    User,
} from "@/generated/graphql";
import { DeepOmit } from "@apollo/client/utilities";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserState = {
    user: DeepOmit<User, "__typename"> | null;
    lastUpdate: number;
};

export type UserActions = {
    deleteUser: () => void;
    updateUser: (data: DeepOmit<User, "__typename">) => void;
    addProject: (orgSlug: string, project: Project) => void;
    updateProject: (
        orgSlug: string,
        projectSlug: string,
        project: Partial<Project>,
    ) => void;
    addWorkspace: (data: DeepOmit<AuthUser, "__typename">) => void;
};

const initialState: UserState = {
    user: null,
    lastUpdate: 0,
};

export const useUserStore = create<UserState & UserActions>()(
    persist(
        (set, get) => ({
            ...initialState,
            deleteUser: () => set(initialState),
            updateUser: (data) =>
                set({
                    user: {
                        ...data,
                    },
                    lastUpdate: Date.now(),
                }),
            addProject: (orgslug, project) => {
                const newUser = get().user;
                if (!newUser || !newUser.organizations) return;

                const orgIndex = newUser.organizations?.edges.findIndex(
                    (edge) => edge.node.slug === orgslug,
                );
                if (orgIndex === -1 || orgIndex === undefined) return;

                const org = {
                    ...newUser?.organizations?.edges[orgIndex].node,
                } as OrganizationCountableEdge["node"];

                org!.projects!.edges! = [
                    { node: project as Project },
                    ...org.projects?.edges!,
                ] as ProjectCountableEdge[];

                newUser.organizations.edges[orgIndex].node = org;

                return set({ user: newUser, lastUpdate: Date.now() });
            },
            updateProject: (orgSlug, projectSlug, project) => {
                const newUser = get().user;
                if (!newUser || !newUser.organizations) return;

                const orgIndex = newUser.organizations?.edges.findIndex(
                    (edge) => edge.node.slug === orgSlug,
                );
                if (orgIndex === -1 || orgIndex === undefined) return;

                const org = {
                    ...newUser?.organizations?.edges[orgIndex].node,
                } as OrganizationCountableEdge["node"];

                const projectIndex = org.projects?.edges?.findIndex(
                    (edge) => edge.node.slug === projectSlug,
                );
                if (projectIndex === -1 || projectIndex === undefined) return;

                org.projects!.edges![projectIndex].node = {
                    ...org.projects?.edges![projectIndex].node,
                    ...project,
                } as Project;

                newUser.organizations.edges[orgIndex].node = org;

                return set({ user: newUser, lastUpdate: Date.now() });
            },
            addWorkspace: (data) => {
                const user = get().user;
                if (!user || !data.organization || !data.project) return;

                user.organization = data.organization;
                user.project = data.project;

                user?.organizations?.edges.unshift({
                    node: {
                        ...data.organization,
                        projects: {
                            edges: [
                                {
                                    node: {
                                        ...data.project,
                                    },
                                },
                            ],
                        },
                    },
                });

                return set({ user, lastUpdate: Date.now() });
            },
        }),
        {
            name: "authUser",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
