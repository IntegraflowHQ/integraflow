import { gql } from "@apollo/client";

export const TOKEN_REFRESH = gql`
    mutation tokenRefresh($csrfToken: String, $refreshToken: String) {
        tokenRefresh(csrfToken: $csrfToken, refreshToken: $refreshToken) {
            token
            errors {
                ...UserErrorFragment
            }
        }
    }
`;
