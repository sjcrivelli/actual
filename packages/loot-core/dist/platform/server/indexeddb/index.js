"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDatabase = exports.openDatabase = exports.getDatabase = exports.del = exports.set = exports.get = exports.getStore = void 0;
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
const getStore = function (db, name) {
    const trans = db.transaction([name], 'readwrite');
    return { trans, store: trans.objectStore(name) };
};
exports.getStore = getStore;
const get = async function (store, key) {
    return new Promise((resolve, reject) => {
        const req = store.get(key);
        req.onsuccess = () => {
            resolve(req.result);
        };
        req.onerror = e => reject(e);
    });
};
exports.get = get;
const set = async function (store, item) {
    return new Promise((resolve, reject) => {
        const req = store.put(item);
        req.onsuccess = () => resolve(undefined);
        req.onerror = e => reject(e);
    });
};
exports.set = set;
const del = async function (store, key) {
    return new Promise((resolve, reject) => {
        const req = store.delete(key);
        req.onsuccess = () => resolve(undefined);
        req.onerror = e => reject(e);
    });
};
exports.del = del;
const getDatabase = function () {
    return openedDb;
};
exports.getDatabase = getDatabase;
const openDatabase = function () {
    if (openedDb == null) {
        openedDb = _openDatabase();
    }
    return openedDb;
};
exports.openDatabase = openDatabase;
const closeDatabase = function () {
    if (openedDb) {
        openedDb.then(db => {
            db.close();
        });
        openedDb = null;
    }
};
exports.closeDatabase = closeDatabase;
