import { gql } from "@apollo/client";

export const EVENT_DEFINITIONS = gql`
    query events {
        events(first: 100) {
            edges {
                node {
                    id
                    project {
                        ...ProjectFragment
                    }
                    event
                    distinctId
                    properties
                    timestamp
                    createdAt
                }
            }
        }
    }
`;
