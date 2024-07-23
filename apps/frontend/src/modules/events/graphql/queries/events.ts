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
    query events($first: Int, $filter: EventFilterInput) {
        events(first: $first, filter: $filter) {
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
    query propertyDefinitions($first: Int, $last: Int, $after: String, $before: String) {
        propertyDefinitions(first: $first, last: $last, after: $after, before: $before) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
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
            totalCount
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
