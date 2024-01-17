import { gql } from "@apollo/client";

export const EVENT_DEFINITIONS = gql`
    query projectEventsData {
        eventDefinitions(first: 100) {
            edges {
                node {
                    id
                    name
                    createdAt
                    lastSeenAt
                }
            }
        }
        eventProperties(first: 100) {
            edges {
                node {
                    id
                    event
                    property
                }
            }
        }
        propertyDefinitions(first: 100, definitionType: EVENT) {
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
