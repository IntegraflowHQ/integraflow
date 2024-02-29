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
