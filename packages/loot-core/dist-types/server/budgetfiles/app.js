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
// @ts-strict-ignore
const CRDT = __importStar(require("@actual-app/crdt"));
const budget_1 = require("../../mocks/budget");
const exceptions_1 = require("../../platform/exceptions");
const asyncStorage = __importStar(require("../../platform/server/asyncStorage"));
const connection = __importStar(require("../../platform/server/connection"));
const fs = __importStar(require("../../platform/server/fs"));
const log_1 = require("../../platform/server/log");
const Platform = __importStar(require("../../shared/platform"));
const app_1 = require("../app");
const budget = __importStar(require("../budget/base"));
const cloudStorage = __importStar(require("../cloud-storage"));
const db = __importStar(require("../db"));
const mappings = __importStar(require("../db/mappings"));
const importers_1 = require("../importers");
const main_app_1 = require("../main-app");
const mutators_1 = require("../mutators");
const prefs = __importStar(require("../prefs"));
const server_config_1 = require("../server-config");
const sheet = __importStar(require("../sheet"));
const sync_1 = require("../sync");
const syncMigrations = __importStar(require("../sync/migrate"));
const rules = __importStar(require("../transactions/transaction-rules"));
const undo_1 = require("../undo");
const update_1 = require("../update");
const budget_name_1 = require("../util/budget-name");
const backups_1 = require("./backups");
const DEMO_BUDGET_ID = '_demo-budget';
const TEST_BUDGET_ID = '_test-budget';
exports.app = (0, app_1.createApp)();
exports.app.method('validate-budget-name', handleValidateBudgetName);
exports.app.method('unique-budget-name', handleUniqueBudgetName);
exports.app.method('get-budgets', getBudgets);
exports.app.method('get-remote-files', getRemoteFiles);
exports.app.method('get-user-file-info', getUserFileInfo);
exports.app.method('reset-budget-cache', (0, mutators_1.mutator)(resetBudgetCache));
exports.app.method('upload-budget', uploadBudget);
exports.app.method('download-budget', downloadBudget);
exports.app.method('sync-budget', syncBudget);
exports.app.method('load-budget', loadBudget);
exports.app.method('create-demo-budget', createDemoBudget);
exports.app.method('close-budget', closeBudget);
exports.app.method('delete-budget', deleteBudget);
exports.app.method('duplicate-budget', duplicateBudget);
exports.app.method('create-budget', createBudget);
exports.app.method('import-budget', importBudget);
exports.app.method('export-budget', exportBudget);
exports.app.method('upload-file-web', uploadFileWeb);
exports.app.method('backups-get', getBackups);
exports.app.method('backup-load', loadBackup);
exports.app.method('backup-make', makeBackup);
exports.app.method('get-last-opened-backup', getLastOpenedBackup);
async function handleValidateBudgetName({ name }) {
    return (0, budget_name_1.validateBudgetName)(name);
}
async function handleUniqueBudgetName({ name }) {
    return (0, budget_name_1.uniqueBudgetName)(name);
}
async function getBudgets() {
    const paths = await fs.listDir(fs.getDocumentDir());
    const budgets = await Promise.all(paths.map(async (name) => {
        const prefsPath = fs.join(fs.getDocumentDir(), name, 'metadata.json');
        if (await fs.exists(prefsPath)) {
            let prefs;
            try {
                prefs = JSON.parse(await fs.readFile(prefsPath));
            }
            catch (e) {
                log_1.logger.log('Error parsing metadata:', e.stack);
                return null;
            }
            // We treat the directory name as the canonical id so that if
            // the user moves it around/renames/etc, nothing breaks. The
            // id is stored in prefs just for convenience (and the prefs
            // will always update to the latest given id)
            if (name !== DEMO_BUDGET_ID) {
                return {
                    id: name,
                    ...(prefs.cloudFileId ? { cloudFileId: prefs.cloudFileId } : {}),
                    ...(prefs.encryptKeyId ? { encryptKeyId: prefs.encryptKeyId } : {}),
                    ...(prefs.groupId ? { groupId: prefs.groupId } : {}),
                    ...(prefs.owner ? { owner: prefs.owner } : {}),
                    name: prefs.budgetName || '(no name)',
                };
            }
        }
        return null;
    }));
    return budgets.filter(Boolean);
}
async function getRemoteFiles() {
    return cloudStorage.listRemoteFiles();
}
async function getUserFileInfo(fileId) {
    return cloudStorage.getRemoteFile(fileId);
}
async function resetBudgetCache() {
    // Recomputing everything will update the cache
    await sheet.loadUserBudgets(db);
    sheet.get().recomputeAll();
    await sheet.waitOnSpreadsheet();
}
async function uploadBudget({ id } = {}) {
    if (id) {
        if (prefs.getPrefs()) {
            throw new Error('upload-budget: id given but prefs already loaded');
        }
        await prefs.loadPrefs(id);
    }
    try {
        await cloudStorage.upload();
    }
    catch (e) {
        log_1.logger.log(e);
        if (e.type === 'FileUploadError') {
            return { error: e };
        }
        (0, exceptions_1.captureException)(e);
        return { error: { reason: 'internal' } };
    }
    finally {
        if (id) {
            prefs.unloadPrefs();
        }
    }
    return {};
}
async function downloadBudget({ cloudFileId, }) {
    let result;
    try {
        result = await cloudStorage.download(cloudFileId);
    }
    catch (e) {
        if (e.type === 'FileDownloadError') {
            if (e.reason === 'file-exists' && e.meta.id) {
                await prefs.loadPrefs(e.meta.id);
                const name = prefs.getPrefs().budgetName;
                prefs.unloadPrefs();
                e.meta = { ...e.meta, name };
            }
            return { error: e };
        }
        else {
            (0, exceptions_1.captureException)(e);
            return { error: { reason: 'internal' } };
        }
    }
    const id = result.id;
    await closeBudget();
    await loadBudget({ id });
    result = await syncBudget();
    if (result.error) {
        return result;
    }
    return { id };
}
// open and sync, but don’t close
async function syncBudget() {
    (0, sync_1.setSyncingMode)('enabled');
    const result = await (0, sync_1.initialFullSync)();
    return result;
}
async function loadBudget({ id }) {
    const currentPrefs = prefs.getPrefs();
    if (currentPrefs) {
        if (currentPrefs.id === id) {
            // If it's already loaded, do nothing
            return {};
        }
        else {
            // Otherwise, close the currently loaded budget
            await closeBudget();
        }
    }
    const res = await _loadBudget(id);
    return res;
}
async function createDemoBudget() {
    // Make sure the read only flag isn't leftover (normally it's
    // reset when signing in, but you don't have to sign in for the
    // demo budget)
    await asyncStorage.setItem('readOnly', '');
    return createBudget({
        budgetName: 'Demo Budget',
        testMode: true,
        testBudgetId: DEMO_BUDGET_ID,
    });
}
async function closeBudget() {
    (0, exceptions_1.captureBreadcrumb)({ message: 'Closing budget' });
    // The spreadsheet may be running, wait for it to complete
    await sheet.waitOnSpreadsheet();
    sheet.unloadSpreadsheet();
    (0, sync_1.clearFullSyncTimeout)();
    await main_app_1.app.stopServices();
    await db.closeDatabase();
    try {
        await asyncStorage.setItem('lastBudget', '');
    }
    catch (e) {
        // This might fail if we are shutting down after failing to load a
        // budget. We want to unload whatever has already been loaded but
        // be resilient to anything failing
    }
    prefs.unloadPrefs();
    await (0, backups_1.stopBackupService)();
    return 'ok';
}
async function deleteBudget({ id, cloudFileId, }) {
    // If it's a cloud file, you can delete it from the server by
    // passing its cloud id
    if (cloudFileId) {
        await cloudStorage.removeFile(cloudFileId).catch(() => { });
    }
    // If a local file exists, you can delete it by passing its local id
    if (id) {
        // opening and then closing the database is a hack to be able to delete
        // the budget file if it hasn't been opened yet.  This needs a better
        // way, but works for now.
        try {
            await db.openDatabase(id);
            await db.closeDatabase();
            const budgetDir = fs.getBudgetDir(id);
            await fs.removeDirRecursively(budgetDir);
        }
        catch (e) {
            return 'fail';
        }
    }
    return 'ok';
}
async function duplicateBudget({ id, newName, cloudSync, open, }) {
    const { valid, message } = await (0, budget_name_1.validateBudgetName)(newName);
    if (!valid)
        throw new Error(message);
    const budgetDir = fs.getBudgetDir(id);
    const newId = await (0, budget_name_1.idFromBudgetName)(newName);
    // copy metadata from current budget
    // replace id with new budget id and budgetName with new budget name
    const metadataText = await fs.readFile(fs.join(budgetDir, 'metadata.json'));
    const metadata = JSON.parse(metadataText);
    metadata.id = newId;
    metadata.budgetName = newName;
    [
        'cloudFileId',
        'groupId',
        'lastUploaded',
        'encryptKeyId',
        'lastSyncedTimestamp',
    ].forEach(item => {
        if (metadata[item])
            delete metadata[item];
    });
    try {
        const newBudgetDir = fs.getBudgetDir(newId);
        await fs.mkdir(newBudgetDir);
        // write metadata for new budget
        await fs.writeFile(fs.join(newBudgetDir, 'metadata.json'), JSON.stringify(metadata));
        await fs.copyFile(fs.join(budgetDir, 'db.sqlite'), fs.join(newBudgetDir, 'db.sqlite'));
    }
    catch (error) {
        // Clean up any partially created files
        try {
            const newBudgetDir = fs.getBudgetDir(newId);
            if (await fs.exists(newBudgetDir)) {
                await fs.removeDirRecursively(newBudgetDir);
            }
        }
        catch { } // Ignore cleanup errors
        throw new Error(`Failed to duplicate budget file: ${error.message}`);
    }
    // load in and validate
    const { error } = await _loadBudget(newId);
    if (error) {
        log_1.logger.log('Error duplicating budget: ' + error);
        return error;
    }
    if (cloudSync) {
        try {
            await cloudStorage.upload();
        }
        catch (error) {
            log_1.logger.warn('Failed to sync duplicated budget to cloud:', error);
            // Ignore any errors uploading. If they are offline they should
            // still be able to create files.
        }
    }
    await closeBudget();
    if (open === 'original')
        await _loadBudget(id);
    if (open === 'copy')
        await _loadBudget(newId);
    return newId;
}
async function createBudget({ budgetName, avoidUpload, testMode, testBudgetId, } = {}) {
    let id;
    if (testMode) {
        budgetName = budgetName || 'Test Budget';
        id = testBudgetId || TEST_BUDGET_ID;
        if (await fs.exists(fs.getBudgetDir(id))) {
            await fs.removeDirRecursively(fs.getBudgetDir(id));
        }
    }
    else {
        // Generate budget name if not given
        if (!budgetName) {
            budgetName = await (0, budget_name_1.uniqueBudgetName)();
        }
        id = await (0, budget_name_1.idFromBudgetName)(budgetName);
    }
    const budgetDir = fs.getBudgetDir(id);
    await fs.mkdir(budgetDir);
    // Create the initial database
    await fs.copyFile(fs.bundledDatabasePath, fs.join(budgetDir, 'db.sqlite'));
    // Create the initial prefs file
    await fs.writeFile(fs.join(budgetDir, 'metadata.json'), JSON.stringify(prefs.getDefaultPrefs(id, budgetName)));
    // Load it in
    const { error } = await _loadBudget(id);
    if (error) {
        log_1.logger.log('Error creating budget: ' + error);
        return { error };
    }
    if (!avoidUpload && !testMode) {
        try {
            await cloudStorage.upload();
        }
        catch (e) {
            // Ignore any errors uploading. If they are offline they should
            // still be able to create files.
        }
    }
    if (testMode) {
        await (0, budget_1.createTestBudget)(main_app_1.app.handlers);
    }
    return {};
}
async function importBudget({ filepath, type, }) {
    try {
        if (!(await fs.exists(filepath))) {
            throw new Error(`File not found at the provided path: ${filepath}`);
        }
        const buffer = Buffer.from(await fs.readFile(filepath, 'binary'));
        const results = await (0, importers_1.handleBudgetImport)(type, filepath, buffer);
        return results || {};
    }
    catch (err) {
        err.message = 'Error importing budget: ' + err.message;
        (0, exceptions_1.captureException)(err);
        return { error: 'internal-error' };
    }
}
async function exportBudget() {
    try {
        return {
            data: await cloudStorage.exportBuffer(),
        };
    }
    catch (err) {
        err.message = 'Error exporting budget: ' + err.message;
        (0, exceptions_1.captureException)(err);
        return { error: 'internal-error' };
    }
}
function onSheetChange({ names }) {
    const nodes = names.map(name => {
        const node = sheet.get()._getNode(name);
        return { name: node.name, value: node.value };
    });
    connection.send('cells-changed', nodes);
}
async function _loadBudget(id) {
    let dir;
    try {
        dir = fs.getBudgetDir(id);
    }
    catch (e) {
        (0, exceptions_1.captureException)(new Error('`getBudgetDir` failed in `loadBudget`: ' + e.message));
        return { error: 'budget-not-found' };
    }
    (0, exceptions_1.captureBreadcrumb)({ message: 'Loading budget ' + dir });
    if (!(await fs.exists(dir))) {
        (0, exceptions_1.captureException)(new Error('budget directory does not exist'));
        return { error: 'budget-not-found' };
    }
    try {
        await prefs.loadPrefs(id);
        await db.openDatabase(id);
    }
    catch (e) {
        (0, exceptions_1.captureBreadcrumb)({ message: 'Error loading budget ' + id });
        (0, exceptions_1.captureException)(e);
        await closeBudget();
        return { error: 'opening-budget' };
    }
    // Older versions didn't tag the file with the current user, so do
    // so now
    if (!prefs.getPrefs().userId) {
        const userId = await asyncStorage.getItem('user-token');
        await prefs.savePrefs({ userId });
    }
    try {
        await (0, update_1.updateVersion)();
    }
    catch (e) {
        log_1.logger.warn('Error updating', e);
        let result;
        if (e.message.includes('out-of-sync-migrations')) {
            result = { error: 'out-of-sync-migrations' };
        }
        else if (e.message.includes('out-of-sync-data')) {
            result = { error: 'out-of-sync-data' };
        }
        else {
            (0, exceptions_1.captureException)(e);
            log_1.logger.info('Error updating budget ' + id, e);
            log_1.logger.log('Error updating budget', e);
            result = { error: 'loading-budget' };
        }
        await closeBudget();
        return result;
    }
    await db.loadClock();
    if (prefs.getPrefs().resetClock) {
        // If we need to generate a fresh clock, we need to generate a new
        // client id. This happens when the database is transferred to a
        // new device.
        //
        // TODO: The client id should be stored elsewhere. It shouldn't
        // work this way, but it's fine for now.
        CRDT.getClock().timestamp.setNode(CRDT.makeClientId());
        await db.runQuery('INSERT OR REPLACE INTO messages_clock (id, clock) VALUES (1, ?)', [CRDT.serializeClock(CRDT.getClock())]);
        await prefs.savePrefs({ resetClock: false });
    }
    if (!Platform.isBrowser && process.env.NODE_ENV !== 'test') {
        await (0, backups_1.startBackupService)(id);
    }
    try {
        await sheet.loadSpreadsheet(db, onSheetChange);
    }
    catch (e) {
        (0, exceptions_1.captureException)(e);
        await closeBudget();
        return { error: 'opening-budget' };
    }
    // This is a bit leaky, but we need to set the initial budget type
    const { value: budgetType = 'envelope' } = (await db.first('SELECT value from preferences WHERE id = ?', ['budgetType'])) ?? {};
    sheet.get().meta().budgetType = budgetType;
    await budget.createAllBudgets();
    // Load all the in-memory state
    await mappings.loadMappings();
    await rules.loadRules();
    await syncMigrations.listen();
    await main_app_1.app.startServices();
    (0, undo_1.clearUndo)();
    // Ensure that syncing is enabled
    if (process.env.NODE_ENV !== 'test') {
        if (id === DEMO_BUDGET_ID) {
            (0, sync_1.setSyncingMode)('disabled');
        }
        else {
            if ((0, server_config_1.getServer)()) {
                (0, sync_1.setSyncingMode)('enabled');
            }
            else {
                (0, sync_1.setSyncingMode)('disabled');
            }
            await asyncStorage.setItem('lastBudget', id);
            await cloudStorage.possiblyUpload();
        }
    }
    else {
        // we're in a test - disable the sync
        (0, sync_1.setSyncingMode)('disabled');
    }
    exports.app.events.emit('load-budget', { id });
    return {};
}
async function uploadFileWeb({ filename, contents, }) {
    if (!Platform.isBrowser) {
        return null;
    }
    await fs.writeFile('/uploads/' + filename, contents);
    return {};
}
async function getBackups({ id }) {
    return (0, backups_1.getAvailableBackups)(id);
}
async function loadBackup({ id, backupId }) {
    await (0, backups_1.loadBackup)(id, backupId);
}
async function makeBackup({ id }) {
    await (0, backups_1.makeBackup)(id);
}
async function getLastOpenedBackup() {
    const id = await asyncStorage.getItem('lastBudget');
    if (id && id !== '') {
        const budgetDir = fs.getBudgetDir(id);
        // We never want to give back a budget that does not exist on the
        // filesystem anymore, so first check that it exists
        if (await fs.exists(budgetDir)) {
            return id;
        }
    }
    return null;
}
//# sourceMappingURL=app.js.map