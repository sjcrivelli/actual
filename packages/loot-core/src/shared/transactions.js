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
exports.isTemporaryId = isTemporaryId;
exports.isPreviewId = isPreviewId;
exports.makeChild = makeChild;
exports.recalculateSplit = recalculateSplit;
exports.ungroupTransactions = ungroupTransactions;
exports.groupTransaction = groupTransaction;
exports.ungroupTransaction = ungroupTransaction;
exports.applyTransactionDiff = applyTransactionDiff;
exports.addSplitTransaction = addSplitTransaction;
exports.updateTransaction = updateTransaction;
exports.deleteTransaction = deleteTransaction;
exports.splitTransaction = splitTransaction;
exports.realizeTempTransactions = realizeTempTransactions;
exports.makeAsNonChildTransactions = makeAsNonChildTransactions;
var uuid_1 = require("uuid");
var util_1 = require("./util");
function isTemporaryId(id) {
    return id.indexOf('temp') !== -1;
}
function isPreviewId(id) {
    return id.indexOf('preview/') !== -1;
}
// The amount might be null when adding a new transaction
function num(n) {
    return typeof n === 'number' ? n : 0;
}
function SplitTransactionError(total, parent) {
    var difference = num(parent.amount) - total;
    return {
        type: 'SplitTransactionError',
        version: 1,
        difference: difference,
    };
}
function makeChild(parent, data) {
    if (data === void 0) { data = {}; }
    var prefix = parent.id === 'temp' ? 'temp' : '';
    return __assign(__assign({ amount: 0 }, data), { category: 'category' in data ? data.category : parent.category, payee: 'payee' in data ? data.payee : parent.payee, id: 'id' in data ? data.id : prefix + (0, uuid_1.v4)(), account: parent.account, date: parent.date, cleared: parent.cleared != null ? parent.cleared : null, reconciled: 'reconciled' in data ? data.reconciled : parent.reconciled, starting_balance_flag: parent.starting_balance_flag != null
            ? parent.starting_balance_flag
            : null, is_child: true, parent_id: parent.id, error: null });
}
function makeNonChild(parent, data) {
    return __assign(__assign({ amount: 0 }, data), { cleared: parent.cleared != null ? parent.cleared : null, reconciled: parent.reconciled != null ? parent.reconciled : null, sort_order: parent.sort_order || null, starting_balance_flag: null, is_child: false, parent_id: null });
}
function recalculateSplit(trans) {
    // Calculate the new total of split transactions and make sure
    // that it equals the parent amount
    var total = (trans.subtransactions || []).reduce(function (acc, t) { return acc + num(t.amount); }, 0);
    var error = trans.error, rest = __rest(trans, ["error"]);
    return __assign(__assign({}, rest), { error: total === num(trans.amount) ? null : SplitTransactionError(total, trans) });
}
function findParentIndex(transactions, idx) {
    // This relies on transactions being sorted in a way where parents
    // are always before children, which is enforced in the db layer.
    // Walk backwards and find the last parent;
    while (idx >= 0) {
        var trans = transactions[idx];
        if (trans.is_parent) {
            return idx;
        }
        idx--;
    }
    return null;
}
function getSplit(transactions, parentIndex) {
    var split = [transactions[parentIndex]];
    var curr = parentIndex + 1;
    while (curr < transactions.length && transactions[curr].is_child) {
        split.push(transactions[curr]);
        curr++;
    }
    return split;
}
function ungroupTransactions(transactions) {
    return transactions.reduce(function (list, parent) {
        var subtransactions = parent.subtransactions, trans = __rest(parent, ["subtransactions"]);
        var _subtransactions = subtransactions || [];
        list.push(trans);
        for (var i = 0; i < _subtransactions.length; i++) {
            list.push(_subtransactions[i]);
        }
        return list;
    }, []);
}
function groupTransaction(split) {
    return __assign(__assign({}, split[0]), { subtransactions: split.slice(1) });
}
function ungroupTransaction(split) {
    if (split == null) {
        return [];
    }
    return ungroupTransactions([split]);
}
function applyTransactionDiff(groupedTrans, diff) {
    return groupTransaction((0, util_1.applyChanges)(diff, ungroupTransaction(groupedTrans) || []));
}
function replaceTransactions(transactions, id, func) {
    var idx = transactions.findIndex(function (t) { return t.id === id; });
    var trans = transactions[idx];
    var transactionsCopy = __spreadArray([], transactions, true);
    if (idx === -1) {
        throw new Error('Tried to edit unknown transaction id: ' + id);
    }
    if (trans.is_parent || trans.is_child) {
        var parentIndex = findParentIndex(transactions, idx);
        if (parentIndex == null) {
            console.log('Cannot find parent index');
            return {
                data: [],
                diff: { added: [], deleted: [], updated: [] },
                newTransaction: null,
            };
        }
        var split = getSplit(transactions, parentIndex);
        var grouped = func(groupTransaction(split));
        var newSplit = ungroupTransaction(grouped);
        var diff = void 0;
        if (newSplit == null) {
            // If everything was deleted, just delete the parent which will
            // delete everything
            diff = { added: [], deleted: [{ id: split[0].id }], updated: [] };
            grouped = __assign(__assign({}, split[0]), { _deleted: true });
            transactionsCopy.splice(parentIndex, split.length);
        }
        else {
            diff = (0, util_1.diffItems)(split, newSplit);
            transactionsCopy.splice.apply(transactionsCopy, __spreadArray([parentIndex, split.length], newSplit, false));
        }
        return { data: transactionsCopy, newTransaction: grouped, diff: diff };
    }
    else {
        var grouped = func(trans);
        var newTrans = ungroupTransaction(grouped) || [];
        if (grouped) {
            grouped.subtransactions = grouped.subtransactions || [];
        }
        transactionsCopy.splice.apply(transactionsCopy, __spreadArray([idx, 1], newTrans, false));
        return {
            data: transactionsCopy,
            newTransaction: grouped || __assign(__assign({}, trans), { _deleted: true }),
            diff: (0, util_1.diffItems)([trans], newTrans),
        };
    }
}
function addSplitTransaction(transactions, id) {
    return replaceTransactions(transactions, id, function (trans) {
        var _a;
        if (!trans.is_parent) {
            return trans;
        }
        var prevSub = (0, util_1.last)(trans.subtransactions || []);
        (_a = trans.subtransactions) === null || _a === void 0 ? void 0 : _a.push(makeChild(trans, {
            amount: 0,
            sort_order: num(prevSub && prevSub.sort_order) - 1,
        }));
        return trans;
    });
}
function updateTransaction(transactions, transaction) {
    return replaceTransactions(transactions, transaction.id, function (trans) {
        var _a;
        if (trans.is_parent) {
            var parent_1 = trans.id === transaction.id ? transaction : trans;
            var originalSubtransactions = (_a = parent_1.subtransactions) !== null && _a !== void 0 ? _a : trans.subtransactions;
            var sub = originalSubtransactions === null || originalSubtransactions === void 0 ? void 0 : originalSubtransactions.map(function (t) {
                // Make sure to update the children to reflect the updated
                // properties (if the parent updated)
                var child = t;
                if (trans.id === transaction.id) {
                    var childPayee = t.payee, rest = __rest(t, ["payee"]);
                    var newPayee = childPayee === trans.payee ? transaction.payee : childPayee;
                    child = __assign(__assign({}, rest), (newPayee != null ? { payee: newPayee } : {}));
                }
                else if (t.id === transaction.id) {
                    child = transaction;
                }
                return makeChild(parent_1, child);
            });
            return recalculateSplit(__assign(__assign({}, parent_1), (sub && { subtransactions: sub })));
        }
        else {
            return transaction;
        }
    });
}
function deleteTransaction(transactions, id) {
    return replaceTransactions(transactions, id, function (trans) {
        var _a, _b;
        if (trans.is_parent) {
            if (trans.id === id) {
                return null;
            }
            else if (((_a = trans.subtransactions) === null || _a === void 0 ? void 0 : _a.length) === 1) {
                var subtransactions = trans.subtransactions, rest = __rest(trans, ["subtransactions"]);
                return __assign(__assign({}, rest), { is_parent: false, error: null });
            }
            else {
                var sub = (_b = trans.subtransactions) === null || _b === void 0 ? void 0 : _b.filter(function (t) { return t.id !== id; });
                return recalculateSplit(__assign(__assign({}, trans), (sub && { subtransactions: sub })));
            }
        }
        else {
            return null;
        }
    });
}
function splitTransaction(transactions, id, createSubtransactions) {
    return replaceTransactions(transactions, id, function (trans) {
        if (trans.is_parent || trans.is_child) {
            return trans;
        }
        var subtransactions = (createSubtransactions === null || createSubtransactions === void 0 ? void 0 : createSubtransactions(trans)) || [
            makeChild(trans),
        ];
        var error = trans.error, rest = __rest(trans, ["error"]);
        return __assign(__assign({}, rest), { is_parent: true, error: num(trans.amount) === 0 ? null : SplitTransactionError(0, trans), subtransactions: subtransactions.map(function (t) { return (__assign(__assign({}, t), { sort_order: t.sort_order || -1 })); }) });
    });
}
function realizeTempTransactions(transactions) {
    var parent = __assign(__assign({}, transactions.find(function (t) { return !t.is_child; })), { id: (0, uuid_1.v4)() });
    var children = transactions.filter(function (t) { return t.is_child; });
    return __spreadArray([
        parent
    ], children.map(function (child) {
        return (__assign(__assign({}, child), { id: (0, uuid_1.v4)(), parent_id: parent.id }));
    }), true);
}
function makeAsNonChildTransactions(childTransactionsToUpdate, transactions) {
    var parentTransaction = transactions[0], childTransactions = transactions.slice(1);
    var newNonChildTransactions = childTransactionsToUpdate.map(function (t) {
        return makeNonChild(parentTransaction, t);
    });
    var remainingChildTransactions = childTransactions.filter(function (t) {
        return !newNonChildTransactions.some(function (updatedTrans) { return updatedTrans.id === t.id; });
    });
    var nonChildTransactionsToUpdate = remainingChildTransactions.length === 1
        ? __spreadArray(__spreadArray([], newNonChildTransactions, true), [
            makeNonChild(parentTransaction, remainingChildTransactions[0]),
        ], false) : newNonChildTransactions;
    var deleteParentTransaction = remainingChildTransactions.length <= 1;
    var updatedParentTransaction = __assign(__assign({}, parentTransaction), (!deleteParentTransaction
        ? {
            amount: remainingChildTransactions
                .map(function (t) { return t.amount; })
                .reduce(function (total, amount) { return total + amount; }, 0),
        }
        : {}));
    return {
        updated: __spreadArray(__spreadArray([], (!deleteParentTransaction ? [updatedParentTransaction] : []), true), nonChildTransactionsToUpdate, true),
        deleted: __spreadArray([], (deleteParentTransaction ? [updatedParentTransaction] : []), true),
    };
}
