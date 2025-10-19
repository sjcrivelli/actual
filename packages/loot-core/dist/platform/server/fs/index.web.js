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
exports.getModifiedTime = exports.removeDirRecursively = exports.removeDir = exports.removeFile = exports.writeFile = exports.readFile = exports.copyFile = exports.size = exports.mkdir = exports.exists = exports.listDir = exports.basename = exports.init = exports.populateFileHeirarchy = exports.pathToId = exports.getDataDir = exports._setDocumentDir = exports.getBudgetDir = exports.getDocumentDir = exports.join = exports.demoBudgetPath = exports.migrationsPath = exports.bundledDatabasePath = void 0;
// @ts-strict-ignore
const absurd_sql_1 = require("absurd-sql");
const indexeddb_backend_1 = __importDefault(require("absurd-sql/dist/indexeddb-backend"));
const connection = __importStar(require("../connection"));
const idb = __importStar(require("../indexeddb"));
const sqlite_1 = require("../sqlite");
const path_join_1 = require("./path-join");
Object.defineProperty(exports, "join", { enumerable: true, get: function () { return path_join_1.join; } });
let FS = null;
let BFS = null;
const NO_PERSIST = false;
exports.bundledDatabasePath = '/default-db.sqlite';
exports.migrationsPath = '/migrations';
exports.demoBudgetPath = '/demo-budget';
var shared_1 = require("./shared");
Object.defineProperty(exports, "getDocumentDir", { enumerable: true, get: function () { return shared_1.getDocumentDir; } });
Object.defineProperty(exports, "getBudgetDir", { enumerable: true, get: function () { return shared_1.getBudgetDir; } });
Object.defineProperty(exports, "_setDocumentDir", { enumerable: true, get: function () { return shared_1._setDocumentDir; } });
const getDataDir = () => process.env.ACTUAL_DATA_DIR;
exports.getDataDir = getDataDir;
const pathToId = function (filepath) {
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
    const parts = dir.split('/').filter(str => str !== '');
    let path = '';
    for (const part of parts) {
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
async function _readFile(filepath, opts) {
    // We persist stuff in /documents, but don't need to handle sqlite
    // file specifically because those are symlinked to a separate
    // filesystem and will be handled in the BlockedFS
    if (!NO_PERSIST &&
        filepath.startsWith('/documents') &&
        !filepath.endsWith('.sqlite')) {
        if (!_exists(filepath)) {
            throw new Error('File does not exist: ' + filepath);
        }
        // Grab contents from IDB
        const { store } = idb.getStore(await idb.getDatabase(), 'files');
        const item = await idb.get(store, filepath);
        if (item == null) {
            throw new Error('File does not exist: ' + filepath);
        }
        if (opts?.encoding === 'utf8' && ArrayBuffer.isView(item.contents)) {
            return String.fromCharCode.apply(null, new Uint16Array(item.contents.buffer));
        }
        return item.contents;
    }
    else {
        if (opts?.encoding === 'utf8') {
            return FS.readFile(resolveLink(filepath), { encoding: 'utf8' });
        }
        else if (opts?.encoding === 'binary') {
            return FS.readFile(resolveLink(filepath), { encoding: 'binary' });
        }
        else {
            return FS.readFile(resolveLink(filepath));
        }
    }
}
function resolveLink(path) {
    try {
        const { node } = FS.lookupPath(path, { follow: false });
        return node.link ? FS.readlink(path) : path;
    }
    catch (e) {
        return path;
    }
}
async function _writeFile(filepath, contents) {
    if (contents instanceof ArrayBuffer) {
        contents = new Uint8Array(contents);
    }
    else if (ArrayBuffer.isView(contents)) {
        contents = new Uint8Array(contents.buffer);
    }
    // We always create the file if it doesn't exist, and this function
    // setups up the file depending on its type
    _createFile(filepath);
    if (!NO_PERSIST && filepath.startsWith('/documents')) {
        const isDb = filepath.endsWith('.sqlite');
        // Write to IDB
        const { store } = idb.getStore(await idb.getDatabase(), 'files');
        if (isDb) {
            // We never write the contents of the database to idb ourselves.
            // It gets handled via a symlink to the blocked fs (created by
            // `_createFile` above). However, we still need to record an
            // entry for the db file so the fs gets properly constructed on
            // startup
            await idb.set(store, { filepath, contents: '' });
            // Actually persist the data by going the FS, which will pass
            // the data through the symlink to the blocked fs. For some
            // reason we need to resolve symlinks ourselves.
            await Promise.resolve();
            FS.writeFile(resolveLink(filepath), contents);
        }
        else {
            await idb.set(store, { filepath, contents });
        }
    }
    else {
        FS.writeFile(resolveLink(filepath), contents);
    }
    return true;
}
async function _copySqlFile(frompath, topath) {
    _createFile(topath);
    const { store } = await idb.getStore(await idb.getDatabase(), 'files');
    await idb.set(store, { filepath: topath, contents: '' });
    const fromitem = await idb.get(store, frompath);
    const fromDbPath = (0, exports.pathToId)(fromitem.filepath);
    const toDbPath = (0, exports.pathToId)(topath);
    const fromfile = BFS.backend.createFile(fromDbPath);
    const tofile = BFS.backend.createFile(toDbPath);
    try {
        fromfile.open();
        tofile.open();
        const fileSize = fromfile.meta.size;
        const blockSize = fromfile.meta.blockSize;
        const buffer = new ArrayBuffer(blockSize);
        const bufferView = new Uint8Array(buffer);
        for (let i = 0; i < fileSize; i += blockSize) {
            const bytesToRead = Math.min(blockSize, fileSize - i);
            fromfile.read(bufferView, 0, bytesToRead, i);
            tofile.write(bufferView, 0, bytesToRead, i);
        }
    }
    catch (error) {
        tofile.close();
        fromfile.close();
        _removeFile(toDbPath);
        console.error('Failed to copy database file', error);
        return false;
    }
    finally {
        tofile.close();
        fromfile.close();
    }
    return true;
}
async function _removeFile(filepath) {
    if (!NO_PERSIST && filepath.startsWith('/documents')) {
        const isDb = filepath.endsWith('.sqlite');
        // Remove from IDB
        const { store } = idb.getStore(await idb.getDatabase(), 'files');
        await idb.del(store, filepath);
        // If this is the database, is has been symlinked and we want to
        // remove the actual contents
        if (isDb) {
            const linked = resolveLink(filepath);
            // Be resilient to fs corruption: don't throw an error by trying
            // to remove a file that doesn't exist. For some reason the db
            // file is gone? It's ok, just ignore it
            if (_exists(linked)) {
                FS.unlink(linked);
            }
        }
    }
    // Finally, remove any in-memory instance
    FS.unlink(filepath);
}
// Load files from the server that should exist by default
async function populateDefaultFilesystem() {
    const index = await (await fetch(process.env.PUBLIC_URL + 'data-file-index.txt')).text();
    const files = index
        .split('\n')
        .map(name => name.trim())
        .filter(name => name !== '');
    const fetchFile = url => fetch(url).then(res => res.arrayBuffer());
    // This is hardcoded. We know we must create the migrations
    // directory, it's not worth complicating the index to support
    // creating arbitrary folders.
    await (0, exports.mkdir)('/migrations');
    await (0, exports.mkdir)('/demo-budget');
    await Promise.all(files.map(async (file) => {
        const contents = await fetchFile(process.env.PUBLIC_URL + 'data/' + file);
        _writeFile('/' + file, contents);
    }));
}
const populateFileHeirarchy = async function () {
    const { store } = idb.getStore(await idb.getDatabase(), 'files');
    const req = store.getAllKeys();
    const paths = await new Promise((resolve, reject) => {
        // @ts-expect-error fix me
        req.onsuccess = e => resolve(e.target.result);
        req.onerror = e => reject(e);
    });
    for (const path of paths) {
        _mkdirRecursively((0, exports.basename)(path));
        _createFile(path);
    }
};
exports.populateFileHeirarchy = populateFileHeirarchy;
const init = async function () {
    const Module = (0, sqlite_1._getModule)();
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
    // Jest doesn't support workers. Right now we disable the blocked fs
    // backend under testing and just test that the directory structure
    // is created correctly. We assume the the absurd-sql project tests
    // the blocked fs enough. Additionally, we don't populate the
    // default files in testing.
    if (process.env.NODE_ENV !== 'test') {
        const backend = new indexeddb_backend_1.default(() => {
            connection.send('fallback-write-error');
        });
        BFS = new absurd_sql_1.SQLiteFS(FS, backend);
        Module.register_for_idb(BFS);
        FS.mount(BFS, {}, '/blocked');
        await populateDefaultFilesystem();
    }
    await (0, exports.populateFileHeirarchy)();
};
exports.init = init;
const basename = function (filepath) {
    const parts = filepath.split('/');
    return parts.slice(0, -1).join('/');
};
exports.basename = basename;
const listDir = async function (filepath) {
    const paths = FS.readdir(filepath);
    return paths.filter(p => p !== '.' && p !== '..');
};
exports.listDir = listDir;
const exists = async function (filepath) {
    return _exists(filepath);
};
exports.exists = exists;
const mkdir = async function (filepath) {
    FS.mkdir(filepath);
};
exports.mkdir = mkdir;
const size = async function (filepath) {
    const attrs = FS.stat(resolveLink(filepath));
    return attrs.size;
};
exports.size = size;
const copyFile = async function (frompath, topath) {
    let result = false;
    try {
        const contents = await _readFile(frompath);
        result = await _writeFile(topath, contents);
    }
    catch (error) {
        if (frompath.endsWith('.sqlite') || topath.endsWith('.sqlite')) {
            try {
                result = await _copySqlFile(frompath, topath);
            }
            catch (secondError) {
                throw new Error(`Failed to copy SQL file from ${frompath} to ${topath}: ${secondError.message}`);
            }
        }
        else {
            throw error;
        }
    }
    return result;
};
exports.copyFile = copyFile;
const readFile = async function (filepath, encoding = 'utf8') {
    return _readFile(filepath, { encoding });
};
exports.readFile = readFile;
const writeFile = async function (filepath, contents) {
    return _writeFile(filepath, contents);
};
exports.writeFile = writeFile;
const removeFile = async function (filepath) {
    return _removeFile(filepath);
};
exports.removeFile = removeFile;
const removeDir = async function (filepath) {
    FS.rmdir(filepath);
};
exports.removeDir = removeDir;
const removeDirRecursively = async function (dirpath) {
    if (await (0, exports.exists)(dirpath)) {
        for (const file of await (0, exports.listDir)(dirpath)) {
            const fullpath = (0, path_join_1.join)(dirpath, file);
            // `true` here means to not follow symlinks
            const attr = FS.stat(fullpath, true);
            if (FS.isDir(attr.mode)) {
                await (0, exports.removeDirRecursively)(fullpath);
            }
            else {
                await (0, exports.removeFile)(fullpath);
            }
        }
        await (0, exports.removeDir)(dirpath);
    }
};
exports.removeDirRecursively = removeDirRecursively;
const getModifiedTime = async function () {
    throw new Error('getModifiedTime not supported on the web (only used for backups)');
};
exports.getModifiedTime = getModifiedTime;
