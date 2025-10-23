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
const asyncStorage = __importStar(require("../../platform/server/asyncStorage"));
const fs = __importStar(require("../../platform/server/fs"));
const util_1 = require("../../shared/util");
const app_1 = require("../app");
const db = __importStar(require("../db"));
const main_1 = require("../main");
const mutators_1 = require("../mutators");
const post_1 = require("../post");
const prefs_1 = require("../prefs");
const server_config_1 = require("../server-config");
const undo_1 = require("../undo");
exports.app = (0, app_1.createApp)();
exports.app.method('preferences/save', (0, mutators_1.mutator)((0, undo_1.undoable)(saveSyncedPrefs)));
exports.app.method('preferences/get', getSyncedPrefs);
exports.app.method('save-global-prefs', saveGlobalPrefs);
exports.app.method('load-global-prefs', loadGlobalPrefs);
exports.app.method('save-prefs', saveMetadataPrefs);
exports.app.method('load-prefs', loadMetadataPrefs);
async function saveSyncedPrefs({ id, value, isGlobal, }) {
    if (!id) {
        return;
    }
    await db.update('preferences', {
        id,
        value,
        ...(isGlobal !== undefined && { isGlobal: isGlobal ? 1 : 0 }),
    });
}
async function getSyncedPrefs() {
    const prefs = await db.all('SELECT id, value FROM preferences');
    return prefs.reduce((carry, { value, id }) => {
        carry[id] = value;
        return carry;
    }, {});
}
async function saveGlobalPrefs(prefs) {
    if (!prefs) {
        return 'ok';
    }
    if (prefs.maxMonths !== undefined) {
        await asyncStorage.setItem('max-months', '' + prefs.maxMonths);
    }
    if (prefs.categoryExpandedState !== undefined) {
        await asyncStorage.setItem('category-expanded-state', '' + prefs.categoryExpandedState);
    }
    if (prefs.documentDir !== undefined && (await fs.exists(prefs.documentDir))) {
        await asyncStorage.setItem('document-dir', prefs.documentDir);
    }
    if (prefs.floatingSidebar !== undefined) {
        await asyncStorage.setItem('floating-sidebar', '' + prefs.floatingSidebar);
    }
    if (prefs.language !== undefined) {
        await asyncStorage.setItem('language', prefs.language);
    }
    if (prefs.theme !== undefined) {
        await asyncStorage.setItem('theme', prefs.theme);
    }
    if (prefs.preferredDarkTheme !== undefined) {
        await asyncStorage.setItem('preferred-dark-theme', prefs.preferredDarkTheme);
    }
    if (prefs.serverSelfSignedCert !== undefined) {
        await asyncStorage.setItem('server-self-signed-cert', prefs.serverSelfSignedCert);
    }
    if (prefs.syncServerConfig !== undefined) {
        await asyncStorage.setItem('syncServerConfig', prefs.syncServerConfig);
    }
    if (prefs.notifyWhenUpdateIsAvailable !== undefined) {
        await asyncStorage.setItem('notifyWhenUpdateIsAvailable', prefs.notifyWhenUpdateIsAvailable);
    }
    return 'ok';
}
async function loadGlobalPrefs() {
    const { 'floating-sidebar': floatingSidebar, 'category-expanded-state': categoryExpandedState, 'max-months': maxMonths, 'document-dir': documentDir, 'encrypt-key': encryptKey, language, theme, 'preferred-dark-theme': preferredDarkTheme, 'server-self-signed-cert': serverSelfSignedCert, syncServerConfig, notifyWhenUpdateIsAvailable, } = await asyncStorage.multiGet([
        'floating-sidebar',
        'category-expanded-state',
        'max-months',
        'document-dir',
        'encrypt-key',
        'language',
        'theme',
        'preferred-dark-theme',
        'server-self-signed-cert',
        'syncServerConfig',
        'notifyWhenUpdateIsAvailable',
    ]);
    return {
        floatingSidebar: floatingSidebar === 'true',
        categoryExpandedState: (0, util_1.stringToInteger)(categoryExpandedState || '') || 0,
        maxMonths: (0, util_1.stringToInteger)(maxMonths || '') || 1,
        documentDir: documentDir || (0, main_1.getDefaultDocumentDir)(),
        keyId: encryptKey && JSON.parse(encryptKey).id,
        language,
        theme: theme === 'light' ||
            theme === 'dark' ||
            theme === 'auto' ||
            theme === 'development' ||
            theme === 'midnight'
            ? theme
            : 'auto',
        preferredDarkTheme: preferredDarkTheme === 'dark' || preferredDarkTheme === 'midnight'
            ? preferredDarkTheme
            : 'dark',
        serverSelfSignedCert: serverSelfSignedCert || undefined,
        syncServerConfig: syncServerConfig || undefined,
        notifyWhenUpdateIsAvailable: notifyWhenUpdateIsAvailable === undefined
            ? true
            : notifyWhenUpdateIsAvailable, // default to true
    };
}
async function saveMetadataPrefs(prefsToSet) {
    if (!prefsToSet) {
        return 'ok';
    }
    const { cloudFileId } = (0, prefs_1.getPrefs)();
    // Need to sync the budget name on the server as well
    if (prefsToSet.budgetName && cloudFileId) {
        const userToken = await asyncStorage.getItem('user-token');
        const syncServer = (0, server_config_1.getServer)()?.SYNC_SERVER;
        if (!syncServer) {
            throw new Error('No sync server set');
        }
        await (0, post_1.post)(syncServer + '/update-user-filename', {
            token: userToken,
            fileId: cloudFileId,
            name: prefsToSet.budgetName,
        });
    }
    await (0, prefs_1.savePrefs)(prefsToSet);
    return 'ok';
}
async function loadMetadataPrefs() {
    return (0, prefs_1.getPrefs)();
}
//# sourceMappingURL=app.js.map