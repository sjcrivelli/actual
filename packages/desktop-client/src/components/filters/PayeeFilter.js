"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayeeFilter = void 0;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var PayeeAutocomplete_1 = require("@desktop-client/components/autocomplete/PayeeAutocomplete");
/**
 * Component to filter on payee.
 *
 * This component also shows "inactive" payees, specifically meant for transfer payees
 * whose account are closed. This lets the end-user filter transactions (among others)
 * based on transfer payees of closed accounts.
 */
var PayeeFilter = function (_a) {
    var _b;
    var value = _a.value, op = _a.op, onChange = _a.onChange;
    var t = (0, react_i18next_1.useTranslation)().t;
    var multi = ['oneOf', 'notOneOf'].includes(op);
    var coercedValue = value;
    if (multi) {
        coercedValue = Array.isArray(value) ? value : [];
    }
    else {
        coercedValue = Array.isArray(value) ? ((_b = value[0]) !== null && _b !== void 0 ? _b : null) : value;
    }
    var placeholder = multi && coercedValue.length > 0 ? undefined : t('nothing');
    return (
    // @ts-ignore: typing is not playing nicely with the union type of AutocompleteProps.
    <PayeeAutocomplete_1.PayeeAutocomplete type={multi ? 'multi' : 'single'} showInactivePayees={true} showMakeTransfer={false} openOnFocus={true} value={coercedValue} inputProps={{ placeholder: placeholder }} onSelect={function (payeeIdOrIds, _) {
            return onChange(payeeIdOrIds);
        }}/>);
};
exports.PayeeFilter = PayeeFilter;
