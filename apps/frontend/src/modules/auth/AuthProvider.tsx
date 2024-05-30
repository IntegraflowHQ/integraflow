import { GraphQLError } from "graphql";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import {
    AuthOrganization,
    Organization,
    Project,
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
import { ROUTES } from "@/routes";
import { GlobalSpinner } from "@/ui";
import { NormalizedCacheObject } from "@apollo/client";
import { DeepPartial } from "@apollo/client/utilities";
import { Navigate, useLocation, useParams, useSearchParams } from "react-router-dom";
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
                const organization = data.viewer.organizations?.edges.find(
                    ({ node }) => node.id === user.organization?.id,
                )?.node;
                const project = organization?.projects?.edges.find(({ node }) => node.id === user.project?.id)?.node;

                updateUserCache({
                    ...data.viewer,
                    organization: convertToAuthOrganization(organization),
                    project,
                });
            }
        },
    });
    const [logout] = useLogoutMutation();
    const [refreshTokenMutation] = useTokenRefreshMutation();

    const handleError = (message: string) => {
        toast.error(message);
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

            return response;
        },
        [initialize],
    );

    const handleGenerateMagicLink = useCallback(
        async (email: string, inviteLink?: string) => {
            try {
                const { errors, data } = await emailAuthChallenge({ variables: { email, inviteLink } });
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
                const { errors, data } = await verifyAuthToken({ variables: { email, token: code, inviteLink } });
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

        return organizations.find((organization) => organization?.slug === slug) ?? null;
    }, [orgSlug, user, organizations]);

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

        return projects?.find((project) => project?.slug === slug) ?? null;
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
            }
        },
        [apollo, updateUserCache, updateUser],
    );

    const handleSwitchWorkspace = useCallback(
        (organization: AuthOrganization, project: Project) => {
            const updatedUser = {
                organization,
                project,
            };

            handleUserUpdate(updatedUser, true);

            if (orgSlug !== organization.slug) {
                redirect({
                    ...(user ?? {}),
                    ...updatedUser,
                });
            }

            apollo.getClient().resetStore();
            apollo.getClient().cache.reset();
        },
        [orgSlug, redirect, handleUserUpdate, user],
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

            if (orgSlug !== organization?.slug || projectSlug !== project.slug) {
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
                const { data } = await getUser();
                if (data?.viewer) {
                    const organization = data.viewer.organizations?.edges.find(
                        ({ node }) => node.id === user.organization?.id,
                    )?.node;
                    const project = organization?.projects?.edges.find(
                        ({ node }) => node.id === user.project?.id,
                    )?.node;
                    updateUserCache({
                        ...data.viewer,
                        organization: convertToAuthOrganization(organization),
                        project,
                    });
                }
            }
        };

        hydrate();
    }, [apollo, hydrated, refreshToken, getUser]);

    const isCurrentOrg = useMemo(() => {
        if (!orgSlug) return false;
        return workspace?.slug?.toLowerCase() === orgSlug.toLowerCase();
    }, [workspace?.slug, orgSlug]);

    const isValidProject = useMemo(() => {
        if (!projectSlug) {
            return project?.organization?.slug?.toLowerCase() === workspace?.slug?.toLowerCase();
        } else {
            return (
                project?.slug?.toLowerCase() === projectSlug.toLowerCase() &&
                project?.organization?.slug?.toLowerCase() === workspace?.slug?.toLowerCase()
            );
        }
    }, [projectSlug, orgSlug, project]);

    const isValidSession = useMemo(() => {
        if (!projectSlug && !orgSlug) return true;
        return isCurrentOrg && isValidProject;
    }, [projectSlug, orgSlug, isCurrentOrg, isValidProject]);

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
            user &&
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

    if (!ready || generatingMagicLink || verifyingToken || googleAuthLoading) {
        return <GlobalSpinner />;
    }

    if (orgSlug && !projectSlug && workspace?.slug && project?.slug) {
        return (
            <Navigate
                to={ROUTES.SURVEY_LIST.replace(":orgSlug", workspace.slug).replace(":projectSlug", project.slug)}
            />
        );
    }

    if (
        !refreshToken &&
        !locationMatch(ROUTES.LOGIN) &&
        !locationMatch(ROUTES.SIGNUP) &&
        !locationMatch(ROUTES.MAGIC_SIGN_IN)
    ) {
        return <Navigate to="/" />;
    }

    if (!isValidSession) {
        return <NotFound />;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
