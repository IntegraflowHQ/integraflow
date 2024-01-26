import { gql } from "@apollo/client";

export const AUDIENCE_PROPERTIES = gql`
    query audienceProperties {
        propertyDefinitions(first: 100, definitionType: PERSON) {
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
