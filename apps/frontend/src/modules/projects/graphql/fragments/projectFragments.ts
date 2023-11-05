import { gql } from '@apollo/client';

export const PROJECT = gql`
  fragment ProjectFragment on Project {
    id
    name
    hasCompletedOnboardingFor
    timezone
    organization {
        ...AuthOrganizationFragment
    }
  }
`;
