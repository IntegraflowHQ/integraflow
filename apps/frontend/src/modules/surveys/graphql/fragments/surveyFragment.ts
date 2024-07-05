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
        survey {
            id
            reference
            slug
            name
            project {
                id
                slug
                name
            }
        }
    }
`;

export const SURVEY_CHANNEL = gql`
    fragment SurveyChannelFragment on SurveyChannel {
        id
        link
        reference
        type
        triggers
        conditions
        settings
        createdAt
    }
`;

export const SURVEY_CORE = gql`
    fragment SurveyCore on Survey {
        id
        slug
        name
        status
        createdAt
        updatedAt
        reference
        creator {
            firstName
            lastName
            email
        }
        stats
    }
`;

export const SURVEY = gql`
    fragment SurveyFragment on Survey {
        ...SurveyCore
        type
        settings
        theme {
            ...ProjectThemeFragment
        }
        project {
            ...ProjectFragment
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
    }
`;

export const SURVEY_ERROR = gql`
    fragment SurveyErrorFragment on SurveyError {
        field
        message
        code
    }
`;

export const SURVEY_CREATE_INPUT = gql`
    input SurveyCreateInput {
        name: String
        slug: String
        type: SurveyTypeEnum
        status: SurveyStatusEnum
        settings: JSONString
        themeId: ID
        id: UUID
    }
`;

export const SURVEY_UPDATE_INPUT = gql`
    input SurveyUpdateInput {
        name: String
        slug: String
        type: SurveyTypeEnum
        status: SurveyStatusEnum
        settings: JSONString
        themeId: ID
    }
`;

export const SURVEY_RESPONSE = gql`
    fragment SurveyResponseFragment on SurveyResponse {
        id
        title
        userAttributes
        response
        status
        completedAt
        createdAt
        updatedAt
        timeSpent
        stats
    }
`;
