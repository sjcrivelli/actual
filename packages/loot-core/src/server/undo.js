"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendMessages = appendMessages;
exports.clearUndo = clearUndo;
exports.withUndo = withUndo;
exports.undoable = undoable;
exports.undo = undo;
exports.redo = redo;
// @ts-strict-ignore
var crdt_1 = require("@actual-app/crdt");
var connection = require("../platform/server/connection");
var util_1 = require("../shared/util");
var mutators_1 = require("./mutators");
var sync_1 = require("./sync");
var MESSAGE_HISTORY = [
    { type: 'marker' },
];
var CURSOR = 0;
var HISTORY_SIZE = 20;
function trimHistory() {
    MESSAGE_HISTORY = MESSAGE_HISTORY.slice(0, CURSOR + 1);
    var markers = MESSAGE_HISTORY.filter(function (item) { return item.type === 'marker'; });
    if (markers.length > HISTORY_SIZE) {
        var slice = markers.slice(-HISTORY_SIZE);
        var cutoff = MESSAGE_HISTORY.indexOf(slice[0]);
        MESSAGE_HISTORY = MESSAGE_HISTORY.slice(cutoff);
        CURSOR = MESSAGE_HISTORY.length - 1;
    }
}
function appendMessages(messages, oldData) {
    var context = (0, mutators_1.getMutatorContext)();
    if (context.undoListening && messages.length > 0) {
        trimHistory();
        var undoTag = context.undoTag;
        MESSAGE_HISTORY.push({
            type: 'messages',
            messages: messages,
            oldData: oldData,
            undoTag: undoTag,
        });
        CURSOR++;
    }
}
function clearUndo() {
    MESSAGE_HISTORY = [{ type: 'marker' }];
    CURSOR = 0;
}
function withUndo(func, meta) {
    var context = (0, mutators_1.getMutatorContext)();
    if (context.undoDisabled || context.undoListening) {
        return func();
    }
    MESSAGE_HISTORY = MESSAGE_HISTORY.slice(0, CURSOR + 1);
    var marker = { type: 'marker', meta: meta };
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
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return withUndo(function () {
            return func.apply(null, args);
        }, metaFunc ? metaFunc.apply(void 0, args) : undefined);
    };
}
function applyUndoAction(messages, meta, undoTag) {
    return __awaiter(this, void 0, void 0, function () {
        var tables;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, mutators_1.withMutatorContext)({ undoListening: false }, function () {
                        return (0, sync_1.sendMessages)(messages.map(function (msg) { return (__assign(__assign({}, msg), { timestamp: crdt_1.Timestamp.send() })); }));
                    })];
                case 1:
                    _a.sent();
                    tables = messages.reduce(function (acc, message) {
                        if (!acc.includes(message.dataset)) {
                            acc.push(message.dataset);
                        }
                        return acc;
                    }, []);
                    connection.send('undo-event', {
                        messages: messages,
                        tables: tables,
                        meta: meta,
                        undoTag: undoTag,
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function undo() {
    return __awaiter(this, void 0, void 0, function () {
        var end, meta, start, entries, toApply;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    end = CURSOR;
                    CURSOR = Math.max(CURSOR - 1, 0);
                    // Walk back to the nearest marker
                    while (CURSOR > 0 && MESSAGE_HISTORY[CURSOR].type !== 'marker') {
                        CURSOR--;
                    }
                    meta = MESSAGE_HISTORY[CURSOR].meta;
                    start = Math.max(CURSOR, 0);
                    entries = MESSAGE_HISTORY.slice(start, end + 1).filter(function (entry) { return entry.type === 'messages'; });
                    if (!(entries.length > 0)) return [3 /*break*/, 2];
                    toApply = entries
                        .reduce(function (acc, entry) {
                        return acc.concat(entry.messages
                            .map(function (message) { return undoMessage(message, entry.oldData); })
                            .filter(function (x) { return x; }));
                    }, [])
                        .reverse();
                    return [4 /*yield*/, applyUndoAction(toApply, meta, entries[0].undoTag)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function undoMessage(message, oldData) {
    var oldItem = (0, util_1.getIn)(oldData, [message.dataset, message.row]);
    if (oldItem) {
        var column = message.column;
        if (message.dataset === 'spreadsheet_cells') {
            // The spreadsheet messages use the `expr` column, but only as a
            // placeholder. We actually want to read the `cachedValue` prop
            // from the old item.
            column = 'cachedValue';
        }
        return __assign(__assign({}, message), { value: oldItem[column] });
    }
    else {
        if (message.dataset === 'spreadsheet_cells') {
            if (message.column === 'expr') {
                return __assign(__assign({}, message), { value: null });
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
                    return __assign(__assign({}, message), { value: 0 });
                }
                return null;
            }
            else if (message.dataset === 'notes') {
                return __assign(__assign({}, message), { value: null });
            }
            return __assign(__assign({}, message), { column: 'tombstone', value: 1 });
        }
    }
    return null;
}
function redo() {
    return __awaiter(this, void 0, void 0, function () {
        var meta, start, end, entries, toApply;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    meta = MESSAGE_HISTORY[CURSOR].type === 'marker'
                        ? MESSAGE_HISTORY[CURSOR].meta
                        : null;
                    start = CURSOR;
                    CURSOR = Math.min(CURSOR + 1, MESSAGE_HISTORY.length - 1);
                    // Walk forward to the nearest marker
                    while (CURSOR < MESSAGE_HISTORY.length - 1 &&
                        MESSAGE_HISTORY[CURSOR].type !== 'marker') {
                        CURSOR++;
                    }
                    end = CURSOR;
                    entries = MESSAGE_HISTORY.slice(start + 1, end + 1).filter(function (entry) { return entry.type === 'messages'; });
                    if (!(entries.length > 0)) return [3 /*break*/, 2];
                    toApply = entries.reduce(function (acc, entry) {
                        return acc
                            .concat(entry.messages)
                            .concat(redoResurrections(entry.messages, entry.oldData));
                    }, []);
                    return [4 /*yield*/, applyUndoAction(toApply, meta, entries[entries.length - 1].undoTag)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function redoResurrections(messages, oldData) {
    var resurrect = new Set();
    messages.forEach(function (message) {
        // If any of the ids didn't exist before, we need to "resurrect"
        // them by resetting their tombstones to 0
        var oldItem = (0, util_1.getIn)(oldData, [message.dataset, message.row]);
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
    return __spreadArray([], resurrect, true).map(function (desc) {
        var _a = desc.split('.'), table = _a[0], row = _a[1];
        return {
            dataset: table,
            row: row,
            column: 'tombstone',
            value: 0,
            timestamp: crdt_1.Timestamp.send(),
        };
    });
}
