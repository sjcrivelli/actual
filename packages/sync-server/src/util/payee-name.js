import { title } from "./title/index.js";

function formatPayeeIban(iban) {
    return `(${iban.slice(0, 4)} XXX ${iban.slice(-4)})`;
}

export function formatPayeeName(trans) {
    const amount = trans.transactionAmount.amount;
    const nameParts = [];
    let name;
    let account;
    if (amount > 0 || Object.is(Number(amount), 0)) {
        name = trans.debtorName;
        account = trans.debtorAccount;
    } else {
        name = trans.creditorName;
        account = trans.creditorAccount;
    }
    account = name ? account : trans.debtorAccount || trans.creditorAccount;
    name =
        name ||
        trans.debtorName ||
        trans.creditorName ||
        trans.remittanceInformationUnstructured ||
        (trans.remittanceInformationUnstructuredArray || []).join(", ") ||
        trans.additionalInformation;
    if (name) {
        nameParts.push(title(name));
    }
    if (account && account.iban) {
        nameParts.push(formatPayeeIban(account.iban));
    }
    return nameParts.join(" ");
}
