import { gql } from "@apollo/client";

export const GET_SURVEY_LIST = gql`
    query GetSurveyList(
        $first: Int
        $last: Int
        $after: String
        $before: String
        $filter: SurveyFilterInput
        $sortBy: SurveySortingInput
    ) {
        surveys(
            first: $first
            last: $last
            after: $after
            before: $before
            filter: $filter
            sortBy: $sortBy
        ) {
            ...SurveyListFragment
        }
    }
`;
