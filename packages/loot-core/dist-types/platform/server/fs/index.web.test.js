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
// @ts-strict-ignore
require("fake-indexeddb/auto");
const fake_indexeddb_1 = require("fake-indexeddb");
const util_1 = require("../../../mocks/util");
const idb = __importStar(require("../indexeddb"));
const sqlite = __importStar(require("../sqlite"));
const index_1 = require("./index");
beforeAll(() => {
    const baseURL = `${__dirname}/../../../../../../node_modules/@jlongster/sql.js/dist/`;
    (0, util_1.patchFetchForSqlJS)(baseURL);
    process.env.PUBLIC_URL = baseURL;
});
beforeEach(() => {
    global.indexedDB = new fake_indexeddb_1.IDBFactory();
});
afterEach(() => {
    sqlite._getModule().reset_filesystem();
});
describe('web filesystem', () => {
    test('basic reads/writes are stored in idb', async () => {
        await idb.openDatabase();
        await sqlite.init();
        await (0, index_1.init)();
        // Text file
        await (0, index_1.writeFile)('/documents/foo.txt', 'hello');
        expect(await (0, index_1.readFile)('/documents/foo.txt')).toBe('hello');
        // Binary file
        const str = 'hello, world';
        const buf = new ArrayBuffer(str.length * 2);
        const view = new Uint16Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            view[i] = str.charCodeAt(i);
        }
        await (0, index_1.writeFile)('/documents/foo.bin', buf);
        expect(await (0, index_1.readFile)('/documents/foo.bin')).toBe('hello, world');
        const db = await idb.openDatabase();
        const { store } = await idb.getStore(db, 'files');
        // Make sure they are in idb
        expect(await idb.get(store, '/documents/foo.txt')).toEqual({
            filepath: '/documents/foo.txt',
            contents: 'hello',
        });
        const binResult = await idb.get(store, '/documents/foo.bin');
        expect(binResult.filepath).toBe('/documents/foo.bin');
        expect(Array.from(binResult.contents)).toEqual(Array.from(new Uint8Array(buf)));
        // Write a file outside of documents
        await (0, index_1.writeFile)('/outside.txt', 'some junk');
        expect(await (0, index_1.readFile)('/outside.txt')).toBe('some junk');
        expect(await idb.get(store, '/outside.txt')).toBe(undefined);
        await idb.closeDatabase();
    });
    test('writing to sqlite files creates symlinks', async () => {
        await idb.openDatabase();
        await sqlite.init();
        await (0, index_1.init)();
        await (0, index_1.writeFile)('/documents/db.sqlite', 'some junk');
        expect(await (0, index_1.readFile)('/documents/db.sqlite')).toBe('some junk');
        expect(await (0, index_1.readFile)('/blocked/' + (0, index_1.pathToId)('/documents/db.sqlite'))).toBe('some junk');
    });
    test('files are restored from idb', async () => {
        const db = await idb.openDatabase();
        const { store } = await idb.getStore(db, 'files');
        idb.set(store, { filepath: '/documents/ok.txt', contents: 'oh yeah' });
        idb.set(store, {
            filepath: '/documents/deep/nested/file/ok.txt',
            contents: 'deeper',
        });
        idb.set(store, {
            filepath: '/documents/deep/nested/db.sqlite',
            contents: 'this will be blank and just create a symlink',
        });
        await sqlite.init();
        await (0, index_1.init)();
        expect(await (0, index_1.readFile)('/documents/ok.txt')).toBe('oh yeah');
        expect(await (0, index_1.exists)('/documents/deep')).toBe(true);
        expect(await (0, index_1.readFile)('/documents/deep/nested/file/ok.txt')).toBe('deeper');
        const FS = sqlite._getModule().FS;
        const { node } = FS.lookupPath('/documents/deep/nested/db.sqlite', {});
        expect(node.link).toBe('/blocked/' + (0, index_1.pathToId)('/documents/deep/nested/db.sqlite'));
    });
});
describe('join', () => {
    test('basic join works', () => {
        expect((0, index_1.join)('foo', 'bar')).toBe('foo/bar');
        expect((0, index_1.join)('/foo', 'bar')).toBe('/foo/bar');
        expect((0, index_1.join)('/foo', '../bar')).toBe('/bar');
    });
});
//# sourceMappingURL=index.web.test.js.map