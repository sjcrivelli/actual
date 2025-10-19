import * as models from './models';
export const accountModel = {
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
export const categoryModel = {
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
export const categoryGroupModel = {
    ...models.categoryGroupModel,
    toExternal(group) {
        return {
            id: group.id,
            name: group.name,
            is_income: group.is_income ? true : false,
            hidden: group.hidden ? true : false,
            categories: group.categories?.map(categoryModel.toExternal) || [],
        };
    },
    fromExternal(group) {
        const result = { ...group };
        if ('categories' in group) {
            result.categories = group.categories.map(categoryModel.fromExternal);
        }
        return result;
    },
};
export const payeeModel = {
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
export const remoteFileModel = {
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
export const budgetModel = {
    toExternal(file) {
        return file;
    },
    fromExternal(file) {
        return file;
    },
};
export const scheduleModel = {
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
