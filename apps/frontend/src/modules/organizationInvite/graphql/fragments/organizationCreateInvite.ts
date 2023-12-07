import { gql } from "@apollo/client";

export const ORGANIZATION_CREATE_INVITE_LINK = gql`
    fragment OrganizationInviteLinkCreateFragment on OrganizationInviteLink {
        inviteLink
    }
`;
