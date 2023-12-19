import { gql } from "@apollo/client";

export const PROJECT_THEME_DELETE = gql`
    mutation ProjectThemeDelete($id: ID!) {
        projectThemeDelete(id: $id) {
            projectErrors {
                ...ProjectErrorFragment
            }
            errors {
                ...ProjectErrorFragment
            }
            projectTheme {
                ...ProjectThemeFragment
            }
        }
    }
`;
