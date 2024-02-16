import { gql } from "@apollo/client";

export const PROJECT_UPDATE = gql`
    mutation projectUpdate($input: ProjectUpdateInput!) {
        projectUpdate(input: $input) {
            ...ProjectUpdateFragment
        }
    }
`;
