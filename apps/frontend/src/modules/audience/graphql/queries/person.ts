import { gql } from "@apollo/client";

export const PERSONS = gql`
    query getPersons($first: Int, $last: Int, $after: String, $before: String) {
        persons(first: $first, last: $last, after: $after, before: $before) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            edges {
                node {
                    ...PersonFragment
                }
            }
            totalCount
        }
    }
`;
