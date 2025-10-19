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
exports.resetSync = resetSync;
// @ts-strict-ignore
const exceptions_1 = require("../../platform/exceptions");
const asyncStorage = __importStar(require("../../platform/server/asyncStorage"));
const connection = __importStar(require("../../platform/server/connection"));
const cloudStorage = __importStar(require("../cloud-storage"));
const db = __importStar(require("../db"));
const mutators_1 = require("../mutators");
const prefs = __importStar(require("../prefs"));
async function resetSync(keyState) {
    if (!keyState) {
        // If we aren't resetting the key, make sure our key is up-to-date
        // so we don't accidentally upload a file encrypted with the wrong
        // key (or not encrypted at all)
        const { valid, error } = await cloudStorage.checkKey();
        if (error) {
            return { error };
        }
        else if (!valid) {
            return { error: { reason: 'file-has-new-key' } };
        }
    }
    const { error } = await cloudStorage.resetSyncState(keyState);
    if (error) {
        return { error };
    }
    await (0, mutators_1.runMutator)(async () => {
        // TOOD: We could automatically generate the list of tables to
        // cleanup by looking at the schema
        //
        // Be VERY careful here since we are bulk deleting data. It should
        // never delete any data that doesn't have `tombstone = 1`
        await db.execQuery(`
      DELETE FROM messages_crdt;
      DELETE FROM messages_clock;
      DELETE FROM transactions WHERE tombstone = 1;
      DELETE FROM accounts WHERE tombstone = 1;
      DELETE FROM payees WHERE tombstone = 1;
      DELETE FROM categories WHERE tombstone = 1;
      DELETE FROM category_groups WHERE tombstone = 1;
      DELETE FROM schedules WHERE tombstone = 1;
      DELETE FROM rules WHERE tombstone = 1;
      ANALYZE;
      VACUUM;
    `);
        await db.loadClock();
    });
    await prefs.savePrefs({
        groupId: null,
        lastSyncedTimestamp: null,
        lastUploaded: null,
    });
    if (keyState) {
        const { key } = keyState;
        const { cloudFileId } = prefs.getPrefs();
        // The key has changed, we need to update our local data to
        // store the new key
        // Persist key in async storage
        const keys = JSON.parse((await asyncStorage.getItem(`encrypt-keys`)) || '{}');
        keys[cloudFileId] = key.serialize();
        await asyncStorage.setItem('encrypt-keys', JSON.stringify(keys));
        // Save the key id in prefs
        await prefs.savePrefs({ encryptKeyId: key.getId() });
    }
    // Finally, upload the file to make it the "true" version that all
    // other clients need to pull down to get back in sync
    try {
        await cloudStorage.upload();
    }
    catch (e) {
        if (e.reason) {
            return { error: e };
        }
        (0, exceptions_1.captureException)(e);
        return { error: { reason: 'upload-failure' } };
    }
    finally {
        connection.send('prefs-updated');
    }
    return {};
}
