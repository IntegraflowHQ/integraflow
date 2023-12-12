import { gql } from "@apollo/client";

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
