import { gql } from "@apollo/client";

export const VIEWER = gql`
    query viewer {
        viewer {
          ...UserFragment
        }
    }
`;
