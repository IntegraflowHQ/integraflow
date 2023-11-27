import { SessionViewer } from "@/types";
import {
    RxDatabase,
    addRxPlugin,
    createRxDatabase,
    removeRxDatabase,
} from "rxdb";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { schema } from "./schemas";
import { ProjectCollection } from "./schemas/project.schema";
import { ViewerCollection } from "./schemas/viewer.schema";

addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBUpdatePlugin);

export type DBCollections = {
    viewer: ViewerCollection;
    projects: ProjectCollection;
};

export type DB = RxDatabase<DBCollections>;

export const databases = new Map<string, DB>();

const createDb = async (name: string): Promise<DB> => {
    if (databases.has(name)) {
        return databases.get(name) as DB;
    }

    const db: DB = await createRxDatabase({
        name,
        multiInstance: true,
        eventReduce: true,
        storage: getRxStorageDexie(),
        ignoreDuplicate: true,
    });

    await db.addCollections(schema);
    databases.set(name, db);
    return db;
};

export const createOrgDbs = async (viewer: SessionViewer) => {
    viewer.organizations?.edges.forEach(async (edge) => {
        const db = await createDb(edge.node.slug);

        edge.node.projects?.edges.forEach(async (edge) => {
            db.collections.projects.upsert({
                id: edge.node.id,
                name: edge.node.name,
                timezone: edge.node.timezone,
            });
        });

        db.collections.viewer.upsert({
            id: viewer.id,
            email: viewer.email,
            firstName: viewer.firstName,
            lastName: viewer.lastName,
            isActive: viewer.isActive,
            isStaff: viewer.isStaff,
            project: {
                id: viewer.project?.id,
                name: viewer.project?.name,
            },
            organization: {
                id: viewer.project?.organization.id,
                name: viewer.project?.organization.name,
            },
        });
    });
};

export const clearOrgDbs = async () => {
    for (const [name] of databases) {
        await removeRxDatabase(name, getRxStorageDexie());
    }
    databases.clear();
};
