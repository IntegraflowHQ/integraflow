import { gql } from "@apollo/client";

export const PROJECT_THEME_CREATE = gql`
    mutation ProjectThemeCreate($input: ProjectThemeCreateInput!) {
        projectThemeCreate(input: $input) {
            errors {
                ...ProjectErrorFragment
            }
            projectTheme {
                ...ProjectThemeFragment
            }
            projectErrors {
                ...ProjectErrorFragment
            }
        }
    }
`;

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

export const PROJECT_THEME_UPDATE = gql`
    mutation ProjectThemeUpdate($id: ID!, $input: ProjectThemeUpdateInput!) {
        projectThemeUpdate(id: $id, input: $input) {
            projectTheme {
                ...ProjectThemeFragment
            }
            projectErrors {
                ...ProjectErrorFragment
            }
            errors {
                ...ProjectErrorFragment
            }
        }
    }
`;
