import { InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { useMemo, useRef } from "react";

import { useUpdateEffect } from "@/hooks";

import { useAuth } from "@/modules/auth/hooks/useAuth";

import { ApolloFactory } from "../services/apollo.factory";

const isDebugMode = import.meta.env.VITE_DEBUG_MODE ?? true;

export const useApolloFactory = () => {
    const apolloRef = useRef<ApolloFactory<NormalizedCacheObject> | null>(null);

    const { token, currentProjectId, refresh, refreshToken, logout } = useAuth();

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
            initialAuthParams: {
                token,
                refreshToken,
                currentProjectId,
                refresh
            },
            onUnauthenticatedError: () => logout(),
            extraLinks: [],
            isDebugMode,
        });

        return apolloRef.current.getClient();
    }, [currentProjectId, token, refreshToken, refresh, logout]);

    useUpdateEffect(() => {
        if (apolloRef.current) {
            apolloRef.current.updateAuthParams({
                token,
                refreshToken,
                currentProjectId,
                refresh
            });
        }
    }, [currentProjectId, token, refreshToken, refresh]);

    return apolloClient;
};
