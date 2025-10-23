import { title } from './title/index.js';

function formatPayeeIban(iban: string): string {
  return '(' + iban.slice(0, 4) + ' XXX ' + iban.slice(-4) + ')';
}

export const formatPayeeName = (trans: Record<string, unknown>): string => {
  let amount = 0;
  if (
    trans.transactionAmount &&
    typeof trans.transactionAmount === 'object' &&
    trans.transactionAmount !== null &&
    'amount' in trans.transactionAmount &&
    typeof (trans.transactionAmount as Record<string, unknown>).amount === 'number'
  ) {
    amount = (trans.transactionAmount as Record<string, unknown>).amount as number;
  }
  const nameParts: string[] = [];

  // get the correct name and account fields for the transaction amount
  let name: unknown;
  let account: unknown;
  if (amount > 0 || Object.is(Number(amount), 0)) {
    name = typeof trans.debtorName === 'string' ? trans.debtorName : undefined;
    account = typeof trans.debtorAccount === 'object' && trans.debtorAccount !== null ? trans.debtorAccount : undefined;
  } else {
    name = typeof trans.creditorName === 'string' ? trans.creditorName : undefined;
    account = typeof trans.creditorAccount === 'object' && trans.creditorAccount !== null ? trans.creditorAccount : undefined;
  }

  // use the correct name field if it was found
  // if not, use whatever we can find

  // if the primary name option is set, prevent the account from falling back
  account = name
    ? account
    : (typeof trans.debtorAccount === 'object' && trans.debtorAccount !== null
        ? trans.debtorAccount
        : typeof trans.creditorAccount === 'object' && trans.creditorAccount !== null
        ? trans.creditorAccount
        : undefined);

  name =
    name ||
    (typeof trans.debtorName === 'string' ? trans.debtorName : undefined) ||
    (typeof trans.creditorName === 'string' ? trans.creditorName : undefined) ||
    (typeof trans.remittanceInformationUnstructured === 'string' ? trans.remittanceInformationUnstructured : undefined) ||
    (Array.isArray(trans.remittanceInformationUnstructuredArray)
      ? trans.remittanceInformationUnstructuredArray.join(', ')
      : undefined) ||
    (typeof trans.additionalInformation === 'string' ? trans.additionalInformation : undefined);

  if (name) {
    nameParts.push(title(name));
  }

  if (account && typeof account === 'object' && account !== null && 'iban' in account && typeof (account as { iban?: unknown }).iban === 'string') {
    nameParts.push(formatPayeeIban((account as { iban: string }).iban));
  }

  return nameParts.join(' ');
};
