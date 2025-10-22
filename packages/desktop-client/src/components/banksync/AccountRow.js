"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRow = void 0;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var date_fns_1 = require("date-fns");
var util_1 = require("loot-core/shared/util");
var table_1 = require("@desktop-client/components/table");
exports.AccountRow = (0, react_1.memo)(function (_a) {
    var _b;
    var account = _a.account, hovered = _a.hovered, onHover = _a.onHover, onAction = _a.onAction, locale = _a.locale;
    var backgroundFocus = hovered;
    var lastSyncString = (0, util_1.tsToRelativeTime)(account.last_sync, locale, {
        capitalize: true,
    });
    var lastSyncDateTime = (0, date_fns_1.format)(new Date(parseInt((_b = account.last_sync) !== null && _b !== void 0 ? _b : '0', 10)), 'MMM d, yyyy, HH:mm:ss', { locale: locale });
    var potentiallyTruncatedAccountName = account.name.length > 30
        ? account.name.slice(0, 30) + '...'
        : account.name;
    return (<table_1.Row height="auto" style={{
            fontSize: 13,
            backgroundColor: backgroundFocus
                ? theme_1.theme.tableRowBackgroundHover
                : theme_1.theme.tableBackground,
        }} collapsed={true} onMouseEnter={function () { return onHover && onHover(account.id); }} onMouseLeave={function () { return onHover && onHover(null); }}>
        <table_1.Cell name="accountName" width={250} plain style={{ color: theme_1.theme.tableText, padding: '10px' }}>
          {potentiallyTruncatedAccountName}
        </table_1.Cell>

        <table_1.Cell name="bankName" width="flex" plain style={{ color: theme_1.theme.tableText, padding: '10px' }}>
          {account.bankName}
        </table_1.Cell>

        {account.account_sync_source ? (<tooltip_1.Tooltip placement="bottom start" content={lastSyncDateTime} style={__assign({}, styles_1.styles.tooltip)}>
            <table_1.Cell name="lastSync" width={200} plain style={{
                color: theme_1.theme.tableText,
                padding: '11px',
                textDecoration: 'underline',
                textDecorationStyle: 'dashed',
                textDecorationColor: theme_1.theme.pageTextSubdued,
                textUnderlineOffset: '4px',
            }}>
              {lastSyncString}
            </table_1.Cell>
          </tooltip_1.Tooltip>) : ('')}

        {account.account_sync_source ? (<table_1.Cell name="edit" plain style={{ paddingRight: '10px' }}>
            <button_1.Button onPress={function () { return onAction(account, 'edit'); }}>
              <react_i18next_1.Trans>Edit</react_i18next_1.Trans>
            </button_1.Button>
          </table_1.Cell>) : (<table_1.Cell name="link" plain style={{ paddingRight: '10px' }}>
            <button_1.Button onPress={function () { return onAction(account, 'link'); }}>
              <react_i18next_1.Trans>Link account</react_i18next_1.Trans>
            </button_1.Button>
          </table_1.Cell>)}
      </table_1.Row>);
});
exports.AccountRow.displayName = 'AccountRow';
