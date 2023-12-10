import {
    AuthUser,
    Project,
    ProjectCountableEdge,
    User,
    useViewerLazyQuery,
} from "@/generated/graphql";
import useRedirect from "@/modules/auth/hooks/useRedirect";
import { isOver24Hours, omitTypename } from "@/utils";
import { logDebug } from "@/utils/log";
import { DeepOmit } from "@apollo/client/utilities";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useUserState from "../../users/hooks/useUserState";
import { Workspace } from "../states/workSpace";
import useWorkspaceState from "./useWorkspaceState";

export default function useWorkspace() {
    const [isValidating, setIsValidating] = useState(true);
    const { orgSlug, projectSlug } = useParams();
    const { workspace, updateWorkspace } = useWorkspaceState();
    const { user, lastUpdate: lastUserUpdate, updateUser } = useUserState();
    const [fetchUser] = useViewerLazyQuery();
    const redirect = useRedirect();

    const switchWorkspace = useCallback(
        (data: Workspace) => {
            updateWorkspace(data);
            if (
                orgSlug !== data.organization.slug ||
                projectSlug !== data.project.slug
            ) {
                redirect(data);
            }
        },
        [orgSlug, projectSlug],
    );

    const isCurrentOrg = useMemo(() => {
        if (!orgSlug) return false;
        return workspace?.organization.slug === orgSlug.toLowerCase();
    }, [workspace?.organization.slug, orgSlug]);

    const isValidProject = useMemo(() => {
        if (!projectSlug) {
            return (
                workspace?.project.organization.slug ===
                workspace?.organization.slug
            );
        } else {
            return (
                workspace?.project.slug === projectSlug.toLowerCase() &&
                workspace.project.organization.slug ===
                    workspace.organization.slug
            );
        }
    }, [projectSlug, orgSlug, workspace]);

    const isValidWorkspace = useMemo(() => {
        if (!projectSlug && !orgSlug) return true;
        return isCurrentOrg && isValidProject;
    }, [projectSlug, orgSlug, isCurrentOrg, isValidProject]);

    const createValidWorkspaceData = useCallback(async () => {
        let org = null;
        let project = null;

        if (!orgSlug) {
            org = user?.organization;
            project = user?.project;
        } else {
            org =
                user?.organizations?.edges.find(
                    (edge) => edge.node.slug === orgSlug,
                )?.node || null;
            project = !projectSlug
                ? org?.projects?.edges[0].node
                : org?.projects?.edges.find(
                      (edge) => edge.node.slug === projectSlug,
                  )?.node || null;
        }

        if ((!org || !project) && isOver24Hours(lastUserUpdate)) {
            logDebug("User might be stale\nUpdating user...");
            await fetchUser({
                onCompleted: ({ viewer }) => {
                    const newUser = omitTypename(viewer as User);
                    updateUser(newUser);

                    if (!orgSlug) {
                        org = newUser?.organization;
                        project = newUser?.project;
                    } else {
                        org =
                            newUser?.organizations?.edges.find(
                                (edge) => edge.node.slug === orgSlug,
                            )?.node || null;
                        project = !projectSlug
                            ? org?.projects?.edges[0].node
                            : org?.projects?.edges.find(
                                  (edge) => edge.node.slug === projectSlug,
                              )?.node || null;
                    }
                },
            });
        }

        if (!org || !project) {
            logDebug("Couldn't find valid org or project\n404 Error.");
            return null;
        }

        return {
            organization: org,
            project: project,
        } as Workspace;
    }, [orgSlug, projectSlug, workspace]);

    const currentOrgData = useMemo(() => {
        const data =
            user?.organizations?.edges.find(
                (edge) => edge.node.slug === workspace?.organization.slug,
            )?.node || null;

        return data;
    }, [user?.organizations, workspace?.organization.id]);

    const projects = useMemo(() => {
        return (
            currentOrgData?.projects?.edges || ([] as ProjectCountableEdge[])
        );
    }, [currentOrgData]);

    useEffect(() => {
        if (!orgSlug) {
            logDebug("No orgSlug, No validation required.");
            setIsValidating(false);
            return;
        }

        setIsValidating(true);

        if (isCurrentOrg && isValidProject) {
            logDebug("Workspace is valid.");
            if (!projectSlug) {
                redirect(workspace as Workspace);
            }
            setIsValidating(false);
            return;
        } else {
            logDebug("orgSlug", orgSlug);
            logDebug("currentOrg", user?.organization);
            logDebug("isCurrentOrg: ", isCurrentOrg);
            logDebug("projectSlug", projectSlug);
            logDebug("currentProject", user?.project);
            logDebug("isValidProject: ", isValidProject);
            logDebug("Creating valid workspace.");
            createValidWorkspaceData()
                .then((workspace) => {
                    logDebug("New workspace: ", workspace);
                    if (workspace) {
                        switchWorkspace(workspace);
                    }
                    setIsValidating(false);
                })
                .catch(() => {
                    logDebug("Failed to fetch");
                    setIsValidating(false);
                });
        }

        return () => {
            setIsValidating(true);
        };
    }, [
        orgSlug,
        projectSlug,
        isCurrentOrg,
        isValidProject,
        createValidWorkspaceData,
    ]);

    useEffect(() => {
        if (!workspace?.organization || !workspace?.project || !user) return;
        updateUser({
            ...user,
            organization: workspace.organization,
            project: workspace.project,
        });
    }, [workspace?.organization, workspace?.project]);

    const switchProject = useCallback(
        (project: DeepOmit<Project, "__typename">) => {
            const newWorkspace: Workspace = {
                organization: workspace?.organization!,
                project: project,
            };
            switchWorkspace(newWorkspace);
        },
        [workspace, switchWorkspace],
    );

    const addWorkspace = useCallback(
        (data: DeepOmit<AuthUser, "__typename">) => {
            if (!user || !data.organization || !data.project) return;

            const newUser = { ...user };
            newUser.organization = data.organization;
            newUser.project = data.project;
            newUser?.organizations?.edges.unshift({
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

            updateUser(newUser);
            switchWorkspace({
                organization: data.organization,
                project: data.project,
            });
        },
        [user],
    );

    return {
        workspace,
        projects,
        isValidating,
        isValidWorkspace,
        switchWorkspace,
        switchProject,
        addWorkspace,
        createValidWorkspaceData,
    };
}
