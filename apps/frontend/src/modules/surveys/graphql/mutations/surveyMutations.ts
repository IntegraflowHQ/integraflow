import { gql } from "@apollo/client";

export const SURVEY_DELETE = gql`
    mutation SurveyDelete($id: ID!) {
        surveyDelete(id: $id) {
            surveyErrors {
                ...SurveyErrorFragment
            }
            errors {
                ...SurveyErrorFragment
            }
            survey {
                ...SurveyFragment
            }
        }
    }
`;

export const SURVEY_CREATE = gql`
    mutation SurveyCreate($input: SurveyCreateInput!) {
        surveyCreate(input: $input) {
            surveyErrors {
                ...SurveyErrorFragment
            }
            errors {
                ...SurveyErrorFragment
            }
            survey {
                ...SurveyFragment
            }
        }
    }
`;

export const SURVEY_UPDATE = gql`
    mutation SurveyUpdate($id: ID!, $input: SurveyUpdateInput!) {
        surveyUpdate(id: $id, input: $input) {
            surveyErrors {
                ...SurveyErrorFragment
            }
            errors {
                ...SurveyErrorFragment
            }
            survey {
                ...SurveyFragment
            }
        }
    }
`;
