import { DeepPartial } from "@apollo/client/utilities";
import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";

import {
    AuthOrganization,
    AuthUser,
    OnboardingCustomerSurvey,
    Organization,
    OrganizationCreateInput,
    Project,
    useOrganizationCreateMutation,
} from "@/generated/graphql";
import { useRedirect } from "@/modules/auth/hooks/useRedirect";
import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser";
import { convertToAuthOrganization } from "@/modules/users/states/user";
import { useApolloClient } from "@apollo/client";

export const useWorkspace = () => {
    const { orgSlug } = useParams();
    const { user, organizations, updateUser } = useCurrentUser();
    const redirect = useRedirect();
    const [createOrganization, { loading }] = useOrganizationCreateMutation();
    const { cache, clearStore } = useApolloClient();

    const workspace = useMemo(() => {
        const slug = orgSlug ?? user?.organization?.slug;

        return organizations.find((organization) => organization?.slug === slug) ?? null;
    }, [orgSlug, user, organizations]);

    const projects = useMemo(() => {
        if (!workspace || !workspace.projects?.edges) {
            return [];
        }

        return workspace.projects.edges.map((edge) => edge?.node);
    }, [workspace]);

    const handleSwitchWorkspace = useCallback(
        (organization: AuthOrganization, project: Project) => {
            const updatedUser = {
                organization,
                project,
            };

            updateUser(updatedUser, true);

            if (orgSlug !== organization.slug) {
                redirect({
                    ...(user ?? {}),
                    ...updatedUser,
                });
            }

            clearStore();
            cache.reset();
        },
        [orgSlug, redirect, updateUser, user],
    );

    const handleAddWorkspace = useCallback(
        (organization: DeepPartial<Organization>) => {
            updateUser(
                {
                    organizations: {
                        ...user.organizations,
                        totalCount: (user.organizations?.totalCount ?? 0) + 1,
                        edges: [
                            ...(user.organizations?.edges ?? []),
                            {
                                node: organization,
                            },
                        ],
                    },
                },
                true,
            );

            const project = organization.projects?.edges?.[0]?.node as Project;
            if (organization && project) {
                handleSwitchWorkspace(convertToAuthOrganization(organization) as AuthOrganization, project);
            }
        },
        [handleSwitchWorkspace, updateUser, user.organizations],
    );

    const handleUpdateWorkspace = useCallback(
        (organization: DeepPartial<Organization>) => {
            const organizations = {
                ...user.organizations,
                edges: (user.organizations?.edges ?? []).map((edge) => {
                    if (edge?.node?.id === organization.id) {
                        return {
                            ...edge,
                            node: organization,
                        };
                    }

                    return edge;
                }),
            };
            updateUser(
                {
                    organization: convertToAuthOrganization(organization),
                    organizations,
                },
                true,
            );
        },
        [updateUser, user],
    );

    const handleCreateWorkspace = useCallback(
        async (input: OrganizationCreateInput, survey?: OnboardingCustomerSurvey) => {
            try {
                const response = await createOrganization({
                    variables: {
                        input,
                        survey,
                    },
                });

                if (response.errors) {
                    return response.errors[0];
                }

                const { data } = response;

                if (data && data.organizationCreate && data.organizationCreate.user) {
                    const { organization, project } = data.organizationCreate.user as AuthUser;

                    if (organization && project) {
                        handleAddWorkspace({
                            id: organization?.id,
                            name: organization?.name,
                            slug: organization?.slug,
                            memberCount: organization?.memberCount,
                            projects: {
                                edges: [{ node: project }],
                            },
                        });
                    }
                }

                return data?.organizationCreate;
            } catch (error) {
                console.log(error);
            }
        },
        [createOrganization, handleAddWorkspace],
    );

    return {
        loading,
        workspace,
        projects,
        createWorkspace: handleCreateWorkspace,
        addWorkspace: handleAddWorkspace,
        updateWorkspace: handleUpdateWorkspace,
        switchWorkspace: handleSwitchWorkspace,
    };
};
