import { gql } from "@apollo/client";

export const GOOGLE_USER_AUTH = gql`
  mutation googleUserAuth($code: String!) {
    googleUserAuth(code: $code) {
      success
      refreshToken
      user {
        organization {
          id
          slug
        }
        project {
          id
          hasCompletedOnboardingFor
        }
      }
      userErrors {
        message
      }
    }
  }
`;
