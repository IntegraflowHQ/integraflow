import { gql } from "@apollo/client";

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
