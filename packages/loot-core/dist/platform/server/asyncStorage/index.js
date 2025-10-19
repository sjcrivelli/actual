"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiRemove = exports.multiSet = exports.removeItem = exports.setItem = exports.getItem = exports.init = void 0;
exports.multiGet = multiGet;
const indexeddb_1 = require("../indexeddb");
const init = function () { };
exports.init = init;
const getItem = async function (key) {
    const db = await (0, indexeddb_1.getDatabase)();
    const transaction = db.transaction(['asyncStorage'], 'readonly');
    const objectStore = transaction.objectStore('asyncStorage');
    return new Promise((resolve, reject) => {
        const req = objectStore.get(key);
        req.onerror = e => reject(e);
        // @ts-expect-error fix me
        req.onsuccess = e => resolve(e.target.result);
    });
};
exports.getItem = getItem;
const setItem = async function (key, value) {
    const db = await (0, indexeddb_1.getDatabase)();
    const transaction = db.transaction(['asyncStorage'], 'readwrite');
    const objectStore = transaction.objectStore('asyncStorage');
    new Promise((resolve, reject) => {
        const req = objectStore.put(value, key);
        req.onerror = e => reject(e);
        req.onsuccess = () => resolve(undefined);
        transaction.commit();
    });
};
exports.setItem = setItem;
const removeItem = async function (key) {
    const db = await (0, indexeddb_1.getDatabase)();
    const transaction = db.transaction(['asyncStorage'], 'readwrite');
    const objectStore = transaction.objectStore('asyncStorage');
    return new Promise((resolve, reject) => {
        const req = objectStore.delete(key);
        req.onerror = e => reject(e);
        req.onsuccess = () => resolve(undefined);
        transaction.commit();
    });
};
exports.removeItem = removeItem;
async function multiGet(keys) {
    const db = await (0, indexeddb_1.getDatabase)();
    const transaction = db.transaction(['asyncStorage'], 'readonly');
    const objectStore = transaction.objectStore('asyncStorage');
    const results = await Promise.all(keys.map(key => {
        return new Promise((resolve, reject) => {
            const req = objectStore.get(key);
            req.onerror = e => reject(e);
            req.onsuccess = e => {
                const target = e.target;
                resolve([key, target.result]);
            };
        });
    }));
    transaction.commit();
    // Convert the array of tuples to an object with properly typed properties
    return results.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});
}
const multiSet = async function (keyValues) {
    const db = await (0, indexeddb_1.getDatabase)();
    const transaction = db.transaction(['asyncStorage'], 'readwrite');
    const objectStore = transaction.objectStore('asyncStorage');
    const promise = Promise.all(keyValues.map(([key, value]) => {
        return new Promise((resolve, reject) => {
            const req = objectStore.put(value, key);
            req.onerror = e => reject(e);
            req.onsuccess = () => resolve(undefined);
        });
    }));
    transaction.commit();
    await promise;
};
exports.multiSet = multiSet;
const multiRemove = async function (keys) {
    const db = await (0, indexeddb_1.getDatabase)();
    const transaction = db.transaction(['asyncStorage'], 'readwrite');
    const objectStore = transaction.objectStore('asyncStorage');
    const promise = Promise.all(keys.map(key => {
        return new Promise((resolve, reject) => {
            const req = objectStore.delete(key);
            req.onerror = e => reject(e);
            req.onsuccess = () => resolve(undefined);
        });
    }));
    transaction.commit();
    await promise;
};
exports.multiRemove = multiRemove;
