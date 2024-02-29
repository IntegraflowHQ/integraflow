import { InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { useEffect, useMemo, useRef, useState } from "react";

import { useUpdateEffect } from "@/hooks";

import { useAuth } from "@/modules/auth/hooks/useAuth";
import { CachePersistor, LocalForageWrapper } from "apollo3-cache-persist";
import * as localForage from "localforage";

import { ApolloFactory } from "../services/apollo.factory";

const isDebugMode = import.meta.env.MODE === "development";

export const useApolloFactory = () => {
    const [persisting, setPersisting] = useState(true);
    const apolloRef = useRef<ApolloFactory<NormalizedCacheObject> | null>(null);
    const cacheRef = useRef<InMemoryCache | null>(null);

    const { token, currentProjectId, refresh, refreshToken, logout } = useAuth();

    useEffect(() => {
        async function init() {
            const cache = new InMemoryCache();
            const persistor = new CachePersistor({
                cache,
                storage: new LocalForageWrapper(localForage),
                debug: isDebugMode,
                trigger: "write",
            });
            await persistor.restore();
            cacheRef.current = cache;
            setPersisting(false);
        }

        init().finally(() => setPersisting(false));
    }, []);

    const apolloClient = useMemo(() => {
        if (persisting) {
            return null;
        }

        apolloRef.current = new ApolloFactory({
            uri: `${import.meta.env.VITE_SERVER_BASE_URL}/graphql`,
            cache: cacheRef.current ?? new InMemoryCache(),
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
    }, [currentProjectId, token, refreshToken, refresh, logout, cacheRef.current, persisting]);

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
