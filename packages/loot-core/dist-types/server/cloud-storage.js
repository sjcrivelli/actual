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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkKey = checkKey;
exports.resetSyncState = resetSyncState;
exports.exportBuffer = exportBuffer;
exports.importBuffer = importBuffer;
exports.upload = upload;
exports.possiblyUpload = possiblyUpload;
exports.removeFile = removeFile;
exports.listRemoteFiles = listRemoteFiles;
exports.getRemoteFile = getRemoteFile;
exports.download = download;
// @ts-strict-ignore
const adm_zip_1 = __importDefault(require("adm-zip"));
const uuid_1 = require("uuid");
const asyncStorage = __importStar(require("../platform/server/asyncStorage"));
const fetch_1 = require("../platform/server/fetch");
const fs = __importStar(require("../platform/server/fs"));
const log_1 = require("../platform/server/log");
const sqlite = __importStar(require("../platform/server/sqlite"));
const monthUtils = __importStar(require("../shared/months"));
const encryption = __importStar(require("./encryption"));
const errors_1 = require("./errors");
const mutators_1 = require("./mutators");
const post_1 = require("./post");
const prefs = __importStar(require("./prefs"));
const server_config_1 = require("./server-config");
const UPLOAD_FREQUENCY_IN_DAYS = 7;
async function checkHTTPStatus(res) {
    if (res.status !== 200) {
        if (res.status === 403) {
            try {
                const text = await res.text();
                const data = JSON.parse(text)?.data;
                if (data?.reason === 'token-expired') {
                    await asyncStorage.removeItem('user-token');
                    throw new errors_1.HTTPError(403, 'token-expired');
                }
            }
            catch (e) {
                if (e instanceof errors_1.HTTPError)
                    throw e;
            }
        }
        return res.text().then(str => {
            throw new errors_1.HTTPError(res.status, str);
        });
    }
    else {
        return res;
    }
}
async function fetchJSON(...args) {
    let res = await (0, fetch_1.fetch)(...args);
    res = await checkHTTPStatus(res);
    return res.json();
}
async function checkKey() {
    const userToken = await asyncStorage.getItem('user-token');
    const { cloudFileId, encryptKeyId } = prefs.getPrefs();
    let res;
    try {
        res = await (0, post_1.post)((0, server_config_1.getServer)().SYNC_SERVER + '/user-get-key', {
            token: userToken,
            fileId: cloudFileId,
        });
    }
    catch (e) {
        log_1.logger.log(e);
        return { valid: false, error: { reason: 'network' } };
    }
    return {
        valid: 
        // This == comparison is important, they could be null or undefined
        // eslint-disable-next-line eqeqeq
        res.id == encryptKeyId &&
            (encryptKeyId == null || encryption.hasKey(encryptKeyId)),
    };
}
async function resetSyncState(newKeyState) {
    const userToken = await asyncStorage.getItem('user-token');
    const { cloudFileId } = prefs.getPrefs();
    try {
        await (0, post_1.post)((0, server_config_1.getServer)().SYNC_SERVER + '/reset-user-file', {
            token: userToken,
            fileId: cloudFileId,
        });
    }
    catch (e) {
        if (e instanceof errors_1.PostError) {
            return {
                error: {
                    reason: e.reason === 'unauthorized' ? 'unauthorized' : 'network',
                },
            };
        }
        return { error: { reason: 'internal' } };
    }
    if (newKeyState) {
        try {
            await (0, post_1.post)((0, server_config_1.getServer)().SYNC_SERVER + '/user-create-key', {
                token: userToken,
                fileId: cloudFileId,
                keyId: newKeyState.key.getId(),
                keySalt: newKeyState.salt,
                testContent: newKeyState.testContent,
            });
        }
        catch (e) {
            if (e instanceof errors_1.PostError) {
                return { error: { reason: 'network' } };
            }
            return { error: { reason: 'internal' } };
        }
    }
    return {};
}
async function exportBuffer() {
    const { id, budgetName } = prefs.getPrefs();
    if (!budgetName) {
        return null;
    }
    const budgetDir = fs.getBudgetDir(id);
    // create zip
    const zipped = new adm_zip_1.default();
    // We run this in a mutator even though its not mutating anything
    // because we are reading the sqlite file from disk. We want to make
    // sure that we get a valid snapshot of it so we want this to be
    // serialized with all other mutations.
    await (0, mutators_1.runMutator)(async () => {
        const rawDbContent = await fs.readFile(fs.join(budgetDir, 'db.sqlite'), 'binary');
        // Do some post-processing of the database. We NEVER upload the cache with
        // the database; this forces new downloads to always recompute everything
        // which is not only safer, but reduces the filesize a lot.
        const memDb = await sqlite.openDatabase(rawDbContent);
        sqlite.execQuery(memDb, `
        DELETE FROM kvcache;
        DELETE FROM kvcache_key;
      `);
        const dbContent = await sqlite.exportDatabase(memDb);
        sqlite.closeDatabase(memDb);
        // mark it as a file that needs a new clock so when a new client
        // downloads it, it'll get set to a unique node
        const meta = JSON.parse(await fs.readFile(fs.join(budgetDir, 'metadata.json')));
        meta.resetClock = true;
        const metaContent = Buffer.from(JSON.stringify(meta), 'utf8');
        zipped.addFile('db.sqlite', Buffer.from(dbContent));
        zipped.addFile('metadata.json', metaContent);
    });
    return Buffer.from(zipped.toBuffer());
}
async function importBuffer(fileData, buffer) {
    let zipped, entries;
    try {
        zipped = new adm_zip_1.default(buffer);
        entries = zipped.getEntries();
    }
    catch (err) {
        throw (0, errors_1.FileDownloadError)('not-zip-file');
    }
    const dbEntry = entries.find(e => e.entryName.includes('db.sqlite'));
    const metaEntry = entries.find(e => e.entryName.includes('metadata.json'));
    if (!dbEntry || !metaEntry) {
        throw (0, errors_1.FileDownloadError)('invalid-zip-file');
    }
    const dbContent = zipped.readFile(dbEntry);
    const metaContent = zipped.readFile(metaEntry);
    let meta;
    try {
        meta = JSON.parse(metaContent.toString('utf8'));
    }
    catch (err) {
        throw (0, errors_1.FileDownloadError)('invalid-meta-file');
    }
    // Update the metadata. The stored file on the server might be
    // out-of-date with a few keys
    meta = {
        ...meta,
        cloudFileId: fileData.fileId,
        groupId: fileData.groupId,
        lastUploaded: monthUtils.currentDay(),
        encryptKeyId: fileData.encryptMeta ? fileData.encryptMeta.keyId : null,
    };
    const budgetDir = fs.getBudgetDir(meta.id);
    if (await fs.exists(budgetDir)) {
        // Don't remove the directory so that backups are retained
        const dbFile = fs.join(budgetDir, 'db.sqlite');
        const metaFile = fs.join(budgetDir, 'metadata.json');
        if (await fs.exists(dbFile)) {
            await fs.removeFile(dbFile);
        }
        if (await fs.exists(metaFile)) {
            await fs.removeFile(metaFile);
        }
    }
    else {
        await fs.mkdir(budgetDir);
    }
    await fs.writeFile(fs.join(budgetDir, 'db.sqlite'), dbContent);
    await fs.writeFile(fs.join(budgetDir, 'metadata.json'), JSON.stringify(meta));
    return { id: meta.id };
}
async function upload() {
    const userToken = await asyncStorage.getItem('user-token');
    if (!userToken) {
        throw (0, errors_1.FileUploadError)('unauthorized');
    }
    const zipContent = await exportBuffer();
    if (zipContent == null) {
        return;
    }
    const { id, groupId, budgetName, cloudFileId: originalCloudFileId, encryptKeyId, } = prefs.getPrefs();
    let cloudFileId = originalCloudFileId;
    let uploadContent = zipContent;
    let uploadMeta = null;
    // The upload process encrypts with the key tagged in the prefs for
    // the file. It will upload the file and the server is responsible
    // for checking that the key is up-to-date and rejecting it if not
    if (encryptKeyId) {
        let encrypted;
        try {
            encrypted = await encryption.encrypt(zipContent, encryptKeyId);
        }
        catch (e) {
            throw (0, errors_1.FileUploadError)('encrypt-failure', {
                isMissingKey: e.message === 'missing-key',
            });
        }
        uploadContent = encrypted.value;
        uploadMeta = encrypted.meta;
    }
    if (!cloudFileId) {
        cloudFileId = (0, uuid_1.v4)();
    }
    let res;
    try {
        res = await fetchJSON((0, server_config_1.getServer)().SYNC_SERVER + '/upload-user-file', {
            method: 'POST',
            headers: {
                'Content-Length': uploadContent.length,
                'Content-Type': 'application/encrypted-file',
                'X-ACTUAL-TOKEN': userToken,
                'X-ACTUAL-FILE-ID': cloudFileId,
                'X-ACTUAL-NAME': encodeURIComponent(budgetName),
                'X-ACTUAL-FORMAT': 2,
                ...(uploadMeta
                    ? { 'X-ACTUAL-ENCRYPT-META': JSON.stringify(uploadMeta) }
                    : null),
                ...(groupId ? { 'X-ACTUAL-GROUP-ID': groupId } : null),
                // TODO: fix me
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            },
            body: uploadContent,
        });
    }
    catch (err) {
        log_1.logger.log('Upload failure', err);
        if (err instanceof errors_1.PostError) {
            throw (0, errors_1.FileUploadError)(err.reason === 'unauthorized'
                ? 'unauthorized'
                : err.reason || 'network');
        }
        throw (0, errors_1.FileUploadError)('internal');
    }
    if (res.status === 'ok') {
        // Only save it if we are still working on the same file
        if (prefs.getPrefs() && prefs.getPrefs().id === id) {
            await prefs.savePrefs({
                lastUploaded: monthUtils.currentDay(),
                cloudFileId,
                groupId: res.groupId,
            });
        }
    }
    else {
        throw (0, errors_1.FileUploadError)('internal');
    }
}
async function possiblyUpload() {
    const { cloudFileId, groupId, lastUploaded } = prefs.getPrefs();
    const threshold = lastUploaded && monthUtils.addDays(lastUploaded, UPLOAD_FREQUENCY_IN_DAYS);
    const currentDay = monthUtils.currentDay();
    // We only want to try to upload every UPLOAD_FREQUENCY_IN_DAYS days
    if (lastUploaded && currentDay < threshold) {
        return;
    }
    // We only want to upload existing cloud files that are part of a
    // valid group
    if (!cloudFileId || !groupId) {
        return;
    }
    // Don't block on uploading
    upload().catch(() => { });
}
async function removeFile(fileId) {
    const userToken = await asyncStorage.getItem('user-token');
    await (0, post_1.post)((0, server_config_1.getServer)().SYNC_SERVER + '/delete-user-file', {
        token: userToken,
        fileId,
    });
}
async function listRemoteFiles() {
    const userToken = await asyncStorage.getItem('user-token');
    if (!userToken) {
        return null;
    }
    let res;
    try {
        res = await fetchJSON((0, server_config_1.getServer)().SYNC_SERVER + '/list-user-files', {
            headers: {
                'X-ACTUAL-TOKEN': userToken,
            },
        });
    }
    catch (e) {
        log_1.logger.log('Unexpected error fetching file list from server', e);
        return null;
    }
    if (res.status === 'error') {
        log_1.logger.log('Error fetching file list from server', res);
        return null;
    }
    return res.data
        .map(file => ({
        ...file,
        hasKey: encryption.hasKey(file.encryptKeyId),
    }))
        .filter(Boolean);
}
async function getRemoteFile(fileId) {
    const userToken = await asyncStorage.getItem('user-token');
    if (!userToken) {
        return null;
    }
    let res;
    try {
        res = await fetchJSON((0, server_config_1.getServer)().SYNC_SERVER + '/get-user-file-info', {
            headers: {
                'X-ACTUAL-TOKEN': userToken,
                'X-ACTUAL-FILE-ID': fileId,
            },
        });
    }
    catch (e) {
        log_1.logger.log('Unexpected error fetching file from server', e);
        return null;
    }
    if (res.status === 'error') {
        log_1.logger.log('Error fetching file from server', res);
        return null;
    }
    return {
        ...res.data,
        hasKey: encryption.hasKey(res.data.encryptKeyId),
    };
}
async function download(cloudFileId) {
    const userToken = await asyncStorage.getItem('user-token');
    const syncServer = (0, server_config_1.getServer)().SYNC_SERVER;
    const userFileFetch = (0, fetch_1.fetch)(`${syncServer}/download-user-file`, {
        headers: {
            'X-ACTUAL-TOKEN': userToken,
            'X-ACTUAL-FILE-ID': cloudFileId,
        },
    })
        .then(checkHTTPStatus)
        .then(res => {
        if (res.arrayBuffer) {
            return res.arrayBuffer().then(ab => Buffer.from(ab));
        }
        return res.buffer();
    })
        .catch(err => {
        log_1.logger.log('Download failure', err);
        throw (0, errors_1.FileDownloadError)('download-failure');
    });
    const userFileInfoFetch = fetchJSON(`${syncServer}/get-user-file-info`, {
        headers: {
            'X-ACTUAL-TOKEN': userToken,
            'X-ACTUAL-FILE-ID': cloudFileId,
        },
    }).catch(err => {
        log_1.logger.log('Error fetching file info', err);
        throw (0, errors_1.FileDownloadError)('internal', { fileId: cloudFileId });
    });
    const [userFileInfoRes, userFileRes] = await Promise.all([
        userFileInfoFetch,
        userFileFetch,
    ]);
    if (userFileInfoRes.status !== 'ok') {
        log_1.logger.log('Could not download file from the server. Are you sure you have the right file ID?', userFileInfoRes);
        throw (0, errors_1.FileDownloadError)('internal', { fileId: cloudFileId });
    }
    const fileData = userFileInfoRes.data;
    let buffer = userFileRes;
    // The download process checks if the server gave us decrypt
    // information. It is assumed that this key has already been loaded
    // in, which is done in a previous step
    if (fileData.encryptMeta) {
        try {
            buffer = await encryption.decrypt(buffer, fileData.encryptMeta);
        }
        catch (e) {
            throw (0, errors_1.FileDownloadError)('decrypt-failure', {
                isMissingKey: e.message === 'missing-key',
            });
        }
    }
    return importBuffer(fileData, buffer);
}
//# sourceMappingURL=cloud-storage.js.map