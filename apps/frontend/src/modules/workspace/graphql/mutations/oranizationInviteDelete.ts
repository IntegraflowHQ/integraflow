import { gql } from "@apollo/client";

export const RESEND_ORGANIZATION_INVITE_DELETE = gql`
    mutation OrganizationInviteDelete($id: ID!) {
        organizationInviteDelete(id: $id) {
            ...OrganizationInviteDeleteFragment
        }
    }
`;
