import useSessionState from "@/modules/users/hooks/useSessionState";
import useUserState from "@/modules/users/hooks/useUserState";
import { createSelectors } from "@/utils/selectors";
import { useCallback, useEffect, useState } from "react";
import { DB, createDb, removeDb } from "..";
import { useDbNamesStore } from "../states/dbNames";

export default function useDatabase() {
    const { user } = useUserState();
    const { session } = useSessionState();
    const dbNamesStore = createSelectors(useDbNamesStore);
    const addDbName = dbNamesStore.use.add();
    const clearDbNames = dbNamesStore.use.clear();
    const dbNames = dbNamesStore.use.names();
    const [db, setDb] = useState<DB | null>(null);

    useEffect(() => {
        const createDbForCurrentOrg = async () => {
            if (!user || !session) return null;

            const org = user.organizations?.edges.find(
                ({ node }) => node.slug === session.organization.slug,
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

            database.collections.viewer.upsert({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isActive: user.isActive,
                isStaff: user.isStaff,
                project: {
                    id: user.project?.id,
                    name: user.project?.name,
                },
                organization: {
                    id: user.project?.organization.id,
                    name: user.project?.organization.name,
                },
            });

            addDbName(dbName);
            setDb(database);
        };

        createDbForCurrentOrg();
    }, [session, user]);

    const clearDBs = useCallback(async () => {
        if (dbNames.length < 1) return;
        await Promise.all(dbNames.map((name) => removeDb(name)));
        clearDbNames();
    }, [dbNames]);

    return { db, clearDBs };
}
