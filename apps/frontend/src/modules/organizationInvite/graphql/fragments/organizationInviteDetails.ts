import { gql } from "@apollo/client";

export const ORGANIZATION_INVITE_DETAILS = gql`
    fragment OrganizationInviteDetailsFragment on OrganizationInviteDetails {
        id
        email
        firstName
        expired
        inviter
        organizationId
        organizationName
        organizationLogo
    }
`;

export const ORGANIZATION_INVITE_LINK_DETAILS = gql`
    fragment OrganizationInviteLinkDetailsFragment on OrganizationInviteLinkDetails {
        id
        organizationId
        organizationName
        organizationLogo
    }
`;
