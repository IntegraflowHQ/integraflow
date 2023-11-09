import { gql } from "@apollo/client";

export const ORGANIZATION_CREATE = gql`
    mutation organizationCreate(
        $input: OrganizationCreateInput!
        $survey: OnboardingCustomerSurvey
    ) {
        organizationCreate(input: $input, survey: $survey) {
            ...OrganizationCreateFragment
        }
    }
`;
