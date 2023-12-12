import { gql } from "@apollo/client";

export const SURVEY_CHANNEL_UPDATE_INPUT = gql`
    input SurveyChannelUpdateInput {
        type: SurveyChannelTypeEnum
        triggers: JSONString
        conditions: JSONString
        settings: JSONString
    }
`;

export const SURVEY_CHANNEL_CREATE_INPUT = gql`
    input SurveyChannelCreateInput {
        type: SurveyChannelTypeEnum
        triggers: JSONString
        conditions: JSONString
        settings: JSONString
        id: UUID
        surveyId: ID!
    }
`;

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
