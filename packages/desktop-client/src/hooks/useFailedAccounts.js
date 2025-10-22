"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFailedAccounts = useFailedAccounts;
var react_1 = require("react");
var redux_1 = require("@desktop-client/redux");
function useFailedAccounts() {
    var failedAccounts = (0, redux_1.useSelector)(function (state) { return state.account.failedAccounts; });
    return (0, react_1.useMemo)(function () { return new Map(Object.entries(failedAccounts)); }, [failedAccounts]);
}
