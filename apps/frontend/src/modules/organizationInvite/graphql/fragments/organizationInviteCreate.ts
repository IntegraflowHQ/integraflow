import { gql } from "@apollo/client";

export const ORGANIZATION_INVITE_CREATE = gql`
    fragment OrganizationInviteCreateFragment on OrganizationInviteCreate {
        organizationInvite {
            ...OrganizationInviteFragment
        }
        organizationErrors {
            ...OrganizationErrorFragment
        }
        errors {
            ...OrganizationErrorFragment
        }
    }
`;

export const ORGANIZATION_INVITE = gql`
    fragment OrganizationInviteFragment on OrganizationInvite {
        id
        email
        firstName
        role
        createdAt
        updatedAt
        expired
        inviter {
            id
            email
            firstName
            lastName
            isStaff
            isActive
        }
        organization {
            id
        }
    }
`;

export const ORGANIZATION_ERROR = gql`
    fragment OrganizationErrorFragment on OrganizationError {
        field
        message
        code
    }
`;
