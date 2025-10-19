import { getDatabase } from '../indexeddb';
export const init = function () { };
export const getItem = async function (key) {
    const db = await getDatabase();
    const transaction = db.transaction(['asyncStorage'], 'readonly');
    const objectStore = transaction.objectStore('asyncStorage');
    return new Promise((resolve, reject) => {
        const req = objectStore.get(key);
        req.onerror = e => reject(e);
        // @ts-expect-error fix me
        req.onsuccess = e => resolve(e.target.result);
    });
};
export const setItem = async function (key, value) {
    const db = await getDatabase();
    const transaction = db.transaction(['asyncStorage'], 'readwrite');
    const objectStore = transaction.objectStore('asyncStorage');
    new Promise((resolve, reject) => {
        const req = objectStore.put(value, key);
        req.onerror = e => reject(e);
        req.onsuccess = () => resolve(undefined);
        transaction.commit();
    });
};
export const removeItem = async function (key) {
    const db = await getDatabase();
    const transaction = db.transaction(['asyncStorage'], 'readwrite');
    const objectStore = transaction.objectStore('asyncStorage');
    return new Promise((resolve, reject) => {
        const req = objectStore.delete(key);
        req.onerror = e => reject(e);
        req.onsuccess = () => resolve(undefined);
        transaction.commit();
    });
};
export async function multiGet(keys) {
    const db = await getDatabase();
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
export const multiSet = async function (keyValues) {
    const db = await getDatabase();
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
export const multiRemove = async function (keys) {
    const db = await getDatabase();
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
