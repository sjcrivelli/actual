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
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// @ts-strict-ignore
var log_1 = require("../../platform/server/log");
var app_1 = require("../app");
var errors_1 = require("../errors");
var mutators_1 = require("../mutators");
var sync_1 = require("../sync");
var rules = require("../transactions/transaction-rules");
var undo_1 = require("../undo");
var _1 = require(".");
function validateRule(rule) {
    // Returns an array of errors, the array is the same link as the
    // passed-in `array`, or null if there are no errors
    function runValidation(array, validate) {
        var result = array.map(function (item) {
            try {
                validate(item);
            }
            catch (e) {
                if (e instanceof errors_1.RuleError) {
                    log_1.logger.warn('Invalid rule', e);
                    return e.type;
                }
                throw e;
            }
            return null;
        });
        return result.filter(function (res) { return typeof res === 'string'; }).length
            ? result
            : null;
    }
    var conditionErrors = runValidation(rule.conditions, function (cond) { return new _1.Condition(cond.op, cond.field, cond.value, cond.options); });
    var actionErrors = runValidation(rule.actions, function (action) {
        return action.op === 'delete-transaction'
            ? new _1.Action(action.op, null, null, null)
            : action.op === 'set-split-amount'
                ? new _1.Action(action.op, null, action.value, action.options)
                : action.op === 'link-schedule'
                    ? new _1.Action(action.op, null, action.value, null)
                    : action.op === 'prepend-notes' || action.op === 'append-notes'
                        ? new _1.Action(action.op, null, action.value, null)
                        : new _1.Action(action.op, action.field, action.value, action.options);
    });
    if (conditionErrors || actionErrors) {
        return {
            conditionErrors: conditionErrors,
            actionErrors: actionErrors,
        };
    }
    return null;
}
// Expose functions to the client
exports.app = (0, app_1.createApp)();
exports.app.method('rule-validate', ruleValidate);
exports.app.method('rule-add', (0, mutators_1.mutator)(addRule));
exports.app.method('rule-update', (0, mutators_1.mutator)((0, undo_1.undoable)(updateRule)));
exports.app.method('rule-delete', (0, mutators_1.mutator)((0, undo_1.undoable)(deleteRule)));
exports.app.method('rule-delete-all', (0, mutators_1.mutator)((0, undo_1.undoable)(deleteAllRules)));
exports.app.method('rule-apply-actions', (0, mutators_1.mutator)((0, undo_1.undoable)(applyRuleActions)));
exports.app.method('rule-add-payee-rename', (0, mutators_1.mutator)(addRulePayeeRename));
exports.app.method('rules-get', getRules);
exports.app.method('rule-get', getRule);
exports.app.method('rules-run', runRules);
function ruleValidate(rule) {
    return __awaiter(this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            error = validateRule(rule);
            return [2 /*return*/, { error: error }];
        });
    });
}
function addRule(rule) {
    return __awaiter(this, void 0, void 0, function () {
        var error, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    error = validateRule(rule);
                    if (error) {
                        return [2 /*return*/, { error: error }];
                    }
                    return [4 /*yield*/, rules.insertRule(rule)];
                case 1:
                    id = _a.sent();
                    return [2 /*return*/, __assign({ id: id }, rule)];
            }
        });
    });
}
function updateRule(rule) {
    return __awaiter(this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    error = validateRule(rule);
                    if (error) {
                        return [2 /*return*/, { error: error }];
                    }
                    return [4 /*yield*/, rules.updateRule(rule)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, rule];
            }
        });
    });
}
function deleteRule(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, rules.deleteRule(id)];
        });
    });
}
function deleteAllRules(ids) {
    return __awaiter(this, void 0, void 0, function () {
        var someDeletionsFailed;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    someDeletionsFailed = false;
                    return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _i, ids_1, id, res;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _i = 0, ids_1 = ids;
                                        _a.label = 1;
                                    case 1:
                                        if (!(_i < ids_1.length)) return [3 /*break*/, 4];
                                        id = ids_1[_i];
                                        return [4 /*yield*/, rules.deleteRule(id)];
                                    case 2:
                                        res = _a.sent();
                                        if (res === false) {
                                            someDeletionsFailed = true;
                                        }
                                        _a.label = 3;
                                    case 3:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { someDeletionsFailed: someDeletionsFailed }];
            }
        });
    });
}
function applyRuleActions(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var transactions = _b.transactions, actions = _b.actions;
        return __generator(this, function (_c) {
            return [2 /*return*/, rules.applyActions(transactions, actions)];
        });
    });
}
function addRulePayeeRename(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var fromNames = _b.fromNames, to = _b.to;
        return __generator(this, function (_c) {
            return [2 /*return*/, rules.updatePayeeRenameRule(fromNames, to)];
        });
    });
}
function getRule(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var rule;
        var id = _b.id;
        return __generator(this, function (_c) {
            rule = rules.getRules().find(function (rule) { return rule.id === id; });
            return [2 /*return*/, rule ? rule.serialize() : null];
        });
    });
}
function getRules() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, _1.rankRules)(rules.getRules()).map(function (rule) { return rule.serialize(); })];
        });
    });
}
function runRules(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var transaction = _b.transaction;
        return __generator(this, function (_c) {
            return [2 /*return*/, rules.runRules(transaction)];
        });
    });
}
