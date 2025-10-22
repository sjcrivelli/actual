"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccount = generateAccount;
exports.generateCategory = generateCategory;
exports.generateCategoryGroup = generateCategoryGroup;
exports.generateCategoryGroups = generateCategoryGroups;
exports.generateTransaction = generateTransaction;
exports.generateTransactions = generateTransactions;
var uuid_1 = require("uuid");
var monthUtils = require("../shared/months");
var random_1 = require("./random");
function generateAccount(name, isConnected, offbudget) {
    var offlineAccount = __assign({ id: (0, uuid_1.v4)(), name: name, offbudget: offbudget ? 1 : 0, sort_order: 0, last_reconciled: null, tombstone: 0, closed: 0 }, emptySyncFields());
    if (isConnected) {
        return __assign(__assign({}, offlineAccount), { balance_current: Math.floor((0, random_1.random)() * 100000), bankId: Math.floor((0, random_1.random)() * 10000), bankName: 'boa', bank: Math.floor((0, random_1.random)() * 10000).toString(), account_id: 'idx', mask: 'xxx', official_name: 'boa', balance_available: 0, balance_limit: 0, account_sync_source: 'goCardless', last_sync: new Date().getTime().toString() });
    }
    return offlineAccount;
}
function emptySyncFields() {
    return {
        account_id: null,
        bank: null,
        bankId: null,
        bankName: null,
        mask: null,
        official_name: null,
        balance_current: null,
        balance_available: null,
        balance_limit: null,
        account_sync_source: null,
        last_sync: null,
    };
}
var sortOrder = 1;
function generateCategory(name, group, isIncome) {
    if (isIncome === void 0) { isIncome = false; }
    return {
        id: (0, uuid_1.v4)(),
        name: name,
        group: group,
        is_income: isIncome,
        sort_order: sortOrder++,
    };
}
var groupSortOrder = 1;
function generateCategoryGroup(name, isIncome) {
    if (isIncome === void 0) { isIncome = false; }
    return {
        id: (0, uuid_1.v4)(),
        name: name,
        is_income: isIncome,
        sort_order: groupSortOrder++,
    };
}
function generateCategoryGroups(definition) {
    return definition.map(function (group) {
        var _a;
        var g = generateCategoryGroup((_a = group.name) !== null && _a !== void 0 ? _a : '', group.is_income);
        if (!group.categories) {
            return g;
        }
        return __assign(__assign({}, g), { categories: group.categories.map(function (cat) {
                return generateCategory(cat.name, g.id, cat.is_income);
            }) });
    });
}
function _generateTransaction(data) {
    return __assign({ id: data.id || (0, uuid_1.v4)(), amount: data.amount || Math.floor((0, random_1.random)() * 10000 - 7000), payee: data.payee || 'payed-to', notes: 'Notes', account: data.account, date: data.date || monthUtils.currentDay(), sort_order: data.sort_order != null ? data.sort_order : 1, cleared: false }, (data.category && { category: data.category }));
}
function generateTransaction(data, splitAmount, showError) {
    if (showError === void 0) { showError = false; }
    var result = [];
    var trans = _generateTransaction(data);
    result.push(trans);
    if (splitAmount) {
        var parent_1 = trans;
        parent_1.is_parent = true;
        result.push({
            id: parent_1.id + '/' + (0, uuid_1.v4)(),
            amount: trans.amount - splitAmount,
            account: parent_1.account,
            date: parent_1.date,
            is_child: true,
        }, {
            id: parent_1.id + '/' + (0, uuid_1.v4)(),
            amount: splitAmount,
            account: parent_1.account,
            date: parent_1.date,
            is_child: true,
        });
        if (showError) {
            var last = result[result.length - 1];
            last.amount += 500;
            last.error = {
                type: 'SplitTransactionError',
                version: 1,
                difference: 500,
            };
        }
    }
    return result;
}
function generateTransactions(count, accountId, groupId, splitAtIndexes, showError) {
    if (splitAtIndexes === void 0) { splitAtIndexes = []; }
    if (showError === void 0) { showError = false; }
    var transactions = [];
    for (var i = 0; i < count; i++) {
        var isSplit = splitAtIndexes.includes(i);
        transactions.push.apply(transactions, generateTransaction(__assign(__assign({ account: accountId, category: groupId }, (isSplit && { amount: 50 })), { sort_order: i }), isSplit ? 30 : undefined, showError));
    }
    return transactions;
}
