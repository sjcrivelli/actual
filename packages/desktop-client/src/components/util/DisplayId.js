"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayId = DisplayId;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var text_1 = require("@actual-app/components/text");
var text_one_line_1 = require("@actual-app/components/text-one-line");
var theme_1 = require("@actual-app/components/theme");
var useAccount_1 = require("@desktop-client/hooks/useAccount");
var usePayee_1 = require("@desktop-client/hooks/usePayee");
function DisplayId(_a) {
    var type = _a.type, id = _a.id, _b = _a.noneColor, noneColor = _b === void 0 ? theme_1.theme.pageTextSubdued : _b;
    return type === 'accounts' ? (<AccountDisplayId id={id} noneColor={noneColor}/>) : (<PayeeDisplayId id={id} noneColor={noneColor}/>);
}
function AccountDisplayId(_a) {
    var id = _a.id, noneColor = _a.noneColor;
    var t = (0, react_i18next_1.useTranslation)().t;
    var account = (0, useAccount_1.useAccount)(id);
    return (<text_1.Text style={account == null ? { color: noneColor } : null} title={account ? account.name : t('None')}>
      {account ? account.name : t('None')}
    </text_1.Text>);
}
function PayeeDisplayId(_a) {
    var id = _a.id, noneColor = _a.noneColor;
    var t = (0, react_i18next_1.useTranslation)().t;
    var payee = (0, usePayee_1.usePayee)(id);
    return (<text_one_line_1.TextOneLine style={payee == null ? { color: noneColor } : null} title={payee ? payee.name : t('None')}>
      {payee ? payee.name : t('None')}
    </text_one_line_1.TextOneLine>);
}
