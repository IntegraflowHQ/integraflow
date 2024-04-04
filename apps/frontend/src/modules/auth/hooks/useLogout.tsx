import { useApolloClient } from "@apollo/client";
import { useCallback } from "react";

import { useUserStore } from "../states/user";
import { useAuth } from "./useAuth";

export const useLogout = () => {
    const { logout: clearAuth } = useAuth();
    const { reset } = useUserStore();
    const client = useApolloClient();

    const handleLogout = useCallback(async () => {
        clearAuth();
        reset();
        await client.clearStore();
        await client.cache.reset();
    }, [clearAuth, client, reset]);

    return {
        logout: handleLogout,
    };
};
