"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var adm_zip_1 = require("adm-zip");
var uuid_1 = require("uuid");
var asyncStorage = require("../platform/server/asyncStorage");
var fetch_1 = require("../platform/server/fetch");
var fs = require("../platform/server/fs");
var log_1 = require("../platform/server/log");
var sqlite = require("../platform/server/sqlite");
var monthUtils = require("../shared/months");
var encryption = require("./encryption");
var errors_1 = require("./errors");
var mutators_1 = require("./mutators");
var post_1 = require("./post");
var prefs = require("./prefs");
var server_config_1 = require("./server-config");
var UPLOAD_FREQUENCY_IN_DAYS = 7;
function checkHTTPStatus(res) {
    return __awaiter(this, void 0, void 0, function () {
        var text, data, e_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(res.status !== 200)) return [3 /*break*/, 7];
                    if (!(res.status === 403)) return [3 /*break*/, 6];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, res.text()];
                case 2:
                    text = _b.sent();
                    data = (_a = JSON.parse(text)) === null || _a === void 0 ? void 0 : _a.data;
                    if (!((data === null || data === void 0 ? void 0 : data.reason) === 'token-expired')) return [3 /*break*/, 4];
                    return [4 /*yield*/, asyncStorage.removeItem('user-token')];
                case 3:
                    _b.sent();
                    throw new errors_1.HTTPError(403, 'token-expired');
                case 4: return [3 /*break*/, 6];
                case 5:
                    e_1 = _b.sent();
                    if (e_1 instanceof errors_1.HTTPError)
                        throw e_1;
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, res.text().then(function (str) {
                        throw new errors_1.HTTPError(res.status, str);
                    })];
                case 7: return [2 /*return*/, res];
            }
        });
    });
}
function fetchJSON() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch_1.fetch.apply(void 0, args)];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, checkHTTPStatus(res)];
                case 2:
                    res = _a.sent();
                    return [2 /*return*/, res.json()];
            }
        });
    });
}
function checkKey() {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, _a, cloudFileId, encryptKeyId, res, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _b.sent();
                    _a = prefs.getPrefs(), cloudFileId = _a.cloudFileId, encryptKeyId = _a.encryptKeyId;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, post_1.post)((0, server_config_1.getServer)().SYNC_SERVER + '/user-get-key', {
                            token: userToken,
                            fileId: cloudFileId,
                        })];
                case 3:
                    res = _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _b.sent();
                    log_1.logger.log(e_2);
                    return [2 /*return*/, { valid: false, error: { reason: 'network' } }];
                case 5: return [2 /*return*/, {
                        valid: 
                        // This == comparison is important, they could be null or undefined
                        // eslint-disable-next-line eqeqeq
                        res.id == encryptKeyId &&
                            (encryptKeyId == null || encryption.hasKey(encryptKeyId)),
                    }];
            }
        });
    });
}
function resetSyncState(newKeyState) {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, cloudFileId, e_3, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    cloudFileId = prefs.getPrefs().cloudFileId;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, post_1.post)((0, server_config_1.getServer)().SYNC_SERVER + '/reset-user-file', {
                            token: userToken,
                            fileId: cloudFileId,
                        })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_3 = _a.sent();
                    if (e_3 instanceof errors_1.PostError) {
                        return [2 /*return*/, {
                                error: {
                                    reason: e_3.reason === 'unauthorized' ? 'unauthorized' : 'network',
                                },
                            }];
                    }
                    return [2 /*return*/, { error: { reason: 'internal' } }];
                case 5:
                    if (!newKeyState) return [3 /*break*/, 9];
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, (0, post_1.post)((0, server_config_1.getServer)().SYNC_SERVER + '/user-create-key', {
                            token: userToken,
                            fileId: cloudFileId,
                            keyId: newKeyState.key.getId(),
                            keySalt: newKeyState.salt,
                            testContent: newKeyState.testContent,
                        })];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    e_4 = _a.sent();
                    if (e_4 instanceof errors_1.PostError) {
                        return [2 /*return*/, { error: { reason: 'network' } }];
                    }
                    return [2 /*return*/, { error: { reason: 'internal' } }];
                case 9: return [2 /*return*/, {}];
            }
        });
    });
}
function exportBuffer() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, id, budgetName, budgetDir, zipped;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = prefs.getPrefs(), id = _a.id, budgetName = _a.budgetName;
                    if (!budgetName) {
                        return [2 /*return*/, null];
                    }
                    budgetDir = fs.getBudgetDir(id);
                    zipped = new adm_zip_1.default();
                    // We run this in a mutator even though its not mutating anything
                    // because we are reading the sqlite file from disk. We want to make
                    // sure that we get a valid snapshot of it so we want this to be
                    // serialized with all other mutations.
                    return [4 /*yield*/, (0, mutators_1.runMutator)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var rawDbContent, memDb, dbContent, meta, _a, _b, metaContent;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, fs.readFile(fs.join(budgetDir, 'db.sqlite'), 'binary')];
                                    case 1:
                                        rawDbContent = _c.sent();
                                        return [4 /*yield*/, sqlite.openDatabase(rawDbContent)];
                                    case 2:
                                        memDb = _c.sent();
                                        sqlite.execQuery(memDb, "\n        DELETE FROM kvcache;\n        DELETE FROM kvcache_key;\n      ");
                                        return [4 /*yield*/, sqlite.exportDatabase(memDb)];
                                    case 3:
                                        dbContent = _c.sent();
                                        sqlite.closeDatabase(memDb);
                                        _b = (_a = JSON).parse;
                                        return [4 /*yield*/, fs.readFile(fs.join(budgetDir, 'metadata.json'))];
                                    case 4:
                                        meta = _b.apply(_a, [_c.sent()]);
                                        meta.resetClock = true;
                                        metaContent = Buffer.from(JSON.stringify(meta), 'utf8');
                                        zipped.addFile('db.sqlite', Buffer.from(dbContent));
                                        zipped.addFile('metadata.json', metaContent);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    // We run this in a mutator even though its not mutating anything
                    // because we are reading the sqlite file from disk. We want to make
                    // sure that we get a valid snapshot of it so we want this to be
                    // serialized with all other mutations.
                    _b.sent();
                    return [2 /*return*/, Buffer.from(zipped.toBuffer())];
            }
        });
    });
}
function importBuffer(fileData, buffer) {
    return __awaiter(this, void 0, void 0, function () {
        var zipped, entries, dbEntry, metaEntry, dbContent, metaContent, meta, budgetDir, dbFile, metaFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    try {
                        zipped = new adm_zip_1.default(buffer);
                        entries = zipped.getEntries();
                    }
                    catch (err) {
                        throw (0, errors_1.FileDownloadError)('not-zip-file');
                    }
                    dbEntry = entries.find(function (e) { return e.entryName.includes('db.sqlite'); });
                    metaEntry = entries.find(function (e) { return e.entryName.includes('metadata.json'); });
                    if (!dbEntry || !metaEntry) {
                        throw (0, errors_1.FileDownloadError)('invalid-zip-file');
                    }
                    dbContent = zipped.readFile(dbEntry);
                    metaContent = zipped.readFile(metaEntry);
                    try {
                        meta = JSON.parse(metaContent.toString('utf8'));
                    }
                    catch (err) {
                        throw (0, errors_1.FileDownloadError)('invalid-meta-file');
                    }
                    // Update the metadata. The stored file on the server might be
                    // out-of-date with a few keys
                    meta = __assign(__assign({}, meta), { cloudFileId: fileData.fileId, groupId: fileData.groupId, lastUploaded: monthUtils.currentDay(), encryptKeyId: fileData.encryptMeta ? fileData.encryptMeta.keyId : null });
                    budgetDir = fs.getBudgetDir(meta.id);
                    return [4 /*yield*/, fs.exists(budgetDir)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 8];
                    dbFile = fs.join(budgetDir, 'db.sqlite');
                    metaFile = fs.join(budgetDir, 'metadata.json');
                    return [4 /*yield*/, fs.exists(dbFile)];
                case 2:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, fs.removeFile(dbFile)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, fs.exists(metaFile)];
                case 5:
                    if (!_a.sent()) return [3 /*break*/, 7];
                    return [4 /*yield*/, fs.removeFile(metaFile)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, fs.mkdir(budgetDir)];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10: return [4 /*yield*/, fs.writeFile(fs.join(budgetDir, 'db.sqlite'), dbContent)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, fs.writeFile(fs.join(budgetDir, 'metadata.json'), JSON.stringify(meta))];
                case 12:
                    _a.sent();
                    return [2 /*return*/, { id: meta.id }];
            }
        });
    });
}
function upload() {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, zipContent, _a, id, groupId, budgetName, originalCloudFileId, encryptKeyId, cloudFileId, uploadContent, uploadMeta, encrypted, e_5, res, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _b.sent();
                    if (!userToken) {
                        throw (0, errors_1.FileUploadError)('unauthorized');
                    }
                    return [4 /*yield*/, exportBuffer()];
                case 2:
                    zipContent = _b.sent();
                    if (zipContent == null) {
                        return [2 /*return*/];
                    }
                    _a = prefs.getPrefs(), id = _a.id, groupId = _a.groupId, budgetName = _a.budgetName, originalCloudFileId = _a.cloudFileId, encryptKeyId = _a.encryptKeyId;
                    cloudFileId = originalCloudFileId;
                    uploadContent = zipContent;
                    uploadMeta = null;
                    if (!encryptKeyId) return [3 /*break*/, 7];
                    encrypted = void 0;
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, encryption.encrypt(zipContent, encryptKeyId)];
                case 4:
                    encrypted = _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_5 = _b.sent();
                    throw (0, errors_1.FileUploadError)('encrypt-failure', {
                        isMissingKey: e_5.message === 'missing-key',
                    });
                case 6:
                    uploadContent = encrypted.value;
                    uploadMeta = encrypted.meta;
                    _b.label = 7;
                case 7:
                    if (!cloudFileId) {
                        cloudFileId = (0, uuid_1.v4)();
                    }
                    _b.label = 8;
                case 8:
                    _b.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, fetchJSON((0, server_config_1.getServer)().SYNC_SERVER + '/upload-user-file', {
                            method: 'POST',
                            headers: __assign(__assign({ 'Content-Length': uploadContent.length, 'Content-Type': 'application/encrypted-file', 'X-ACTUAL-TOKEN': userToken, 'X-ACTUAL-FILE-ID': cloudFileId, 'X-ACTUAL-NAME': encodeURIComponent(budgetName), 'X-ACTUAL-FORMAT': 2 }, (uploadMeta
                                ? { 'X-ACTUAL-ENCRYPT-META': JSON.stringify(uploadMeta) }
                                : null)), (groupId ? { 'X-ACTUAL-GROUP-ID': groupId } : null)),
                            body: uploadContent,
                        })];
                case 9:
                    res = _b.sent();
                    return [3 /*break*/, 11];
                case 10:
                    err_1 = _b.sent();
                    log_1.logger.log('Upload failure', err_1);
                    if (err_1 instanceof errors_1.PostError) {
                        throw (0, errors_1.FileUploadError)(err_1.reason === 'unauthorized'
                            ? 'unauthorized'
                            : err_1.reason || 'network');
                    }
                    throw (0, errors_1.FileUploadError)('internal');
                case 11:
                    if (!(res.status === 'ok')) return [3 /*break*/, 14];
                    if (!(prefs.getPrefs() && prefs.getPrefs().id === id)) return [3 /*break*/, 13];
                    return [4 /*yield*/, prefs.savePrefs({
                            lastUploaded: monthUtils.currentDay(),
                            cloudFileId: cloudFileId,
                            groupId: res.groupId,
                        })];
                case 12:
                    _b.sent();
                    _b.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14: throw (0, errors_1.FileUploadError)('internal');
                case 15: return [2 /*return*/];
            }
        });
    });
}
function possiblyUpload() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, cloudFileId, groupId, lastUploaded, threshold, currentDay;
        return __generator(this, function (_b) {
            _a = prefs.getPrefs(), cloudFileId = _a.cloudFileId, groupId = _a.groupId, lastUploaded = _a.lastUploaded;
            threshold = lastUploaded && monthUtils.addDays(lastUploaded, UPLOAD_FREQUENCY_IN_DAYS);
            currentDay = monthUtils.currentDay();
            // We only want to try to upload every UPLOAD_FREQUENCY_IN_DAYS days
            if (lastUploaded && currentDay < threshold) {
                return [2 /*return*/];
            }
            // We only want to upload existing cloud files that are part of a
            // valid group
            if (!cloudFileId || !groupId) {
                return [2 /*return*/];
            }
            // Don't block on uploading
            upload().catch(function () { });
            return [2 /*return*/];
        });
    });
}
function removeFile(fileId) {
    return __awaiter(this, void 0, void 0, function () {
        var userToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    return [4 /*yield*/, (0, post_1.post)((0, server_config_1.getServer)().SYNC_SERVER + '/delete-user-file', {
                            token: userToken,
                            fileId: fileId,
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function listRemoteFiles() {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, res, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken) {
                        return [2 /*return*/, null];
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fetchJSON((0, server_config_1.getServer)().SYNC_SERVER + '/list-user-files', {
                            headers: {
                                'X-ACTUAL-TOKEN': userToken,
                            },
                        })];
                case 3:
                    res = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_6 = _a.sent();
                    log_1.logger.log('Unexpected error fetching file list from server', e_6);
                    return [2 /*return*/, null];
                case 5:
                    if (res.status === 'error') {
                        log_1.logger.log('Error fetching file list from server', res);
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, res.data
                            .map(function (file) { return (__assign(__assign({}, file), { hasKey: encryption.hasKey(file.encryptKeyId) })); })
                            .filter(Boolean)];
            }
        });
    });
}
function getRemoteFile(fileId) {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, res, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _a.sent();
                    if (!userToken) {
                        return [2 /*return*/, null];
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fetchJSON((0, server_config_1.getServer)().SYNC_SERVER + '/get-user-file-info', {
                            headers: {
                                'X-ACTUAL-TOKEN': userToken,
                                'X-ACTUAL-FILE-ID': fileId,
                            },
                        })];
                case 3:
                    res = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_7 = _a.sent();
                    log_1.logger.log('Unexpected error fetching file from server', e_7);
                    return [2 /*return*/, null];
                case 5:
                    if (res.status === 'error') {
                        log_1.logger.log('Error fetching file from server', res);
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, __assign(__assign({}, res.data), { hasKey: encryption.hasKey(res.data.encryptKeyId) })];
            }
        });
    });
}
function download(cloudFileId) {
    return __awaiter(this, void 0, void 0, function () {
        var userToken, syncServer, userFileFetch, userFileInfoFetch, _a, userFileInfoRes, userFileRes, fileData, buffer, e_8;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, asyncStorage.getItem('user-token')];
                case 1:
                    userToken = _b.sent();
                    syncServer = (0, server_config_1.getServer)().SYNC_SERVER;
                    userFileFetch = (0, fetch_1.fetch)("".concat(syncServer, "/download-user-file"), {
                        headers: {
                            'X-ACTUAL-TOKEN': userToken,
                            'X-ACTUAL-FILE-ID': cloudFileId,
                        },
                    })
                        .then(checkHTTPStatus)
                        .then(function (res) {
                        if (res.arrayBuffer) {
                            return res.arrayBuffer().then(function (ab) { return Buffer.from(ab); });
                        }
                        return res.buffer();
                    })
                        .catch(function (err) {
                        log_1.logger.log('Download failure', err);
                        throw (0, errors_1.FileDownloadError)('download-failure');
                    });
                    userFileInfoFetch = fetchJSON("".concat(syncServer, "/get-user-file-info"), {
                        headers: {
                            'X-ACTUAL-TOKEN': userToken,
                            'X-ACTUAL-FILE-ID': cloudFileId,
                        },
                    }).catch(function (err) {
                        log_1.logger.log('Error fetching file info', err);
                        throw (0, errors_1.FileDownloadError)('internal', { fileId: cloudFileId });
                    });
                    return [4 /*yield*/, Promise.all([
                            userFileInfoFetch,
                            userFileFetch,
                        ])];
                case 2:
                    _a = _b.sent(), userFileInfoRes = _a[0], userFileRes = _a[1];
                    if (userFileInfoRes.status !== 'ok') {
                        log_1.logger.log('Could not download file from the server. Are you sure you have the right file ID?', userFileInfoRes);
                        throw (0, errors_1.FileDownloadError)('internal', { fileId: cloudFileId });
                    }
                    fileData = userFileInfoRes.data;
                    buffer = userFileRes;
                    if (!fileData.encryptMeta) return [3 /*break*/, 6];
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, encryption.decrypt(buffer, fileData.encryptMeta)];
                case 4:
                    buffer = _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_8 = _b.sent();
                    throw (0, errors_1.FileDownloadError)('decrypt-failure', {
                        isMissingKey: e_8.message === 'missing-key',
                    });
                case 6: return [2 /*return*/, importBuffer(fileData, buffer)];
            }
        });
    });
}
