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
exports.prepare = prepare;
exports.runQuery = runQuery;
exports.execQuery = execQuery;
exports.transaction = transaction;
exports.asyncTransaction = asyncTransaction;
exports.openDatabase = openDatabase;
exports.closeDatabase = closeDatabase;
exports.exportDatabase = exportDatabase;
// @ts-strict-ignore
var better_sqlite3_1 = require("better-sqlite3");
var uuid_1 = require("uuid");
var fs_1 = require("../fs");
var normalise_1 = require("./normalise");
var unicodeLike_1 = require("./unicodeLike");
function verifyParamTypes(sql, arr) {
    arr.forEach(function (val) {
        if (typeof val !== 'string' && typeof val !== 'number' && val !== null) {
            console.log(sql, arr);
            throw new Error('Invalid field type ' + val + ' for sql ' + sql);
        }
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); });
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
    var stmt;
    try {
        stmt = typeof sql === 'string' ? db.prepare(sql) : sql;
    }
    catch (e) {
        console.log('error', sql);
        throw e;
    }
    if (fetchAll) {
        try {
            var result = stmt.all.apply(stmt, params);
            return result;
        }
        catch (e) {
            console.log('error', sql);
            throw e;
        }
    }
    else {
        try {
            var info = stmt.run.apply(stmt, params);
            return { changes: info.changes, insertId: info.lastInsertRowid };
        }
        catch (e) {
            // console.log('error', sql);
            throw e;
        }
    }
}
function execQuery(db, sql) {
    db.exec(sql);
}
function transaction(db, fn) {
    db.transaction(fn)();
}
// **Important**: this is an unsafe function since sqlite executes
// executes statements sequentially. It would be easy for other code
// to run statements in between our transaction and get caught up in
// it. This is rarely used, and only needed for specific cases (like
// batch importing a bunch of data). Don't use this.
var transactionDepth = 0;
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
    var db = new better_sqlite3_1.default(pathOrBuffer);
    // Define Unicode-aware LOWER, UPPER, and LIKE implementation.
    // This is necessary because better-sqlite3 uses SQLite build without ICU support.
    db.function('UNICODE_LOWER', { deterministic: true }, function (arg) {
        return arg === null || arg === void 0 ? void 0 : arg.toLowerCase();
    });
    db.function('UNICODE_UPPER', { deterministic: true }, function (arg) {
        return arg === null || arg === void 0 ? void 0 : arg.toUpperCase();
    });
    db.function('UNICODE_LIKE', { deterministic: true }, unicodeLike_1.unicodeLike);
    db.function('REGEXP', { deterministic: true }, regexp);
    db.function('NORMALISE', { deterministic: true }, normalise_1.normalise);
    return db;
}
function closeDatabase(db) {
    return db.close();
}
function exportDatabase(db) {
    return __awaiter(this, void 0, void 0, function () {
        var name, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    name = "".concat(process.env.ACTUAL_DATA_DIR, "/backup-for-export-").concat((0, uuid_1.v4)(), ".db");
                    return [4 /*yield*/, db.backup(name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, fs_1.readFile)(name, 'binary')];
                case 2:
                    data = _a.sent();
                    return [4 /*yield*/, (0, fs_1.removeFile)(name)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, data];
            }
        });
    });
}
