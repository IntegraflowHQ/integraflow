import { InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { useMemo, useRef } from "react";

import { useUpdateEffect } from "@/hooks";

import { useAuthToken } from "@/modules/auth/hooks/useAuthToken";
import useLogout from "@/modules/auth/hooks/useLogout";
import useWorkspaceState from "@/modules/workspace/hooks/useWorkspaceState";
import { setContext } from "@apollo/client/link/context";
import { LocalForageWrapper, persistCache } from "apollo3-cache-persist";
import * as localForage from "localforage";
import { ApolloFactory } from "../services/apollo.factory";

const isDebugMode = import.meta.env.VITE_DEBUG_MODE ?? true;

const cache = new InMemoryCache();

await persistCache({
    cache,
    storage: new LocalForageWrapper(localForage),
});

export const useApolloFactory = () => {
    const apolloRef = useRef<ApolloFactory<NormalizedCacheObject> | null>(null);

    const { token, refresh, refreshToken } = useAuthToken();
    const { workspace } = useWorkspaceState();
    const { handleLogout } = useLogout();

    const apolloClient = useMemo(() => {
        apolloRef.current = new ApolloFactory({
            uri: `${import.meta.env.VITE_SERVER_BASE_URL}/graphql`,
            cache,
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
            extraLinks: [
                setContext(async (_, { headers }) => {
                    return {
                        headers: {
                            ...headers,
                            Project: workspace?.project.id ?? "",
                        },
                    };
                }),
            ],
            isDebugMode,
        });

        return apolloRef.current.getClient();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, refreshToken, workspace?.project.id]);

    useUpdateEffect(() => {
        if (apolloRef.current) {
            apolloRef.current.updateAuthToken({ token, refreshToken });
        }
    }, [token, refreshToken]);

    useUpdateEffect(() => {
        if (apolloRef.current) {
            apolloRef.current.getClient().resetStore();
        }
    }, [workspace]);

    return apolloClient;
};
