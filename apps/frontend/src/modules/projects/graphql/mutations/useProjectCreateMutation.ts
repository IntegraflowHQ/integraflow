import { gql } from "@apollo/client";

export const PROJECT_CREATE = gql`
    mutation projectCreate($input: ProjectCreateInput!) {
        projectCreate(input: $input) {
            project {
                name
            }
        }
    }
`;
