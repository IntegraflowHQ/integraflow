import { gql } from "@apollo/client";

export const ORGANIZATION_CREATE = gql`
  fragment OrganizationCreateFragment on OrganizationCreate {
    organization {
      ...AuthOrganizationFragment
    }
    user {
      ...AuthUserFragment
    }
    organizationErrors {
      ...OrganizationErrorFragment
    }
    errors {
      ...OrganizationErrorFragment
    }
  }
`;

export const ORGANIZATION_ERROR = gql`
  fragment OrganizationErrorFragment on OrganizationError {
    field
    message
    code
  }
`;
