import { gql } from "@apollo/client";

export const GET_PROJECT_THEMES = gql`
    query Themes($first: Int) {
        themes(first: $first) {
            edges {
                node {
                    ...ProjectThemeFragment
                }
            }
            totalCount
        }
    }
`;
