"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsList = AccountsList;
var react_1 = require("react");
var view_1 = require("@actual-app/components/view");
var AccountRow_1 = require("./AccountRow");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
function AccountsList(_a) {
    var accounts = _a.accounts, hoveredAccount = _a.hoveredAccount, onHover = _a.onHover, onAction = _a.onAction;
    var locale = (0, useLocale_1.useLocale)();
    if (accounts.length === 0) {
        return null;
    }
    return (<view_1.View style={{
            minHeight: 'initial',
        }}>
      {accounts.map(function (account) {
            var hovered = hoveredAccount === account.id;
            return (<AccountRow_1.AccountRow key={account.id} account={account} hovered={hovered} onHover={onHover} onAction={onAction} locale={locale}/>);
        })}
    </view_1.View>);
}
