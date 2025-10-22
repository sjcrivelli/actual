"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOnBudgetAccounts = useOnBudgetAccounts;
var react_1 = require("react");
var useAccounts_1 = require("./useAccounts");
function useOnBudgetAccounts() {
    var accounts = (0, useAccounts_1.useAccounts)();
    return (0, react_1.useMemo)(function () {
        return accounts.filter(function (account) { return account.closed === 0 && account.offbudget === 0; });
    }, [accounts]);
}
