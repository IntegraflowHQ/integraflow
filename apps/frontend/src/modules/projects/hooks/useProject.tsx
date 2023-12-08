import {
    OrganizationCountableEdge,
    Project,
    ProjectCountableEdge,
} from "@/generated/graphql";
import useSessionState from "@/modules/users/hooks/useSessionState";
import useUserState from "@/modules/users/hooks/useUserState";
import { DeepOmit } from "@apollo/client/utilities";
import { useCallback } from "react";

export const useProject = () => {
    const { session, updateSession } = useSessionState();
    const { user, updateUser } = useUserState();

    const upsertProject = useCallback(
        (project: DeepOmit<Project, "__typename">) => {
            if (!session || !user) return;

            const newUser = { ...user };
            if (!newUser || !newUser.organizations) return;

            const orgIndex = newUser.organizations?.edges.findIndex(
                (edge) => edge.node.slug === project.organization.slug,
            );
            if (orgIndex === -1 || orgIndex === undefined) return;

            const org = {
                ...newUser?.organizations?.edges[orgIndex].node,
            } as OrganizationCountableEdge["node"];
            if (!org.projects) return;

            const projectIndex = org.projects?.edges?.findIndex(
                (edge) => edge.node.slug === project.slug,
            );
            if (projectIndex === undefined) return;

            if (projectIndex === -1) {
                org.projects.edges = [
                    { node: project as Project },
                    ...org.projects?.edges!,
                ] as ProjectCountableEdge[];
            } else {
                org.projects!.edges![projectIndex].node = project;
            }

            newUser.organizations.edges[orgIndex].node = org;
            updateUser(newUser);
            updateSession({
                ...session,
                project: project,
            });
        },
        [user, session],
    );

    return {
        upsertProject,
    };
};
