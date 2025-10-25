
// @ts-strict-ignore
import { parse, isValid } from "date-fns";
import { getDayMonthRegex, getDayMonthFormat, getShortYearRegex, getShortYearFormat, dayFromDate } from "loot-core/shared/months";
import { q } from "loot-core/shared/query";
import { currencyToAmount, amountToInteger } from "loot-core/shared/util";

export function accountFilter(accountId, field = "account") {
    if (accountId) {
        if (accountId === "onbudget") {
            return {
                $and: [
                    { [`${field}.offbudget`]: false },
                    { [`${field}.closed`]: false },
                ],
            };
        } else if (accountId === "offbudget") {
            return {
                $and: [
                    { [`${field}.offbudget`]: true },
                    { [`${field}.closed`]: false },
                ],
            };
        } else if (accountId === "closed") {
            return { [`${field}.closed`]: true };
        } else if (accountId === "uncategorized") {
            return {
                [`${field}.offbudget`]: false,
                category: null,
                is_parent: false,
                $or: [
                    {
                        "payee.transfer_acct.offbudget": true,
                        "payee.transfer_acct": null,
                    },
                ],
            };
        } else {
            return { [field]: accountId };
        }
    }
    return null;
}

export function transactions(accountId) {
    let queryObj = q("transactions").options({ splits: "grouped" });
    const filter = accountFilter(accountId);
    if (filter) {
        queryObj = queryObj.filter(filter);
    }
    return queryObj;
}

export function transactionsSearch(currentQuery, search, dateFormat) {
    const amount = currencyToAmount(search);
    // Support various date formats
    let parsedDate;
    if (getDayMonthRegex(dateFormat).test(search)) {
        parsedDate = parse(search, getDayMonthFormat(dateFormat), new Date());
    } else if (getShortYearRegex(dateFormat).test(search)) {
        parsedDate = parse(search, getShortYearFormat(dateFormat), new Date());
    } else {
        parsedDate = parse(search, dateFormat, new Date());
    }
    return currentQuery.filter({
        $or: {
            "payee.name": { $like: `%${search}%` },
            "payee.transfer_acct.name": { $like: `%${search}%` },
            notes: { $like: `%${search}%` },
            "category.name": { $like: `%${search}%` },
            "account.name": { $like: `%${search}%` },
            $or: [
                isValid(parsedDate) && { date: dayFromDate(parsedDate) },
                amount != null && {
                    amount: { $transform: "$abs", $eq: amountToInteger(amount) },
                },
                amount != null &&
                    Number.isInteger(amount) && {
                        amount: {
                            $transform: { $abs: { $idiv: ["$", 100] } },
                            $eq: amount,
                        },
                    },
            ].filter(Boolean),
        },
    });
}

export function uncategorizedTransactions() {
    return q("transactions").filter({
        "account.offbudget": false,
        category: null,
        $or: [
            {
                "payee.transfer_acct.offbudget": true,
                "payee.transfer_acct": null,
            },
        ],
    });
}

const defaultExport = {
    accountFilter,
    transactions,
    transactionsSearch,
    uncategorizedTransactions,
};
export default defaultExport;
