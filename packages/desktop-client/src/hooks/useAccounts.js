"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAccounts = useAccounts;
var react_1 = require("react");
var useInitialMount_1 = require("./useInitialMount");
var accountsSlice_1 = require("@desktop-client/accounts/accountsSlice");
var redux_1 = require("@desktop-client/redux");
function useAccounts() {
    var dispatch = (0, redux_1.useDispatch)();
    var isInitialMount = (0, useInitialMount_1.useInitialMount)();
    var isAccountsDirty = (0, redux_1.useSelector)(function (state) { return state.account.isAccountsDirty; });
    (0, react_1.useEffect)(function () {
        if (isInitialMount || isAccountsDirty) {
            dispatch((0, accountsSlice_1.getAccounts)());
        }
    }, [dispatch, isInitialMount, isAccountsDirty]);
    return (0, redux_1.useSelector)(function (state) { return state.account.accounts; });
}
