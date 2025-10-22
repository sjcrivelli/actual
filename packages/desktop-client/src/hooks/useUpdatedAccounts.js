"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpdatedAccounts = useUpdatedAccounts;
var redux_1 = require("@desktop-client/redux");
function useUpdatedAccounts() {
    return (0, redux_1.useSelector)(function (state) { return state.account.updatedAccounts; });
}
