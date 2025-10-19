import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useCallback, } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { SvgArrowThinRight } from '@actual-app/components/icons/v1';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { makeBalanceAmountStyle } from './util';
import { CellValue, CellValueText, } from '@desktop-client/components/spreadsheet/CellValue';
import { useFeatureFlag } from '@desktop-client/hooks/useFeatureFlag';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useSheetValue } from '@desktop-client/hooks/useSheetValue';
export function CarryoverIndicator({ style }) {
    return (_jsx(View, { style: {
            marginLeft: 2,
            position: 'absolute',
            right: '-4px',
            alignSelf: 'center',
            justifyContent: 'center',
            top: 0,
            bottom: 0,
            ...style,
        }, children: _jsx(SvgArrowThinRight, { width: style?.width || 7, height: style?.height || 7, style: style }) }));
}
function GoalTooltipRow({ children }) {
    return (_jsx("div", { style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
        }, children: children }));
}
export function BalanceWithCarryover({ carryover, balance, goal, budgeted, longGoal, isDisabled, shouldInlineGoalStatus, CarryoverIndicator: CarryoverIndicatorComponent = CarryoverIndicator, tooltipDisabled, children, ...props }) {
    const { t } = useTranslation();
    const { isNarrowWidth } = useResponsive();
    const carryoverValue = useSheetValue(carryover);
    const goalValue = useSheetValue(goal);
    const budgetedValue = useSheetValue(budgeted);
    const longGoalValue = useSheetValue(longGoal);
    const isGoalTemplatesEnabled = useFeatureFlag('goalTemplatesEnabled');
    const getBalanceAmountStyle = useCallback((balanceValue) => makeBalanceAmountStyle(balanceValue, isGoalTemplatesEnabled ? goalValue : null, longGoalValue === 1 ? balanceValue : budgetedValue), [budgetedValue, goalValue, isGoalTemplatesEnabled, longGoalValue]);
    const format = useFormat();
    const getDifferenceToGoal = useCallback((balanceValue) => longGoalValue === 1
        ? balanceValue - goalValue
        : budgetedValue - goalValue, [budgetedValue, goalValue, longGoalValue]);
    const getDefaultClassName = useCallback((balanceValue) => css({
        ...getBalanceAmountStyle(balanceValue),
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'right',
        ...(!isDisabled && {
            cursor: 'pointer',
        }),
        ':hover': { textDecoration: 'underline' },
    }), [getBalanceAmountStyle, isDisabled]);
    const GoalStatusDisplay = useCallback((balanceValue, type) => {
        return (_jsxs(_Fragment, { children: [_jsx("span", { style: { fontWeight: 'bold' }, children: getDifferenceToGoal(balanceValue) === 0 ? (_jsx("span", { style: { color: theme.noticeText }, children: _jsx(Trans, { children: "Fully funded" }) })) : getDifferenceToGoal(balanceValue) > 0 ? (_jsx("span", { style: { color: theme.noticeText }, children: _jsxs(Trans, { children: ["Overfunded (", {
                                    amount: format(getDifferenceToGoal(balanceValue), 'financial'),
                                }, ")"] }) })) : (_jsx("span", { style: { color: theme.errorText }, children: _jsxs(Trans, { children: ["Underfunded (", {
                                    amount: format(getDifferenceToGoal(balanceValue), 'financial'),
                                }, ")"] }) })) }), _jsx(GoalTooltipRow, { children: _jsxs(Trans, { children: [_jsx("div", { children: "Goal Type:" }), _jsx("div", { children: {
                                    type: longGoalValue === 1 ? t('Long') : t('Template'),
                                } })] }) }), _jsx(GoalTooltipRow, { children: _jsxs(Trans, { children: [_jsx("div", { children: "Goal:" }), _jsx("div", { children: {
                                    amount: format(goalValue, 'financial'),
                                } })] }) }), _jsx(GoalTooltipRow, { children: longGoalValue !== 1 ? (_jsxs(Trans, { children: [_jsx("div", { children: "Budgeted:" }), _jsx("div", { children: {
                                    amount: format(budgetedValue, 'financial'),
                                } })] })) : (_jsxs(Trans, { children: [_jsx("div", { children: "Balance:" }), _jsx("div", { children: {
                                    amount: format(balanceValue, type),
                                } })] })) })] }));
    }, [budgetedValue, format, getDifferenceToGoal, goalValue, longGoalValue, t]);
    return (_jsx(CellValue, { binding: balance, type: "financial", ...props, children: ({ type, name, value: balanceValue }) => (_jsxs(_Fragment, { children: [_jsx(Tooltip, { content: _jsx(View, { style: { padding: 10 }, children: GoalStatusDisplay(balanceValue, type) }), style: { ...styles.tooltip, borderRadius: '0px 5px 5px 0px' }, placement: "bottom", triggerProps: {
                        delay: 750,
                        isDisabled: !isGoalTemplatesEnabled ||
                            goalValue == null ||
                            isNarrowWidth ||
                            tooltipDisabled,
                    }, children: children ? (children({
                        type,
                        name,
                        value: balanceValue,
                        className: getDefaultClassName(balanceValue),
                    })) : (_jsx(CellValueText, { type: type, name: name, value: balanceValue, className: getDefaultClassName(balanceValue) })) }), carryoverValue && (_jsx(CarryoverIndicatorComponent, { style: getBalanceAmountStyle(balanceValue) })), shouldInlineGoalStatus &&
                    isGoalTemplatesEnabled &&
                    goalValue !== null && (_jsxs(_Fragment, { children: [_jsx(View, { style: {
                                borderTop: '1px solid ' + theme.tableBorderSeparator,
                                width: '160px',
                                margin: '3px 0px',
                            } }), _jsx(View, { children: GoalStatusDisplay(balanceValue, type) })] }))] })) }));
}
