"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiRemove = exports.multiSet = exports.removeItem = exports.setItem = exports.getItem = exports.init = void 0;
exports.multiGet = multiGet;
// @ts-strict-ignore
const fs = __importStar(require("fs"));
const path_1 = require("path");
const lootFs = __importStar(require("../fs"));
const getStorePath = () => (0, path_1.join)(lootFs.getDataDir(), 'global-store.json');
let store;
let persisted = true;
const init = function ({ persist = true } = {}) {
    if (persist) {
        try {
            store = JSON.parse(fs.readFileSync(getStorePath(), 'utf8'));
        }
        catch (e) {
            store = {};
        }
    }
    else {
        store = {};
    }
    persisted = persist;
};
exports.init = init;
function _saveStore() {
    if (persisted) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(getStorePath(), JSON.stringify(store), 'utf8', function (err) {
                return err ? reject(err) : resolve();
            });
        });
    }
}
const getItem = function (key) {
    return new Promise(function (resolve) {
        return resolve(store[key]);
    });
};
exports.getItem = getItem;
const setItem = function (key, value) {
    store[key] = value;
    return _saveStore();
};
exports.setItem = setItem;
const removeItem = function (key) {
    delete store[key];
    return _saveStore();
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
const multiSet = function (keyValues) {
    keyValues.forEach(function ([key, value]) {
        store[key] = value;
    });
    return _saveStore();
};
exports.multiSet = multiSet;
const multiRemove = function (keys) {
    keys.forEach(function (key) {
        delete store[key];
    });
    return _saveStore();
};
exports.multiRemove = multiRemove;
