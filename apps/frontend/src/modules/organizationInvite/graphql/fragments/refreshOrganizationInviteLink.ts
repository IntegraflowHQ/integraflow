import { gql } from "@apollo/client";

export const REFRESH_ORGANIZATION_INVITE_LINK = gql`
    fragment RefreshOrganizationInviteLinkFragment on OrganizationInviteLinkReset {
        inviteLink
        success
        organizationErrors {
            ...OrganizationErrorFragment
        }
        errors {
            ...OrganizationErrorFragment
        }
    }
`;
