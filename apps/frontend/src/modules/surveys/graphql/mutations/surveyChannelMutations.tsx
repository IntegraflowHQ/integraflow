import { gql } from "@apollo/client";

export const SURVEY_CHANNEL_CREATE = gql`
    mutation SurveyChannelCreate($input: SurveyChannelCreateInput!) {
        surveyChannelCreate(input: $input) {
            surveyChannel {
                ...SurveyChannelFragment
            }
            surveyErrors {
                ...SurveyErrorFragment
            }
            errors {
                ...SurveyErrorFragment
            }
        }
    }
`;

export const SURVEY_CHANNEL_UPDATE = gql`
    mutation SurveyChannelUpdate($id: ID!, $input: SurveyChannelUpdateInput!) {
        surveyChannelUpdate(id: $id, input: $input) {
            surveyChannel {
                ...SurveyChannelFragment
            }
            surveyErrors {
                ...SurveyErrorFragment
            }
            errors {
                ...SurveyErrorFragment
            }
        }
    }
`;

export const SURVEY_CHANNEL_DELETE = gql`
    mutation SurveyChannelDelete($id: ID!) {
        surveyChannelDelete(id: $id) {
            surveyChannel {
                ...SurveyChannelFragment
            }
            surveyErrors {
                ...SurveyErrorFragment
            }
            errors {
                ...SurveyErrorFragment
            }
        }
    }
`;
