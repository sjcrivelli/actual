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
exports.scheduleModel = exports.budgetModel = exports.remoteFileModel = exports.payeeModel = exports.categoryGroupModel = exports.categoryModel = exports.accountModel = void 0;
const models = __importStar(require("./models"));
exports.accountModel = {
    ...models.accountModel,
    toExternal(account) {
        return {
            id: account.id,
            name: account.name,
            offbudget: account.offbudget ? true : false,
            closed: account.closed ? true : false,
        };
    },
    fromExternal(account) {
        const result = { ...account };
        if ('offbudget' in account) {
            result.offbudget = account.offbudget ? 1 : 0;
        }
        if ('closed' in account) {
            result.closed = account.closed ? 1 : 0;
        }
        return result;
    },
};
exports.categoryModel = {
    ...models.categoryModel,
    toExternal(category) {
        return {
            id: category.id,
            name: category.name,
            is_income: category.is_income ? true : false,
            hidden: category.hidden ? true : false,
            group_id: category.group,
        };
    },
    fromExternal(category) {
        const { group_id, ...apiCategory } = category;
        const result = {
            ...apiCategory,
            group: group_id,
        };
        return result;
    },
};
exports.categoryGroupModel = {
    ...models.categoryGroupModel,
    toExternal(group) {
        return {
            id: group.id,
            name: group.name,
            is_income: group.is_income ? true : false,
            hidden: group.hidden ? true : false,
            categories: group.categories?.map(exports.categoryModel.toExternal) || [],
        };
    },
    fromExternal(group) {
        const result = { ...group };
        if ('categories' in group) {
            result.categories = group.categories.map(exports.categoryModel.fromExternal);
        }
        return result;
    },
};
exports.payeeModel = {
    ...models.payeeModel,
    toExternal(payee) {
        return {
            id: payee.id,
            name: payee.name,
            transfer_acct: payee.transfer_acct,
        };
    },
    fromExternal(payee) {
        // No translation is needed
        return payee;
    },
};
exports.remoteFileModel = {
    toExternal(file) {
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
    fromExternal(file) {
        return { deleted: false, fileId: file.cloudFileId, ...file };
    },
};
exports.budgetModel = {
    toExternal(file) {
        return file;
    },
    fromExternal(file) {
        return file;
    },
};
exports.scheduleModel = {
    toExternal(schedule) {
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
    fromExternal(schedule) {
        const result = {
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
//# sourceMappingURL=api-models.js.map