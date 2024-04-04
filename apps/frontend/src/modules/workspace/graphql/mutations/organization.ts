import { gql } from "@apollo/client";

export const ORGANIZATION_CREATE = gql`
    mutation organizationCreate($input: OrganizationCreateInput!, $survey: OnboardingCustomerSurvey) {
        organizationCreate(input: $input, survey: $survey) {
            ...OrganizationCreateFragment
        }
    }
`;

export const ORGANIZATION_LEAVE = gql`
    mutation OrganizationLeave($id: ID!) {
        organizationLeave(id: $id) {
            ...OrganizationLeaveFragment
        }
    }
`;

export const ORGANIZATION_MEMBER_LEAVE = gql`
    mutation OrganizationMemberLeave($id: ID!) {
        organizationMemberLeave(id: $id) {
            ...OrganizationMemberLeaveFragment
        }
    }
`;

export const ORGANIZATION_INVITE_CREATE = gql`
    mutation organizationInviteCreate($input: OrganizationInviteCreateInput!) {
        organizationInviteCreate(input: $input) {
            ...OrganizationInviteCreateFragment
        }
    }
`;

export const ORGANIZATION_JOIN = gql`
    mutation OrganizationJoin($input: OrganizationJoinInput!) {
        organizationJoin(input: $input) {
            ...OrganizationJoinFragment
        }
    }
`;

export const RESEND_ORGANIZATION_INVITE_LINK = gql`
    mutation OrganizationInviteResend($id: ID!) {
        organizationInviteResend(id: $id) {
            ...ResendOrganizationInviteLinkFragment
        }
    }
`;

export const REFRESH_ORGANIZATION_INVITE_LINK = gql`
    mutation organizationInviteLinkReset {
        organizationInviteLinkReset {
            ...RefreshOrganizationInviteLinkFragment
        }
    }
`;

export const RESEND_ORGANIZATION_INVITE_DELETE = gql`
    mutation OrganizationInviteDelete($id: ID!) {
        organizationInviteDelete(id: $id) {
            ...OrganizationInviteDeleteFragment
        }
    }
`;
