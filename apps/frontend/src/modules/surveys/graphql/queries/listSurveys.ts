import { gql } from "@apollo/client";

export const GET_SURVEY_LIST = gql`
    query GetSurveyList($first: Int) {
        surveys(first: $first) {
            ...SurveyListFragment
        }
    }
`;
