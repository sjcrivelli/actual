import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SpaceBetween } from '@actual-app/components/space-between';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { ActionableGridListItem } from '@desktop-client/components/mobile/ActionableGridListItem';
import { ActionExpression } from '@desktop-client/components/rules/ActionExpression';
import { ConditionExpression } from '@desktop-client/components/rules/ConditionExpression';
import { groupActionsBySplitIndex } from '@desktop-client/util/ruleUtils';
export function RulesListItem({ value: rule, onDelete, style, ...props }) {
    const { t } = useTranslation();
    // Group actions by splitIndex to handle split transactions
    const actionSplits = groupActionsBySplitIndex(rule.actions);
    const hasSplits = actionSplits.length > 1;
    return (_jsx(ActionableGridListItem, { id: rule.id, value: rule, textValue: t('Rule {{id}}', { id: rule.id }), style: { ...styles.mobileListItem, padding: '8px 16px', ...style }, actions: _jsx(Button, { variant: "bare", onPress: onDelete, style: {
                color: theme.errorText,
                width: '100%',
            }, children: _jsx(Trans, { children: "Delete" }) }), ...props, children: _jsxs(SpaceBetween, { gap: 12, style: { alignItems: 'flex-start' }, children: [_jsx(View, { style: {
                        flexShrink: 0,
                        paddingTop: 2, // Slight top padding to align with text baseline
                    }, children: _jsx(View, { style: {
                            backgroundColor: rule.stage === 'pre'
                                ? theme.noticeBackgroundLight
                                : rule.stage === 'post'
                                    ? theme.warningBackground
                                    : theme.pillBackgroundSelected,
                            paddingLeft: 6,
                            paddingRight: 6,
                            paddingTop: 2,
                            paddingBottom: 2,
                            borderRadius: 3,
                        }, children: _jsx("span", { style: {
                                fontSize: 11,
                                fontWeight: 500,
                                color: rule.stage === 'pre'
                                    ? theme.noticeTextLight
                                    : rule.stage === 'post'
                                        ? theme.warningText
                                        : theme.pillTextSelected,
                            }, "data-testid": "rule-stage-badge", children: rule.stage === 'pre'
                                ? t('PRE')
                                : rule.stage === 'post'
                                    ? t('POST')
                                    : t('DEFAULT') }) }) }), _jsxs(View, { style: {
                        flex: 1,
                        flexDirection: 'column',
                        gap: 4,
                    }, children: [_jsxs(SpaceBetween, { gap: 6, children: [_jsx("span", { style: {
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: theme.pageTextLight,
                                        marginRight: 4,
                                    }, children: t('IF') }), rule.conditions.map((condition, index) => (_jsx(View, { style: { marginRight: 4, marginBottom: 2 }, children: _jsx(ConditionExpression, { field: condition.field, op: condition.op, value: condition.value, options: condition.options, inline: true }) }, index)))] }), _jsxs(View, { style: {
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: 4,
                            }, children: [_jsx("span", { style: {
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: theme.pageTextLight,
                                        marginBottom: 2,
                                    }, children: t('THEN') }), hasSplits
                                    ? actionSplits.map((split, i) => (_jsxs(View, { style: {
                                            width: '100%',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            marginTop: i > 0 ? 4 : 0,
                                            padding: '6px',
                                            borderColor: theme.tableBorder,
                                            borderWidth: '1px',
                                            borderRadius: '5px',
                                        }, children: [_jsx("span", { style: {
                                                    fontSize: 11,
                                                    fontWeight: 500,
                                                    color: theme.pageTextLight,
                                                    marginBottom: 4,
                                                }, children: i ? t('Split {{num}}', { num: i }) : t('Apply to all') }), split.actions.map((action, j) => (_jsx(View, { style: {
                                                    marginBottom: j !== split.actions.length - 1 ? 2 : 0,
                                                    maxWidth: '100%',
                                                }, children: _jsx(ActionExpression, { ...action }) }, j)))] }, i)))
                                    : rule.actions.map((action, index) => (_jsx(View, { style: { marginBottom: 2, maxWidth: '100%' }, children: _jsx(ActionExpression, { ...action }) }, index)))] })] })] }) }));
}
