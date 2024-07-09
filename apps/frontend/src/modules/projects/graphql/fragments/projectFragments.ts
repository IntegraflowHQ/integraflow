import { gql } from "@apollo/client";

export const PROJECT_CREATE = gql`
    fragment ProjectCreateFragment on ProjectCreate {
        project {
            ...ProjectFragment
        }
        projectErrors {
            ...ProjectErrorFragment
        }
        errors {
            ...ProjectErrorFragment
        }
    }
`;

export const PROJECT_ERROR = gql`
    fragment ProjectErrorFragment on ProjectError {
        field
        message
        code
    }
`;

export const PROJECT = gql`
    fragment ProjectFragment on Project {
        id
        name
        slug
        apiToken
        accessControl
        hasCompletedOnboardingFor
        timezone
        organization {
            ...AuthOrganizationFragment
        }
    }
`;

export const PROJECT_TOKEN_REFRESH = gql`
    fragment ProjectTokenResetFragment on ProjectTokenReset {
        project {
            ...ProjectFragment
        }
        projectErrors {
            ...ProjectErrorFragment
        }
        errors {
            ...ProjectErrorFragment
        }
    }
`;

export const PROJECT_UPDATE = gql`
    fragment ProjectUpdateFragment on ProjectUpdate {
        project {
            ...ProjectFragment
        }
        projectErrors {
            ...ProjectErrorFragment
        }
        errors {
            ...ProjectErrorFragment
        }
    }
`;

export const PROJECT_THEME = gql`
    fragment ProjectThemeFragment on ProjectTheme {
        id
        reference
        name
        colorScheme
        createdAt
        updatedAt
    }
`;

export const PROJECT_THEME_UPDATE = gql`
    fragment ProjectThemeUpdateFragment on ProjectThemeUpdate {
        projectTheme {
            ...ProjectThemeFragment
        }
        projectErrors {
            ...ProjectErrorFragment
        }
        errors {
            ...ProjectErrorFragment
        }
    }
`;
