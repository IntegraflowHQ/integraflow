import { addRxPlugin, createRxDatabase, RxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { schema } from './schemas';
import { TodoCollection } from './schemas/todo.schema';

addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBUpdatePlugin);

export type DBCollections = {
  todos: TodoCollection;
}

export type DB = RxDatabase<DBCollections>;

const db: DB = await createRxDatabase({
  name: 'todos-db',
  ignoreDuplicate: true,
  storage: getRxStorageDexie(),
});

await db.addCollections(schema);

export default db;
