import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { PayeeAutocomplete, } from '@desktop-client/components/autocomplete/PayeeAutocomplete';
/**
 * Component to filter on payee.
 *
 * This component also shows "inactive" payees, specifically meant for transfer payees
 * whose account are closed. This lets the end-user filter transactions (among others)
 * based on transfer payees of closed accounts.
 */
export const PayeeFilter = ({ value, op, onChange }) => {
    const { t } = useTranslation();
    const multi = ['oneOf', 'notOneOf'].includes(op);
    let coercedValue = value;
    if (multi) {
        coercedValue = Array.isArray(value) ? value : [];
    }
    else {
        coercedValue = Array.isArray(value) ? (value[0] ?? null) : value;
    }
    const placeholder = multi && coercedValue.length > 0 ? undefined : t('nothing');
    return (
    // @ts-ignore: typing is not playing nicely with the union type of AutocompleteProps.
    _jsx(PayeeAutocomplete, { type: multi ? 'multi' : 'single', showInactivePayees: true, showMakeTransfer: false, openOnFocus: true, value: coercedValue, inputProps: { placeholder }, onSelect: (payeeIdOrIds, _) => onChange(payeeIdOrIds) }));
};
