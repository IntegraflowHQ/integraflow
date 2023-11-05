import { gql } from "@apollo/client";

export const EMAIL_TOKEN_USER_AUTH = gql`
    mutation emailTokenUserAuth($email: String!, $token: String!) {
        emailTokenUserAuth(email: $email, token: $token) {
            ...EmailTokenUserAuthFragment
        }
    }
`;
