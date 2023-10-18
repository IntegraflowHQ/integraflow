// WatermelonDB
import { Database } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import schema from './schemas';
// import migrations from './migrations';

const adapter = new LokiJSAdapter({
  dbName: "Integraflow",
  schema,
  // migrations,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
});

const database = new Database({
  adapter,
  modelClasses: [
    // ⬅️ You'll add Models to Watermelon here
  ],
});

export default database;
