import { gql } from "@apollo/client";

export const GET_SURVEY = gql`
    query GetSurvey($id: ID, $slug:String) {
        survey(id: $id, slug: $slug) {
          ...SurveyFragment
        }
    }
`;



