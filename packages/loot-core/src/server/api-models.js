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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleModel = exports.budgetModel = exports.remoteFileModel = exports.payeeModel = exports.categoryGroupModel = exports.categoryModel = exports.accountModel = void 0;
var models = require("./models");
exports.accountModel = __assign(__assign({}, models.accountModel), { toExternal: function (account) {
        return {
            id: account.id,
            name: account.name,
            offbudget: account.offbudget ? true : false,
            closed: account.closed ? true : false,
        };
    }, fromExternal: function (account) {
        var result = __assign({}, account);
        if ('offbudget' in account) {
            result.offbudget = account.offbudget ? 1 : 0;
        }
        if ('closed' in account) {
            result.closed = account.closed ? 1 : 0;
        }
        return result;
    } });
exports.categoryModel = __assign(__assign({}, models.categoryModel), { toExternal: function (category) {
        return {
            id: category.id,
            name: category.name,
            is_income: category.is_income ? true : false,
            hidden: category.hidden ? true : false,
            group_id: category.group,
        };
    }, fromExternal: function (category) {
        var group_id = category.group_id, apiCategory = __rest(category, ["group_id"]);
        var result = __assign(__assign({}, apiCategory), { group: group_id });
        return result;
    } });
exports.categoryGroupModel = __assign(__assign({}, models.categoryGroupModel), { toExternal: function (group) {
        var _a;
        return {
            id: group.id,
            name: group.name,
            is_income: group.is_income ? true : false,
            hidden: group.hidden ? true : false,
            categories: ((_a = group.categories) === null || _a === void 0 ? void 0 : _a.map(exports.categoryModel.toExternal)) || [],
        };
    }, fromExternal: function (group) {
        var result = __assign({}, group);
        if ('categories' in group) {
            result.categories = group.categories.map(exports.categoryModel.fromExternal);
        }
        return result;
    } });
exports.payeeModel = __assign(__assign({}, models.payeeModel), { toExternal: function (payee) {
        return {
            id: payee.id,
            name: payee.name,
            transfer_acct: payee.transfer_acct,
        };
    }, fromExternal: function (payee) {
        // No translation is needed
        return payee;
    } });
exports.remoteFileModel = {
    toExternal: function (file) {
        if (file.deleted) {
            return null;
        }
        return {
            cloudFileId: file.fileId,
            state: 'remote',
            groupId: file.groupId,
            name: file.name,
            encryptKeyId: file.encryptKeyId,
            hasKey: file.hasKey,
            owner: file.owner,
            usersWithAccess: file.usersWithAccess,
        };
    },
    fromExternal: function (file) {
        return __assign({ deleted: false, fileId: file.cloudFileId }, file);
    },
};
exports.budgetModel = {
    toExternal: function (file) {
        return file;
    },
    fromExternal: function (file) {
        return file;
    },
};
exports.scheduleModel = {
    toExternal: function (schedule) {
        return {
            id: schedule.id,
            name: schedule.name,
            rule: schedule.rule,
            next_date: schedule.next_date,
            completed: schedule.completed,
            posts_transaction: schedule.posts_transaction,
            payee: schedule._payee,
            account: schedule._account,
            amount: schedule._amount,
            amountOp: schedule._amountOp, // e.g. 'isapprox', 'is', etc.
            date: schedule._date,
        };
    },
    //just an update
    fromExternal: function (schedule) {
        var result = {
            id: schedule.id,
            name: schedule.name,
            rule: String(schedule.rule),
            next_date: String(schedule.next_date),
            completed: Boolean(schedule.completed),
            posts_transaction: schedule.posts_transaction,
            tombstone: false,
            _payee: String(schedule.payee),
            _account: String(schedule.account),
            _amount: schedule.amount,
            _amountOp: schedule.amountOp, // e.g. 'isapprox', 'is', etc.
            _date: schedule.date,
            _conditions: [
                { op: 'is', field: 'payee', value: String(schedule.payee) },
                { op: 'is', field: 'account', value: String(schedule.account) },
                { op: 'isapprox', field: 'date', value: schedule.date },
                { op: schedule.amountOp, field: 'amount', value: schedule.amount },
            ],
            _actions: [], // empty array, as you requested
        };
        return result;
    },
};
