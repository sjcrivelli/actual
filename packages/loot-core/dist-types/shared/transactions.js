"use strict";
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
const uuid_1 = require("uuid");
const util_1 = require("./util");
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
    const difference = num(parent.amount) - total;
    return {
        type: 'SplitTransactionError',
        version: 1,
        difference,
    };
}
function makeChild(parent, data = {}) {
    const prefix = parent.id === 'temp' ? 'temp' : '';
    return {
        amount: 0,
        ...data,
        category: 'category' in data ? data.category : parent.category,
        payee: 'payee' in data ? data.payee : parent.payee,
        id: 'id' in data ? data.id : prefix + (0, uuid_1.v4)(),
        account: parent.account,
        date: parent.date,
        cleared: parent.cleared != null ? parent.cleared : null,
        reconciled: 'reconciled' in data ? data.reconciled : parent.reconciled,
        starting_balance_flag: parent.starting_balance_flag != null
            ? parent.starting_balance_flag
            : null,
        is_child: true,
        parent_id: parent.id,
        error: null,
    };
}
function makeNonChild(parent, data) {
    return {
        amount: 0,
        ...data,
        cleared: parent.cleared != null ? parent.cleared : null,
        reconciled: parent.reconciled != null ? parent.reconciled : null,
        sort_order: parent.sort_order || null,
        starting_balance_flag: null,
        is_child: false,
        parent_id: null,
    };
}
function recalculateSplit(trans) {
    // Calculate the new total of split transactions and make sure
    // that it equals the parent amount
    const total = (trans.subtransactions || []).reduce((acc, t) => acc + num(t.amount), 0);
    const { error, ...rest } = trans;
    return {
        ...rest,
        error: total === num(trans.amount) ? null : SplitTransactionError(total, trans),
    };
}
function findParentIndex(transactions, idx) {
    // This relies on transactions being sorted in a way where parents
    // are always before children, which is enforced in the db layer.
    // Walk backwards and find the last parent;
    while (idx >= 0) {
        const trans = transactions[idx];
        if (trans.is_parent) {
            return idx;
        }
        idx--;
    }
    return null;
}
function getSplit(transactions, parentIndex) {
    const split = [transactions[parentIndex]];
    let curr = parentIndex + 1;
    while (curr < transactions.length && transactions[curr].is_child) {
        split.push(transactions[curr]);
        curr++;
    }
    return split;
}
function ungroupTransactions(transactions) {
    return transactions.reduce((list, parent) => {
        const { subtransactions, ...trans } = parent;
        const _subtransactions = subtransactions || [];
        list.push(trans);
        for (let i = 0; i < _subtransactions.length; i++) {
            list.push(_subtransactions[i]);
        }
        return list;
    }, []);
}
function groupTransaction(split) {
    return {
        ...split[0],
        subtransactions: split.slice(1),
    };
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
    const idx = transactions.findIndex(t => t.id === id);
    const trans = transactions[idx];
    const transactionsCopy = [...transactions];
    if (idx === -1) {
        throw new Error('Tried to edit unknown transaction id: ' + id);
    }
    if (trans.is_parent || trans.is_child) {
        const parentIndex = findParentIndex(transactions, idx);
        if (parentIndex == null) {
            console.log('Cannot find parent index');
            return {
                data: [],
                diff: { added: [], deleted: [], updated: [] },
                newTransaction: null,
            };
        }
        const split = getSplit(transactions, parentIndex);
        let grouped = func(groupTransaction(split));
        const newSplit = ungroupTransaction(grouped);
        let diff;
        if (newSplit == null) {
            // If everything was deleted, just delete the parent which will
            // delete everything
            diff = { added: [], deleted: [{ id: split[0].id }], updated: [] };
            grouped = { ...split[0], _deleted: true };
            transactionsCopy.splice(parentIndex, split.length);
        }
        else {
            diff = (0, util_1.diffItems)(split, newSplit);
            transactionsCopy.splice(parentIndex, split.length, ...newSplit);
        }
        return { data: transactionsCopy, newTransaction: grouped, diff };
    }
    else {
        const grouped = func(trans);
        const newTrans = ungroupTransaction(grouped) || [];
        if (grouped) {
            grouped.subtransactions = grouped.subtransactions || [];
        }
        transactionsCopy.splice(idx, 1, ...newTrans);
        return {
            data: transactionsCopy,
            newTransaction: grouped || {
                ...trans,
                _deleted: true,
            },
            diff: (0, util_1.diffItems)([trans], newTrans),
        };
    }
}
function addSplitTransaction(transactions, id) {
    return replaceTransactions(transactions, id, trans => {
        if (!trans.is_parent) {
            return trans;
        }
        const prevSub = (0, util_1.last)(trans.subtransactions || []);
        trans.subtransactions?.push(makeChild(trans, {
            amount: 0,
            sort_order: num(prevSub && prevSub.sort_order) - 1,
        }));
        return trans;
    });
}
function updateTransaction(transactions, transaction) {
    return replaceTransactions(transactions, transaction.id, trans => {
        if (trans.is_parent) {
            const parent = trans.id === transaction.id ? transaction : trans;
            const originalSubtransactions = parent.subtransactions ?? trans.subtransactions;
            const sub = originalSubtransactions?.map(t => {
                // Make sure to update the children to reflect the updated
                // properties (if the parent updated)
                let child = t;
                if (trans.id === transaction.id) {
                    const { payee: childPayee, ...rest } = t;
                    const newPayee = childPayee === trans.payee ? transaction.payee : childPayee;
                    child = {
                        ...rest,
                        ...(newPayee != null ? { payee: newPayee } : {}),
                    };
                }
                else if (t.id === transaction.id) {
                    child = transaction;
                }
                return makeChild(parent, child);
            });
            return recalculateSplit({
                ...parent,
                ...(sub && { subtransactions: sub }),
            });
        }
        else {
            return transaction;
        }
    });
}
function deleteTransaction(transactions, id) {
    return replaceTransactions(transactions, id, trans => {
        if (trans.is_parent) {
            if (trans.id === id) {
                return null;
            }
            else if (trans.subtransactions?.length === 1) {
                const { subtransactions, ...rest } = trans;
                return {
                    ...rest,
                    is_parent: false,
                    error: null,
                };
            }
            else {
                const sub = trans.subtransactions?.filter(t => t.id !== id);
                return recalculateSplit({
                    ...trans,
                    ...(sub && { subtransactions: sub }),
                });
            }
        }
        else {
            return null;
        }
    });
}
function splitTransaction(transactions, id, createSubtransactions) {
    return replaceTransactions(transactions, id, trans => {
        if (trans.is_parent || trans.is_child) {
            return trans;
        }
        const subtransactions = createSubtransactions?.(trans) || [
            makeChild(trans),
        ];
        const { error, ...rest } = trans;
        return {
            ...rest,
            is_parent: true,
            error: num(trans.amount) === 0 ? null : SplitTransactionError(0, trans),
            subtransactions: subtransactions.map(t => ({
                ...t,
                sort_order: t.sort_order || -1,
            })),
        };
    });
}
function realizeTempTransactions(transactions) {
    const parent = {
        ...transactions.find(t => !t.is_child),
        id: (0, uuid_1.v4)(),
    };
    const children = transactions.filter(t => t.is_child);
    return [
        parent,
        ...children.map(child => ({
            ...child,
            id: (0, uuid_1.v4)(),
            parent_id: parent.id,
        })),
    ];
}
function makeAsNonChildTransactions(childTransactionsToUpdate, transactions) {
    const [parentTransaction, ...childTransactions] = transactions;
    const newNonChildTransactions = childTransactionsToUpdate.map(t => makeNonChild(parentTransaction, t));
    const remainingChildTransactions = childTransactions.filter(t => !newNonChildTransactions.some(updatedTrans => updatedTrans.id === t.id));
    const nonChildTransactionsToUpdate = remainingChildTransactions.length === 1
        ? [
            ...newNonChildTransactions,
            makeNonChild(parentTransaction, remainingChildTransactions[0]),
        ]
        : newNonChildTransactions;
    const deleteParentTransaction = remainingChildTransactions.length <= 1;
    const updatedParentTransaction = {
        ...parentTransaction,
        ...(!deleteParentTransaction
            ? {
                amount: remainingChildTransactions
                    .map(t => t.amount)
                    .reduce((total, amount) => total + amount, 0),
            }
            : {}),
    };
    return {
        updated: [
            ...(!deleteParentTransaction ? [updatedParentTransaction] : []),
            ...nonChildTransactionsToUpdate,
        ],
        deleted: [...(deleteParentTransaction ? [updatedParentTransaction] : [])],
    };
}
//# sourceMappingURL=transactions.js.map