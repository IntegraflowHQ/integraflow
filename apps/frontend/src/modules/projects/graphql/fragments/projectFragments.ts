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
        hasCompletedOnboardingFor
        timezone
        organization {
            ...AuthOrganizationFragment
        }
    }
`;
