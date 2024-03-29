import { DeepPartial } from "@apollo/client/utilities";
import { useCallback } from "react";

import {
    AuthOrganization,
    AuthUser,
    OnboardingCustomerSurvey,
    Organization,
    OrganizationCreateInput,
    Project,
    useOrganizationCreateMutation,
} from "@/generated/graphql";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { convertToAuthOrganization } from "@/modules/auth/states/user";

export const useWorkspace = () => {
    const { user, workspace, projects, updateUser, switchWorkspace } = useAuth();
    const [createOrganization, { loading }] = useOrganizationCreateMutation();

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
                switchWorkspace(convertToAuthOrganization(organization) as AuthOrganization, project);
            }
        },
        [switchWorkspace, updateUser, user.organizations],
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
    };
};
