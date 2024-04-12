import { gql } from "@apollo/client";

export const ORGANIZATION = gql`
    fragment OrganizationFragment on Organization {
        id
        slug
        name
        memberCount
        invites(first: 100) {
            edges {
                node {
                    id
                    email
                    firstName
                    role
                }
            }
        }
        members(first: 100) {
            edges {
                node {
                    id
                    email
                    firstName
                    lastName
                    role
                }
            }
        }
        projects(first: 100) {
            edges {
                node {
                    ...ProjectFragment
                }
            }
        }
    }
`;

export const ORGANIZATION_MEMBERSHIP = gql`
    fragment OrganizationMembershipFragment on OrganizationMember {
        id
        email
        firstName
        lastName
        role
    }
`;

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

export const ORGANIZATION_CREATE_INVITE_LINK = gql`
    fragment OrganizationInviteLinkCreateFragment on OrganizationInviteLink {
        inviteLink
    }
`;

export const ORGANIZATION_INVITE_CREATE = gql`
    fragment OrganizationInviteCreateFragment on OrganizationInviteCreate {
        organizationInvite {
            ...OrganizationInviteFragment
        }
        organizationErrors {
            ...OrganizationErrorFragment
        }
        errors {
            ...OrganizationErrorFragment
        }
    }
`;

export const ORGANIZATION_INVITE = gql`
    fragment OrganizationInviteFragment on OrganizationInvite {
        id
        email
        firstName
        role
        createdAt
        updatedAt
        expired
        inviter {
            id
            email
            firstName
            lastName
            isStaff
            isActive
        }
        organization {
            id
        }
    }
`;

export const ORGANIZATION_INVITE_DETAILS = gql`
    fragment OrganizationInviteDetailsFragment on OrganizationInviteDetails {
        id
        email
        firstName
        expired
        inviter
        organizationId
        organizationName
        organizationLogo
    }
`;

export const ORGANIZATION_INVITE_LINK_DETAILS = gql`
    fragment OrganizationInviteLinkDetailsFragment on OrganizationInviteLinkDetails {
        id
        organizationId
        organizationName
        organizationLogo
    }
`;

export const ORGANIZATION_JOIN = gql`
    fragment OrganizationJoinFragment on OrganizationJoin {
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

export const REFRESH_ORGANIZATION_INVITE_LINK = gql`
    fragment RefreshOrganizationInviteLinkFragment on OrganizationInviteLinkReset {
        inviteLink
        success
        organizationErrors {
            ...OrganizationErrorFragment
        }
        errors {
            ...OrganizationErrorFragment
        }
    }
`;

export const RESEND_ORGANIZATION_INVITE_LINK = gql`
    fragment ResendOrganizationInviteLinkFragment on OrganizationInviteResend {
        organizationInvite {
            ...OrganizationInviteFragment
        }
        organizationErrors {
            ...OrganizationErrorFragment
        }
        errors {
            ...OrganizationErrorFragment
        }
    }
`;

export const RESEND_ORGANIZATION_INVITE_DELETE = gql`
    fragment OrganizationInviteDeleteFragment on OrganizationInviteDelete {
        organizationInvite {
            ...OrganizationInviteFragment
        }
        organizationErrors {
            ...OrganizationErrorFragment
        }
        errors {
            ...OrganizationErrorFragment
        }
    }
`;
export const ORGANIZATION_LEAVE = gql`
    fragment OrganizationLeaveFragment on OrganizationLeave {
        organization {
            ...OrganizationFragment
        }
        organizationErrors {
            ...OrganizationErrorFragment
        }
        errors {
            ...OrganizationErrorFragment
        }
    }
`;
export const ORGANIZATION_MEMBER_LEAVE = gql`
    fragment OrganizationMemberLeaveFragment on OrganizationMemberLeave {
        organizationMembership {
            ...OrganizationMembershipFragment
        }
        organizationErrors {
            ...OrganizationErrorFragment
        }
        errors {
            ...OrganizationErrorFragment
        }
    }
`;

export const ORGANIZATION_MEMBER_UPDATE = gql`
    fragment OrganizationMemberUpdateFragment on OrganizationMemberUpdate {
        organizationMembership {
            ...OrganizationMembershipFragment
        }
        organizationErrors {
            ...OrganizationErrorFragment
        }
        errors {
            ...OrganizationErrorFragment
        }
    }
`;
