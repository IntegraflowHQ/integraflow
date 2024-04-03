import { gql } from "@apollo/client";

export const RESEND_ORGANIZATION_INVITE_LINK = gql`
    mutation OrganizationInviteResend($id: ID!) {
        organizationInviteResend(id: $id) {
            ...ResendOrganizationInviteLinkFragment
        }
    }
`;
