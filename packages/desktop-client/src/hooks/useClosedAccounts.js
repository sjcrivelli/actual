"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClosedAccounts = useClosedAccounts;
var react_1 = require("react");
var useAccounts_1 = require("./useAccounts");
function useClosedAccounts() {
    var accounts = (0, useAccounts_1.useAccounts)();
    return (0, react_1.useMemo)(function () { return accounts.filter(function (account) { return account.closed === 1; }); }, [accounts]);
}
