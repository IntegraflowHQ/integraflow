import { gql } from "@apollo/client";

export const GET_ORGANIZATION_INVITE_LINK = gql`
    query OrganizationInviteLinkCreate {
        organizationInviteLink {
            ...OrganizationInviteLinkCreateFragment
        }
    }
`;
