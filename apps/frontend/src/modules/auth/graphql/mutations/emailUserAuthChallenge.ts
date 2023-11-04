import { gql } from "@apollo/client";

export const EMAIL_USER_AUTH_CHALLENGE = gql`
    mutation emailUserAuthChallenge($email: String!) {
        emailUserAuthChallenge(email: $email) {
            success
            authType
            userErrors {
                ...UserErrorFragment
            }
        }
    }
`;
