import { gql } from "@apollo/client";

export const SURVEY_QUESTION_CREATE = gql`
    mutation SurveyQuestionCreate($input: SurveyQuestionCreateInput!) {
        surveyQuestionCreate(input: $input) {
            surveyErrors{
                ...SurveyErrorFragment
            }
            errors{
                ...SurveyErrorFragment
            }
            surveyQuestion{
                ...SurveyQuestionFragment
            }
        }
    }
`;



