const store = {};
export const init = function () { };
export const getItem = async function (key) {
    return store[key];
};
export const setItem = async function (key, value) {
    store[key] = value;
};
export const removeItem = async function (key) {
    delete store[key];
};
export async function multiGet(keys) {
    const results = keys.map(key => [key, store[key]]);
    // Convert the array of tuples to an object with properly typed properties
    return results.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});
}
export const multiSet = async function (keyValues) {
    keyValues.forEach(function ([key, value]) {
        store[key] = value;
    });
};
export const multiRemove = async function (keys) {
    keys.forEach(function (key) {
        delete store[key];
    });
};
