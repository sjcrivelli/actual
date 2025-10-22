"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayeesListItem = void 0;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var space_between_1 = require("@actual-app/components/space-between");
var theme_1 = require("@actual-app/components/theme");
var ActionableGridListItem_1 = require("@desktop-client/components/mobile/ActionableGridListItem");
var PayeeRuleCountLabel_1 = require("@desktop-client/components/payees/PayeeRuleCountLabel");
exports.PayeesListItem = (0, react_1.memo)(function PayeeListItem(_a) {
    var payee = _a.value, ruleCount = _a.ruleCount, isRuleCountLoading = _a.isRuleCountLoading, onDelete = _a.onDelete, props = __rest(_a, ["value", "ruleCount", "isRuleCountLoading", "onDelete"]);
    var t = (0, react_i18next_1.useTranslation)().t;
    var label = payee.transfer_acct
        ? t('Transfer: {{name}}', { name: payee.name })
        : payee.name;
    return (<ActionableGridListItem_1.ActionableGridListItem id={payee.id} value={payee} textValue={label} actions={!payee.transfer_acct && (<button_1.Button variant="bare" onPress={onDelete} style={{
                color: theme_1.theme.errorText,
                width: '100%',
            }}>
            <react_i18next_1.Trans>Delete</react_i18next_1.Trans>
          </button_1.Button>)} {...props}>
      <space_between_1.SpaceBetween gap={5} style={{ flex: 1 }}>
        {payee.favorite && (<v1_1.SvgBookmark aria-hidden focusable={false} width={15} height={15} style={{
                color: theme_1.theme.pageText,
                flexShrink: 0,
            }}/>)}
        <space_between_1.SpaceBetween style={{
            justifyContent: 'space-between',
            flex: 1,
            alignItems: 'flex-start',
        }}>
          <span style={{
            fontSize: 15,
            fontWeight: 500,
            color: payee.transfer_acct
                ? theme_1.theme.pageTextSubdued
                : theme_1.theme.pageText,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            textAlign: 'left',
        }} title={label}>
            {label}
          </span>

          <span style={{
            borderRadius: 4,
            padding: '3px 6px',
            backgroundColor: theme_1.theme.noticeBackground,
            border: '1px solid ' + theme_1.theme.noticeBackground,
            color: theme_1.theme.noticeTextDark,
            fontSize: 12,
            flexShrink: 0,
        }}>
            <PayeeRuleCountLabel_1.PayeeRuleCountLabel count={ruleCount} isLoading={isRuleCountLoading} style={{ fontSize: 12 }}/>
          </span>
        </space_between_1.SpaceBetween>
      </space_between_1.SpaceBetween>
    </ActionableGridListItem_1.ActionableGridListItem>);
});
