import { useCallback } from "react";

import {
    OrganizationInviteCreateInput,
    RoleLevel,
    useOrganizationInviteCreateMutation,
    useOrganizationInviteDeleteMutation,
    useOrganizationInviteDetailsLazyQuery,
    useOrganizationInviteLinkCreateLazyQuery,
    useOrganizationInviteLinkResetMutation,
    useOrganizationInviteResendMutation,
    useOrganizationJoinMutation,
    useOrganizationLeaveMutation,
    useOrganizationMemberLeaveMutation,
    useOrganizationMemberUpdateMutation,
} from "@/generated/graphql";

import { parseInviteLink } from "@/utils";
import { useWorkspace } from "./useWorkspace";

export const useWorkspaceInvite = () => {
    const { addWorkspace } = useWorkspace();

    const [getInviteLink, { loading: loadingInviteLink }] = useOrganizationInviteLinkCreateLazyQuery({
        fetchPolicy: "cache-and-network",
    });
    const [getInviteDetails, { loading: inviteDetailsLoading }] = useOrganizationInviteDetailsLazyQuery({
        fetchPolicy: "cache-and-network",
    });

    const [emailInvite, { loading: loadingEmailInvite }] = useOrganizationInviteCreateMutation();
    const [resetInviteLink, { loading: loadingLinkReset }] = useOrganizationInviteLinkResetMutation();
    const [resendInviteLink] = useOrganizationInviteResendMutation();
    const [revokeInviteLink] = useOrganizationInviteDeleteMutation();
    const [removeOrganizationMember] = useOrganizationMemberLeaveMutation();
    const [leaveOrganization, { loading: loadingLeaveOrganization }] = useOrganizationLeaveMutation();
    const [updateMemberRole] = useOrganizationMemberUpdateMutation();
    const [joinOrganization, { loading: joiningOrg }] = useOrganizationJoinMutation();

    const handleGetInviteDetails = useCallback(
        async (inviteLink: string) => {
            try {
                const response = await getInviteDetails({
                    variables: { inviteLink: parseInviteLink(inviteLink) },
                });

                return response.data?.organizationInviteDetails;
            } catch (error) {
                console.error(error);
            }
        },
        [getInviteDetails],
    );

    const handleGetInviteLink = useCallback(async () => {
        try {
            const response = await getInviteLink();

            return response.data?.organizationInviteLink;
        } catch (error) {
            console.error(error);
        }
    }, [getInviteLink]);

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
                        input: { inviteLink: parseInviteLink(inviteLink) },
                    },
                });

                if (response.errors) {
                    return response.errors[0];
                }

                const { data } = response;

                if (data && data.organizationJoin?.user.organization && data.organizationJoin.user.project) {
                    addWorkspace({
                        ...data.organizationJoin.user.project.organization,
                        memberCount: data.organizationJoin.user.organization.memberCount,
                    });
                }

                return data?.organizationJoin;
            } catch (error) {
                console.error(error);
            }
        },
        [addWorkspace, joinOrganization],
    );

    const handleResetInviteLink = useCallback(async () => {
        try {
            const response = await resetInviteLink();
            return response?.data?.organizationInviteLinkReset;
        } catch (error) {
            console.error(error);
        }
    }, [resetInviteLink]);

    const handleResendInviteLink = useCallback(async (inviteID: string) => {
        try {
            const response = await resendInviteLink({
                variables: {
                    id: inviteID,
                },
            });
            return response?.data?.organizationInviteResend;
        } catch (error) {
            console.error(error);
        }
    }, []);
    const handleRevokeInviteLink = useCallback(async (inviteID: string) => {
        try {
            const response = await revokeInviteLink({
                variables: {
                    id: inviteID,
                },
            });
            return response?.data?.organizationInviteDelete;
        } catch (error) {
            console.error(error);
        }
    }, []);

    const handleMemberLeave = useCallback(async (organizationId: string) => {
        try {
            const response = await leaveOrganization({
                variables: {
                    id: organizationId,
                },
            });
            return response?.data?.organizationLeave;
        } catch (error) {
            console.error(error);
        }
    }, []);

    const handleUpdateMemberRole = useCallback(async (memberId: string, roleLevel: RoleLevel) => {
        try {
            const response = await updateMemberRole({
                variables: {
                    id: memberId,
                    input: {
                        role: roleLevel,
                    },
                },
            });
            return response?.data?.organizationMemberUpdate;
        } catch (error) {
            console.error(error);
        }
    }, []);

    const handleRemoveMember = useCallback(async (memberId: string) => {
        try {
            const response = await removeOrganizationMember({
                variables: {
                    id: memberId,
                },
            });
            return response?.data?.organizationMemberLeave;
        } catch (error) {
            console.error(error);
        }
    }, []);

    return {
        loadingEmailInvite,
        loading:
            joiningOrg || inviteDetailsLoading || loadingInviteLink || loadingLinkReset || loadingLeaveOrganization,
        getInviteDetails: handleGetInviteDetails,
        getInviteLink: handleGetInviteLink,
        emailInvite: handleEmailInvite,
        joinWorkspace: handleJoinWorkspace,
        resetInviteLink: handleResetInviteLink,
        resendInviteLink: handleResendInviteLink,
        revokeInviteLink: handleRevokeInviteLink,
        removeOrganizationMember: handleRemoveMember,
        leaveOrganization: handleMemberLeave,
        updateMemberRole: handleUpdateMemberRole,
    };
};
