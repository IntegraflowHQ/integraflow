import { gql } from "@apollo/client";

export const PERSONS = gql`
    query persons {
        persons(first: 100) {
            edges {
                node {
                    id
                    uuid
                    attributes
                    distinctIds
                    isIdentified
                    createdAt
                }
            }
        }
    }
`;
