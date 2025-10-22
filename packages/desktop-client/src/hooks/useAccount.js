"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAccount = useAccount;
var react_1 = require("react");
var useAccounts_1 = require("./useAccounts");
function useAccount(id) {
    var accounts = (0, useAccounts_1.useAccounts)();
    return (0, react_1.useMemo)(function () { return accounts.find(function (a) { return a.id === id; }); }, [id, accounts]);
}
