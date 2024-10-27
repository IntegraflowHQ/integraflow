import { useCallback, useMemo } from "react";

import {
    EventDefinition,
    Project,
    PropertyDefinition,
    useAudiencePropertiesQuery,
    useProjectCreateMutation,
    useProjectEventsDataQuery,
    useProjectTokenResetMutation,
    useProjectUpdateMutation,
} from "@/generated/graphql";
import { AnalyticsEnum, useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { convertToAuthOrganization } from "@/modules/auth/states/user";
import { useWorkspace } from "@/modules/workspace/hooks/useWorkspace";
import { EventProperties } from "@/types";

export const useProject = () => {
    const { workspace, project, updateUser, switchProject } = useAuth();
    const { capture } = useAnalytics();
    const { updateWorkspace } = useWorkspace();
    const [projectCreate, { loading: loadingCreateProject }] = useProjectCreateMutation();
    const [projectUpdate] = useProjectUpdateMutation();
    const [resetProjectToken, { loading: loadingProjectTokenReset }] = useProjectTokenResetMutation();
    const { data: eventsData } = useProjectEventsDataQuery({ fetchPolicy: "cache-and-network" });
    const { data: audienceProperties } = useAudiencePropertiesQuery({ fetchPolicy: "cache-and-network" });

    const handleAddProject = useCallback(
        (project: Project) => {
            const organization = {
                ...workspace,
                projects: {
                    ...workspace?.projects,
                    totalCount: (workspace?.projects?.totalCount ?? 0) + 1,
                    edges: [{ node: project }, ...(workspace?.projects?.edges ?? [])],
                },
            };
            updateWorkspace(organization);

            switchProject(project);
        },
        [switchProject, updateWorkspace, workspace],
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
                    capture(AnalyticsEnum.CREATE_PROJECT, { feature: "Create Project" });
                    handleAddProject(project as Project);
                }

                return data?.projectCreate;
            } catch (error) {
                console.error(error);
            }
        },
        [handleAddProject, projectCreate],
    );

    const handleUpdateProject = useCallback(
        async (input: Partial<Project>, cacheOnly = false) => {
            const updatedProject = {
                ...project,
                ...input,
            };

            const organization = {
                ...workspace,
                projects: {
                    ...workspace?.projects,
                    edges: (workspace?.projects?.edges ?? []).map((edge) => {
                        if (edge?.node?.id === updatedProject?.id) {
                            return {
                                ...edge,
                                node: {
                                    ...edge?.node,
                                    ...updatedProject,
                                },
                            };
                        }
                        return edge;
                    }),
                },
            };
            updateWorkspace(organization);
            updateUser(
                {
                    project: updatedProject,
                    organization: convertToAuthOrganization(organization),
                },
                true,
            );

            if (cacheOnly) {
                return;
            }

            try {
                const response = await projectUpdate({
                    variables: {
                        input: {
                            hasCompletedOnboardingFor: input.hasCompletedOnboardingFor,
                            name: input.name ?? project?.name,
                            private: input.accessControl ?? project?.accessControl,
                            timezone: input.timezone ?? project?.timezone,
                        },
                    },
                });

                if (response.errors) {
                    return response.errors[0];
                }
                if (response.data?.projectUpdate) {
                    capture(AnalyticsEnum.UPDATE_PROJECT, {
                        feature: "Update project settings",
                    });
                }

                return response.data?.projectUpdate;
            } catch (error) {
                console.error(error);
            }
        },
        [project, projectUpdate, updateUser, updateWorkspace, workspace],
    );

    const handleResetProjectToken = useCallback(async () => {
        const response = await resetProjectToken();
        if (response.data?.projectTokenReset?.project.apiToken) {
            handleUpdateProject({ apiToken: response.data?.projectTokenReset?.project.apiToken }, true);
            return true;
        }
        return false;
    }, [resetProjectToken, project, handleUpdateProject]);

    const eventDefinitions = useMemo(() => {
        return eventsData?.eventDefinitions?.edges.map(({ node }) => node) || ([] as EventDefinition[]);
    }, [eventsData?.eventDefinitions]);

    const eventProperties = useMemo(() => {
        return eventsData?.eventProperties?.edges.map(({ node }) => node) || ([] as EventProperties[]);
    }, [eventsData?.eventProperties]);

    const propertyDefinitions = useMemo(() => {
        return eventsData?.propertyDefinitions?.edges.map(({ node }) => node) || ([] as PropertyDefinition[]);
    }, [eventsData?.propertyDefinitions]);

    const getPropertyDefinition = useCallback(
        (property: string) => {
            return propertyDefinitions.find((p) => p.name === property);
        },
        [propertyDefinitions],
    );

    const getProperties = useCallback(
        (event: string) => {
            const properties = eventProperties.filter((p) => p.event === event);
            return properties
                .map((p) => {
                    const definition = p.property ? getPropertyDefinition(p.property as string) : undefined;

                    return definition;
                })
                .filter((p) => p !== undefined) as PropertyDefinition[];
        },
        [eventProperties, getPropertyDefinition],
    );

    const personProperties = useMemo(() => {
        return audienceProperties?.propertyDefinitions?.edges.map((edge) => edge.node) || ([] as PropertyDefinition[]);
    }, [audienceProperties]);

    return {
        loading: loadingCreateProject || loadingProjectTokenReset,
        project,
        eventDefinitions,
        eventProperties,
        propertyDefinitions,
        personProperties,
        getProperties,
        getPropertyDefinition,
        addProject: handleAddProject,
        createProject: handleCreateProject,
        updateProject: handleUpdateProject,
        refreshProjectToken: handleResetProjectToken,
    };
};
