import { gql } from "@apollo/client";

export const VIEWER = gql`
    query viewer {
        viewer {
            id
            email
            firstName
            lastName
            isStaff
            isActive
            organization {
                ...AuthOrganizationFragment
            }
            project {
                ...ProjectFragment
            }
        }
    }
`;
