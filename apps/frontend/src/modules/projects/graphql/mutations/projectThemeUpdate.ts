import { gql } from "@apollo/client";

export const PROJECT_THEME_UPDATE = gql`
    mutation ProjectThemeUpdate($id: ID!, $input: ProjectThemeUpdateInput!) {
        projectThemeUpdate(id: $id, input: $input) {
            projectTheme {
                ...ProjectThemeFragment
            }
            projectErrors {
                ...ProjectErrorFragment
            }
        }
    }
`;
