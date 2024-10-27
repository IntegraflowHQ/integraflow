import { gql } from "@apollo/client";

export const USER = gql`
    fragment UserFragment on User {
        id
        email
        firstName
        lastName
        isStaff
        isActive
        isOnboarded
        organization {
            id
            slug
            name
            memberCount
        }
        project {
            ...ProjectFragment
        }
        organizations(first: 50) {
            edges {
                node {
                    ...OrganizationFragment
                }
            }
        }
    }
`;
