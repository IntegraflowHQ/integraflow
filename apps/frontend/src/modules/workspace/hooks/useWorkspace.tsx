import {
    AuthOrganization,
    AuthUser,
    Project,
} from "@/generated/graphql";
import useRedirect from "@/modules/auth/hooks/useRedirect";
import { DeepOmit } from "@apollo/client/utilities";
import { useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser";
import { omitTypename } from "@/utils";

export const useWorkspace = () => {
    const { orgSlug, projectSlug } = useParams();
    const { user, updateUser } = useCurrentUser();
    const { organizations } = useCurrentUser();
    const redirect = useRedirect();

    const workspace = useMemo(() => {
        const slug = orgSlug ?? user?.organization?.slug;

        return organizations.find(organization => organization.slug === slug) ?? null;
    }, [orgSlug, user?.organization?.slug, organizations]);

    const projects = useMemo(() => {
        if (!workspace || !workspace.projects?.edges) {
            return [];
        }

        return workspace.projects.edges.map(edge => omitTypename(edge.node));
    }, [workspace]);

    const project = useMemo(() => {
        if (!workspace) {
            return null;
        }

        if (orgSlug && !projectSlug) {
            return omitTypename(projects?.[0]) ?? null;
        }

        const slug = projectSlug ?? user?.project?.slug;

        const project = projects?.find(project => project.slug === slug);
        return project ? omitTypename(project) : null;
    }, [user?.project?.slug, orgSlug, projectSlug, projects, workspace]);

    useEffect(() => {
        const newProject = project ?? omitTypename(projects?.[0]);

        if (
            workspace &&
            newProject &&
            (workspace.id !== user?.organization?.id || newProject.id !== user?.project?.id)
        ) {
            updateUser({
                organization: workspace,
                project: newProject
            }, true);
        }
    }, [user, project, projects, workspace, updateUser]);

    const handleSwitchWorkspace = useCallback(
        (organization: DeepOmit<AuthOrganization, "__typename">, project: DeepOmit<Project, "__typename">) => {
            updateUser({
                organization: workspace,
                project: project
            }, true);

            if (
                user &&
                (orgSlug !== organization.slug || projectSlug !== project.slug)
            ) {
                redirect(user);
            }
        },
        [updateUser, workspace, user, orgSlug, projectSlug, redirect],
    );

    const handleSwitchProject = useCallback(
        (project: DeepOmit<Project, "__typename">) => {
            handleSwitchWorkspace(project.organization, project);
        },
        [handleSwitchWorkspace],
    );

    const handleAddWorkspace = useCallback(
        (data: DeepOmit<AuthUser, "__typename">) => {
            if (!data.organization || !data.project) return;

            handleSwitchWorkspace(data.organization, data.project);
        },
        [handleSwitchWorkspace],
    );

    return {
        workspace,
        projects,
        project,
        switchWorkspace: handleSwitchWorkspace,
        switchProject: handleSwitchProject,
        addWorkspace: handleAddWorkspace
    };
}
