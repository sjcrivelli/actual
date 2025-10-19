"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiRemove = exports.multiSet = exports.removeItem = exports.setItem = exports.getItem = exports.init = void 0;
exports.multiGet = multiGet;
const store = {};
const init = function () { };
exports.init = init;
const getItem = async function (key) {
    return store[key];
};
exports.getItem = getItem;
const setItem = async function (key, value) {
    store[key] = value;
};
exports.setItem = setItem;
const removeItem = async function (key) {
    delete store[key];
};
exports.removeItem = removeItem;
async function multiGet(keys) {
    const results = keys.map(key => [key, store[key]]);
    // Convert the array of tuples to an object with properly typed properties
    return results.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});
}
const multiSet = async function (keyValues) {
    keyValues.forEach(function ([key, value]) {
        store[key] = value;
    });
};
exports.multiSet = multiSet;
const multiRemove = async function (keys) {
    keys.forEach(function (key) {
        delete store[key];
    });
};
exports.multiRemove = multiRemove;
