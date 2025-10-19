"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccount = generateAccount;
exports.generateCategory = generateCategory;
exports.generateCategoryGroup = generateCategoryGroup;
exports.generateCategoryGroups = generateCategoryGroups;
exports.generateTransaction = generateTransaction;
exports.generateTransactions = generateTransactions;
const uuid_1 = require("uuid");
const monthUtils = __importStar(require("../shared/months"));
const random_1 = require("./random");
function generateAccount(name, isConnected, offbudget) {
    const offlineAccount = {
        id: (0, uuid_1.v4)(),
        name,
        offbudget: offbudget ? 1 : 0,
        sort_order: 0,
        last_reconciled: null,
        tombstone: 0,
        closed: 0,
        ...emptySyncFields(),
    };
    if (isConnected) {
        return {
            ...offlineAccount,
            balance_current: Math.floor((0, random_1.random)() * 100000),
            bankId: Math.floor((0, random_1.random)() * 10000),
            bankName: 'boa',
            bank: Math.floor((0, random_1.random)() * 10000).toString(),
            account_id: 'idx',
            mask: 'xxx',
            official_name: 'boa',
            balance_available: 0,
            balance_limit: 0,
            account_sync_source: 'goCardless',
            last_sync: new Date().getTime().toString(),
        };
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
let sortOrder = 1;
function generateCategory(name, group, isIncome = false) {
    return {
        id: (0, uuid_1.v4)(),
        name,
        group,
        is_income: isIncome,
        sort_order: sortOrder++,
    };
}
let groupSortOrder = 1;
function generateCategoryGroup(name, isIncome = false) {
    return {
        id: (0, uuid_1.v4)(),
        name,
        is_income: isIncome,
        sort_order: groupSortOrder++,
    };
}
function generateCategoryGroups(definition) {
    return definition.map(group => {
        const g = generateCategoryGroup(group.name ?? '', group.is_income);
        if (!group.categories) {
            return g;
        }
        return {
            ...g,
            categories: group.categories.map(cat => generateCategory(cat.name, g.id, cat.is_income)),
        };
    });
}
function _generateTransaction(data) {
    return {
        id: data.id || (0, uuid_1.v4)(),
        amount: data.amount || Math.floor((0, random_1.random)() * 10000 - 7000),
        payee: data.payee || 'payed-to',
        notes: 'Notes',
        account: data.account,
        date: data.date || monthUtils.currentDay(),
        sort_order: data.sort_order != null ? data.sort_order : 1,
        cleared: false,
        ...(data.category && { category: data.category }),
    };
}
function generateTransaction(data, splitAmount, showError = false) {
    const result = [];
    const trans = _generateTransaction(data);
    result.push(trans);
    if (splitAmount) {
        const parent = trans;
        parent.is_parent = true;
        result.push({
            id: parent.id + '/' + (0, uuid_1.v4)(),
            amount: trans.amount - splitAmount,
            account: parent.account,
            date: parent.date,
            is_child: true,
        }, {
            id: parent.id + '/' + (0, uuid_1.v4)(),
            amount: splitAmount,
            account: parent.account,
            date: parent.date,
            is_child: true,
        });
        if (showError) {
            const last = result[result.length - 1];
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
function generateTransactions(count, accountId, groupId, splitAtIndexes = [], showError = false) {
    const transactions = [];
    for (let i = 0; i < count; i++) {
        const isSplit = splitAtIndexes.includes(i);
        transactions.push.apply(transactions, generateTransaction({
            account: accountId,
            category: groupId,
            ...(isSplit && { amount: 50 }),
            sort_order: i,
        }, isSplit ? 30 : undefined, showError));
    }
    return transactions;
}
