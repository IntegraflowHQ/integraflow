import { gql } from "@apollo/client";

export const ORGANIZATION_JOIN = gql`
    mutation OrganizationJoin($input: OrganizationJoinInput!) {
        organizationJoin(input: $input) {
            ...OrganizationJoinFragment
        }
    }
`;



