import { gql } from "@apollo/client";

export const ORGANIZATION_JOIN = gql`
    fragment OrganizationJoinFragment on OrganizationJoin {
        user {
            ...AuthUserFragment
        }
        organizationErrors {
            ...OrganizationErrorFragment
        }
        errors {
            ...OrganizationErrorFragment
        }
    }
`;
