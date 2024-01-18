import { GraphQLError } from "graphql";
import {
    createContext,
    useCallback,
    useMemo,
    useState,
} from "react";

import type { AuthUser, UserError } from "@/generated/graphql";
import { toast } from "@/utils/toast";

import {
    emailAuthChallenge,
    googleAuthLogin,
    logout,
    refreshToken as refreshTokenFn,
    verifyAuthToken,
} from "./services/auth.service";
import { useAuthStore, type AuthState } from "./states/auth";

export type AuthStateChangeCallback = (state?: AuthState | null) => void;

export interface AuthProviderProps {
    /**
     * Should trigger whenever the authentication state changes
     */
    onAuthStateChange?: (callback: AuthStateChangeCallback) => () => void;
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
    generateMagicLink: (email: string, inviteLink?: string) => Promise<boolean>;
    authenticateWithMagicLink: (
        email: string,
        token: string,
        inviteLink?: string,
    ) => Promise<AuthResponse | undefined>;
    authenticateWithGoogle: (
        code: string,
        inviteLink?: string,
    ) => Promise<AuthResponse | undefined>;
    refresh: () => Promise<string | undefined>;
    switchProject: (projectId: string) => void;
    logout: () => void;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const {
        token,
        refreshToken,
        csrfToken,
        currentProjectId,
        initialize,
        refresh,
        switchProject,
        reset,
    } = useAuthStore();

    const [loading, setLoading] = useState(false);

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
                setLoading(true);
                const { errors, data } = await emailAuthChallenge(
                    email,
                    inviteLink,
                );
                if (errors) {
                    handleError(errors[0].message);
                    return false;
                }

                if (data && data.emailUserAuthChallenge?.userErrors?.length) {
                    handleError(
                        data.emailUserAuthChallenge?.userErrors?.[0]?.message ??
                            "",
                    );
                    return false;
                }

                return true;
            } catch (error) {
                handleError(
                    "Unexpected error occurred while generating magic link.",
                );
                return false;
            } finally {
                setLoading(false);
            }
        },
        [setLoading],
    );

    const handleAuthenticateWithMagicLink = useCallback(
        async (email: string, code: string, inviteLink?: string) => {
            try {
                setLoading(true);
                const { errors, data } = await verifyAuthToken(
                    email,
                    code,
                    inviteLink,
                );
                if (errors) {
                    handleError(errors[0].message);
                    return;
                }

                if (data && data.emailTokenUserAuth?.userErrors?.length) {
                    handleError(
                        data.emailTokenUserAuth.userErrors[0]?.message ?? "",
                    );
                    return;
                }

                if (data && data.emailTokenUserAuth) {
                    return handleSuccess(data.emailTokenUserAuth);
                }
            } catch (error) {
                handleError(
                    "Unexpected error occurred while authenticating with magic link.",
                );
            } finally {
                setLoading(false);
            }
        },
        [setLoading, handleSuccess],
    );

    const handleAuthenticateWithGoogle = useCallback(
        async (code: string, inviteLink?: string) => {
            try {
                setLoading(true);
                const { errors, data } = await googleAuthLogin(
                    code,
                    inviteLink,
                );
                if (errors) {
                    handleError(errors[0].message);
                    return;
                }

                if (data && data.googleUserAuth?.userErrors?.length) {
                    handleError(
                        data.googleUserAuth.userErrors[0]?.message ?? "",
                    );
                    return;
                }

                if (data && data.googleUserAuth) {
                    return handleSuccess(data.googleUserAuth);
                }
            } catch (error) {
                handleError(
                    "Unexpected error occurred while generating magic link.",
                );
                return;
            } finally {
                setLoading(false);
            }
        },
        [setLoading, handleSuccess],
    );

    const handleRefreshToken = useCallback(async () => {
        if (!refreshToken) {
            return;
        }

        const token = await refreshTokenFn(refreshToken);
        refresh(token);
        return token;
    }, [refreshToken, refresh]);

    const handleLogout = useCallback(async () => {
        if (!token) {
            return;
        }

        await logout(token);
        reset();

    }, [token, reset]);

    const value = useMemo<AuthContextValue>(
        () => ({
            isAuthenticated: !!refreshToken,
            loading,
            token,
            refreshToken,
            csrfToken,
            currentProjectId,
            generateMagicLink: handleGenerateMagicLink,
            authenticateWithMagicLink: handleAuthenticateWithMagicLink,
            authenticateWithGoogle: handleAuthenticateWithGoogle,
            refresh: handleRefreshToken,
            switchProject,
            logout: handleLogout,
        }),
        [
            loading,
            token,
            refreshToken,
            csrfToken,
            currentProjectId,
            handleGenerateMagicLink,
            handleAuthenticateWithMagicLink,
            handleAuthenticateWithGoogle,
            handleRefreshToken,
            switchProject,
            handleLogout,
        ],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
