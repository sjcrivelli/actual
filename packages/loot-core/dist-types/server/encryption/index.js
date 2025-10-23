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
exports.getKey = getKey;
exports.hasKey = hasKey;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.randomBytes = randomBytes;
exports.loadKey = loadKey;
exports.unloadKey = unloadKey;
exports.unloadAllKeys = unloadAllKeys;
exports.createKey = createKey;
// @ts-strict-ignore
const uuid_1 = require("uuid");
const internals = __importStar(require("./encryption-internals"));
// A map of all possible master encryption keys to use, keyed by
// unique id
let keys = {};
class Key {
    id;
    value;
    constructor({ id }) {
        this.id = id || (0, uuid_1.v4)();
    }
    async createFromPassword({ password, salt }) {
        this.value = await internals.createKey({ secret: password, salt });
    }
    async createFromBase64(str) {
        this.value = await internals.importKey(str);
    }
    getId() {
        return this.id;
    }
    getValue() {
        return this.value;
    }
    serialize() {
        return {
            id: this.id,
            base64: this.value.base64,
        };
    }
}
function getKey(keyId) {
    if (keyId == null || keys[keyId] == null) {
        throw new Error('missing-key');
    }
    return keys[keyId];
}
function hasKey(keyId) {
    return keyId in keys;
}
function encrypt(value, keyId) {
    return internals.encrypt(getKey(keyId), value);
}
function decrypt(encrypted, meta) {
    return internals.decrypt(getKey(meta.keyId), encrypted, meta);
}
function randomBytes(n) {
    return internals.randomBytes(n);
}
async function loadKey(key) {
    let keyInstance;
    if (!(key instanceof Key)) {
        keyInstance = new Key({ id: key.id });
        await keyInstance.createFromBase64(key.base64);
    }
    else {
        keyInstance = key;
    }
    keys[keyInstance.getId()] = keyInstance;
}
function unloadKey(key) {
    delete keys[key.getId()];
}
function unloadAllKeys() {
    keys = {};
}
async function createKey({ id, password, salt }) {
    const key = new Key({ id });
    await key.createFromPassword({ password, salt });
    return key;
}
//# sourceMappingURL=index.js.map