import { gql } from "@apollo/client";

export const EVENT_DEFINITIONS = gql`
    query EventDefinitions($first: Int, $last: Int, $after: String, $before: String) {
        eventDefinitions(first: $first, last: $last, after: $after, before: $before) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            totalCount
            edges {
                node {
                    id
                    project {
                        ...ProjectFragment
                    }
                    name
                    volume
                    createdAt
                    lastSeenAt
                }
            }
        }
    }
`;

export const EVENTS = gql`
    query events($first: Int, $filters: EventFilterInput) {
        events(first: $first, filters: $filters) {
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

export const PROPERTY_DEFINITIONS = gql`
    query propertyDefinitions {
        propertyDefinitions(first: 100) {
            edges {
                node {
                    id
                    project {
                        ...ProjectFragment
                    }
                    name
                    isNumerical
                    type
                    propertyType
                }
            }
        }
    }
`;

export const PROPERTIES_WITH_DEFINITIONS = gql`
    query propertiesWithDefinitions($event: String) {
        propertiesWithDefinitions(event: $event) {
            event
            property
            isNumerical
            propertyType
        }
    }
`;
