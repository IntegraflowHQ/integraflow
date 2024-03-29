import { InMemoryCache } from "@apollo/client";
import { CachePersistor, LocalForageWrapper } from "apollo3-cache-persist";
import localForage from "localforage";
import { useEffect, useMemo, useRef, useState } from "react";

const storageInstance = localForage.createInstance({
    name: "integraflow-db",
    storeName: "integraflow-store",
});

export const useApolloCache = () => {
    const [persisting, setPersisting] = useState(true);
    const cacheRef = useRef<InMemoryCache | null>(null);

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
            setPersisting(false);
        }

        init().finally(() => setPersisting(false));
    }, []);

    const cacheInstance = useMemo(
        () => ({
            persisting,
            cache: cacheRef.current,
        }),
        [persisting, cacheRef.current],
    );

    return cacheInstance;
};
