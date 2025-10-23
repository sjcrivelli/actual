"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const uuid_1 = require("uuid");
const fs_1 = require("../fs");
const normalise_1 = require("./normalise");
const unicodeLike_1 = require("./unicodeLike");
function verifyParamTypes(sql, arr) {
    arr.forEach(val => {
        if (typeof val !== 'string' && typeof val !== 'number' && val !== null) {
            console.log(sql, arr);
            throw new Error('Invalid field type ' + val + ' for sql ' + sql);
        }
    });
}
async function init() { }
function prepare(db, sql) {
    return db.prepare(sql);
}
function runQuery(db, sql, params = [], fetchAll = false) {
    if (params) {
        verifyParamTypes(sql, params);
    }
    let stmt;
    try {
        stmt = typeof sql === 'string' ? db.prepare(sql) : sql;
    }
    catch (e) {
        console.log('error', sql);
        throw e;
    }
    if (fetchAll) {
        try {
            const result = stmt.all(...params);
            return result;
        }
        catch (e) {
            console.log('error', sql);
            throw e;
        }
    }
    else {
        try {
            const info = stmt.run(...params);
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
let transactionDepth = 0;
async function asyncTransaction(db, fn) {
    // Support nested transactions by "coalescing" them into the parent
    // one if one is already started
    if (transactionDepth === 0) {
        db.exec('BEGIN TRANSACTION');
    }
    transactionDepth++;
    try {
        await fn();
    }
    finally {
        transactionDepth--;
        // We always commit because rollback is more dangerous - any
        // queries that ran *in-between* this async function would be
        // lost. Right now we are only using transactions for speed
        // purposes unfortunately
        if (transactionDepth === 0) {
            db.exec('COMMIT');
        }
    }
}
function regexp(regex, text) {
    return new RegExp(regex).test(text || '') ? 1 : 0;
}
function openDatabase(pathOrBuffer) {
    const db = new better_sqlite3_1.default(pathOrBuffer);
    // Define Unicode-aware LOWER, UPPER, and LIKE implementation.
    // This is necessary because better-sqlite3 uses SQLite build without ICU support.
    db.function('UNICODE_LOWER', { deterministic: true }, (arg) => arg?.toLowerCase());
    db.function('UNICODE_UPPER', { deterministic: true }, (arg) => arg?.toUpperCase());
    db.function('UNICODE_LIKE', { deterministic: true }, unicodeLike_1.unicodeLike);
    db.function('REGEXP', { deterministic: true }, regexp);
    db.function('NORMALISE', { deterministic: true }, normalise_1.normalise);
    return db;
}
function closeDatabase(db) {
    return db.close();
}
async function exportDatabase(db) {
    // electron does not support better-sqlite serialize since v21
    // save to file and read in the raw data.
    const name = `${process.env.ACTUAL_DATA_DIR}/backup-for-export-${(0, uuid_1.v4)()}.db`;
    await db.backup(name);
    const data = await (0, fs_1.readFile)(name, 'binary');
    await (0, fs_1.removeFile)(name);
    return data;
}
//# sourceMappingURL=index.electron.js.map