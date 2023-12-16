import { gql } from "@apollo/client";

export const EVENT_DEFINITIONS = gql`
    query projectEventsData {
        eventDefinitions(first: 50) {
            edges {
                node {
                    id
                    name
                    createdAt
                    lastSeenAt
                }
            }
        }

        eventProperties(first: 50) {
            edges {
                node {
                    id
                    event
                    property
                }
            }
        }

        propertyDefinitions(first: 50) {
            edges {
                node {
                    id
                    name
                    isNumerical
                    type
                    propertyType
                }
            }
        }
    }
`;
