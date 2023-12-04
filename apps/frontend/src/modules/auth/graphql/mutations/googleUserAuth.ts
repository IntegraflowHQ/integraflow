import { gql } from "@apollo/client";

export const GOOGLE_USER_AUTH = gql`
    mutation googleUserAuth($code: String!, $inviteLink: String) {
        googleUserAuth(code: $code, inviteLink: $inviteLink) {
            ...GoogleUserAuthFragment
        }
    }
`;
