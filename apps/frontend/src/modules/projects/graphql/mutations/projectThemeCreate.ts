import { gql } from "@apollo/client";

export const PROJECT_THEME_CREATE = gql`
    mutation ProjectThemeCreate($input: ProjectThemeCreateInput!) {
        projectThemeCreate(input: $input) {
            projectTheme {
                id
                name
                colorScheme
            }
        }
    }
`;
