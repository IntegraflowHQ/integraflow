import { useApolloClient } from "@apollo/client";
import { useCallback } from "react";

import { useLogoutMutation } from "@/generated/graphql";

import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser";
import { useAuth } from "./useAuth";

export const useLogout = () => {
    const { logout: clearAuth } = useAuth();
    const { reset } = useCurrentUser();
    const { cache, clearStore } = useApolloClient();

    const onLogout = useCallback(async () => {
        await clearStore();
        await cache.reset();
        clearAuth();
        reset();
    }, [cache, clearAuth, clearStore, reset]);

    const [logout] = useLogoutMutation({
        onCompleted: onLogout,
        onError: onLogout,
    });

    const handleLogout = useCallback(() => logout(), [logout]);
    return {
        logout: handleLogout,
    };
};
