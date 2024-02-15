import { gql } from "@apollo/client";

export const SURVEY_QUESTION_DELETE = gql`
    mutation SurveyQuestionDelete($id: ID!) {
        surveyQuestionDelete(id: $id) {
            surveyErrors{
                ...SurveyErrorFragment
            }
            errors {
                ...SurveyErrorFragment
            }
            surveyQuestion {
                ...SurveyQuestionFragment
            }
        }
    }
`;
