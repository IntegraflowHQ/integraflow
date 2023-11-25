import { gql } from "@apollo/client";

export const ORGANIZATION_INVITE_CREATE= gql`
    mutation organizationInviteCreate(
        $input: OrganizationInviteCreateInput!
    ) {
        organizationInviteCreate(input: $input) {
            ...OrganizationInviteCreateFragment
        }
    }
`;
