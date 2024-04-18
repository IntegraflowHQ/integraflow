import { gql } from "@apollo/client";

export const GET_CHANNELS = gql`
    query channels($surveyId: ID!) {
        channels(id: $surveyId, first: 50) {
            edges {
                node {
                    ...SurveyChannelFragment
                }
            }
        }
    }
`;
