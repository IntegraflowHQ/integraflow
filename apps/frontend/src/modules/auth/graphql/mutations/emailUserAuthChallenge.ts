import { gql } from "@apollo/client";

export const EMAIL_USER_AUTH_CHALLENGE = gql`
    mutation emailUserAuthChallenge($email: String!, $inviteLink: String!) {
        emailUserAuthChallenge(email: $email, inviteLink: $inviteLink) {
            success
            authType
            userErrors {
                ...UserErrorFragment
            }
        }
    }
`;
