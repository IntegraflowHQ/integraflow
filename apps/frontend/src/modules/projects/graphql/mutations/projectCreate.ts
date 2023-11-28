import { gql } from "@apollo/client";

export const ORGANIZATION_CREATE = gql`
    mutation projectCreate(
        $input: ProjectCreateInput!
    ) {
        projectCreate(input: $input) {
            ...ProjectCreateFragment
        }
    }
`;
