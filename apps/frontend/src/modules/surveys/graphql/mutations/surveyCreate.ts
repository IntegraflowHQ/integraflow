import { gql } from "@apollo/client";

export const SURVEY_CREATE = gql`
    mutation SurveyCreate($input: SurveyCreateInput!) {
        surveyCreate(input: $input) {
            ...SurveyCreateFragment
        }
    }
`;
