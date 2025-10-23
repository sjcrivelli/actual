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
exports.addTransfer = addTransfer;
exports.removeTransfer = removeTransfer;
exports.updateTransfer = updateTransfer;
exports.onInsert = onInsert;
exports.onDelete = onDelete;
exports.onUpdate = onUpdate;
// @ts-strict-ignore
const db = __importStar(require("../db"));
const transaction_rules_1 = require("./transaction-rules");
async function getPayee(acct) {
    return db.first('SELECT * FROM payees WHERE transfer_acct = ?', [
        acct,
    ]);
}
async function getTransferredAccount(transaction) {
    if (transaction.payee) {
        const result = await db.first('SELECT transfer_acct FROM v_payees WHERE id = ?', [transaction.payee]);
        return result?.transfer_acct || null;
    }
    return null;
}
async function clearCategory(transaction, transferAcct) {
    const { offbudget: fromOffBudget } = await db.first('SELECT offbudget FROM accounts WHERE id = ?', [transaction.account]);
    const { offbudget: toOffBudget } = await db.first('SELECT offbudget FROM accounts WHERE id = ?', [transferAcct]);
    // If the transfer is between two on budget or two off budget accounts,
    // we should clear the category, because the category is not relevant
    if (fromOffBudget === toOffBudget) {
        await db.updateTransaction({ id: transaction.id, category: null });
        if (transaction.transfer_id) {
            await db.updateTransaction({
                id: transaction.transfer_id,
                category: null,
            });
        }
        return true;
    }
    return false;
}
async function addTransfer(transaction, transferredAccount) {
    if (transaction.is_parent) {
        // For split transactions, we should create transfers using child transactions.
        // This is to ensure that the amounts received by the transferred account
        // reflects the amounts in the child transactions and not the parent transaction
        // amount which is the total amount.
        return null;
    }
    const { id: fromPayee } = await db.first('SELECT id FROM payees WHERE transfer_acct = ?', [transaction.account]);
    const transferTransaction = {
        account: transferredAccount,
        amount: -transaction.amount,
        payee: fromPayee,
        date: transaction.date,
        transfer_id: transaction.id,
        notes: transaction.notes || null,
        schedule: transaction.schedule,
        cleared: false,
    };
    const { notes, cleared } = await (0, transaction_rules_1.runRules)(transferTransaction);
    const id = await db.insertTransaction({
        ...transferTransaction,
        notes,
        cleared,
    });
    await db.updateTransaction({ id: transaction.id, transfer_id: id });
    const categoryCleared = await clearCategory(transaction, transferredAccount);
    return {
        id: transaction.id,
        transfer_id: id,
        ...(categoryCleared ? { category: null } : {}),
    };
}
async function removeTransfer(transaction) {
    const transferTrans = await db.getTransaction(transaction.transfer_id);
    // Perform operations on the transfer transaction only
    // if it is found. For example: when users delete both
    // (in & out) transfer transactions at the same time -
    // transfer transaction will not be found.
    if (transferTrans) {
        if (transferTrans.is_child) {
            // If it's a child transaction, we don't delete it because that
            // would invalidate the whole split transaction. Instead of turn
            // it into a normal transaction
            await db.updateTransaction({
                id: transaction.transfer_id,
                transfer_id: null,
                payee: null,
            });
        }
        else {
            await db.deleteTransaction({ id: transaction.transfer_id });
        }
    }
    await db.updateTransaction({ id: transaction.id, transfer_id: null });
    return { id: transaction.id, transfer_id: null };
}
async function updateTransfer(transaction, transferredAccount) {
    const payee = await getPayee(transaction.account);
    await db.updateTransaction({
        id: transaction.transfer_id,
        account: transferredAccount,
        // Make sure to update the payee on the other side in case the
        // user moved this transaction into another account
        payee: payee.id,
        date: transaction.date,
        notes: transaction.notes,
        amount: -transaction.amount,
        schedule: transaction.schedule,
    });
    const categoryCleared = await clearCategory(transaction, transferredAccount);
    if (categoryCleared) {
        return { id: transaction.id, category: null };
    }
}
async function onInsert(transaction) {
    const transferredAccount = await getTransferredAccount(transaction);
    if (transferredAccount) {
        return addTransfer(transaction, transferredAccount);
    }
}
async function onDelete(transaction) {
    if (transaction.transfer_id) {
        await removeTransfer(transaction);
    }
}
async function onUpdate(transaction) {
    const transferredAccount = await getTransferredAccount(transaction);
    if (transaction.is_parent) {
        return removeTransfer(transaction);
    }
    if (transferredAccount && !transaction.transfer_id) {
        return addTransfer(transaction, transferredAccount);
    }
    if (!transferredAccount && transaction.transfer_id) {
        return removeTransfer(transaction);
    }
    if (transferredAccount && transaction.transfer_id) {
        return updateTransfer(transaction, transferredAccount);
    }
}
//# sourceMappingURL=transfer.js.map