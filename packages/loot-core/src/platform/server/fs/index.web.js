"use strict";
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
exports.getModifiedTime = exports.removeDirRecursively = exports.removeDir = exports.removeFile = exports.writeFile = exports.readFile = exports.copyFile = exports.size = exports.mkdir = exports.exists = exports.listDir = exports.basename = exports.init = exports.populateFileHeirarchy = exports.pathToId = exports.getDataDir = exports._setDocumentDir = exports.getBudgetDir = exports.getDocumentDir = exports.join = exports.demoBudgetPath = exports.migrationsPath = exports.bundledDatabasePath = void 0;
// @ts-strict-ignore
var absurd_sql_1 = require("absurd-sql");
var indexeddb_backend_1 = require("absurd-sql/dist/indexeddb-backend");
var connection = require("../connection");
var idb = require("../indexeddb");
var sqlite_1 = require("../sqlite");
var path_join_1 = require("./path-join");
Object.defineProperty(exports, "join", { enumerable: true, get: function () { return path_join_1.join; } });
var FS = null;
var BFS = null;
var NO_PERSIST = false;
exports.bundledDatabasePath = '/default-db.sqlite';
exports.migrationsPath = '/migrations';
exports.demoBudgetPath = '/demo-budget';
var shared_1 = require("./shared");
Object.defineProperty(exports, "getDocumentDir", { enumerable: true, get: function () { return shared_1.getDocumentDir; } });
Object.defineProperty(exports, "getBudgetDir", { enumerable: true, get: function () { return shared_1.getBudgetDir; } });
Object.defineProperty(exports, "_setDocumentDir", { enumerable: true, get: function () { return shared_1._setDocumentDir; } });
var getDataDir = function () { return process.env.ACTUAL_DATA_DIR; };
exports.getDataDir = getDataDir;
var pathToId = function (filepath) {
    return filepath.replace(/^\//, '').replace(/\//g, '-');
};
exports.pathToId = pathToId;
function _exists(filepath) {
    try {
        FS.readlink(filepath);
        return true;
    }
    catch (e) { }
    try {
        FS.stat(filepath);
        return true;
    }
    catch (e) { }
    return false;
}
function _mkdirRecursively(dir) {
    var parts = dir.split('/').filter(function (str) { return str !== ''; });
    var path = '';
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        path += '/' + part;
        if (!_exists(path)) {
            FS.mkdir(path);
        }
    }
}
function _createFile(filepath) {
    // This can create the file. Check if it exists, if not create a
    // symlink if it's a sqlite file. Otherwise store in idb
    if (!NO_PERSIST && filepath.startsWith('/documents')) {
        if (filepath.endsWith('.sqlite')) {
            // If it doesn't exist, we need to create a symlink
            if (!_exists(filepath)) {
                FS.symlink('/blocked/' + (0, exports.pathToId)(filepath), filepath);
            }
        }
        else {
            // The contents are actually stored in IndexedDB. We only write to
            // the in-memory fs to take advantage of the file hierarchy
            FS.writeFile(filepath, '!$@) this should never read !$@)');
        }
    }
    return filepath;
}
function _readFile(filepath, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var store, _a, _b, item;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(!NO_PERSIST &&
                        filepath.startsWith('/documents') &&
                        !filepath.endsWith('.sqlite'))) return [3 /*break*/, 3];
                    if (!_exists(filepath)) {
                        throw new Error('File does not exist: ' + filepath);
                    }
                    _b = (_a = idb).getStore;
                    return [4 /*yield*/, idb.getDatabase()];
                case 1:
                    store = _b.apply(_a, [_c.sent(), 'files']).store;
                    return [4 /*yield*/, idb.get(store, filepath)];
                case 2:
                    item = _c.sent();
                    if (item == null) {
                        throw new Error('File does not exist: ' + filepath);
                    }
                    if ((opts === null || opts === void 0 ? void 0 : opts.encoding) === 'utf8' && ArrayBuffer.isView(item.contents)) {
                        return [2 /*return*/, String.fromCharCode.apply(null, new Uint16Array(item.contents.buffer))];
                    }
                    return [2 /*return*/, item.contents];
                case 3:
                    if ((opts === null || opts === void 0 ? void 0 : opts.encoding) === 'utf8') {
                        return [2 /*return*/, FS.readFile(resolveLink(filepath), { encoding: 'utf8' })];
                    }
                    else if ((opts === null || opts === void 0 ? void 0 : opts.encoding) === 'binary') {
                        return [2 /*return*/, FS.readFile(resolveLink(filepath), { encoding: 'binary' })];
                    }
                    else {
                        return [2 /*return*/, FS.readFile(resolveLink(filepath))];
                    }
                    _c.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function resolveLink(path) {
    try {
        var node = FS.lookupPath(path, { follow: false }).node;
        return node.link ? FS.readlink(path) : path;
    }
    catch (e) {
        return path;
    }
}
function _writeFile(filepath, contents) {
    return __awaiter(this, void 0, void 0, function () {
        var isDb, store, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (contents instanceof ArrayBuffer) {
                        contents = new Uint8Array(contents);
                    }
                    else if (ArrayBuffer.isView(contents)) {
                        contents = new Uint8Array(contents.buffer);
                    }
                    // We always create the file if it doesn't exist, and this function
                    // setups up the file depending on its type
                    _createFile(filepath);
                    if (!(!NO_PERSIST && filepath.startsWith('/documents'))) return [3 /*break*/, 7];
                    isDb = filepath.endsWith('.sqlite');
                    _b = (_a = idb).getStore;
                    return [4 /*yield*/, idb.getDatabase()];
                case 1:
                    store = _b.apply(_a, [_c.sent(), 'files']).store;
                    if (!isDb) return [3 /*break*/, 4];
                    // We never write the contents of the database to idb ourselves.
                    // It gets handled via a symlink to the blocked fs (created by
                    // `_createFile` above). However, we still need to record an
                    // entry for the db file so the fs gets properly constructed on
                    // startup
                    return [4 /*yield*/, idb.set(store, { filepath: filepath, contents: '' })];
                case 2:
                    // We never write the contents of the database to idb ourselves.
                    // It gets handled via a symlink to the blocked fs (created by
                    // `_createFile` above). However, we still need to record an
                    // entry for the db file so the fs gets properly constructed on
                    // startup
                    _c.sent();
                    // Actually persist the data by going the FS, which will pass
                    // the data through the symlink to the blocked fs. For some
                    // reason we need to resolve symlinks ourselves.
                    return [4 /*yield*/, Promise.resolve()];
                case 3:
                    // Actually persist the data by going the FS, which will pass
                    // the data through the symlink to the blocked fs. For some
                    // reason we need to resolve symlinks ourselves.
                    _c.sent();
                    FS.writeFile(resolveLink(filepath), contents);
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, idb.set(store, { filepath: filepath, contents: contents })];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    FS.writeFile(resolveLink(filepath), contents);
                    _c.label = 8;
                case 8: return [2 /*return*/, true];
            }
        });
    });
}
function _copySqlFile(frompath, topath) {
    return __awaiter(this, void 0, void 0, function () {
        var store, _a, _b, fromitem, fromDbPath, toDbPath, fromfile, tofile, fileSize, blockSize, buffer, bufferView, i, bytesToRead;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _createFile(topath);
                    _b = (_a = idb).getStore;
                    return [4 /*yield*/, idb.getDatabase()];
                case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent(), 'files'])];
                case 2:
                    store = (_c.sent()).store;
                    return [4 /*yield*/, idb.set(store, { filepath: topath, contents: '' })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, idb.get(store, frompath)];
                case 4:
                    fromitem = _c.sent();
                    fromDbPath = (0, exports.pathToId)(fromitem.filepath);
                    toDbPath = (0, exports.pathToId)(topath);
                    fromfile = BFS.backend.createFile(fromDbPath);
                    tofile = BFS.backend.createFile(toDbPath);
                    try {
                        fromfile.open();
                        tofile.open();
                        fileSize = fromfile.meta.size;
                        blockSize = fromfile.meta.blockSize;
                        buffer = new ArrayBuffer(blockSize);
                        bufferView = new Uint8Array(buffer);
                        for (i = 0; i < fileSize; i += blockSize) {
                            bytesToRead = Math.min(blockSize, fileSize - i);
                            fromfile.read(bufferView, 0, bytesToRead, i);
                            tofile.write(bufferView, 0, bytesToRead, i);
                        }
                    }
                    catch (error) {
                        tofile.close();
                        fromfile.close();
                        _removeFile(toDbPath);
                        console.error('Failed to copy database file', error);
                        return [2 /*return*/, false];
                    }
                    finally {
                        tofile.close();
                        fromfile.close();
                    }
                    return [2 /*return*/, true];
            }
        });
    });
}
function _removeFile(filepath) {
    return __awaiter(this, void 0, void 0, function () {
        var isDb, store, _a, _b, linked;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(!NO_PERSIST && filepath.startsWith('/documents'))) return [3 /*break*/, 3];
                    isDb = filepath.endsWith('.sqlite');
                    _b = (_a = idb).getStore;
                    return [4 /*yield*/, idb.getDatabase()];
                case 1:
                    store = _b.apply(_a, [_c.sent(), 'files']).store;
                    return [4 /*yield*/, idb.del(store, filepath)];
                case 2:
                    _c.sent();
                    // If this is the database, is has been symlinked and we want to
                    // remove the actual contents
                    if (isDb) {
                        linked = resolveLink(filepath);
                        // Be resilient to fs corruption: don't throw an error by trying
                        // to remove a file that doesn't exist. For some reason the db
                        // file is gone? It's ok, just ignore it
                        if (_exists(linked)) {
                            FS.unlink(linked);
                        }
                    }
                    _c.label = 3;
                case 3:
                    // Finally, remove any in-memory instance
                    FS.unlink(filepath);
                    return [2 /*return*/];
            }
        });
    });
}
// Load files from the server that should exist by default
function populateDefaultFilesystem() {
    return __awaiter(this, void 0, void 0, function () {
        var index, files, fetchFile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(process.env.PUBLIC_URL + 'data-file-index.txt')];
                case 1: return [4 /*yield*/, (_a.sent()).text()];
                case 2:
                    index = _a.sent();
                    files = index
                        .split('\n')
                        .map(function (name) { return name.trim(); })
                        .filter(function (name) { return name !== ''; });
                    fetchFile = function (url) { return fetch(url).then(function (res) { return res.arrayBuffer(); }); };
                    // This is hardcoded. We know we must create the migrations
                    // directory, it's not worth complicating the index to support
                    // creating arbitrary folders.
                    return [4 /*yield*/, (0, exports.mkdir)('/migrations')];
                case 3:
                    // This is hardcoded. We know we must create the migrations
                    // directory, it's not worth complicating the index to support
                    // creating arbitrary folders.
                    _a.sent();
                    return [4 /*yield*/, (0, exports.mkdir)('/demo-budget')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, Promise.all(files.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                            var contents;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fetchFile(process.env.PUBLIC_URL + 'data/' + file)];
                                    case 1:
                                        contents = _a.sent();
                                        _writeFile('/' + file, contents);
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var populateFileHeirarchy = function () {
    return __awaiter(this, void 0, void 0, function () {
        var store, _a, _b, req, paths, _i, paths_1, path;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = idb).getStore;
                    return [4 /*yield*/, idb.getDatabase()];
                case 1:
                    store = _b.apply(_a, [_c.sent(), 'files']).store;
                    req = store.getAllKeys();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            // @ts-expect-error fix me
                            req.onsuccess = function (e) { return resolve(e.target.result); };
                            req.onerror = function (e) { return reject(e); };
                        })];
                case 2:
                    paths = _c.sent();
                    for (_i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
                        path = paths_1[_i];
                        _mkdirRecursively((0, exports.basename)(path));
                        _createFile(path);
                    }
                    return [2 /*return*/];
            }
        });
    });
};
exports.populateFileHeirarchy = populateFileHeirarchy;
var init = function () {
    return __awaiter(this, void 0, void 0, function () {
        var Module, backend;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Module = (0, sqlite_1._getModule)();
                    FS = Module.FS;
                    // When a user "uploads" a file, we just put it in memory in this
                    // dir and the backend takes it from there
                    FS.mkdir('/uploads');
                    // Files in /documents are actually read/written from idb.
                    // Everything in there is automatically persisted
                    FS.mkdir('/documents');
                    // Files in /blocked are handled by the BlockedFS, which is a
                    // special fs that persists files in blocks. This is necessary
                    // for sqlite3
                    FS.mkdir('/blocked');
                    if (!(process.env.NODE_ENV !== 'test')) return [3 /*break*/, 2];
                    backend = new indexeddb_backend_1.default(function () {
                        connection.send('fallback-write-error');
                    });
                    BFS = new absurd_sql_1.SQLiteFS(FS, backend);
                    Module.register_for_idb(BFS);
                    FS.mount(BFS, {}, '/blocked');
                    return [4 /*yield*/, populateDefaultFilesystem()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, (0, exports.populateFileHeirarchy)()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.init = init;
var basename = function (filepath) {
    var parts = filepath.split('/');
    return parts.slice(0, -1).join('/');
};
exports.basename = basename;
var listDir = function (filepath) {
    return __awaiter(this, void 0, void 0, function () {
        var paths;
        return __generator(this, function (_a) {
            paths = FS.readdir(filepath);
            return [2 /*return*/, paths.filter(function (p) { return p !== '.' && p !== '..'; })];
        });
    });
};
exports.listDir = listDir;
var exists = function (filepath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _exists(filepath)];
        });
    });
};
exports.exists = exists;
var mkdir = function (filepath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            FS.mkdir(filepath);
            return [2 /*return*/];
        });
    });
};
exports.mkdir = mkdir;
var size = function (filepath) {
    return __awaiter(this, void 0, void 0, function () {
        var attrs;
        return __generator(this, function (_a) {
            attrs = FS.stat(resolveLink(filepath));
            return [2 /*return*/, attrs.size];
        });
    });
};
exports.size = size;
var copyFile = function (frompath, topath) {
    return __awaiter(this, void 0, void 0, function () {
        var result, contents, error_1, secondError_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = false;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 11]);
                    return [4 /*yield*/, _readFile(frompath)];
                case 2:
                    contents = _a.sent();
                    return [4 /*yield*/, _writeFile(topath, contents)];
                case 3:
                    result = _a.sent();
                    return [3 /*break*/, 11];
                case 4:
                    error_1 = _a.sent();
                    if (!(frompath.endsWith('.sqlite') || topath.endsWith('.sqlite'))) return [3 /*break*/, 9];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, _copySqlFile(frompath, topath)];
                case 6:
                    result = _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    secondError_1 = _a.sent();
                    throw new Error("Failed to copy SQL file from ".concat(frompath, " to ").concat(topath, ": ").concat(secondError_1.message));
                case 8: return [3 /*break*/, 10];
                case 9: throw error_1;
                case 10: return [3 /*break*/, 11];
                case 11: return [2 /*return*/, result];
            }
        });
    });
};
exports.copyFile = copyFile;
var readFile = function (filepath_1) {
    return __awaiter(this, arguments, void 0, function (filepath, encoding) {
        if (encoding === void 0) { encoding = 'utf8'; }
        return __generator(this, function (_a) {
            return [2 /*return*/, _readFile(filepath, { encoding: encoding })];
        });
    });
};
exports.readFile = readFile;
var writeFile = function (filepath, contents) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _writeFile(filepath, contents)];
        });
    });
};
exports.writeFile = writeFile;
var removeFile = function (filepath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, _removeFile(filepath)];
        });
    });
};
exports.removeFile = removeFile;
var removeDir = function (filepath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            FS.rmdir(filepath);
            return [2 /*return*/];
        });
    });
};
exports.removeDir = removeDir;
var removeDirRecursively = function (dirpath) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, file, fullpath, attr;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, exports.exists)(dirpath)];
                case 1:
                    if (!_b.sent()) return [3 /*break*/, 10];
                    _i = 0;
                    return [4 /*yield*/, (0, exports.listDir)(dirpath)];
                case 2:
                    _a = _b.sent();
                    _b.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    file = _a[_i];
                    fullpath = (0, path_join_1.join)(dirpath, file);
                    attr = FS.stat(fullpath, true);
                    if (!FS.isDir(attr.mode)) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, exports.removeDirRecursively)(fullpath)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, (0, exports.removeFile)(fullpath)];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8: return [4 /*yield*/, (0, exports.removeDir)(dirpath)];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    });
};
exports.removeDirRecursively = removeDirRecursively;
var getModifiedTime = function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new Error('getModifiedTime not supported on the web (only used for backups)');
        });
    });
};
exports.getModifiedTime = getModifiedTime;
