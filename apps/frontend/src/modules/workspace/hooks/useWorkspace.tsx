import { DeepPartial } from "@apollo/client/utilities";
import { useCallback } from "react";

import {
    OnboardingCustomerSurvey,
    Organization,
    OrganizationCreateInput,
    Project,
    useOrganizationCreateMutation,
    useOrganizationUpdateMutation,
} from "@/generated/graphql";
import { AnalyticsEnum, useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { convertToAuthOrganization } from "@/modules/auth/states/user";

export const useWorkspace = () => {
    const { user, workspace, projects, updateUser, switchWorkspace } = useAuth();
    const { capture } = useAnalytics();
    const [createOrganization, { loading }] = useOrganizationCreateMutation();
    const [updateOrganization] = useOrganizationUpdateMutation();

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
                switchWorkspace(convertToAuthOrganization(organization) as Organization, project);
            }
        },
        [switchWorkspace, updateUser, user.organizations],
    );

    const handleUpdateWorkspace = useCallback(
        async (organization: DeepPartial<Organization>, cacheOnly = true) => {
            const updateUserCache = (organization: DeepPartial<Organization>) => {
                const organizations = {
                    ...user.organizations,
                    edges: (user.organizations?.edges ?? []).map((edge) => {
                        if (edge?.node?.id === (organization as DeepPartial<Organization>).id) {
                            return {
                                ...edge,
                                node: organization as DeepPartial<Organization>,
                            };
                        }
                        return edge;
                    }),
                };

                updateUser(
                    {
                        organization: convertToAuthOrganization(organization as DeepPartial<Organization>),
                        organizations,
                    },
                    true,
                );
            };

            if (cacheOnly) {
                updateUserCache(organization);
                return;
            }

            try {
                const response = await updateOrganization({
                    variables: {
                        input: {
                            name: organization.name,
                            slug: organization.slug,
                        },
                    },
                });
                capture(AnalyticsEnum.UPDATE_WORKSPACE, {
                    feature: "update workspace settings",
                });
                if (response.data?.organizationUpdate?.organization) {
                    updateUserCache(response.data?.organizationUpdate?.organization);
                }
                return response;
            } catch (error) {
                console.error(error);
            }
        },
        [updateUser, user.organizations],
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

                if (data && data.organizationCreate?.organization) {
                    const { organization } = data.organizationCreate;
                    capture(AnalyticsEnum.CREATE_WORKSPACE, {
                        feature: "Create workspace",
                    });

                    handleAddWorkspace(organization);
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
    };
};
