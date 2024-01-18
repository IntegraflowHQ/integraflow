import { useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import {
    Project,
    ProjectUpdateInput,
    useProjectCreateMutation,
    useProjectUpdateMutation,
} from "@/generated/graphql";
import { useRedirect } from "@/modules/auth/hooks/useRedirect";
import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser";
import { useWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { convertToAuthOrganization } from "@/modules/users/states/user";

export const useProject = () => {
    const { currentProjectId, switchProject } = useAuth();
    const { workspace, projects, updateWorkspace } = useWorkspace();
    const { user, updateUser } = useCurrentUser();
    const { orgSlug, projectSlug } = useParams();
    const redirect = useRedirect();

    const [projectCreate] = useProjectCreateMutation();
    const [projectUpdate] = useProjectUpdateMutation();

    const project = useMemo(() => {
        if (!workspace) {
            return null;
        }

        if (orgSlug && !projectSlug) {
            return projects?.[0] ?? null;
        }

        const slug = projectSlug ?? user?.project?.slug;

        return projects?.find((project) => project?.slug === slug) ?? null;
    }, [user, orgSlug, projectSlug, projects, workspace]);

    useEffect(() => {
        const newProject = project ?? projects?.[0];

        if (
            workspace &&
            newProject &&
            (workspace.id !== user?.organization?.id ||
                newProject.id !== user?.project?.id)
        ) {
            updateUser({
                organization: convertToAuthOrganization(workspace),
                project: newProject
            }, true);

            if (newProject.id && currentProjectId !== newProject.id) {
                switchProject(newProject.id);
            }
        }
    }, [user, projects, workspace, updateUser, project, currentProjectId, switchProject]);

    const handleSwitchProject = useCallback(
        (project: Project) => {
            const organization = project.organization ?? workspace;

            const updatedUser = {
                organization,
                project,
            };

            updateUser(updatedUser, true);

            if (currentProjectId !== project.id) {
                switchProject(project.id);
            }

            if (
                orgSlug !== organization?.slug ||
                projectSlug !== project.slug
            ) {
                redirect({
                    ...(user ?? {}),
                    ...updatedUser
                });
            }
        },
        [currentProjectId, orgSlug, projectSlug, redirect, switchProject, updateUser, user, workspace],
    );

    const handleAddProject = useCallback(
        (project: Project) => {
            const organization = {
                ...workspace,
                projects: {
                    ...workspace?.projects,
                    totalCount: (workspace?.projects?.totalCount ?? 0) + 1,
                    edges: [
                        { node: project },
                        ...(workspace?.projects?.edges ?? []),
                    ],
                },
            };
            updateWorkspace(organization);

            handleSwitchProject(project);
        },
        [handleSwitchProject, updateWorkspace, workspace],
    );

    const handleCreateProject = useCallback(
        async (name: string) => {
            try {
                const response = await projectCreate({
                    variables: {
                        input: { name },
                    },
                });

                if (response.errors) {
                    return response.errors[0];
                }

                const { data } = response;

                if (data && data.projectCreate && data.projectCreate.project) {
                    const project = data.projectCreate.project;

                    handleAddProject(project);
                }

                return data?.projectCreate;
            } catch (error) {
                console.error(error);
            }
        },
        [handleAddProject, projectCreate],
    );

    const handleUpdateProject = useCallback(
        async (input: ProjectUpdateInput, cacheOnly = false) => {
            const updatedProject = {
                ...project,
                hasCompletedOnboardingFor: input.hasCompletedOnboardingFor,
                name: input.name ?? project?.name,
                accessControl: input.private,
                timezone: input.timezone ?? project?.timezone,
            };

            const organization = {
                ...workspace,
                projects: {
                    ...workspace?.projects,
                    edges: (workspace?.projects?.edges ?? []).map(
                        (edge) => {
                            if (edge?.node?.id === updatedProject?.id) {
                                return {
                                    ...edge,
                                    node: {
                                        ...edge?.node,
                                        ...updatedProject
                                    },
                                };
                            }

                            return edge;
                        },
                    ),
                },
            };
            updateWorkspace(organization);
            updateUser({
                project: updatedProject,
                organization: convertToAuthOrganization(organization)
            }, true);

            if (cacheOnly) {
                return;
            }

            try {
                const response = await projectUpdate({
                    variables: {
                        input,
                    },
                });

                if (response.errors) {
                    return response.errors[0];
                }

                return response.data?.projectUpdate;
            } catch (error) {
                console.error(error);
            }
        },
        [project, projectUpdate, updateUser, updateWorkspace, workspace],
    );

    return {
        project,
        addProject: handleAddProject,
        createProject: handleCreateProject,
        switchProject: handleSwitchProject,
        updateProject: handleUpdateProject,
    };
};
