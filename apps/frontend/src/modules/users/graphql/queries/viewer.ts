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
            organizations(first: 50) {
                edges {
                    node {
                        id
                        slug
                        name
                        memberCount
                        projects(first: 100) {
                            edges {
                                node {
                                    ...ProjectFragment
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
