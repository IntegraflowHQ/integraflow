import useUserState from "@/modules/users/hooks/useUserState";
import useWorkspaceState from "@/modules/workspace/hooks/useWorkspaceState";
import { createSelectors } from "@/utils/selectors";
import { useCallback, useEffect, useState } from "react";
import { DB, createDb, removeDb } from "..";
import { useDbNamesStore } from "../states/dbNames";

export default function useDatabase() {
    const { user } = useUserState();
    const { workspace } = useWorkspaceState();
    const dbNamesStore = createSelectors(useDbNamesStore);
    const addDbName = dbNamesStore.use.add();
    const clearDbNames = dbNamesStore.use.clear();
    const dbNames = dbNamesStore.use.names();
    const [db, setDb] = useState<DB | null>(null);

    useEffect(() => {
        const createDbForCurrentOrg = async () => {
            if (!user || !workspace) return null;

            const org = user.organizations?.edges.find(
                ({ node }) => node.slug.toLowerCase() === workspace.organization.slug.toLowerCase(),
            )?.node;
            if (!org) return null;

            const dbName = `integraflow-${org.slug}`;
            const database = await createDb(dbName);

            org.projects?.edges.forEach(async (edge) => {
                await database.collections.projects.upsert({
                    id: edge.node.id,
                    name: edge.node.name,
                    timezone: edge.node.timezone,
                });
            });

            addDbName(dbName);
            setDb(database);
        };

        createDbForCurrentOrg();
    }, [workspace, user]);

    const clearDBs = useCallback(async () => {
        if (dbNames.length < 1) return;
        await Promise.all(dbNames.map((name) => removeDb(name)));
        clearDbNames();
    }, [dbNames]);

    return { db, clearDBs };
}
