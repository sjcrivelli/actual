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
exports.app = void 0;
const uuid_1 = require("uuid");
const asyncStorage = __importStar(require("../../platform/server/asyncStorage"));
const log_1 = require("../../platform/server/log");
const app_1 = require("../app");
const post_1 = require("../post");
const prefs = __importStar(require("../prefs"));
const server_config_1 = require("../server-config");
const sync_1 = require("../sync");
const encryption = __importStar(require("."));
exports.app = (0, app_1.createApp)();
exports.app.method('key-make', keyMake);
exports.app.method('key-test', keyTest);
// A user can only enable/change their key with the file loaded. This
// will change in the future: during onboarding the user should be
// able to enable encryption. (Imagine if they are importing data from
// another source, they should be able to encrypt first)
async function keyMake({ password }) {
    if (!prefs.getPrefs()) {
        throw new Error('key-make must be called with file loaded');
    }
    const salt = encryption.randomBytes(32).toString('base64');
    const id = (0, uuid_1.v4)();
    const key = await encryption.createKey({ id, password, salt });
    // Load the key
    await encryption.loadKey(key);
    // Make some test data to use if the key is valid or not
    const testContent = await (0, sync_1.makeTestMessage)(key.getId());
    // Changing your key necessitates a sync reset as well. This will
    // clear all existing encrypted data from the server so you won't
    // have a mix of data encrypted with different keys.
    return await (0, sync_1.resetSync)({
        key,
        salt,
        testContent: JSON.stringify({
            ...testContent,
            value: testContent.value.toString('base64'),
        }),
    });
}
// This can be called both while a file is already loaded or not. This
// will see if a key is valid and if so save it off.
async function keyTest({ cloudFileId, password, }) {
    const userToken = await asyncStorage.getItem('user-token');
    if (cloudFileId == null) {
        cloudFileId = prefs.getPrefs().cloudFileId;
    }
    let validCloudFileId;
    let res;
    try {
        const serverConfig = (0, server_config_1.getServer)();
        if (!serverConfig) {
            throw new Error('No sync server configured.');
        }
        res = await (0, post_1.post)(serverConfig.SYNC_SERVER + '/user-get-key', {
            token: userToken,
            fileId: cloudFileId,
        });
        validCloudFileId = cloudFileId;
    }
    catch (e) {
        log_1.logger.log(e);
        return { error: { reason: 'network' } };
    }
    const { id, salt, test: originalTest } = res;
    if (!originalTest) {
        return { error: { reason: 'old-key-style' } };
    }
    const test = JSON.parse(originalTest);
    const key = await encryption.createKey({ id, password, salt });
    encryption.loadKey(key);
    try {
        await encryption.decrypt(Buffer.from(test.value, 'base64'), test.meta);
    }
    catch (e) {
        log_1.logger.log(e);
        // Unload the key, it's invalid
        encryption.unloadKey(key);
        return { error: { reason: 'decrypt-failure' } };
    }
    // Persist key in async storage
    const keys = JSON.parse((await asyncStorage.getItem(`encrypt-keys`)) || '{}');
    keys[validCloudFileId] = key.serialize();
    await asyncStorage.setItem('encrypt-keys', JSON.stringify(keys));
    // Save the key id in prefs if the are loaded. If they aren't, we
    // are testing a key to download a file and when the file is
    // actually downloaded it will update the prefs with the latest key id
    if (prefs.getPrefs()) {
        await prefs.savePrefs({ encryptKeyId: key.getId() });
    }
    return {};
}
