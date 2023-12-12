import { gql } from "@apollo/client";

export const SURVEY_UPDATE = gql`
    mutation SurveyUpdate(id: ID!, $input: SurveyUpdateInput!) {
        surveyUpdate(id: $id, input: $input) {
            survey {
                ...SurveyFragment
            }
            surveyErrors {
                ...SurveyErrorFragment
            }
        }
    }
`;

// import { gql } from "@apollo/client";

// export const SURVEY_UPDATE = gql`
//     mutation SurveyUpdate(id: ID!, $input: SurveyUpdateInput!) {
//         surveyUpdate(id: $id, input: $input) {
//             ...SurveyCreateFragment
//         }
//     }
// `;
