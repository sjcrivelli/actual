"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrettyPayee = getPrettyPayee;
function getPrettyPayee(_a) {
    var t = _a.t, transaction = _a.transaction, payee = _a.payee, transferAccount = _a.transferAccount;
    if (!transaction) {
        return '';
    }
    if (transferAccount) {
        return t('Transfer {{direction}} {{accountName}}', {
            direction: (transaction === null || transaction === void 0 ? void 0 : transaction.amount) > 0 ? t('from') : t('to'),
            accountName: transferAccount.name,
        });
    }
    else if (transaction.is_parent) {
        return t('Split');
    }
    else if (payee) {
        return payee.name;
    }
    return '';
}
