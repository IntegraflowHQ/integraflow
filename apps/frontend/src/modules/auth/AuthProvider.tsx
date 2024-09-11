import { GraphQLError } from "graphql";
import { createContext, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";

import {
    AuthOrganization,
    Organization,
    Project,
    RoleLevel,
    User,
    useEmailTokenUserAuthMutation,
    useEmailUserAuthChallengeMutation,
    useGoogleUserAuthMutation,
    useLogoutMutation,
    useTokenRefreshMutation,
    useUserUpdateMutation,
    useViewerLazyQuery,
    type AuthUser,
    type UserError,
} from "@/generated/graphql";
import { toast } from "@/utils/toast";

import { NotFound } from "@/components/NotFound";
import { AUTH_EXEMPT, EMAIL_REGEX } from "@/constants";
import { useIsMatchingLocation } from "@/hooks";
import { AnalyticsEnum } from "@/hooks/useAnalytics";
import { ROUTES } from "@/routes";
import { GlobalSpinner } from "@/ui";
import { parseInviteLink } from "@/utils";
import { NormalizedCacheObject } from "@apollo/client";
import { DeepPartial } from "@apollo/client/utilities";
import posthog from "posthog-js";
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ApolloFactory } from "../apollo/services/apollo.factory";
import { useRedirect } from "./hooks/useRedirect";
import { useAuthStore, type AuthState } from "./states/auth";
import { convertToAuthOrganization, useUserStore } from "./states/user";

export type AuthStateChangeCallback = (state?: AuthState | null) => void;

export interface AuthProviderProps {
    apollo: ApolloFactory<NormalizedCacheObject>;
    purgePersistedCache: () => void;
    children?: React.ReactNode;
}

export type AuthResponse = {
    userErrors?: UserError[] | null;
    token?: string | null;
    refreshToken?: string | null;
    csrfToken?: string | null;
    user?: AuthUser | null;
};

export type AuthContextValue = {
    isAuthenticated: boolean;
    loading: boolean;
    token: string | null;
    currentProjectId: string | null;
    refreshToken: string | null;
    csrfToken: string | null;
    user: DeepPartial<User>;
    organizations: (DeepPartial<Organization> | undefined)[];
    workspace: DeepPartial<Organization> | null;
    roleLevel?: RoleLevel;
    projects: (DeepPartial<Project> | undefined)[];
    project: DeepPartial<Project> | null;
    generateMagicLink: (email: string, inviteLink?: string) => Promise<boolean>;
    authenticateWithMagicLink: (email: string, token: string, inviteLink?: string) => Promise<AuthResponse | undefined>;
    authenticateWithGoogle: (code: string, inviteLink?: string) => Promise<AuthResponse | undefined>;
    updateUser: (updatedUser: DeepPartial<User>, cacheOnly?: boolean) => Promise<void>;
    refresh: (token: string) => void;
    switchProject: (project: Project) => void;
    switchWorkspace: (organization: AuthOrganization, project: Project) => void;
    logout: () => void;
    reset: () => void;
};

export type AuthResult = {
    errors?: ReadonlyArray<GraphQLError>;
    data?: {
        [key: string]: AuthResponse | null;
    };
};

const createAuthContext = () => {
    return createContext<AuthContextValue | null>(null);
};

export const AuthContext = createAuthContext();

export const AuthProvider = ({ children, apollo, purgePersistedCache }: AuthProviderProps) => {
    const { token, refreshToken, csrfToken, currentProjectId, initialize, refresh, switchProject, reset } =
        useAuthStore();
    const { updateUser: updateUserCache, reset: resetUser, hydrated, ...user } = useUserStore();
    const redirect = useRedirect();
    const navigate = useNavigate();
    const { orgSlug, projectSlug } = useParams();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");
    const inviteLink = searchParams.get("inviteLink") ?? undefined;

    const locationMatch = useIsMatchingLocation();

    const [ready, setReady] = useState(false);

    const [emailAuthChallenge, { loading: generatingMagicLink }] = useEmailUserAuthChallengeMutation();
    const [verifyAuthToken, { loading: verifyingToken }] = useEmailTokenUserAuthMutation();
    const [googleAuthLogin, { loading: googleAuthLoading }] = useGoogleUserAuthMutation();
    const [updateUser, { loading: updatingUser }] = useUserUpdateMutation();
    const [getUser] = useViewerLazyQuery({
        fetchPolicy: "cache-and-network",
        onCompleted: (data) => {
            if (data?.viewer) {
                const currentOrg = data.viewer.organizations?.edges.find(
                    ({ node }) => node.id === user.organization?.id,
                )?.node;

                if (currentOrg) {
                    const project = currentOrg?.projects?.edges.find(({ node }) => node.id === user.project?.id)?.node;
                    updateUserCache({
                        ...data.viewer,
                        organization: convertToAuthOrganization(currentOrg),
                        project,
                        hydrated: true,
                    });
                    return;
                }

                updateUserCache({ ...data.viewer, hydrated: true });
            }
        },
    });
    const [logout] = useLogoutMutation();
    const [refreshTokenMutation] = useTokenRefreshMutation();

    const handleError = (message: string) => {
        toast.error(message);
    };

    const posthogCapture = (eventName: string, properties: {}) => {
        posthog.capture(eventName, properties, {
            $set_once: {
                email: user.email,
            },
            $set: {
                organization: { name: user.organization?.name, slug: user.organization?.slug },
                project: { name: user.project?.name, slug: user.project?.slug },
                name: { firstName: user.firstName, lastName: user.lastName },
            },
        });
    };

    const handleSuccess = useCallback(
        (response?: AuthResponse) => {
            if (!response) {
                return;
            }

            initialize({
                token: response.token ?? null,
                refreshToken: response.refreshToken ?? null,
                csrfToken: response.csrfToken ?? null,
                currentProjectId: response.user?.project?.id ?? null,
            });

            if (response.user && response.user?.project?.slug && response.user?.organization?.slug) {
                updateUserCache({
                    ...response.user,
                    organizations: {
                        __typename: "OrganizationCountableConnection",
                        edges: [
                            {
                                node: {
                                    ...response.user.organization,
                                    __typename: "OrganizationCountableEdge",
                                    projects: {
                                        __typename: "ProjectCountableConnection",
                                        edges: [
                                            {
                                                node: {
                                                    ...response.user.project,
                                                    __typename: "ProjectCountableEdge",
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                } as unknown as DeepPartial<User>);
                redirect(response.user);

                posthogCapture(AnalyticsEnum.LOGIN, { feature: "Authenticate User" });
            } else if (response.user) {
                updateUserCache(response.user as DeepPartial<User>);
                redirect(response.user);
            }

            return response;
        },
        [initialize, updateUserCache],
    );

    const handleGenerateMagicLink = useCallback(
        async (email: string, inviteLink?: string) => {
            try {
                const { errors, data } = await emailAuthChallenge({
                    variables: { email, inviteLink: inviteLink ? parseInviteLink(inviteLink) : undefined },
                });
                if (errors) {
                    handleError(errors[0].message);
                    return false;
                }

                if (data && data.emailUserAuthChallenge?.userErrors?.length) {
                    handleError(data.emailUserAuthChallenge?.userErrors?.[0]?.message ?? "");
                    return false;
                }

                return true;
            } catch (error) {
                handleError("Unexpected error occurred while generating magic link.");
                return false;
            }
        },
        [apollo, emailAuthChallenge],
    );

    const handleAuthenticateWithMagicLink = useCallback(
        async (email: string, code: string, inviteLink?: string) => {
            try {
                const { errors, data } = await verifyAuthToken({
                    variables: { email, token: code, inviteLink: inviteLink ? parseInviteLink(inviteLink) : undefined },
                });
                if (errors) {
                    handleError(errors[0].message);
                    return;
                }

                if (data && data.emailTokenUserAuth?.userErrors?.length) {
                    handleError(data.emailTokenUserAuth.userErrors[0]?.message ?? "");
                    return;
                }

                if (data && data.emailTokenUserAuth) {
                    return handleSuccess(data.emailTokenUserAuth as AuthResponse);
                }
            } catch (error) {
                handleError("Unexpected error occurred while authenticating with magic link.");
            }
        },
        [apollo, handleSuccess, verifyAuthToken],
    );

    const handleAuthenticateWithGoogle = useCallback(
        async (code: string, inviteLink?: string) => {
            try {
                const { errors, data } = await googleAuthLogin({ variables: { code, inviteLink } });
                if (errors) {
                    handleError(errors[0].message);
                    return;
                }

                if (data && data.googleUserAuth?.userErrors?.length) {
                    handleError(data.googleUserAuth.userErrors[0]?.message ?? "");
                    return;
                }

                if (data && data.googleUserAuth) {
                    return handleSuccess(data.googleUserAuth as AuthResponse);
                }
            } catch (error) {
                handleError("Unexpected error occurred during google login.");
                return;
            }
        },
        [apollo, handleSuccess, googleAuthLogin],
    );

    const organizations = useMemo(() => {
        if (!user || !user.organizations?.edges) {
            return [];
        }

        return user.organizations.edges.map((edge) => edge?.node);
    }, [user, user.organizations?.edges]);

    const workspace = useMemo(() => {
        const slug = orgSlug ?? user?.organization?.slug;

        return organizations.find((organization) => organization?.slug?.toLowerCase() === slug?.toLowerCase()) ?? null;
    }, [orgSlug, user?.organization?.slug, organizations]);

    const projects = useMemo(() => {
        if (!workspace || !workspace.projects?.edges) {
            return [];
        }

        return workspace.projects.edges.map((edge) => edge?.node);
    }, [workspace]);

    const project = useMemo(() => {
        if (!workspace) {
            return null;
        }

        if (orgSlug && !projectSlug) {
            return projects?.[0] ?? null;
        }

        const slug = projectSlug ?? user?.project?.slug;

        return projects?.find((project) => project?.slug?.toLowerCase() === slug?.toLowerCase()) ?? null;
    }, [user, orgSlug, projectSlug, projects, workspace]);

    const handleUserUpdate = useCallback(
        async (updatedUser: DeepPartial<User>, cacheOnly = false) => {
            updateUserCache(updatedUser);

            if (!cacheOnly) {
                if (!apollo) {
                    return;
                }
                await updateUser({
                    variables: {
                        input: {
                            firstName: updatedUser.firstName,
                            lastName: updatedUser.lastName,
                            isOnboarded: updatedUser.isOnboarded,
                        },
                    },
                });
                posthogCapture(AnalyticsEnum.UPDATE_USER_PROFILE, { feature: "Update user profile" });
            }
        },
        [apollo, updateUserCache, updateUser],
    );

    const handleSwitchProject = useCallback(
        (project: Project) => {
            const organization = project.organization ?? workspace;

            const updatedUser = {
                organization,
                project,
            };

            handleUserUpdate(updatedUser, true);

            if (currentProjectId !== project.id) {
                switchProject(project.id);
            }

            if (
                orgSlug?.toLowerCase() !== organization?.slug.toLowerCase() ||
                projectSlug?.toLowerCase() !== project.slug.toLowerCase()
            ) {
                redirect({
                    ...(user ?? {}),
                    ...updatedUser,
                });
            }

            apollo.getClient().resetStore();
            apollo.getClient().cache.reset();
        },
        [currentProjectId, orgSlug, projectSlug, user, workspace, redirect, switchProject, handleUserUpdate],
    );

    const handleSwitchWorkspace = useCallback(
        (organization: AuthOrganization, project: Project) => {
            handleSwitchProject({ ...project, organization });
        },
        [handleSwitchProject],
    );

    const handleLogout = useCallback(async () => {
        logout();
        reset();
        resetUser();
        await apollo.getClient().resetStore();
        await apollo.getClient().cache.reset();
        purgePersistedCache();
    }, [apollo, reset, logout, resetUser, purgePersistedCache]);

    useEffect(() => {
        const newProject = project ?? projects?.[0];

        if (
            workspace &&
            newProject &&
            (workspace.id !== user?.organization?.id || newProject.id !== user?.project?.id)
        ) {
            handleUserUpdate(
                {
                    organization: convertToAuthOrganization(workspace),
                    project: newProject,
                },
                true,
            );

            if (newProject.id && currentProjectId !== newProject.id) {
                handleSwitchProject(newProject as Project);
            }
        }
    }, [user, projects, workspace, project, currentProjectId, handleUserUpdate, handleSwitchProject]);

    const handleTokenRefresh = useCallback(async () => {
        if (!refreshToken) {
            return;
        }

        const { data, errors } = await refreshTokenMutation({
            variables: {
                refreshToken,
            },
            context: { headers: { authorization: AUTH_EXEMPT } },
        });

        if (errors || !data || data.tokenRefresh?.errors?.length || !data.tokenRefresh?.token) {
            throw new Error("Something went wrong during token renewal");
        }

        return data.tokenRefresh?.token;
    }, [refreshToken, refreshTokenMutation]);

    useEffect(() => {
        const hydrate = async () => {
            if (!!refreshToken && !hydrated) {
                await getUser();
            }
        };

        hydrate();
    }, [hydrated, refreshToken, getUser]);

    const isValidSession = useMemo(() => {
        if (!projectSlug && !orgSlug) {
            return true;
        }

        if (orgSlug && projectSlug) {
            return (
                workspace?.slug?.toLowerCase() === orgSlug.toLowerCase() &&
                project?.organization?.slug?.toLowerCase() === orgSlug.toLowerCase() &&
                project?.slug?.toLowerCase() === projectSlug.toLowerCase()
            );
        }

        if (orgSlug && !projectSlug) {
            return (
                workspace?.slug?.toLowerCase() === orgSlug.toLowerCase() &&
                project?.organization?.slug?.toLowerCase() === orgSlug.toLowerCase()
            );
        }
    }, [workspace, project, projectSlug, orgSlug]);

    const roleLevel = useMemo(() => {
        const membership = workspace?.members?.edges?.find((edge) => edge?.node?.email === user.email);
        return membership?.node?.role;
    }, [workspace, user]);

    useEffect(() => {
        if (apollo) {
            apollo.updateAuthParams({
                token,
                refreshToken,
                currentProjectId,
            });
        }
    }, [currentProjectId, token, refreshToken, apollo]);

    useEffect(() => {
        if (apollo) {
            apollo.updateActions({
                onUnauthenticatedError: () => handleLogout(),
                onTokenRefreshed: (token) => refresh(token),
                refreshToken: handleTokenRefresh,
            });
        }
    }, [reset, refresh, handleTokenRefresh, apollo]);

    useEffect(() => {
        if (
            user.organization &&
            user.project &&
            !!refreshToken &&
            (locationMatch(ROUTES.LOGIN) || locationMatch(ROUTES.SIGNUP) || locationMatch(ROUTES.MAGIC_SIGN_IN))
        ) {
            redirect(user);
        }
        setReady(true);
    }, [locationMatch, user, refreshToken, redirect]);

    useEffect(() => {
        if (location.pathname === ROUTES.MAGIC_SIGN_IN && emailParam && EMAIL_REGEX.test(emailParam) && tokenParam) {
            handleAuthenticateWithMagicLink(emailParam, tokenParam, inviteLink);
        }
    }, []);

    useLayoutEffect(() => {
        if (
            !refreshToken &&
            !locationMatch(ROUTES.LOGIN) &&
            !locationMatch(ROUTES.SIGNUP) &&
            !locationMatch(ROUTES.MAGIC_SIGN_IN) &&
            !locationMatch(ROUTES.ACCEPT_EMAIL_WORKSPACE_INVITE) &&
            !locationMatch(ROUTES.ACCEPT_LINK_WORKSPACE_INVITE)
        ) {
            handleLogout();
            navigate(ROUTES.LOGIN);
        }
    }, [refreshToken, locationMatch, handleLogout, navigate]);

    const value = useMemo<AuthContextValue>(
        () => ({
            isAuthenticated: !!refreshToken,
            loading: generatingMagicLink || verifyingToken || googleAuthLoading || updatingUser,
            token,
            refreshToken,
            csrfToken,
            currentProjectId,
            user,
            organizations,
            workspace,
            roleLevel,
            projects,
            project,
            generateMagicLink: handleGenerateMagicLink,
            authenticateWithMagicLink: handleAuthenticateWithMagicLink,
            authenticateWithGoogle: handleAuthenticateWithGoogle,
            refresh,
            switchWorkspace: handleSwitchWorkspace,
            switchProject: handleSwitchProject,
            logout: handleLogout,
            updateUser: handleUserUpdate,
            reset,
        }),
        [
            generatingMagicLink,
            verifyingToken,
            googleAuthLoading,
            updatingUser,
            token,
            refreshToken,
            csrfToken,
            currentProjectId,
            user,
            organizations,
            workspace,
            roleLevel,
            projects,
            handleGenerateMagicLink,
            handleAuthenticateWithMagicLink,
            handleAuthenticateWithGoogle,
            handleSwitchProject,
            handleSwitchWorkspace,
            handleLogout,
            handleUserUpdate,
            reset,
            refresh,
        ],
    );

    if (
        !ready ||
        generatingMagicLink ||
        verifyingToken ||
        googleAuthLoading ||
        (!isValidSession && refreshToken && !hydrated)
    ) {
        return <GlobalSpinner />;
    }

    if (orgSlug && !projectSlug && workspace?.slug && project?.slug) {
        return (
            <Navigate
                to={ROUTES.SURVEY_LIST.replace(":orgSlug", workspace.slug).replace(":projectSlug", project.slug)}
            />
        );
    }

    if (!isValidSession) {
        return <NotFound />;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
