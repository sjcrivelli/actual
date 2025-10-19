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
exports.mergeTransactions = mergeTransactions;
const db = __importStar(require("../db"));
async function mergeTransactions(transactions) {
    // make sure all values have ids
    const txIds = transactions?.map(x => x?.id).filter(Boolean) || [];
    if (txIds.length !== 2) {
        throw new Error('Merging is only possible with 2 transactions, but found ' +
            JSON.stringify(transactions));
    }
    // get most recent transactions
    const [a, b] = await Promise.all(txIds.map(db.getTransaction));
    if (!a || !b) {
        throw new Error('One of the provided transactions does not exist');
    }
    else if (a.amount !== b.amount) {
        throw new Error('Transaction amounts must match for merge');
    }
    const { keep, drop } = determineKeepDrop(a, b);
    await Promise.all([
        db.updateTransaction({
            id: keep.id,
            payee: keep.payee || drop.payee,
            category: keep.category || drop.category,
            notes: keep.notes || drop.notes,
            cleared: keep.cleared || drop.cleared,
            reconciled: keep.reconciled || drop.reconciled,
        }),
        db.deleteTransaction(drop),
    ]);
    return keep.id;
}
function determineKeepDrop(a, b) {
    // if one is imported through bank sync and the other is manual,
    // keep the imported transaction
    if (b.imported_id && !a.imported_id) {
        return { keep: b, drop: a };
    }
    else if (a.imported_id && !b.imported_id) {
        return { keep: a, drop: b };
    }
    // same logic but for imported transactions
    if (b.imported_payee && !a.imported_payee) {
        return { keep: b, drop: a };
    }
    else if (a.imported_payee && !b.imported_payee) {
        return { keep: a, drop: b };
    }
    // keep the earlier transaction
    if (a.date.localeCompare(b.date) < 0) {
        return { keep: a, drop: b };
    }
    else {
        return { keep: b, drop: a };
    }
}
