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
// @ts-strict-ignore
require("fake-indexeddb/auto");
var fake_indexeddb_1 = require("fake-indexeddb");
var util_1 = require("../../../mocks/util");
var idb = require("../indexeddb");
var sqlite = require("../sqlite");
var index_1 = require("./index");
beforeAll(function () {
    var baseURL = "".concat(__dirname, "/../../../../../../node_modules/@jlongster/sql.js/dist/");
    (0, util_1.patchFetchForSqlJS)(baseURL);
    process.env.PUBLIC_URL = baseURL;
});
beforeEach(function () {
    global.indexedDB = new fake_indexeddb_1.IDBFactory();
});
afterEach(function () {
    sqlite._getModule().reset_filesystem();
});
describe('web filesystem', function () {
    test('basic reads/writes are stored in idb', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, str, buf, view, i, strLen, _b, db, store, _c, binResult, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, idb.openDatabase()];
                case 1:
                    _f.sent();
                    return [4 /*yield*/, sqlite.init()];
                case 2:
                    _f.sent();
                    return [4 /*yield*/, (0, index_1.init)()];
                case 3:
                    _f.sent();
                    // Text file
                    return [4 /*yield*/, (0, index_1.writeFile)('/documents/foo.txt', 'hello')];
                case 4:
                    // Text file
                    _f.sent();
                    _a = expect;
                    return [4 /*yield*/, (0, index_1.readFile)('/documents/foo.txt')];
                case 5:
                    _a.apply(void 0, [_f.sent()]).toBe('hello');
                    str = 'hello, world';
                    buf = new ArrayBuffer(str.length * 2);
                    view = new Uint16Array(buf);
                    for (i = 0, strLen = str.length; i < strLen; i++) {
                        view[i] = str.charCodeAt(i);
                    }
                    return [4 /*yield*/, (0, index_1.writeFile)('/documents/foo.bin', buf)];
                case 6:
                    _f.sent();
                    _b = expect;
                    return [4 /*yield*/, (0, index_1.readFile)('/documents/foo.bin')];
                case 7:
                    _b.apply(void 0, [_f.sent()]).toBe('hello, world');
                    return [4 /*yield*/, idb.openDatabase()];
                case 8:
                    db = _f.sent();
                    return [4 /*yield*/, idb.getStore(db, 'files')];
                case 9:
                    store = (_f.sent()).store;
                    // Make sure they are in idb
                    _c = expect;
                    return [4 /*yield*/, idb.get(store, '/documents/foo.txt')];
                case 10:
                    // Make sure they are in idb
                    _c.apply(void 0, [_f.sent()]).toEqual({
                        filepath: '/documents/foo.txt',
                        contents: 'hello',
                    });
                    return [4 /*yield*/, idb.get(store, '/documents/foo.bin')];
                case 11:
                    binResult = _f.sent();
                    expect(binResult.filepath).toBe('/documents/foo.bin');
                    expect(Array.from(binResult.contents)).toEqual(Array.from(new Uint8Array(buf)));
                    // Write a file outside of documents
                    return [4 /*yield*/, (0, index_1.writeFile)('/outside.txt', 'some junk')];
                case 12:
                    // Write a file outside of documents
                    _f.sent();
                    _d = expect;
                    return [4 /*yield*/, (0, index_1.readFile)('/outside.txt')];
                case 13:
                    _d.apply(void 0, [_f.sent()]).toBe('some junk');
                    _e = expect;
                    return [4 /*yield*/, idb.get(store, '/outside.txt')];
                case 14:
                    _e.apply(void 0, [_f.sent()]).toBe(undefined);
                    return [4 /*yield*/, idb.closeDatabase()];
                case 15:
                    _f.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('writing to sqlite files creates symlinks', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, idb.openDatabase()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, sqlite.init()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, index_1.init)()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, index_1.writeFile)('/documents/db.sqlite', 'some junk')];
                case 4:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, (0, index_1.readFile)('/documents/db.sqlite')];
                case 5:
                    _a.apply(void 0, [_c.sent()]).toBe('some junk');
                    _b = expect;
                    return [4 /*yield*/, (0, index_1.readFile)('/blocked/' + (0, index_1.pathToId)('/documents/db.sqlite'))];
                case 6:
                    _b.apply(void 0, [_c.sent()]).toBe('some junk');
                    return [2 /*return*/];
            }
        });
    }); });
    test('files are restored from idb', function () { return __awaiter(void 0, void 0, void 0, function () {
        var db, store, _a, _b, _c, FS, node;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, idb.openDatabase()];
                case 1:
                    db = _d.sent();
                    return [4 /*yield*/, idb.getStore(db, 'files')];
                case 2:
                    store = (_d.sent()).store;
                    idb.set(store, { filepath: '/documents/ok.txt', contents: 'oh yeah' });
                    idb.set(store, {
                        filepath: '/documents/deep/nested/file/ok.txt',
                        contents: 'deeper',
                    });
                    idb.set(store, {
                        filepath: '/documents/deep/nested/db.sqlite',
                        contents: 'this will be blank and just create a symlink',
                    });
                    return [4 /*yield*/, sqlite.init()];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, (0, index_1.init)()];
                case 4:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, (0, index_1.readFile)('/documents/ok.txt')];
                case 5:
                    _a.apply(void 0, [_d.sent()]).toBe('oh yeah');
                    _b = expect;
                    return [4 /*yield*/, (0, index_1.exists)('/documents/deep')];
                case 6:
                    _b.apply(void 0, [_d.sent()]).toBe(true);
                    _c = expect;
                    return [4 /*yield*/, (0, index_1.readFile)('/documents/deep/nested/file/ok.txt')];
                case 7:
                    _c.apply(void 0, [_d.sent()]).toBe('deeper');
                    FS = sqlite._getModule().FS;
                    node = FS.lookupPath('/documents/deep/nested/db.sqlite', {}).node;
                    expect(node.link).toBe('/blocked/' + (0, index_1.pathToId)('/documents/deep/nested/db.sqlite'));
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('join', function () {
    test('basic join works', function () {
        expect((0, index_1.join)('foo', 'bar')).toBe('foo/bar');
        expect((0, index_1.join)('/foo', 'bar')).toBe('/foo/bar');
        expect((0, index_1.join)('/foo', '../bar')).toBe('/bar');
    });
});
