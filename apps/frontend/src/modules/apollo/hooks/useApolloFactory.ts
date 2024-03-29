import { NormalizedCacheObject } from "@apollo/client";
import { useMemo, useRef } from "react";

import { ApolloFactory } from "../services/apollo.factory";
import { useApolloCache } from "./useApolloCache";

export const useApolloFactory = () => {
    const apolloRef = useRef<ApolloFactory<NormalizedCacheObject> | null>(null);
    const { persisting, cache } = useApolloCache();

    const apolloClient = useMemo(() => {
        if (persisting || !cache) {
            return null;
        }

        apolloRef.current = new ApolloFactory({
            cache,
            // We don't want to re-create the client on token change or it will cause infinite loop
            initialAuthParams: null,
            initialActions: null,
        });

        return apolloRef.current;
    }, [cache, persisting]);

    return apolloClient;
};
