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

export const createDb = async (name: string): Promise<DB> => {
    const db: DB = await createRxDatabase({
        name,
        multiInstance: true,
        eventReduce: true,
        storage: getRxStorageDexie(),
        ignoreDuplicate: true,
    });

    await db.addCollections(schema);
    return db;
};

export const removeDb = async (name: string) => {
    await removeRxDatabase(name, getRxStorageDexie());
};
