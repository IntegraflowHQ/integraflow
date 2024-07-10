import { gql } from "@apollo/client";

export const PROJECT_CREATE = gql`
    mutation projectCreate($input: ProjectCreateInput!) {
        projectCreate(input: $input) {
            ...ProjectCreateFragment
        }
    }
`;

export const PROJECT_UPDATE = gql`
    mutation projectUpdate($input: ProjectUpdateInput!) {
        projectUpdate(input: $input) {
            ...ProjectUpdateFragment
        }
    }
`;

export const REFRESH_PROJECT_TOKEN = gql`
    mutation projectTokenReset {
        projectTokenReset {
            ...ProjectTokenResetFragment
        }
    }
`;
