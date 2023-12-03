import { gql } from "@apollo/client";

export const EMAIL_TOKEN_USER_AUTH = gql`
    mutation emailTokenUserAuth(
        $email: String!
        $token: String!
        $inviteLink: String
    ) {
        emailTokenUserAuth(
            email: $email
            token: $token
            inviteLink: $inviteLink
        ) {
            ...EmailTokenUserAuthFragment
        }
    }
`;
