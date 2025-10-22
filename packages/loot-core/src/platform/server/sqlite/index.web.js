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
exports.init = init;
exports._getModule = _getModule;
exports.prepare = prepare;
exports.runQuery = runQuery;
exports.execQuery = execQuery;
exports.transaction = transaction;
exports.asyncTransaction = asyncTransaction;
exports.openDatabase = openDatabase;
exports.closeDatabase = closeDatabase;
exports.exportDatabase = exportDatabase;
// @ts-strict-ignore
var sql_js_1 = require("@jlongster/sql.js");
var normalise_1 = require("./normalise");
var unicodeLike_1 = require("./unicodeLike");
var SQL = null;
function init() {
    return __awaiter(this, arguments, void 0, function (_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.baseURL, baseURL = _c === void 0 ? process.env.PUBLIC_URL : _c;
        return __generator(this, function (_d) {
            // `initSqlJS` doesn't actually return a real promise, so make sure
            // we're returning a real one for correct semantics
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    (0, sql_js_1.default)({
                        locateFile: function (file) { return baseURL + file; },
                    }).then(function (sql) {
                        SQL = sql;
                        resolve(undefined);
                    }, function (err) {
                        reject(err);
                    });
                })];
        });
    });
}
function _getModule() {
    if (SQL == null) {
        throw new Error('_getModule: sql.js must be initialized first');
    }
    return SQL;
}
function verifyParamTypes(sql, arr) {
    if (arr === void 0) { arr = []; }
    arr.forEach(function (val) {
        if (typeof val !== 'string' && typeof val !== 'number' && val !== null) {
            throw new Error('Invalid field type ' + val + ' for sql ' + sql);
        }
    });
}
function prepare(db, sql) {
    return db.prepare(sql);
}
function runQuery(db, sql, params, fetchAll) {
    if (params === void 0) { params = []; }
    if (fetchAll === void 0) { fetchAll = false; }
    if (params) {
        verifyParamTypes(sql, params);
    }
    var stmt = typeof sql === 'string' ? db.prepare(sql) : sql;
    if (fetchAll) {
        try {
            stmt.bind(params);
            var rows = [];
            while (stmt.step()) {
                rows.push(stmt.getAsObject());
            }
            if (typeof sql === 'string') {
                stmt.free();
            }
            else {
                stmt.reset();
            }
            return rows;
        }
        catch (e) {
            console.log(sql);
            throw e;
        }
    }
    else {
        try {
            stmt.run(params);
            return { changes: db.getRowsModified() };
        }
        catch (e) {
            // console.log(sql);
            throw e;
        }
    }
}
function execQuery(db, sql) {
    db.exec(sql);
}
var transactionDepth = 0;
function transaction(db, fn) {
    var before, after, undo;
    if (transactionDepth > 0) {
        before = 'SAVEPOINT __actual_sp';
        after = 'RELEASE __actual_sp';
        undo = 'ROLLBACK TO __actual_sp';
    }
    else {
        before = 'BEGIN';
        after = 'COMMIT';
        undo = 'ROLLBACK';
    }
    execQuery(db, before);
    transactionDepth++;
    try {
        fn();
        execQuery(db, after);
    }
    catch (ex) {
        execQuery(db, undo);
        if (undo !== 'ROLLBACK') {
            execQuery(db, after);
        }
        throw ex;
    }
    finally {
        transactionDepth--;
    }
}
// See the comment about this function in index.electron.js. You
// shouldn't normally use this. I'd like to get rid of it.
function asyncTransaction(db, fn) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Support nested transactions by "coalescing" them into the parent
                    // one if one is already started
                    if (transactionDepth === 0) {
                        db.exec('BEGIN TRANSACTION');
                    }
                    transactionDepth++;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, fn()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    transactionDepth--;
                    // We always commit because rollback is more dangerous - any
                    // queries that ran *in-between* this async function would be
                    // lost. Right now we are only using transactions for speed
                    // purposes unfortunately
                    if (transactionDepth === 0) {
                        db.exec('COMMIT');
                    }
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function regexp(regex, text) {
    return new RegExp(regex).test(text || '') ? 1 : 0;
}
function openDatabase(pathOrBuffer) {
    return __awaiter(this, void 0, void 0, function () {
        var db, path, stream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db = null;
                    if (!pathOrBuffer) return [3 /*break*/, 4];
                    if (!(typeof pathOrBuffer !== 'string')) return [3 /*break*/, 1];
                    db = new SQL.Database(pathOrBuffer);
                    return [3 /*break*/, 4];
                case 1:
                    path = pathOrBuffer;
                    if (!(path !== ':memory:')) return [3 /*break*/, 4];
                    if (!(typeof SharedArrayBuffer === 'undefined')) return [3 /*break*/, 3];
                    stream = SQL.FS.open(SQL.FS.readlink(path), 'a+');
                    return [4 /*yield*/, stream.node.contents.readIfFallback()];
                case 2:
                    _a.sent();
                    SQL.FS.close(stream);
                    _a.label = 3;
                case 3:
                    db = new SQL.Database(path.includes('/blocked') ? path : SQL.FS.readlink(path), 
                    // @ts-expect-error 2nd argument missed in sql.js types
                    { filename: true });
                    db.exec("\n          PRAGMA journal_mode=MEMORY;\n          PRAGMA cache_size=-10000;\n        ");
                    _a.label = 4;
                case 4:
                    if (db === null) {
                        db = new SQL.Database();
                    }
                    // Define Unicode-aware LOWER, UPPER, and LIKE implementation.
                    // This is necessary because sql.js uses SQLite build without ICU support.
                    //
                    // Note that this function should ideally be created with a deterministic flag
                    // to allow SQLite to better optimize calls to it by factoring them out of inner loops
                    // but SQL.js does not support this: https://github.com/sql-js/sql.js/issues/551
                    db.create_function('UNICODE_LOWER', function (arg) { return arg === null || arg === void 0 ? void 0 : arg.toLowerCase(); });
                    db.create_function('UNICODE_UPPER', function (arg) { return arg === null || arg === void 0 ? void 0 : arg.toUpperCase(); });
                    db.create_function('UNICODE_LIKE', unicodeLike_1.unicodeLike);
                    db.create_function('REGEXP', regexp);
                    db.create_function('NORMALISE', normalise_1.normalise);
                    return [2 /*return*/, db];
            }
        });
    });
}
function closeDatabase(db) {
    db.close();
}
function exportDatabase(db) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db.export()];
        });
    });
}
