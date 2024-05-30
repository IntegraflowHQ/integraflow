import { InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { CachePersistor, LocalForageWrapper } from "apollo3-cache-persist";
import localForage from "localforage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const storageInstance = localForage.createInstance({
    name: "integraflow-db",
    storeName: "integraflow-store",
});

export const useApolloCache = () => {
    const [persisting, setPersisting] = useState(true);
    const cacheRef = useRef<InMemoryCache | null>(null);
    const [persistor, setPersistor] = useState<CachePersistor<NormalizedCacheObject>>();

    useEffect(() => {
        async function init() {
            const cache = new InMemoryCache();
            const persistor = new CachePersistor({
                cache,
                storage: new LocalForageWrapper(storageInstance),
                debug: import.meta.env.MODE === "development",
                trigger: "write",
            });
            await persistor.restore();
            cacheRef.current = cache;
            setPersistor(persistor);
            setPersisting(false);
        }

        init().finally(() => setPersisting(false));
    }, []);

    const purgePersistedCache = useCallback(() => {
        if (!persistor) {
            return;
        }

        persistor.purge();
    }, [persistor]);

    const cacheInstance = useMemo(
        () => ({
            persisting,
            purgePersistedCache,
            cache: cacheRef.current,
        }),
        [persisting, cacheRef.current, purgePersistedCache],
    );

    return cacheInstance;
};
