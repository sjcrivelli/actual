import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgBookmark } from '@actual-app/components/icons/v1';
import { SpaceBetween } from '@actual-app/components/space-between';
import { theme } from '@actual-app/components/theme';
import { ActionableGridListItem } from '@desktop-client/components/mobile/ActionableGridListItem';
import { PayeeRuleCountLabel } from '@desktop-client/components/payees/PayeeRuleCountLabel';
export const PayeesListItem = memo(function PayeeListItem({ value: payee, ruleCount, isRuleCountLoading, onDelete, ...props }) {
    const { t } = useTranslation();
    const label = payee.transfer_acct
        ? t('Transfer: {{name}}', { name: payee.name })
        : payee.name;
    return (_jsx(ActionableGridListItem, { id: payee.id, value: payee, textValue: label, actions: !payee.transfer_acct && (_jsx(Button, { variant: "bare", onPress: onDelete, style: {
                color: theme.errorText,
                width: '100%',
            }, children: _jsx(Trans, { children: "Delete" }) })), ...props, children: _jsxs(SpaceBetween, { gap: 5, style: { flex: 1 }, children: [payee.favorite && (_jsx(SvgBookmark, { "aria-hidden": true, focusable: false, width: 15, height: 15, style: {
                        color: theme.pageText,
                        flexShrink: 0,
                    } })), _jsxs(SpaceBetween, { style: {
                        justifyContent: 'space-between',
                        flex: 1,
                        alignItems: 'flex-start',
                    }, children: [_jsx("span", { style: {
                                fontSize: 15,
                                fontWeight: 500,
                                color: payee.transfer_acct
                                    ? theme.pageTextSubdued
                                    : theme.pageText,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                                textAlign: 'left',
                            }, title: label, children: label }), _jsx("span", { style: {
                                borderRadius: 4,
                                padding: '3px 6px',
                                backgroundColor: theme.noticeBackground,
                                border: '1px solid ' + theme.noticeBackground,
                                color: theme.noticeTextDark,
                                fontSize: 12,
                                flexShrink: 0,
                            }, children: _jsx(PayeeRuleCountLabel, { count: ruleCount, isLoading: isRuleCountLoading, style: { fontSize: 12 } }) })] })] }) }));
});
