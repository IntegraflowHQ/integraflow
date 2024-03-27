import { gql } from "@apollo/client";

export const GET_QUESTIONS = gql`
    query GetQuestions($id: ID!, ) {
        questions(id: $id, first: 50) {
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
            edges {
                node {
                    ...SurveyQuestionFragment
                }
            }
            totalCount
        }
    }
`;
