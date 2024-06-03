import { gql } from "@apollo/client";

export const PERSON = gql`
    fragment PersonFragment on Person {
        id
        project {
            ...ProjectFragment
        }
        uuid
        attributes
        distinctIds
        isIdentified
        createdAt
    }
`;
