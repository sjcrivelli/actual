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
var util_1 = require("../../../mocks/util");
// eslint-disable-next-line no-restricted-imports
var index_web_1 = require("./index.web");
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var baseURL;
    return __generator(this, function (_a) {
        baseURL = "".concat(__dirname, "/../../../../../../node_modules/@jlongster/sql.js/dist/");
        (0, util_1.patchFetchForSqlJS)(baseURL);
        return [2 /*return*/, (0, index_web_1.init)({ baseURL: baseURL })];
    });
}); });
var initSQL = "\nCREATE TABLE numbers (id TEXT PRIMARY KEY, number INTEGER);\nCREATE TABLE textstrings (id TEXT PRIMARY KEY, string TEXT);\n";
describe('Web sqlite', function () {
    it('should rollback transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var db, rows, consoleSpy;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, index_web_1.openDatabase)()];
                case 1:
                    db = _a.sent();
                    (0, index_web_1.execQuery)(db, initSQL);
                    (0, index_web_1.runQuery)(db, "INSERT INTO numbers (id, number) VALUES ('id1', 4)");
                    rows = (0, index_web_1.runQuery)(db, 'SELECT * FROM numbers', null, true);
                    expect(rows.length).toBe(1);
                    // @ts-expect-error Property 'number' does not exist on type 'unknown'
                    expect(rows[0].number).toBe(4);
                    consoleSpy = vi.spyOn(console, 'log').mockImplementation(function () { return null; });
                    expect(function () {
                        (0, index_web_1.transaction)(db, function () {
                            (0, index_web_1.runQuery)(db, "INSERT INTO numbers (id, number) VALUES ('id2', 5)");
                            (0, index_web_1.runQuery)(db, "INSERT INTO numbers (id, number) VALUES ('id3', 6)");
                            // Insert an invalid one that will error
                            (0, index_web_1.runQuery)(db, "INSERT INTO numbers (id, number) VALUES ('id1', 1)");
                        });
                    }).toThrow(/constraint failed/);
                    consoleSpy.mockRestore();
                    // Nothing should have changed in the db
                    rows = (0, index_web_1.runQuery)(db, 'SELECT * FROM numbers', null, true);
                    expect(rows.length).toBe(1);
                    // @ts-expect-error Property 'number' does not exist on type 'unknown'
                    expect(rows[0].number).toBe(4);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should support nested transactions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var db, rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, index_web_1.openDatabase)()];
                case 1:
                    db = _a.sent();
                    (0, index_web_1.execQuery)(db, initSQL);
                    (0, index_web_1.runQuery)(db, "INSERT INTO numbers (id, number) VALUES ('id1', 4)");
                    rows = (0, index_web_1.runQuery)(db, 'SELECT * FROM numbers', null, true);
                    expect(rows.length).toBe(1);
                    // @ts-expect-error Property 'number' does not exist on type 'unknown'
                    expect(rows[0].number).toBe(4);
                    (0, index_web_1.transaction)(db, function () {
                        (0, index_web_1.runQuery)(db, "INSERT INTO numbers (id, number) VALUES ('id2', 5)");
                        (0, index_web_1.runQuery)(db, "INSERT INTO numbers (id, number) VALUES ('id3', 6)");
                        // Only this transaction should fail
                        var consoleSpy = vi
                            .spyOn(console, 'log')
                            .mockImplementation(function () { return null; });
                        expect(function () {
                            (0, index_web_1.transaction)(db, function () {
                                (0, index_web_1.runQuery)(db, "INSERT INTO numbers (id, number) VALUES ('id4', 7)");
                                // Insert an invalid one that will error
                                (0, index_web_1.runQuery)(db, "INSERT INTO numbers (id, number) VALUES ('id1', 1)");
                            });
                        }).toThrow(/constraint failed/);
                        consoleSpy.mockRestore();
                    });
                    // Nothing should have changed in the db
                    rows = (0, index_web_1.runQuery)(db, 'SELECT * FROM numbers', null, true);
                    expect(rows.length).toBe(3);
                    // @ts-expect-error Property 'number' does not exist on type 'unknown'
                    expect(rows[0].number).toBe(4);
                    // @ts-expect-error Property 'number' does not exist on type 'unknown'
                    expect(rows[1].number).toBe(5);
                    // @ts-expect-error Property 'number' does not exist on type 'unknown'
                    expect(rows[2].number).toBe(6);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should match regex on text fields', function () { return __awaiter(void 0, void 0, void 0, function () {
        var db, rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, index_web_1.openDatabase)()];
                case 1:
                    db = _a.sent();
                    (0, index_web_1.execQuery)(db, initSQL);
                    (0, index_web_1.runQuery)(db, "INSERT INTO textstrings (id, string) VALUES ('id1', 'not empty string')");
                    (0, index_web_1.runQuery)(db, "INSERT INTO textstrings (id) VALUES ('id2')");
                    rows = (0, index_web_1.runQuery)(db, 'SELECT id FROM textstrings where REGEXP("n.", string)', null, true);
                    expect(rows.length).toBe(1);
                    // @ts-expect-error Property 'id' does not exist on type 'unknown'
                    expect(rows[0].id).toBe('id1');
                    return [2 /*return*/];
            }
        });
    }); });
});
