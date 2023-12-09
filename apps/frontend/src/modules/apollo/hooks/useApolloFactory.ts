import { InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useIsMatchingLocation, useUpdateEffect } from "@/hooks";

import { useAuthToken } from "@/modules/auth/hooks/useAuthToken";
import useLogout from "@/modules/auth/hooks/useLogout";
import { ApolloFactory } from "../services/apollo.factory";

const isDebugMode = import.meta.env.VITE_DEBUG_MODE ?? true;

export const useApolloFactory = () => {
    const apolloRef = useRef<ApolloFactory<NormalizedCacheObject> | null>(null);

    const navigate = useNavigate();
    const isMatchingLocation = useIsMatchingLocation();

    const { token, refresh, refreshToken } = useAuthToken();
    const { handleLogout } = useLogout();

    const apolloClient = useMemo(() => {
        apolloRef.current = new ApolloFactory({
            uri: `${import.meta.env.VITE_SERVER_BASE_URL}/graphql`,
            cache: new InMemoryCache(),
            defaultOptions: {
                query: {
                    fetchPolicy: "cache-first",
                },
            },
            connectToDevTools: isDebugMode,
            // We don't want to re-create the client on token change or it will cause infinite loop
            initialAuthToken: {
                token,
                refreshToken,
            },
            onAccessTokenChange: (token: string) => refresh(token),
            onUnauthenticatedError: () => {
                handleLogout();
            },
            extraLinks: [],
            isDebugMode,
        });

        return apolloRef.current.getClient();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, refreshToken]);

    useUpdateEffect(() => {
        if (apolloRef.current) {
            apolloRef.current.updateAuthToken({ token, refreshToken });
        }
    }, [token, refreshToken]);

    return apolloClient;
};
