import { gql } from "@apollo/client";

export const GET_ORGANIZATION_INVITE_DETAILS = gql`
    query organizationInviteDetails($inviteLink: String!) {
        organizationInviteDetails(inviteLink: $inviteLink) {
            ...OrganizationInviteLinkDetailsFragment
            ...OrganizationInviteDetailsFragment
        }
    }
`;
