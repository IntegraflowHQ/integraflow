import { gql } from "@apollo/client";

export const SURVEY_QUESTION_UPDATE = gql`
    mutation SurveyQuestionUpdate(
        $id: ID!
        $input: SurveyQuestionUpdateInput!
    ) {
        surveyQuestionUpdate(id: $id, input: $input) {
            surveyErrors {
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
