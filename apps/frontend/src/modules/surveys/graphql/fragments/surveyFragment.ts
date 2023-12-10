import { gql } from "@apollo/client";

export const SURVEY_QUESTION = gql`
    fragment SurveyQuestionFragment on SurveyQuestion {
        id
        reference
        label
        description
        type
        options
        settings
        orderNumber
        maxPath
        createdAt
    }
`;

export const SURVEY_CHANNEL = gql`
    fragment SurveyChannelFragment on SurveyChannel {
        id
        reference
        type
        triggers
        conditions
        settings
        createdAt
    }
`;

export const SURVEY = gql`
    fragment SurveyFragment on Survey {
        id
        reference
        name
        slug
        type
        status
        settings
        theme {
            ...ProjectThemeFragment
        }
        creator {
            ...UserFragment
        }
        questions(first: 50) {
            edges {
                node {
                    ...SurveyQuestionFragment
                }
            }
        }
        channels(first: 50) {
            edges {
                node {
                    ...SurveyChannelFragment
                }
            }
        }
        createdAt
        updatedAt
    }
`;

export const SURVEY_ERROR = gql`
    fragment SurveyErrorFragment on SurveyError {
        field
        message
        code
    }
`;

export const SURVEY_CREATE = gql`
    fragment SurveyCreateFragment on SurveyCreate {
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
`;