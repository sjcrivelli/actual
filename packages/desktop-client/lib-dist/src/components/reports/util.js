import { aqlQuery } from '@desktop-client/queries/aqlQuery';
export function fromDateRepr(date) {
    return date.slice(0, 7);
}
export async function runAll(queries, cb) {
    const data = await Promise.all(queries.map(q => {
        return aqlQuery(q).then(({ data }) => data);
    }));
    cb(data);
}
export function indexCashFlow(data) {
    const results = {};
    data.forEach(item => {
        const findExisting = results?.[item.date]?.[String(item.isTransfer)] ?? 0;
        const result = { [String(item.isTransfer)]: item.amount + findExisting };
        results[item.date] = { ...results[item.date], ...result };
    });
    return results;
}
/**
 * Checks if the given conditions have issues
 * (i.e. non-existing category/payee/account being used).
 */
export function calculateHasWarning(conditions, { categories, accounts, payees, }) {
    const categoryIds = new Set(categories.map(({ id }) => id));
    const payeeIds = new Set(payees.map(({ id }) => id));
    const accountIds = new Set(accounts.map(({ id }) => id));
    if (!conditions) {
        return false;
    }
    for (const cond of conditions) {
        const { field, value, op } = cond;
        const isMultiCondition = Array.isArray(value);
        const isSupportedSingleCondition = ['is', 'isNot'].includes(op);
        // Regex and other more complicated operations are not supported
        if (!isSupportedSingleCondition && !isMultiCondition) {
            continue;
        }
        // Empty value.. we can skip
        if (!isMultiCondition && !value) {
            continue;
        }
        switch (field) {
            case 'account':
                if (isMultiCondition) {
                    if (value.find(val => !accountIds.has(val))) {
                        return true;
                    }
                    break;
                }
                if (!accountIds.has(value)) {
                    return true;
                }
                break;
            case 'payee':
                if (isMultiCondition) {
                    if (value.find(val => !payeeIds.has(val))) {
                        return true;
                    }
                    break;
                }
                if (!payeeIds.has(value)) {
                    return true;
                }
                break;
            case 'category':
                if (isMultiCondition) {
                    if (value.find(val => !categoryIds.has(val))) {
                        return true;
                    }
                    break;
                }
                if (!categoryIds.has(value)) {
                    return true;
                }
                break;
        }
    }
    return false;
}
