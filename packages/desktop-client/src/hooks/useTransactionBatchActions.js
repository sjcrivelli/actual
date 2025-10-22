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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTransactionBatchActions = useTransactionBatchActions;
var react_i18next_1 = require("react-i18next");
var fetch_1 = require("loot-core/platform/client/fetch");
var monthUtils = require("loot-core/shared/months");
var query_1 = require("loot-core/shared/query");
var transactions_1 = require("loot-core/shared/transactions");
var transfer_1 = require("loot-core/shared/transfer");
var util_1 = require("loot-core/shared/util");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var aqlQuery_1 = require("@desktop-client/queries/aqlQuery");
var redux_1 = require("@desktop-client/redux");
function useTransactionBatchActions() {
    var _this = this;
    var dispatch = (0, redux_1.useDispatch)();
    var t = (0, react_i18next_1.useTranslation)().t;
    var onBatchEdit = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var data, transactions, onChange, pushPayeeAutocompleteModal, pushAccountAutocompleteModal, pushEditField, pushCategoryAutocompleteModal, reconciledTransactions;
        var _this = this;
        var name = _b.name, ids = _b.ids, onSuccess = _b.onSuccess;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)((0, query_1.q)('transactions')
                        .filter({ id: { $oneof: ids } })
                        .select('*')
                        .options({ splits: 'grouped' }))];
                case 1:
                    data = (_c.sent()).data;
                    transactions = (0, transactions_1.ungroupTransactions)(data);
                    onChange = function (name, value, mode) { return __awaiter(_this, void 0, void 0, function () {
                        var transactionsToChange, changes, idSet;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    transactionsToChange = transactions;
                                    value = value === null ? '' : value;
                                    changes = {
                                        added: [],
                                        deleted: [],
                                        updated: [],
                                    };
                                    // Cleared is a special case right now
                                    if (name === 'cleared') {
                                        // Clear them if any are uncleared, otherwise unclear them
                                        value = !!transactionsToChange.find(function (t) { return !t.cleared; });
                                    }
                                    idSet = new Set(ids);
                                    transactionsToChange.forEach(function (trans) {
                                        var _a;
                                        if (name === 'cleared' && trans.reconciled) {
                                            // Skip transactions that are reconciled. Don't want to set them as
                                            // uncleared.
                                            return;
                                        }
                                        if (!idSet.has(trans.id)) {
                                            // Skip transactions which aren't actually selected, since the query
                                            // above also retrieves the siblings & parent of any selected splits.
                                            return;
                                        }
                                        var valueToSet = value;
                                        if (name === 'notes') {
                                            if (mode === 'prepend') {
                                                valueToSet =
                                                    trans.notes === null ? value : "".concat(value).concat(trans.notes);
                                            }
                                            else if (mode === 'append') {
                                                valueToSet =
                                                    trans.notes === null ? value : "".concat(trans.notes).concat(value);
                                            }
                                            else if (mode === 'replace') {
                                                valueToSet = value;
                                            }
                                        }
                                        var transaction = __assign(__assign({}, trans), (_a = {}, _a[name] = valueToSet, _a));
                                        if (name === 'account' && trans.account !== value) {
                                            transaction.reconciled = false;
                                        }
                                        var diff = (0, transactions_1.updateTransaction)(transactionsToChange, transaction).diff;
                                        // TODO: We need to keep an updated list of transactions so
                                        // the logic in `updateTransaction`, particularly about
                                        // updating split transactions, works. This isn't ideal and we
                                        // should figure something else out
                                        transactionsToChange = (0, util_1.applyChanges)(diff, transactionsToChange);
                                        changes.deleted = changes.deleted
                                            ? changes.deleted.concat(diff.deleted)
                                            : diff.deleted;
                                        changes.updated = changes.updated
                                            ? changes.updated.concat(diff.updated)
                                            : diff.updated;
                                        changes.added = changes.added
                                            ? changes.added.concat(diff.added)
                                            : diff.added;
                                    });
                                    return [4 /*yield*/, (0, fetch_1.send)('transactions-batch-update', changes)];
                                case 1:
                                    _a.sent();
                                    onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(ids, name, value, mode);
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    pushPayeeAutocompleteModal = function () {
                        dispatch((0, modalsSlice_1.pushModal)({
                            modal: {
                                name: 'payee-autocomplete',
                                options: {
                                    onSelect: function (payeeId) { return onChange(name, payeeId); },
                                },
                            },
                        }));
                    };
                    pushAccountAutocompleteModal = function () {
                        dispatch((0, modalsSlice_1.pushModal)({
                            modal: {
                                name: 'account-autocomplete',
                                options: {
                                    onSelect: function (accountId) { return onChange(name, accountId); },
                                },
                            },
                        }));
                    };
                    pushEditField = function () {
                        if (name !== 'date' && name !== 'amount' && name !== 'notes') {
                            return;
                        }
                        dispatch((0, modalsSlice_1.pushModal)({
                            modal: {
                                name: 'edit-field',
                                options: {
                                    name: name,
                                    onSubmit: function (name, value, mode) { return onChange(name, value, mode); },
                                },
                            },
                        }));
                    };
                    pushCategoryAutocompleteModal = function () {
                        var _a, _b;
                        // Only show balances when all selected transaction are in the same month.
                        var transactionMonth = ((_a = transactions[0]) === null || _a === void 0 ? void 0 : _a.date)
                            ? monthUtils.monthFromDate((_b = transactions[0]) === null || _b === void 0 ? void 0 : _b.date)
                            : null;
                        var transactionsHaveSameMonth = transactionMonth &&
                            transactions.every(function (t) { return monthUtils.monthFromDate(t.date) === transactionMonth; });
                        dispatch((0, modalsSlice_1.pushModal)({
                            modal: {
                                name: 'category-autocomplete',
                                options: {
                                    month: transactionsHaveSameMonth ? transactionMonth : undefined,
                                    onSelect: function (categoryId) { return onChange(name, categoryId); },
                                },
                            },
                        }));
                    };
                    if (name === 'amount' ||
                        name === 'payee' ||
                        name === 'account' ||
                        name === 'date') {
                        reconciledTransactions = transactions.filter(function (t) { return t.reconciled; });
                        if (reconciledTransactions.length > 0) {
                            dispatch((0, modalsSlice_1.pushModal)({
                                modal: {
                                    name: 'confirm-transaction-edit',
                                    options: {
                                        onConfirm: function () {
                                            if (name === 'payee') {
                                                pushPayeeAutocompleteModal();
                                            }
                                            else if (name === 'account') {
                                                pushAccountAutocompleteModal();
                                            }
                                            else {
                                                pushEditField();
                                            }
                                        },
                                        confirmReason: 'batchEditWithReconciled',
                                    },
                                },
                            }));
                            return [2 /*return*/];
                        }
                    }
                    if (name === 'cleared') {
                        // Cleared just toggles it on/off and it depends on the data
                        // loaded. Need to clean this up in the future.
                        onChange('cleared', null);
                    }
                    else if (name === 'category') {
                        pushCategoryAutocompleteModal();
                    }
                    else if (name === 'payee') {
                        pushPayeeAutocompleteModal();
                    }
                    else if (name === 'account') {
                        pushAccountAutocompleteModal();
                    }
                    else {
                        pushEditField();
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var onBatchDuplicate = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var onConfirmDuplicate;
        var _this = this;
        var ids = _b.ids, onSuccess = _b.onSuccess;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    onConfirmDuplicate = function (ids) { return __awaiter(_this, void 0, void 0, function () {
                        var data, transactions, changes;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)((0, query_1.q)('transactions')
                                        .filter({ id: { $oneof: ids } })
                                        .select('*')
                                        .options({ splits: 'grouped' }))];
                                case 1:
                                    data = (_a.sent()).data;
                                    transactions = data;
                                    changes = {
                                        added: transactions
                                            .reduce(function (newTransactions, trans) {
                                            return newTransactions.concat((0, transactions_1.realizeTempTransactions)((0, transactions_1.ungroupTransaction)(trans)));
                                        }, [])
                                            .map(function (_a) {
                                            var sort_order = _a.sort_order, trans = __rest(_a, ["sort_order"]);
                                            return (__assign({}, trans));
                                        }),
                                    };
                                    return [4 /*yield*/, (0, fetch_1.send)('transactions-batch-update', changes)];
                                case 2:
                                    _a.sent();
                                    onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(ids);
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, checkForReconciledTransactions(ids, 'batchDuplicateWithReconciled', onConfirmDuplicate)];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var onBatchDelete = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var onConfirmDelete;
        var _this = this;
        var ids = _b.ids, onSuccess = _b.onSuccess;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    onConfirmDelete = function (ids) {
                        dispatch((0, modalsSlice_1.pushModal)({
                            modal: {
                                name: 'confirm-delete',
                                options: {
                                    message: ids.length > 1
                                        ? t('Are you sure you want to delete these {{count}} transactions?', { count: ids.length })
                                        : t('Are you sure you want to delete the transaction?'),
                                    onConfirm: function () { return __awaiter(_this, void 0, void 0, function () {
                                        var data, transactions, idSet, changes;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)((0, query_1.q)('transactions')
                                                        .filter({ id: { $oneof: ids } })
                                                        .select('*')
                                                        .options({ splits: 'grouped' }))];
                                                case 1:
                                                    data = (_a.sent()).data;
                                                    transactions = (0, transactions_1.ungroupTransactions)(data);
                                                    idSet = new Set(ids);
                                                    changes = {
                                                        added: [],
                                                        deleted: [],
                                                        updated: [],
                                                    };
                                                    transactions.forEach(function (trans) {
                                                        var parentId = trans.parent_id;
                                                        // First, check if we're actually deleting this transaction by
                                                        // checking `idSet`. Then, we don't need to do anything if it's
                                                        // a child transaction and the parent is already being deleted
                                                        if (!idSet.has(trans.id) ||
                                                            (parentId && idSet.has(parentId))) {
                                                            return;
                                                        }
                                                        var diff = (0, transactions_1.deleteTransaction)(transactions, trans.id).diff;
                                                        // TODO: We need to keep an updated list of transactions so
                                                        // the logic in `updateTransaction`, particularly about
                                                        // updating split transactions, works. This isn't ideal and we
                                                        // should figure something else out
                                                        transactions = (0, util_1.applyChanges)(diff, transactions);
                                                        changes.deleted = diff.deleted
                                                            ? changes.deleted.concat(diff.deleted)
                                                            : diff.deleted;
                                                        changes.updated = diff.updated
                                                            ? changes.updated.concat(diff.updated)
                                                            : diff.updated;
                                                    });
                                                    return [4 /*yield*/, (0, fetch_1.send)('transactions-batch-update', changes)];
                                                case 2:
                                                    _a.sent();
                                                    onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(ids);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); },
                                },
                            },
                        }));
                    };
                    return [4 /*yield*/, checkForReconciledTransactions(ids, 'batchDeleteWithReconciled', onConfirmDelete)];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var onBatchLinkSchedule = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var transactions;
        var _c;
        var ids = _b.ids, account = _b.account, onSuccess = _b.onSuccess;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)((0, query_1.q)('transactions')
                        .filter({ id: { $oneof: ids } })
                        .select('*')
                        .options({ splits: 'grouped' }))];
                case 1:
                    transactions = (_d.sent()).data;
                    dispatch((0, modalsSlice_1.pushModal)({
                        modal: {
                            name: 'schedule-link',
                            options: {
                                transactionIds: ids,
                                getTransaction: function (id) {
                                    return transactions.find(function (t) { return t.id === id; });
                                },
                                accountName: (_c = account === null || account === void 0 ? void 0 : account.name) !== null && _c !== void 0 ? _c : '',
                                onScheduleLinked: function (schedule) {
                                    onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(ids, schedule);
                                },
                            },
                        },
                    }));
                    return [2 /*return*/];
            }
        });
    }); };
    var onBatchUnlinkSchedule = function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
        var changes;
        var ids = _b.ids, onSuccess = _b.onSuccess;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    changes = {
                        updated: ids.map(function (id) { return ({ id: id, schedule: null }); }),
                    };
                    return [4 /*yield*/, (0, fetch_1.send)('transactions-batch-update', changes)];
                case 1:
                    _c.sent();
                    onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(ids);
                    return [2 /*return*/];
            }
        });
    }); };
    var checkForReconciledTransactions = function (ids, confirmReason, onConfirm) { return __awaiter(_this, void 0, void 0, function () {
        var data, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)((0, query_1.q)('transactions')
                        .filter({ id: { $oneof: ids }, reconciled: true })
                        .select('*')
                        .options({ splits: 'grouped' }))];
                case 1:
                    data = (_a.sent()).data;
                    transactions = (0, transactions_1.ungroupTransactions)(data);
                    if (transactions.length > 0) {
                        dispatch((0, modalsSlice_1.pushModal)({
                            modal: {
                                name: 'confirm-transaction-edit',
                                options: {
                                    onConfirm: function () {
                                        onConfirm(ids);
                                    },
                                    confirmReason: confirmReason,
                                },
                            },
                        }));
                    }
                    else {
                        onConfirm(ids);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var onSetTransfer = function (ids, payees, onSuccess) { return __awaiter(_this, void 0, void 0, function () {
        var onConfirmTransfer;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onConfirmTransfer = function (ids) { return __awaiter(_this, void 0, void 0, function () {
                        var transactions, fromTrans, toTrans, fromPayee, toPayee, changes;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, aqlQuery_1.aqlQuery)((0, query_1.q)('transactions')
                                        .filter({ id: { $oneof: ids } })
                                        .select('*'))];
                                case 1:
                                    transactions = (_a.sent()).data;
                                    fromTrans = transactions[0], toTrans = transactions[1];
                                    if (!(transactions.length === 2 && (0, transfer_1.validForTransfer)(fromTrans, toTrans))) return [3 /*break*/, 3];
                                    fromPayee = payees.find(function (p) { return p.transfer_acct === fromTrans.account; });
                                    toPayee = payees.find(function (p) { return p.transfer_acct === toTrans.account; });
                                    changes = {
                                        updated: [
                                            __assign(__assign({}, fromTrans), { category: null, payee: toPayee === null || toPayee === void 0 ? void 0 : toPayee.id, transfer_id: toTrans.id }),
                                            __assign(__assign({}, toTrans), { category: null, payee: fromPayee === null || fromPayee === void 0 ? void 0 : fromPayee.id, transfer_id: fromTrans.id }),
                                        ],
                                        runTransfers: false,
                                    };
                                    return [4 /*yield*/, (0, fetch_1.send)('transactions-batch-update', changes)];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(ids);
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, checkForReconciledTransactions(ids, 'batchEditWithReconciled', onConfirmTransfer)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var onMerge = function (ids, onSuccess) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, fetch_1.send)('transactions-merge', ids.map(function (id) { return ({ id: id }); }))];
                case 1:
                    _a.sent();
                    onSuccess();
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        onBatchEdit: onBatchEdit,
        onBatchDuplicate: onBatchDuplicate,
        onBatchDelete: onBatchDelete,
        onBatchLinkSchedule: onBatchLinkSchedule,
        onBatchUnlinkSchedule: onBatchUnlinkSchedule,
        onSetTransfer: onSetTransfer,
        onMerge: onMerge,
    };
}
