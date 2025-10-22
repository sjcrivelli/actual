"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validForTransfer = validForTransfer;
function validForTransfer(fromTransaction, toTransaction) {
    if (
    // not already a transfer
    [fromTransaction, toTransaction].every(function (tran) { return tran.transfer_id == null; }) &&
        fromTransaction.account !== toTransaction.account && // belong to different accounts
        fromTransaction.amount + toTransaction.amount === 0 // amount must zero each other out
    ) {
        return true;
    }
    return false;
}
