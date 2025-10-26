// @ts-strict-ignore
import { parseStringPromise } from 'xml2js';
function findKeys(obj, key) {
    let result = [];
    for (const i in obj) {
        if (!obj.hasOwnProperty(i))
            continue;
        if (i === key) {
            if (Array.isArray(obj[i])) {
                result = result.concat(obj[i]);
            }
            else {
                result.push(obj[i]);
            }
        }
        if (typeof obj[i] === 'object') {
            result = result.concat(findKeys(obj[i], key));
        }
    }
    return result;
}
function getPayeeNameFromTxDtls(TxDtls, isDebit) {
    if (TxDtls?.RltdPties) {
        const key = isDebit ? TxDtls.RltdPties.Cdtr : TxDtls.RltdPties.Dbtr;
        const Nm = findKeys(key, 'Nm');
        return Nm.length > 0 ? Nm[0] : null;
    }
    return null;
}
function getNotesFromTxDtls(TxDtls) {
    if (TxDtls?.RmtInf) {
        const Ustrd = TxDtls.RmtInf.Ustrd;
        return Array.isArray(Ustrd) ? Ustrd.join(' ') : Ustrd;
    }
    return null;
}
function convertToNumberOrNull(value) {
    const number = Number(value);
    return isNaN(number) ? null : number;
}
function getDtOrDtTm(Date) {
    if (!Date) {
        return null;
    }
    if ('DtTm' in Date) {
        return Date.DtTm.slice(0, 10);
    }
    return Date?.Dt;
}
export async function xmlCAMT2json(content) {
    const data = await parseStringPromise(content, { explicitArray: false });
    const entries = findKeys(data, 'Ntry');
    const transactions = [];
    for (const entry of entries) {
        /*
          For (camt.052/054) could filter on entry.Sts= BOOK or PDNG, currently importing all entries
        */
        const id = entry.AcctSvcrRef;
        const amount = convertToNumberOrNull(entry.Amt?._);
        const isDebit = entry.CdtDbtInd === 'DBIT';
        const date = getDtOrDtTm(entry.ValDt) || getDtOrDtTm(entry.BookgDt);
        if (Array.isArray(entry.NtryDtls?.TxDtls)) {
            // we add subtransactions as normal transactions as importing split with subtransactions is not supported
            // amount, and payee_name are not processed correctly for subtransaction.
            entry.NtryDtls.TxDtls.forEach((TxDtls) => {
                const subPayee = getPayeeNameFromTxDtls(TxDtls, isDebit);
                const subNotes = getNotesFromTxDtls(TxDtls);
                const Amt = findKeys(TxDtls, 'Amt');
                const amount = Amt.length > 0 ? convertToNumberOrNull(Amt[0]._) : null;
                transactions.push({
                    amount: isDebit ? -amount : amount,
                    date,
                    payee_name: subPayee,
                    imported_payee: subPayee,
                    notes: subNotes,
                });
            });
        }
        else {
            let payee_name;
            let notes;
            payee_name = getPayeeNameFromTxDtls(entry.NtryDtls?.TxDtls, isDebit);
            if (!payee_name && entry.AddtlNtryInf) {
                payee_name = entry.AddtlNtryInf;
            }
            notes = getNotesFromTxDtls(entry.NtryDtls?.TxDtls);
            if (!notes && entry.AddtlNtryInf && entry.AddtlNtryInf !== payee_name) {
                notes = entry.AddtlNtryInf;
            }
            if (!payee_name && !notes && entry.NtryRef) {
                notes = entry.NtryRef;
            }
            if (payee_name && notes && payee_name.includes(notes)) {
                notes = null;
            }
            const transaction = {
                amount: isDebit ? -amount : amount,
                date,
                payee_name,
                imported_payee: payee_name,
                notes,
            };
            if (id) {
                transaction.imported_id = id;
            }
            transactions.push(transaction);
        }
    }
    return transactions.filter(trans => trans.date != null && trans.amount != null);
}
