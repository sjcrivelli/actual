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
exports.ManagePayeesWithData = ManagePayeesWithData;
var react_1 = require("react");
var fetch_1 = require("loot-core/platform/client/fetch");
var undo = require("loot-core/platform/client/undo");
var util_1 = require("loot-core/shared/util");
var ManagePayees_1 = require("./ManagePayees");
var usePayeeRuleCounts_1 = require("@desktop-client/hooks/usePayeeRuleCounts");
var usePayees_1 = require("@desktop-client/hooks/usePayees");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var payeesSlice_1 = require("@desktop-client/payees/payeesSlice");
var redux_1 = require("@desktop-client/redux");
function ManagePayeesWithData(_a) {
    var _this = this;
    var initialSelectedIds = _a.initialSelectedIds;
    var payees = (0, usePayees_1.usePayees)();
    var dispatch = (0, redux_1.useDispatch)();
    var _b = (0, usePayeeRuleCounts_1.usePayeeRuleCounts)(), ruleCounts = _b.ruleCounts, refetchRuleCounts = _b.refetch;
    var _c = (0, react_1.useState)([]), orphans = _c[0], setOrphans = _c[1];
    var refetchOrphanedPayees = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var orphs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.send)('payees-get-orphaned')];
                case 1:
                    orphs = _a.sent();
                    setOrphans(orphs);
                    return [2 /*return*/];
            }
        });
    }); }, []);
    (0, react_1.useEffect)(function () {
        function loadData() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, dispatch((0, payeesSlice_1.getPayees)())];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, refetchOrphanedPayees()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        loadData();
        var unlisten = (0, fetch_1.listen)('sync-event', function (event) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(event.type === 'applied')) return [3 /*break*/, 2];
                        if (!event.tables.includes('rules')) return [3 /*break*/, 2];
                        return [4 /*yield*/, refetchRuleCounts()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        return function () {
            unlisten();
        };
    }, [dispatch, refetchRuleCounts, refetchOrphanedPayees]);
    (0, react_1.useEffect)(function () {
        function onUndo(_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var targetId;
                var tables = _b.tables, messages = _b.messages, meta = _b.meta;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!tables.includes('payees') && !tables.includes('payee_mapping')) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, refetchOrphanedPayees()];
                        case 1:
                            _c.sent();
                            targetId = meta && typeof meta === 'object' && 'targetId' in meta
                                ? meta.targetId
                                : null;
                            if (!(targetId || messages.find(function (msg) { return msg.dataset === 'rules'; }))) return [3 /*break*/, 3];
                            return [4 /*yield*/, refetchRuleCounts()];
                        case 2:
                            _c.sent();
                            _c.label = 3;
                        case 3:
                            undo.setUndoState('undoEvent', null);
                            return [2 /*return*/];
                    }
                });
            });
        }
        var lastUndoEvent = undo.getUndoState('undoEvent');
        if (lastUndoEvent) {
            onUndo(lastUndoEvent);
        }
        return (0, fetch_1.listen)('undo-event', onUndo);
    }, [dispatch, refetchRuleCounts, refetchOrphanedPayees]);
    function onViewRules(id) {
        dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'manage-rules', options: { payeeId: id } } }));
    }
    function onCreateRule(id) {
        var rule = {
            stage: null,
            conditionsOp: 'and',
            conditions: [
                {
                    field: 'payee',
                    op: 'is',
                    value: id,
                    type: 'id',
                },
            ],
            actions: [
                {
                    op: 'set',
                    field: 'category',
                    value: null,
                    type: 'id',
                },
            ],
        };
        dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'edit-rule', options: { rule: rule } } }));
    }
    return (<ManagePayees_1.ManagePayees payees={payees} ruleCounts={ruleCounts} orphanedPayees={orphans} initialSelectedIds={initialSelectedIds} onBatchChange={function (changes) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.send)('payees-batch-change', changes)];
                    case 1:
                        _a.sent();
                        setOrphans((0, util_1.applyChanges)(changes, orphans));
                        return [2 /*return*/];
                }
            });
        }); }} onMerge={function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var targetIdIsOrphan, mergeIdsOrphans, filtedOrphans;
            var targetId = _b[0], mergeIds = _b.slice(1);
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, fetch_1.send)('payees-merge', { targetId: targetId, mergeIds: mergeIds })];
                    case 1:
                        _c.sent();
                        targetIdIsOrphan = orphans.map(function (o) { return o.id; }).includes(targetId);
                        mergeIdsOrphans = mergeIds.filter(function (m) {
                            return orphans.map(function (o) { return o.id; }).includes(m);
                        });
                        filtedOrphans = orphans;
                        if (targetIdIsOrphan && mergeIdsOrphans.length !== mergeIds.length) {
                            // there is a non-orphan in mergeIds, target can be removed from orphan arr
                            filtedOrphans = filtedOrphans.filter(function (o) { return o.id !== targetId; });
                        }
                        filtedOrphans = filtedOrphans.filter(function (o) { return !mergeIds.includes(o.id); });
                        // Refetch rule counts after merging
                        return [4 /*yield*/, refetchRuleCounts()];
                    case 2:
                        // Refetch rule counts after merging
                        _c.sent();
                        return [4 /*yield*/, dispatch((0, payeesSlice_1.reloadPayees)())];
                    case 3:
                        _c.sent();
                        setOrphans(filtedOrphans);
                        return [2 /*return*/];
                }
            });
        }); }} onViewRules={onViewRules} onCreateRule={onCreateRule}/>);
}
