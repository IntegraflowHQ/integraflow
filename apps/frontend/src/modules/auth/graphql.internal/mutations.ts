import { gql } from "@apollo/client";

export const GOOGLE_USER_AUTH = gql`
  mutation googleUserAuth($code: String!) {
    googleUserAuth(code: $code) {
      success
      accessToken
      refreshToken
      userErrors {
        message
      }
    }
  }
`;
