// Copyright 2016, Jake Archibald

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
export class Store {
  readonly dbPromise: Promise<IDBDatabase>;

  constructor(dbName = 'keyval-store', readonly storeName = 'keyval') {
    this.dbPromise = new Promise((resolve, reject) => {
      const openreq = indexedDB.open(dbName, 1);
      openreq.onerror = () => reject(openreq.error);
      openreq.onsuccess = () => resolve(openreq.result);

      // First time setup: create an empty object store
      openreq.onupgradeneeded = () => openreq.result.createObjectStore(storeName);
    });
  }

  withIDBStore(
    type: IDBTransactionMode,
    callback: (store: IDBObjectStore) => void
  ): Promise<void> {
    return this.dbPromise.then(
      db => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(this.storeName, type);

        transaction.oncomplete = () => resolve();
        transaction.onabort = () => reject(transaction.error);
        transaction.onerror = () => reject(transaction.error);

        callback(transaction.objectStore(this.storeName));
      })
    );
  }
}

let store: Store;

function getDefaultStore() {
  if (!store) {
    store = new Store();
  }
  return store;
}

export function get<Type>(
  key: IDBValidKey,
  store = getDefaultStore()
): Promise<Type> {
  let req: IDBRequest;

  return store
    .withIDBStore('readonly', store => {
      req = store.get(key);
    })
    .then(() => req.result);
}

export function set(
  key: IDBValidKey,
  value: any,
  store = getDefaultStore()
): Promise<void> {
  return store.withIDBStore('readwrite', store => {
    store.put(value, key);
  });
}

export function del(
  key: IDBValidKey,
  store = getDefaultStore()
): Promise<void> {
  return store.withIDBStore('readwrite', store => {
    store.delete(key);
  });
}

export function clear(store = getDefaultStore()): Promise<void> {
  return store.withIDBStore('readwrite', store => {
    store.clear();
  });
}

export function keys(store = getDefaultStore()): Promise<IDBValidKey[]> {
  const keys: IDBValidKey[] = [];

  return store
    .withIDBStore('readonly', store => {
      // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
      // And openKeyCursor isn't supported by Safari.
      (store.openKeyCursor || store.openCursor).call(
        store
      ).onsuccess = function () {
        if (!this.result) return;
        keys.push(this.result.key);
        this.result.continue();
      };
    }).then(() => keys);
}
