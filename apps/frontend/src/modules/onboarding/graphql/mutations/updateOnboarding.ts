import { gql } from "@apollo/client";

export const UPDATE_ONBOARDING = gql`
    mutation completeOnboardingStage($input: ProjectUpdateInput!) {
        projectUpdate(input: $input) {
            project {
                id
                hasCompletedOnboardingFor
                __typename
            }
        }
    }
`;
