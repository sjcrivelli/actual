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
exports.app = void 0;
var app_1 = require("../app");
var db = require("../db");
var models_1 = require("../models");
var mutators_1 = require("../mutators");
var sync_1 = require("../sync");
var rules = require("../transactions/transaction-rules");
var undo_1 = require("../undo");
exports.app = (0, app_1.createApp)();
exports.app.method('payee-create', (0, mutators_1.mutator)((0, undo_1.undoable)(createPayee)));
exports.app.method('common-payees-get', getCommonPayees);
exports.app.method('payees-get', getPayees);
exports.app.method('payees-get-orphaned', getOrphanedPayees);
exports.app.method('payees-get-rule-counts', getPayeeRuleCounts);
exports.app.method('payees-merge', (0, mutators_1.mutator)((0, undo_1.undoable)(mergePayees, function (args) { return ({
    mergeIds: args.mergeIds,
    targetId: args.targetId,
}); })));
exports.app.method('payees-batch-change', (0, mutators_1.mutator)((0, undo_1.undoable)(batchChangePayees)));
exports.app.method('payees-check-orphaned', checkOrphanedPayees);
exports.app.method('payees-get-rules', getPayeeRules);
function createPayee(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var name = _b.name;
        return __generator(this, function (_c) {
            return [2 /*return*/, db.insertPayee({ name: name })];
        });
    });
}
function getCommonPayees() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.getCommonPayees()];
                case 1: 
                // TODO: Update to an AQL query. Server must return AQL entities not the raw DB data.
                return [2 /*return*/, (_a.sent()).map(models_1.payeeModel.fromDb)];
            }
        });
    });
}
function getPayees() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.getPayees()];
                case 1: 
                // TODO: Update to an AQL query. Server must return AQL entities not the raw DB data.
                return [2 /*return*/, (_a.sent()).map(models_1.payeeModel.fromDb)];
            }
        });
    });
}
function getOrphanedPayees() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.syncGetOrphanedPayees()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getPayeeRuleCounts() {
    return __awaiter(this, void 0, void 0, function () {
        var payeeCounts;
        return __generator(this, function (_a) {
            payeeCounts = {};
            rules.iterateIds(rules.getRules(), 'payee', function (rule, id) {
                if (payeeCounts[id] == null) {
                    payeeCounts[id] = 0;
                }
                payeeCounts[id]++;
            });
            return [2 /*return*/, payeeCounts];
        });
    });
}
function mergePayees(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var targetId = _b.targetId, mergeIds = _b.mergeIds;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db.mergePayees(targetId, mergeIds)];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function batchChangePayees(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _this = this;
        var added = _b.added, deleted = _b.deleted, updated = _b.updated;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, sync_1.batchMessages)(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!deleted) return [3 /*break*/, 2];
                                    return [4 /*yield*/, Promise.all(deleted.map(function (p) { return ({ id: p.id }); }).map(function (p) { return db.deletePayee(p); }))];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2:
                                    if (!added) return [3 /*break*/, 4];
                                    return [4 /*yield*/, Promise.all(added.map(function (p) { return models_1.payeeModel.toDb(p); }).map(function (p) { return db.insertPayee(p); }))];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4:
                                    if (!updated) return [3 /*break*/, 6];
                                    return [4 /*yield*/, Promise.all(updated
                                            .map(function (p) { return models_1.payeeModel.toDb(p, { update: true }); })
                                            .map(function (p) { return db.updatePayee(p); }))];
                                case 5:
                                    _a.sent();
                                    _a.label = 6;
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function checkOrphanedPayees(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var orphaned, _c;
        var ids = _b.ids;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _c = Set.bind;
                    return [4 /*yield*/, db.getOrphanedPayees()];
                case 1:
                    orphaned = new (_c.apply(Set, [void 0, _d.sent()]))();
                    return [2 /*return*/, ids.filter(function (id) { return orphaned.has(id); })];
            }
        });
    });
}
function getPayeeRules(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id = _b.id;
        return __generator(this, function (_c) {
            return [2 /*return*/, rules.getRulesForPayee(id).map(function (rule) { return rule.serialize(); })];
        });
    });
}
