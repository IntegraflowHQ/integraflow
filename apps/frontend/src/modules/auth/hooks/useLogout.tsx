import { useApolloClient } from "@apollo/client";
import { useCallback } from "react";

import { useLogoutMutation } from "@/generated/graphql";

import { useCurrentUser } from "@/modules/users/hooks/useCurrentUser";
import { useAuth } from "./useAuth";

export const useLogout = () => {
    const { reset: clearAuth } = useAuth();
    const { reset } = useCurrentUser();
    const client = useApolloClient();

    const onLogout = useCallback(async () => {
        await client.clearStore();
        await client.cache.reset();
        reset();
        clearAuth();
    }, [client, reset]);

    const [logout] = useLogoutMutation({
        onCompleted: onLogout,
        onError: onLogout,
    });

    const handleLogout = useCallback(() => logout(), [logout]);
    return {
        logout: handleLogout,
    };
};
