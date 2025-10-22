"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockStore = void 0;
exports.resetMockStore = resetMockStore;
exports.TestProvider = TestProvider;
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var toolkit_1 = require("@reduxjs/toolkit");
var accountsSlice_1 = require("@desktop-client/accounts/accountsSlice");
var appSlice_1 = require("@desktop-client/app/appSlice");
var budgetSlice_1 = require("@desktop-client/budget/budgetSlice");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var payeesSlice_1 = require("@desktop-client/payees/payeesSlice");
var prefsSlice_1 = require("@desktop-client/prefs/prefsSlice");
var tagsSlice_1 = require("@desktop-client/tags/tagsSlice");
var transactionsSlice_1 = require("@desktop-client/transactions/transactionsSlice");
var usersSlice_1 = require("@desktop-client/users/usersSlice");
var appReducer = (0, toolkit_1.combineReducers)((_a = {},
    _a[accountsSlice_1.name] = accountsSlice_1.reducer,
    _a[appSlice_1.name] = appSlice_1.reducer,
    _a[budgetSlice_1.name] = budgetSlice_1.reducer,
    _a[budgetfilesSlice_1.name] = budgetfilesSlice_1.reducer,
    _a[modalsSlice_1.name] = modalsSlice_1.reducer,
    _a[notificationsSlice_1.name] = notificationsSlice_1.reducer,
    _a[payeesSlice_1.name] = payeesSlice_1.reducer,
    _a[prefsSlice_1.name] = prefsSlice_1.reducer,
    _a[transactionsSlice_1.name] = transactionsSlice_1.reducer,
    _a[tagsSlice_1.name] = tagsSlice_1.reducer,
    _a[usersSlice_1.name] = usersSlice_1.reducer,
    _a));
exports.mockStore = (0, toolkit_1.configureStore)({
    reducer: appReducer,
});
function resetMockStore() {
    exports.mockStore = (0, toolkit_1.configureStore)({
        reducer: appReducer,
    });
}
function TestProvider(_a) {
    var children = _a.children;
    return <react_redux_1.Provider store={exports.mockStore}>{children}</react_redux_1.Provider>;
}
