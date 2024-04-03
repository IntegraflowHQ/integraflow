import { gql } from "@apollo/client";

export const ORGANIZATION_LEAVE = gql`
    mutation OrganizationLeave($id: ID!) {
        organizationLeave(id: $id) {
            ...OrganizationLeaveFragment
        }
    }
`;
