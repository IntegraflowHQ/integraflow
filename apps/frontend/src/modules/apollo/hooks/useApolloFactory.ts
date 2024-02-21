import { InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { useEffect, useMemo, useRef } from "react";

import { useUpdateEffect } from "@/hooks";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import { LocalForageWrapper, persistCache } from "apollo3-cache-persist";
import * as localForage from "localforage";

import { ApolloFactory } from "../services/apollo.factory";

const isDebugMode = import.meta.env.MODE === "development";

export const useApolloFactory = () => {
    const apolloRef = useRef<ApolloFactory<NormalizedCacheObject> | null>(null);
    const cacheRef = useRef<InMemoryCache | null>(null);

    const { token, currentProjectId, refresh, refreshToken, logout } = useAuth();

    useEffect(() => {
        if (!cacheRef.current) {
            const cache = new InMemoryCache();
            persistCache({
                cache,
                storage: new LocalForageWrapper(localForage),
            })
                .then(() => {
                    cacheRef.current = cache;
                })
                .catch((error) => {
                    console.error("Error persisting cache", error);
                    cacheRef.current = cache;
                });
        }
    }, []);

    const apolloClient = useMemo(() => {
        apolloRef.current = new ApolloFactory({
            uri: `${import.meta.env.VITE_SERVER_BASE_URL}/graphql`,
            cache: cacheRef.current ? cacheRef.current : new InMemoryCache(),
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
                refresh,
            },
            onUnauthenticatedError: () => logout(),
            extraLinks: [],
            isDebugMode,
        });

        return apolloRef.current.getClient();
    }, [currentProjectId, token, refreshToken, refresh, logout, cacheRef.current]);

    useUpdateEffect(() => {
        if (apolloRef.current) {
            apolloRef.current.updateAuthParams({
                token,
                refreshToken,
                currentProjectId,
                refresh,
            });
        }
    }, [currentProjectId, token, refreshToken, refresh]);

    return apolloClient;
};
