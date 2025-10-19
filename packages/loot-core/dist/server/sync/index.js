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
exports.fullSync = exports.applyMessages = exports.repairSync = exports.resetSync = exports.makeTestMessage = void 0;
exports.setSyncingMode = setSyncingMode;
exports.checkSyncingMode = checkSyncingMode;
exports.serializeValue = serializeValue;
exports.deserializeValue = deserializeValue;
exports.addSyncListener = addSyncListener;
exports.receiveMessages = receiveMessages;
exports.batchMessages = batchMessages;
exports.sendMessages = sendMessages;
exports.getMessagesSince = getMessagesSince;
exports.clearFullSyncTimeout = clearFullSyncTimeout;
exports.scheduleFullSync = scheduleFullSync;
exports.initialFullSync = initialFullSync;
// @ts-strict-ignore
const crdt_1 = require("@actual-app/crdt");
const exceptions_1 = require("../../platform/exceptions");
const asyncStorage = __importStar(require("../../platform/server/asyncStorage"));
const connection = __importStar(require("../../platform/server/connection"));
const log_1 = require("../../platform/server/log");
const async_1 = require("../../shared/async");
const util_1 = require("../../shared/util");
const base_1 = require("../budget/base");
const db = __importStar(require("../db"));
const errors_1 = require("../errors");
const main_app_1 = require("../main-app");
const mutators_1 = require("../mutators");
const post_1 = require("../post");
const prefs = __importStar(require("../prefs"));
const server_config_1 = require("../server-config");
const sheet = __importStar(require("../sheet"));
const undo = __importStar(require("../undo"));
const encoder = __importStar(require("./encoder"));
const repair_1 = require("./repair");
const utils_1 = require("./utils");
var make_test_message_1 = require("./make-test-message");
Object.defineProperty(exports, "makeTestMessage", { enumerable: true, get: function () { return make_test_message_1.makeTestMessage; } });
var reset_1 = require("./reset");
Object.defineProperty(exports, "resetSync", { enumerable: true, get: function () { return reset_1.resetSync; } });
var repair_2 = require("./repair");
Object.defineProperty(exports, "repairSync", { enumerable: true, get: function () { return repair_2.repairSync; } });
const FULL_SYNC_DELAY = 1000;
let SYNCING_MODE = 'enabled';
function setSyncingMode(mode) {
    const prevMode = SYNCING_MODE;
    switch (mode) {
        case 'enabled':
            SYNCING_MODE = 'enabled';
            break;
        case 'offline':
            SYNCING_MODE = 'offline';
            break;
        case 'disabled':
            SYNCING_MODE = 'disabled';
            break;
        case 'import':
            SYNCING_MODE = 'import';
            break;
        default:
            throw new Error('setSyncingMode: invalid mode: ' + mode);
    }
    return prevMode;
}
function checkSyncingMode(mode) {
    switch (mode) {
        case 'enabled':
            return SYNCING_MODE === 'enabled' || SYNCING_MODE === 'offline';
        case 'disabled':
            return SYNCING_MODE === 'disabled' || SYNCING_MODE === 'import';
        case 'offline':
            return SYNCING_MODE === 'offline';
        case 'import':
            return SYNCING_MODE === 'import';
        default:
            throw new Error('checkSyncingMode: invalid mode: ' + mode);
    }
}
function apply(msg, prev) {
    const { dataset, row, column, value } = msg;
    if (dataset === 'prefs') {
        // Do nothing, it doesn't exist in the db
    }
    else {
        let query;
        try {
            if (prev) {
                query = {
                    sql: `UPDATE ${dataset} SET ${column} = ? WHERE id = ?`,
                    params: [value, row],
                };
            }
            else {
                query = {
                    sql: `INSERT INTO ${dataset} (id, ${column}) VALUES (?, ?)`,
                    params: [row, value],
                };
            }
            db.runQuery(db.cache(query.sql), query.params);
        }
        catch (error) {
            throw new errors_1.SyncError('invalid-schema', {
                error: { message: error.message, stack: error.stack },
                query,
            });
        }
    }
}
// TODO: convert to `whereIn`
async function fetchAll(table, ids) {
    let results = [];
    // was 500, but that caused a stack overflow in Safari
    const batchSize = 100;
    for (let i = 0; i < ids.length; i += batchSize) {
        const partIds = ids.slice(i, i + batchSize);
        let sql;
        let column = `${table}.id`;
        // We have to provide *mapped* data so the spreadsheet works. The functions
        // which trigger budget changes based on data changes assumes data has been
        // mapped. The only mapped data that the budget is concerned about is
        // categories. This is kind of annoying, but we manually map it here
        if (table === 'transactions') {
            sql = `
        SELECT t.*, c.transferId AS category
        FROM transactions t
        LEFT JOIN category_mapping c ON c.id = t.category
      `;
            column = 't.id';
        }
        else {
            sql = `SELECT * FROM ${table}`;
        }
        sql += ` WHERE `;
        sql += partIds.map(() => `${column} = ?`).join(' OR ');
        try {
            const rows = await db.runQuery(sql, partIds, true);
            results = results.concat(rows);
        }
        catch (error) {
            throw new errors_1.SyncError('invalid-schema', {
                error: {
                    message: error.message,
                    stack: error.stack,
                },
                query: { sql, params: partIds },
            });
        }
    }
    return results;
}
function serializeValue(value) {
    if (value === null) {
        return '0:';
    }
    else if (typeof value === 'number') {
        return 'N:' + value;
    }
    else if (typeof value === 'string') {
        return 'S:' + value;
    }
    throw new Error('Unserializable value type: ' + JSON.stringify(value));
}
function deserializeValue(value) {
    const type = value[0];
    switch (type) {
        case '0':
            return null;
        case 'N':
            return parseFloat(value.slice(2));
        case 'S':
            return value.slice(2);
        default:
    }
    throw new Error('Invalid type key for value: ' + value);
}
let _syncListeners = [];
function addSyncListener(func) {
    _syncListeners.push(func);
    return () => {
        _syncListeners = _syncListeners.filter(f => f !== func);
    };
}
async function compareMessages(messages) {
    const newMessages = [];
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const { dataset, row, column, timestamp } = message;
        const timestampStr = timestamp.toString();
        const res = db.runQuery(db.cache('SELECT timestamp FROM messages_crdt WHERE dataset = ? AND row = ? AND column = ? AND timestamp >= ?'), [dataset, row, column, timestampStr], true);
        // Returned message is any one that is "later" than this message,
        // meaning if the result exists this message is an old one
        if (res.length === 0) {
            newMessages.push(message);
        }
        else if (res[0].timestamp !== timestampStr) {
            newMessages.push({ ...message, old: true });
        }
    }
    return newMessages;
}
// This is the fast path `apply` function when in "import" mode.
// There's no need to run through the whole sync system when
// importing, but **there is a caveat**: because we don't run sync
// listeners importers should not rely on any functions that use any
// projected state (like rules). We can't fire those because they
// depend on having both old and new data which we don't quere here
function applyMessagesForImport(messages) {
    db.transaction(() => {
        for (let i = 0; i < messages.length; i++) {
            const msg = messages[i];
            const { dataset } = msg;
            if (!msg.old) {
                try {
                    apply(msg);
                }
                catch (e) {
                    apply(msg, true);
                }
                if (dataset === 'prefs') {
                    throw new Error('Cannot set prefs while importing');
                }
            }
        }
    });
}
exports.applyMessages = (0, async_1.sequential)(async (messages) => {
    if (checkSyncingMode('import')) {
        applyMessagesForImport(messages);
        return undefined;
    }
    else if (checkSyncingMode('enabled')) {
        // Compare the messages with the existing crdt. This filters out
        // already applied messages and determines if a message is old or
        // not. An "old" message doesn't need to be applied, but it still
        // needs to be put into the merkle trie to maintain the hash.
        messages = await compareMessages(messages);
    }
    messages = [...messages].sort((m1, m2) => {
        const t1 = m1.timestamp ? m1.timestamp.toString() : '';
        const t2 = m2.timestamp ? m2.timestamp.toString() : '';
        if (t1 < t2) {
            return -1;
        }
        else if (t1 > t2) {
            return 1;
        }
        return 0;
    });
    const idsPerTable = {};
    messages.forEach(msg => {
        if (msg.dataset === 'prefs') {
            return;
        }
        if (idsPerTable[msg.dataset] == null) {
            idsPerTable[msg.dataset] = [];
        }
        idsPerTable[msg.dataset].push(msg.row);
    });
    async function fetchData() {
        const data = new Map();
        for (const table of Object.keys(idsPerTable)) {
            const rows = await fetchAll(table, idsPerTable[table]);
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                (0, util_1.setIn)(data, [table, row.id], row);
            }
        }
        return data;
    }
    const prefsToSet = {};
    const oldData = await fetchData();
    undo.appendMessages(messages, oldData);
    // It's important to not mutate the clock while processing the
    // messages. We only want to mutate it if the transaction succeeds.
    // The merkle variable will be updated while applying the messages and
    // we'll apply it afterwards.
    let clock;
    let currentMerkle;
    if (checkSyncingMode('enabled')) {
        clock = (0, crdt_1.getClock)();
        currentMerkle = clock.merkle;
    }
    if (sheet.get()) {
        sheet.get().startCacheBarrier();
    }
    // Now that we have all of the data, go through and apply the
    // messages carefully. This transaction is **crucial**: it
    // guarantees that everything is atomically committed to the
    // database, and if any part of it fails everything aborts and
    // nothing is changed. This is critical to maintain consistency. We
    // also avoid any side effects to in-memory objects, and apply them
    // after this succeeds.
    db.transaction(() => {
        const added = new Set();
        for (const msg of messages) {
            const { dataset, row, column, timestamp, value } = msg;
            if (!msg.old) {
                apply(msg, (0, util_1.getIn)(oldData, [dataset, row]) || added.has(dataset + row));
                if (dataset === 'prefs') {
                    prefsToSet[row] = value;
                }
                else {
                    // Keep track of which items have been added it in this sync
                    // so it knows whether they already exist in the db or not. We
                    // ignore any changes to the spreadsheet.
                    added.add(dataset + row);
                }
            }
            if (checkSyncingMode('enabled')) {
                db.runQuery(db.cache(`INSERT INTO messages_crdt (timestamp, dataset, row, column, value)
           VALUES (?, ?, ?, ?, ?)`), [timestamp.toString(), dataset, row, column, serializeValue(value)]);
                currentMerkle = crdt_1.merkle.insert(currentMerkle, timestamp);
            }
            // Special treatment for some synced prefs
            if (dataset === 'preferences' && row === 'budgetType') {
                (0, base_1.setType)(value);
            }
        }
        if (checkSyncingMode('enabled')) {
            currentMerkle = crdt_1.merkle.prune(currentMerkle);
            // Save the clock in the db first (queries might throw
            // exceptions)
            db.runQuery(db.cache('INSERT OR REPLACE INTO messages_clock (id, clock) VALUES (1, ?)'), [(0, crdt_1.serializeClock)({ ...clock, merkle: currentMerkle })]);
        }
    });
    if (checkSyncingMode('enabled')) {
        // The transaction succeeded, so we can update in-memory objects
        // now. Update the in-memory clock.
        clock.merkle = currentMerkle;
    }
    // Save any synced prefs
    if (Object.keys(prefsToSet).length > 0) {
        prefs.savePrefs(prefsToSet, { avoidSync: true });
        connection.send('prefs-updated');
    }
    const newData = await fetchData();
    // In testing, sometimes the spreadsheet isn't loaded, and that's ok
    if (sheet.get()) {
        // Need to clean up these APIs and make them consistent
        sheet.startTransaction();
        (0, base_1.triggerBudgetChanges)(oldData, newData);
        sheet.get().triggerDatabaseChanges(oldData, newData);
        sheet.endTransaction();
        // Allow the cache to be used in the future. At this point it's guaranteed
        // to be up-to-date because we are done mutating any other data
        sheet.get().endCacheBarrier();
    }
    _syncListeners.forEach(func => func(oldData, newData));
    const tables = getTablesFromMessages(messages.filter(msg => !msg.old));
    main_app_1.app.events.emit('sync', {
        type: 'applied',
        tables,
        data: newData,
        prevData: oldData,
    });
    return messages;
});
function receiveMessages(messages) {
    messages.forEach(msg => {
        crdt_1.Timestamp.recv(msg.timestamp);
    });
    return (0, mutators_1.runMutator)(() => (0, exports.applyMessages)(messages));
}
async function _sendMessages(messages) {
    try {
        await (0, exports.applyMessages)(messages);
    }
    catch (e) {
        if (e instanceof errors_1.SyncError) {
            if (e.reason === 'invalid-schema') {
                // We know this message came from a local modification, and it
                // couldn't apply, which doesn't make any sense. Must be a bug
                // in the code. Send a specific error type for it for a custom
                // message.
                main_app_1.app.events.emit('sync', {
                    type: 'error',
                    subtype: 'apply-failure',
                    meta: e.meta,
                });
            }
            else {
                main_app_1.app.events.emit('sync', { type: 'error', meta: e.meta });
            }
        }
        throw e;
    }
    await scheduleFullSync();
}
let IS_BATCHING = false;
let _BATCHED = [];
async function batchMessages(func) {
    if (IS_BATCHING) {
        await func();
        return;
    }
    IS_BATCHING = true;
    let batched = [];
    try {
        await func();
        // TODO: if it fails, it shouldn't apply them?
    }
    finally {
        IS_BATCHING = false;
        batched = _BATCHED;
        _BATCHED = [];
    }
    if (batched.length > 0) {
        await _sendMessages(batched);
    }
}
async function sendMessages(messages) {
    if (IS_BATCHING) {
        _BATCHED = _BATCHED.concat(messages);
    }
    else {
        return _sendMessages(messages);
    }
}
function getMessagesSince(since) {
    return db.runQuery('SELECT timestamp, dataset, row, column, value FROM messages_crdt WHERE timestamp > ?', [since], true);
}
function clearFullSyncTimeout() {
    if (syncTimeout) {
        clearTimeout(syncTimeout);
        syncTimeout = null;
    }
}
let syncTimeout = null;
function scheduleFullSync() {
    clearFullSyncTimeout();
    if (checkSyncingMode('enabled') && !checkSyncingMode('offline')) {
        if (process.env.NODE_ENV === 'test') {
            return (0, exports.fullSync)().then(res => {
                if ((0, utils_1.isError)(res)) {
                    throw res.error;
                }
                return res;
            });
        }
        else {
            syncTimeout = setTimeout(exports.fullSync, FULL_SYNC_DELAY);
        }
    }
}
function getTablesFromMessages(messages) {
    return messages.reduce((acc, message) => {
        const dataset = message.dataset === 'schedules_next_date' ? 'schedules' : message.dataset;
        if (!acc.includes(dataset)) {
            acc.push(dataset);
        }
        return acc;
    }, []);
}
// This is different than `fullSync` because it waits for the
// spreadsheet to finish any processing. This is useful if we want to
// perform a full sync and wait for everything to finish, usually if
// you're doing an initial sync before working with a file.
async function initialFullSync() {
    const result = await (0, exports.fullSync)();
    if ((0, utils_1.isError)(result)) {
        // Make sure to wait for anything in the spreadsheet to process
        await sheet.waitOnSpreadsheet();
        return result;
    }
    return {};
}
exports.fullSync = (0, async_1.once)(async function () {
    main_app_1.app.events.emit('sync', { type: 'start' });
    let messages;
    try {
        messages = await _fullSync(null, 0, null);
    }
    catch (e) {
        log_1.logger.log(e);
        if (e instanceof errors_1.SyncError) {
            if (e.reason === 'out-of-sync') {
                (0, exceptions_1.captureException)(e);
                main_app_1.app.events.emit('sync', {
                    type: 'error',
                    subtype: 'out-of-sync',
                    meta: e.meta,
                });
            }
            else if (e.reason === 'invalid-schema') {
                main_app_1.app.events.emit('sync', {
                    type: 'error',
                    subtype: 'invalid-schema',
                    meta: e.meta,
                });
            }
            else if (e.reason === 'decrypt-failure' ||
                e.reason === 'encrypt-failure') {
                main_app_1.app.events.emit('sync', {
                    type: 'error',
                    subtype: e.reason,
                    meta: e.meta,
                });
            }
            else {
                main_app_1.app.events.emit('sync', { type: 'error', meta: e.meta });
            }
        }
        else if (e instanceof errors_1.PostError) {
            log_1.logger.log(e);
            if (e.reason === 'unauthorized') {
                main_app_1.app.events.emit('sync', { type: 'unauthorized' });
                // Set the user into read-only mode
                asyncStorage.setItem('readOnly', 'true');
            }
            else if (e.reason === 'network-failure') {
                main_app_1.app.events.emit('sync', { type: 'error', subtype: 'network' });
            }
            else {
                main_app_1.app.events.emit('sync', { type: 'error', subtype: e.reason });
            }
        }
        else {
            (0, exceptions_1.captureException)(e);
            // TODO: Send the message to the client and allow them to expand & view it
            main_app_1.app.events.emit('sync', { type: 'error' });
        }
        return { error: { message: getErrorMessage(e), reason: e.reason, meta: e.meta } };
    }
    const tables = getTablesFromMessages(messages);
    main_app_1.app.events.emit('sync', {
        type: 'success',
        tables,
        syncDisabled: checkSyncingMode('disabled'),
    });
    return { messages };
});
async function _fullSync(sinceTimestamp, count, prevDiffTime) {
    const { id: currentId, cloudFileId, groupId, lastSyncedTimestamp, } = prefs.getPrefs() || {};
    clearFullSyncTimeout();
    if (checkSyncingMode('disabled') ||
        checkSyncingMode('offline') ||
        !currentId) {
        return [];
    }
    // Snapshot the point at which we are currently syncing
    const currentTime = (0, crdt_1.getClock)().timestamp.toString();
    const since = sinceTimestamp ||
        lastSyncedTimestamp ||
        // Default to 5 minutes ago
        new crdt_1.Timestamp(Date.now() - 5 * 60 * 1000, 0, '0').toString();
    const messages = getMessagesSince(since);
    const userToken = await asyncStorage.getItem('user-token');
    log_1.logger.info('Syncing since', since, messages.length, '(attempt: ' + count + ')');
    const buffer = await encoder.encode(groupId, cloudFileId, since, messages);
    // TODO: There a limit on how many messages we can send because of
    // the payload size. Right now it's at 20MB on the server. We should
    // check the worst case here and make multiple requests if it's
    // really large.
    const resBuffer = await (0, post_1.postBinary)((0, server_config_1.getServer)().SYNC_SERVER + '/sync', buffer, {
        'X-ACTUAL-TOKEN': userToken,
    });
    // Abort if the file is either no longer loaded, the group id has
    // changed because of a sync reset
    if (!prefs.getPrefs() || prefs.getPrefs().groupId !== groupId) {
        return [];
    }
    const res = await encoder.decode(resBuffer);
    log_1.logger.info('Got messages from server', res.messages.length);
    const localTimeChanged = (0, crdt_1.getClock)().timestamp.toString() !== currentTime;
    // Apply the new messages
    let receivedMessages = [];
    if (res.messages.length > 0) {
        receivedMessages = await receiveMessages(res.messages.map(msg => ({
            ...msg,
            value: deserializeValue(msg.value),
        })));
    }
    const diffTime = crdt_1.merkle.diff(res.merkle, (0, crdt_1.getClock)().merkle);
    if (diffTime !== null) {
        // This is a bit wonky, but we loop until we are in sync with the
        // server. While syncing, either the client or server could change
        // out from under us, so it might take a couple passes to
        // completely sync up. This is a check that stops the loop in case
        // we are corrupted and can't sync up. We try 10 times if we keep
        // getting the same diff time, and add a upper limit of 300 no
        // matter what (just to stop this from ever being an infinite
        // loop).
        //
        // It's slightly possible for the user to add more messages while we
        // are in `receiveMessages`, but `localTimeChanged` would still be
        // false. In that case, we don't reset the counter but it should be
        // very unlikely that this happens enough to hit the loop limit.
        if ((count >= 10 && diffTime === prevDiffTime) || count >= 100) {
            log_1.logger.info('SENT -------');
            log_1.logger.info(JSON.stringify(messages));
            log_1.logger.info('RECEIVED -------');
            log_1.logger.info(JSON.stringify(res.messages));
            const rebuiltMerkle = (0, repair_1.rebuildMerkleHash)();
            log_1.logger.log(count, 'messages:', messages.length, messages.length > 0 ? messages[0] : null, 'res.messages:', res.messages.length, res.messages.length > 0 ? res.messages[0] : null, 'clientId', (0, crdt_1.getClock)().timestamp.node(), 'groupId', groupId, 'diffTime:', diffTime, diffTime === prevDiffTime, 'local clock:', (0, crdt_1.getClock)().timestamp.toString(), (0, crdt_1.getClock)().merkle.hash, 'rebuilt hash:', rebuiltMerkle.numMessages, rebuiltMerkle.trie.hash, 'server hash:', res.merkle.hash, 'localTimeChanged:', localTimeChanged);
            if (rebuiltMerkle.trie.hash === res.merkle.hash) {
                // Rebuilding the merkle worked... but why?
                const clocks = await db.all('SELECT * FROM messages_clock');
                if (clocks.length !== 1) {
                    log_1.logger.log('Bad number of clocks:', clocks.length);
                }
                const hash = (0, crdt_1.deserializeClock)(clocks[0].clock).merkle.hash;
                log_1.logger.log('Merkle hash in db:', hash);
            }
            throw new errors_1.SyncError('out-of-sync');
        }
        receivedMessages = receivedMessages.concat(await _fullSync(new crdt_1.Timestamp(diffTime, 0, '0').toString(), 
        // If something local changed while we were syncing, always
        // reset, token the counter. We never want to think syncing failed
        // because we tried to syncing many times and couldn't sync,
        // but it was because the user kept changing stuff in the
        // middle of syncing.
        localTimeChanged ? 0 : count + 1, diffTime));
    }
    else {
        // All synced up, store the current time as a simple optimization for the next sync
        const requiresUpdate = (0, crdt_1.getClock)().timestamp.toString() !== lastSyncedTimestamp;
        if (requiresUpdate) {
            await prefs.savePrefs({
                lastSyncedTimestamp: (0, crdt_1.getClock)().timestamp.toString(),
            });
        }
    }
    return receivedMessages;
}
