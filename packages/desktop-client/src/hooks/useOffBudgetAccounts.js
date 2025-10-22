"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOffBudgetAccounts = useOffBudgetAccounts;
var react_1 = require("react");
var useAccounts_1 = require("./useAccounts");
function useOffBudgetAccounts() {
    var accounts = (0, useAccounts_1.useAccounts)();
    return (0, react_1.useMemo)(function () {
        return accounts.filter(function (account) { return account.closed === 0 && account.offbudget === 1; });
    }, [accounts]);
}
