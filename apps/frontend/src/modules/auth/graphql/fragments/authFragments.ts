import { gql } from '@apollo/client';

export const AUTH_USER = gql`
    fragment AuthUserFragment on AuthUser {
        id
        email
        firstName
        lastName
        isStaff
        organization {
            ...AuthOrganizationFragment
        }
        project {
            ...ProjectFragment
        }
    }
`;

export const AUTH_ORGANIZATION = gql`
    fragment AuthOrganizationFragment on AuthOrganization {
        id
        slug
        name
        memberCount
    }
`;

export const USER_ERROR = gql`
    fragment UserErrorFragment on UserError {
        field
        message
        code
    }
`;

export const GOOGLE_USER_AUTH = gql`
    fragment GoogleUserAuthFragment on GoogleUserAuth {
        token
        refreshToken
        csrfToken
        userErrors {
            ...UserErrorFragment
        }
    }
`;

export const EMAIL_TOKEN_USER_AUTH = gql`
    fragment EmailTokenUserAuthFragment on EmailTokenUserAuth {
        token
        refreshToken
        csrfToken
        userErrors {
            ...UserErrorFragment
        }
    }
`;
