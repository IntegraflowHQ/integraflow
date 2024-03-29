import { useCallback } from "react";

import {
    OrganizationInviteCreateInput,
    useOrganizationInviteCreateMutation,
    useOrganizationInviteDetailsLazyQuery,
    useOrganizationInviteLinkCreateLazyQuery,
    useOrganizationInviteLinkResetMutation,
    useOrganizationJoinMutation
} from "@/generated/graphql";

import { useWorkspace } from "./useWorkspace";

export const useWorkspaceInvite = () => {
    const { switchWorkspace } = useWorkspace();

    const [getInviteLink, { loading: loadingInviteLink }] = useOrganizationInviteLinkCreateLazyQuery();
    const [getInviteDetails, { loading: inviteDetailsLoading }] = useOrganizationInviteDetailsLazyQuery();

    const [emailInvite] = useOrganizationInviteCreateMutation();
    const [resetInviteLink, { loading: loadingLinkReset }] = useOrganizationInviteLinkResetMutation();
    const [joinOrganization, { loading: joiningOrg }] = useOrganizationJoinMutation();

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

    const handleGetInviteLink = useCallback(
        async () => {
            try {
                const response = await getInviteLink();

                return response.data?.organizationInviteLink;
            } catch (error) {
                console.error(error);
            }
        },
        [getInviteLink],
    );

    const handleEmailInvite = useCallback(
        async (inviteInput: OrganizationInviteCreateInput) => {
            try {
                const response = await emailInvite({
                    variables: { input: inviteInput },
                });

                if (response.errors) {
                    return response.errors[0];
                }

                return response?.data?.organizationInviteCreate;
            } catch (error) {
                console.error(error);
            }
        },
        [emailInvite],
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
                    switchWorkspace(
                        data.organizationJoin.user.organization,
                        data.organizationJoin.user.project,
                    );
                }

                return data?.organizationJoin;
            } catch (error) {
                console.error(error);
            }
        },
        [switchWorkspace, joinOrganization],
    );

    const handleResetInviteLink = useCallback(
        async () => {
            try {
                const response = await resetInviteLink();
                return response?.data?.organizationInviteLinkReset;
            } catch (error) {
                console.error(error);
            }
        },
        [resetInviteLink],
    );

    return {
        loading: joiningOrg || inviteDetailsLoading || loadingInviteLink || loadingLinkReset,
        getInviteDetails: handleGetInviteDetails,
        getInviteLink: handleGetInviteLink,
        emailInvite: handleEmailInvite,
        joinWorkspace: handleJoinWorkspace,
        resetInviteLink: handleResetInviteLink,
    };
};
