import * as asyncStorage from '../../platform/server/asyncStorage';
import * as fs from '../../platform/server/fs';
import { stringToInteger } from '../../shared/util';
import { createApp } from '../app';
import * as db from '../db';
import { getDefaultDocumentDir } from '../main';
import { mutator } from '../mutators';
import { post } from '../post';
import { getPrefs as _getMetadataPrefs, savePrefs as _saveMetadataPrefs, } from '../prefs';
import { getServer } from '../server-config';
import { undoable } from '../undo';
export const app = createApp();
app.method('preferences/save', mutator(undoable(saveSyncedPrefs)));
app.method('preferences/get', getSyncedPrefs);
app.method('save-global-prefs', saveGlobalPrefs);
app.method('load-global-prefs', loadGlobalPrefs);
app.method('save-prefs', saveMetadataPrefs);
app.method('load-prefs', loadMetadataPrefs);
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
        categoryExpandedState: stringToInteger(categoryExpandedState || '') || 0,
        maxMonths: stringToInteger(maxMonths || '') || 1,
        documentDir: documentDir || getDefaultDocumentDir(),
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
    const { cloudFileId } = _getMetadataPrefs();
    // Need to sync the budget name on the server as well
    if (prefsToSet.budgetName && cloudFileId) {
        const userToken = await asyncStorage.getItem('user-token');
        const syncServer = getServer()?.SYNC_SERVER;
        if (!syncServer) {
            throw new Error('No sync server set');
        }
        await post(syncServer + '/update-user-filename', {
            token: userToken,
            fileId: cloudFileId,
            name: prefsToSet.budgetName,
        });
    }
    await _saveMetadataPrefs(prefsToSet);
    return 'ok';
}
async function loadMetadataPrefs() {
    return _getMetadataPrefs();
}
