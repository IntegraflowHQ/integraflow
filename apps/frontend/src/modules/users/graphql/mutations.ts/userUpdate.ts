import { gql } from "@apollo/client";

export const USER_UPDATE = gql`
    mutation userUpdate($input: UserInput!) {
        userUpdate(input: $input) {
            user {
                ... on User {
                    id
                    email
                    firstName
                    lastName
                    isStaff
                    isActive
                    isOnboarded
                }
            }
        }
    }
`;
