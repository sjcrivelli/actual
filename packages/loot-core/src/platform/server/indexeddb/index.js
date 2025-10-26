let openedDb = _openDatabase();
// The web version uses IndexedDB to store data
function _openDatabase() {
    return new Promise((resolve, reject) => {
        const dbVersion = 9;
        const openRequest = indexedDB.open('actual', dbVersion);
        openRequest.onupgradeneeded = function (e) {
            const db = e.target.result;
            // Remove old stores
            if (db.objectStoreNames.contains('filesystem')) {
                db.deleteObjectStore('filesystem');
            }
            if (db.objectStoreNames.contains('messages')) {
                db.deleteObjectStore('messages');
            }
            // Create new stores
            if (!db.objectStoreNames.contains('asyncStorage')) {
                db.createObjectStore('asyncStorage');
            }
            if (!db.objectStoreNames.contains('files')) {
                db.createObjectStore('files', { keyPath: 'filepath' });
            }
        };
        openRequest.onblocked = e => console.log('blocked', e);
        openRequest.onerror = () => {
            console.log('openRequest error');
            reject(new Error('indexeddb-failure: Could not open IndexedDB'));
        };
        openRequest.onsuccess = function (e) {
            const db = e.target.result;
            db.onversionchange = () => {
                // TODO: Notify the user somehow
                db.close();
            };
            db.onerror = function (event) {
                const error = event.target?.error;
                console.log('Database error: ' + error);
                if (event.target && error) {
                    if (error.name === 'QuotaExceededError') {
                        throw new Error('indexeddb-quota-error');
                    }
                }
            };
            resolve(db);
        };
    });
}
export const getStore = function (db, name) {
    const trans = db.transaction([name], 'readwrite');
    return { trans, store: trans.objectStore(name) };
};
export const get = async function (store, key) {
    return new Promise((resolve, reject) => {
        const req = store.get(key);
        req.onsuccess = () => {
            resolve(req.result);
        };
        req.onerror = e => reject(e);
    });
};
export const set = async function (store, item) {
    return new Promise((resolve, reject) => {
        const req = store.put(item);
        req.onsuccess = () => resolve(undefined);
        req.onerror = e => reject(e);
    });
};
export const del = async function (store, key) {
    return new Promise((resolve, reject) => {
        const req = store.delete(key);
        req.onsuccess = () => resolve(undefined);
        req.onerror = e => reject(e);
    });
};
export const getDatabase = function () {
    return openedDb;
};
export const openDatabase = function () {
    if (openedDb == null) {
        openedDb = _openDatabase();
    }
    return openedDb;
};
export const closeDatabase = function () {
    if (openedDb) {
        openedDb.then(db => {
            db.close();
        });
        openedDb = null;
    }
};
