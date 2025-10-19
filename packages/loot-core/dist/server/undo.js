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
exports.appendMessages = appendMessages;
exports.clearUndo = clearUndo;
exports.withUndo = withUndo;
exports.undoable = undoable;
exports.undo = undo;
exports.redo = redo;
// @ts-strict-ignore
const crdt_1 = require("@actual-app/crdt");
const connection = __importStar(require("../platform/server/connection"));
const util_1 = require("../shared/util");
const mutators_1 = require("./mutators");
const sync_1 = require("./sync");
let MESSAGE_HISTORY = [
    { type: 'marker' },
];
let CURSOR = 0;
const HISTORY_SIZE = 20;
function trimHistory() {
    MESSAGE_HISTORY = MESSAGE_HISTORY.slice(0, CURSOR + 1);
    const markers = MESSAGE_HISTORY.filter(item => item.type === 'marker');
    if (markers.length > HISTORY_SIZE) {
        const slice = markers.slice(-HISTORY_SIZE);
        const cutoff = MESSAGE_HISTORY.indexOf(slice[0]);
        MESSAGE_HISTORY = MESSAGE_HISTORY.slice(cutoff);
        CURSOR = MESSAGE_HISTORY.length - 1;
    }
}
function appendMessages(messages, oldData) {
    const context = (0, mutators_1.getMutatorContext)();
    if (context.undoListening && messages.length > 0) {
        trimHistory();
        const { undoTag } = context;
        MESSAGE_HISTORY.push({
            type: 'messages',
            messages,
            oldData,
            undoTag,
        });
        CURSOR++;
    }
}
function clearUndo() {
    MESSAGE_HISTORY = [{ type: 'marker' }];
    CURSOR = 0;
}
function withUndo(func, meta) {
    const context = (0, mutators_1.getMutatorContext)();
    if (context.undoDisabled || context.undoListening) {
        return func();
    }
    MESSAGE_HISTORY = MESSAGE_HISTORY.slice(0, CURSOR + 1);
    const marker = { type: 'marker', meta };
    if (MESSAGE_HISTORY[MESSAGE_HISTORY.length - 1].type === 'marker') {
        MESSAGE_HISTORY[MESSAGE_HISTORY.length - 1] = marker;
    }
    else {
        MESSAGE_HISTORY.push(marker);
        CURSOR++;
    }
    return (0, mutators_1.withMutatorContext)({ undoListening: true, undoTag: context.undoTag }, func);
}
function undoable(func, metaFunc) {
    return (...args) => {
        return withUndo(() => {
            return func.apply(null, args);
        }, metaFunc ? metaFunc(...args) : undefined);
    };
}
async function applyUndoAction(messages, meta, undoTag) {
    await (0, mutators_1.withMutatorContext)({ undoListening: false }, () => {
        return (0, sync_1.sendMessages)(messages.map(msg => ({ ...msg, timestamp: crdt_1.Timestamp.send() })));
    });
    const tables = messages.reduce((acc, message) => {
        if (!acc.includes(message.dataset)) {
            acc.push(message.dataset);
        }
        return acc;
    }, []);
    connection.send('undo-event', {
        messages,
        tables,
        meta,
        undoTag,
    });
}
async function undo() {
    const end = CURSOR;
    CURSOR = Math.max(CURSOR - 1, 0);
    // Walk back to the nearest marker
    while (CURSOR > 0 && MESSAGE_HISTORY[CURSOR].type !== 'marker') {
        CURSOR--;
    }
    const meta = MESSAGE_HISTORY[CURSOR].meta;
    const start = Math.max(CURSOR, 0);
    const entries = MESSAGE_HISTORY.slice(start, end + 1).filter((entry) => entry.type === 'messages');
    if (entries.length > 0) {
        const toApply = entries
            .reduce((acc, entry) => {
            return acc.concat(entry.messages
                .map(message => undoMessage(message, entry.oldData))
                .filter(x => x));
        }, [])
            .reverse();
        await applyUndoAction(toApply, meta, entries[0].undoTag);
    }
}
function undoMessage(message, oldData) {
    const oldItem = (0, util_1.getIn)(oldData, [message.dataset, message.row]);
    if (oldItem) {
        let column = message.column;
        if (message.dataset === 'spreadsheet_cells') {
            // The spreadsheet messages use the `expr` column, but only as a
            // placeholder. We actually want to read the `cachedValue` prop
            // from the old item.
            column = 'cachedValue';
        }
        return { ...message, value: oldItem[column] };
    }
    else {
        if (message.dataset === 'spreadsheet_cells') {
            if (message.column === 'expr') {
                return { ...message, value: null };
            }
            return message;
        }
        else if (
        // The mapping fields aren't ever deleted... this should be
        // harmless since all they are is meta information. Maybe we
        // should fix this though.
        message.dataset !== 'category_mapping' &&
            message.dataset !== 'payee_mapping') {
            if (message.dataset === 'zero_budget_months' ||
                message.dataset === 'zero_budgets' ||
                message.dataset === 'reflect_budgets') {
                // Only these fields are reversable
                if (['buffered', 'amount', 'carryover'].includes(message.column)) {
                    return { ...message, value: 0 };
                }
                return null;
            }
            else if (message.dataset === 'notes') {
                return { ...message, value: null };
            }
            return { ...message, column: 'tombstone', value: 1 };
        }
    }
    return null;
}
async function redo() {
    const meta = MESSAGE_HISTORY[CURSOR].type === 'marker'
        ? MESSAGE_HISTORY[CURSOR].meta
        : null;
    const start = CURSOR;
    CURSOR = Math.min(CURSOR + 1, MESSAGE_HISTORY.length - 1);
    // Walk forward to the nearest marker
    while (CURSOR < MESSAGE_HISTORY.length - 1 &&
        MESSAGE_HISTORY[CURSOR].type !== 'marker') {
        CURSOR++;
    }
    const end = CURSOR;
    const entries = MESSAGE_HISTORY.slice(start + 1, end + 1).filter((entry) => entry.type === 'messages');
    if (entries.length > 0) {
        const toApply = entries.reduce((acc, entry) => {
            return acc
                .concat(entry.messages)
                .concat(redoResurrections(entry.messages, entry.oldData));
        }, []);
        await applyUndoAction(toApply, meta, entries[entries.length - 1].undoTag);
    }
}
function redoResurrections(messages, oldData) {
    const resurrect = new Set();
    messages.forEach(message => {
        // If any of the ids didn't exist before, we need to "resurrect"
        // them by resetting their tombstones to 0
        const oldItem = (0, util_1.getIn)(oldData, [message.dataset, message.row]);
        if (!oldItem &&
            ![
                'zero_budget_months',
                'zero_budgets',
                'reflect_budgets',
                'notes',
                'category_mapping',
                'payee_mapping',
            ].includes(message.dataset)) {
            resurrect.add(message.dataset + '.' + message.row);
        }
    });
    return [...resurrect].map(desc => {
        const [table, row] = desc.split('.');
        return {
            dataset: table,
            row,
            column: 'tombstone',
            value: 0,
            timestamp: crdt_1.Timestamp.send(),
        };
    });
}
