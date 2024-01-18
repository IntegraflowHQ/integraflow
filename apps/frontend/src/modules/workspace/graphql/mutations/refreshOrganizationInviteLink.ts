import { gql } from "@apollo/client";

export const REFRESH_ORGANIZATION_INVITE_LINK = gql`
    mutation organizationInviteLinkReset {
        organizationInviteLinkReset {
            ...RefreshOrganizationInviteLinkFragment
        }
    }
`;
