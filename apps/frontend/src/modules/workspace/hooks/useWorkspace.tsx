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
    useOrganizationInviteDetailsLazyQuery,
    useOrganizationJoinMutation,
} from "@/generated/graphql";
import { useRedirect } from "@/modules/auth/hooks/useRedirect";
import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser";
import { convertToAuthOrganization } from "@/modules/users/states/user";

export const useWorkspace = () => {
    const { orgSlug } = useParams();
    const { user, organizations, updateUser } = useCurrentUser();
    const redirect = useRedirect();
    const [createOrganization, { loading: creatingOrg }] =
        useOrganizationCreateMutation();
    const [joinOrganization, { loading: joiningOrg }] =
        useOrganizationJoinMutation();
    const [getInviteDetails, { loading: inviteDetailsLoading }] =
        useOrganizationInviteDetailsLazyQuery();

    const workspace = useMemo(() => {
        const slug = orgSlug ?? user?.organization?.slug;

        return (
            organizations.find((organization) => organization?.slug === slug) ??
            null
        );
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
                handleSwitchWorkspace(
                    convertToAuthOrganization(organization) as AuthOrganization,
                    project,
                );
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
        async (
            input: OrganizationCreateInput,
            survey?: OnboardingCustomerSurvey,
        ) => {
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

                if (
                    data &&
                    data.organizationCreate &&
                    data.organizationCreate.user
                ) {
                    const { organization, project } = data.organizationCreate
                        .user as AuthUser;

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

    const handleJoinWorkspace = useCallback(
        async (inviteLink: string) => {
            try {
                const response = await joinOrganization({
                    variables: {
                        input: { inviteLink },
                    },
                });

                if (response.errors) {
                    return response.errors[0];
                }

                const { data } = response;

                if (
                    data &&
                    data.organizationJoin?.user.organization &&
                    data.organizationJoin.user.project
                ) {
                    handleSwitchWorkspace(
                        data.organizationJoin.user.organization,
                        data.organizationJoin.user.project,
                    );
                }
            } catch (error) {
                console.error(error);
            }
        },
        [handleSwitchWorkspace, joinOrganization],
    );

    const handleGetInviteDetails = useCallback(
        async (inviteLink: string) => {
            try {
                const response = await getInviteDetails({
                    variables: { inviteLink },
                });

                return response.data?.organizationInviteDetails;
            } catch (error) {
                console.error(error);
            }
        },
        [getInviteDetails],
    );

    return {
        loading: joiningOrg || creatingOrg || inviteDetailsLoading,
        workspace,
        projects,
        createWorkspace: handleCreateWorkspace,
        addWorkspace: handleAddWorkspace,
        getInviteDetails: handleGetInviteDetails,
        joinWorkspace: handleJoinWorkspace,
        updateWorkspace: handleUpdateWorkspace,
        switchWorkspace: handleSwitchWorkspace,
    };
};
