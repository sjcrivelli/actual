import { parseISO, isValid as isDateValid } from 'date-fns';
import { evalArithmetic } from 'loot-core/shared/arithmetic';
import { currentDay } from 'loot-core/shared/months';
import { amountToInteger, integerToCurrencyWithDecimal, } from 'loot-core/shared/util';
export function serializeTransaction(transaction, showZeroInDeposit) {
    const { amount, date: originalDate } = transaction;
    let debit = amount < 0 ? -amount : null;
    let credit = amount > 0 ? amount : null;
    if (amount === 0) {
        if (showZeroInDeposit) {
            credit = 0;
        }
        else {
            debit = 0;
        }
    }
    let date = originalDate;
    // Validate the date format
    if (!isDateValid(parseISO(date))) {
        // Be a little forgiving if the date isn't valid. This at least
        // stops the UI from crashing, but this is a serious problem with
        // the data. This allows the user to go through and see empty
        // dates and manually fix them.
        console.error(`Date ‘${date}’ is not valid.`);
        // TODO: the fact that the date type is not nullable but we are setting it to null needs to be changed
        date = null;
    }
    // Convert with decimals here so the value doesn't lose decimals and formatter will show or hide them.
    return {
        ...transaction,
        date,
        debit: debit != null ? integerToCurrencyWithDecimal(debit) : '',
        credit: credit != null ? integerToCurrencyWithDecimal(credit) : '',
    };
}
export function deserializeTransaction(transaction, originalTransaction) {
    const { debit, credit, date: originalDate, ...realTransaction } = transaction;
    let amount;
    if (debit !== '') {
        const parsed = evalArithmetic(debit, null);
        amount = parsed != null ? -parsed : null;
    }
    else {
        amount = evalArithmetic(credit, null);
    }
    amount =
        amount != null ? amountToInteger(amount) : originalTransaction.amount;
    let date = originalDate;
    if (date == null) {
        date = originalTransaction.date || currentDay();
    }
    return { ...realTransaction, date, amount };
}
export function isLastChild(transactions, index) {
    const trans = transactions[index];
    return (trans &&
        trans.is_child &&
        (transactions[index + 1] == null ||
            transactions[index + 1].parent_id !== trans.parent_id));
}
export function selectAscDesc(field, ascDesc, clicked, defaultAscDesc = 'asc') {
    return field === clicked
        ? ascDesc === 'asc'
            ? 'desc'
            : 'asc'
        : defaultAscDesc;
}
export function getDisplayValue(obj, name) {
    return obj ? obj[name] : '';
}
export function makeTemporaryTransactions(currentAccountId, currentCategoryId, lastDate) {
    return [
        {
            id: 'temp',
            date: lastDate || currentDay(),
            // TODO: consider making this default to an empty string
            account: (currentAccountId || null),
            category: currentCategoryId || undefined,
            cleared: false,
            // TODO: either make this nullable or find a way to make this not null
            amount: null,
        },
    ];
}
