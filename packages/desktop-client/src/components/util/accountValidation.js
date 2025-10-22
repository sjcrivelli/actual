"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAccountName = validateAccountName;
var i18next_1 = require("i18next");
function validateAccountName(newAccountName, accountId, accounts) {
    newAccountName = newAccountName.trim();
    if (newAccountName.length) {
        var duplicateNamedAccounts = accounts.filter(function (account) { return account.name === newAccountName && account.id !== accountId; });
        if (duplicateNamedAccounts.length) {
            return (0, i18next_1.t)('Name {{ newAccountName }} already exists.', { newAccountName: newAccountName });
        }
        else {
            return '';
        }
    }
    else {
        return (0, i18next_1.t)('Name cannot be blank.');
    }
}
