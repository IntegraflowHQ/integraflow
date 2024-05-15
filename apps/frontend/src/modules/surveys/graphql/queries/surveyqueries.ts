import { gql } from "@apollo/client";

export const GET_SURVEY = gql`
    query GetSurvey($id: ID, $slug: String) {
        survey(id: $id, slug: $slug) {
            ...SurveyFragment
        }
    }
`;

export const GET_SURVEY_LIST = gql`
    query GetSurveyList(
        $first: Int
        $last: Int
        $after: String
        $before: String
        $filter: SurveyFilterInput
        $sortBy: SurveySortingInput
    ) {
        surveys(first: $first, last: $last, after: $after, before: $before, filter: $filter, sortBy: $sortBy) {
            edges {
                node {
                    ...SurveyCore
                }
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                endCursor
                startCursor
            }
            totalCount
        }
    }
`;

export const SURVEY_RESPONSES = gql`
    query responses(
        $id: ID
        $filter: SurveyResponseFilterInput
        $before: String
        $after: String
        $first: Int
        $last: Int
    ) {
        responses(id: $id, filter: $filter, before: $before, after: $after, first: $first, last: $last) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            totalCount
            nodes {
                ...SurveyResponseFragment
            }
        }
    }
`;
