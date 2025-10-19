import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgArrowThickRight } from '@actual-app/components/icons/v1';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { css, cx } from '@emotion/css';
import { AutoTextSize } from 'auto-text-size';
import { getColumnWidth, PILL_STYLE } from './BudgetTable';
import { BalanceWithCarryover } from '@desktop-client/components/budget/BalanceWithCarryover';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
import { envelopeBudget, trackingBudget, } from '@desktop-client/spreadsheet/bindings';
export function BalanceCell({ binding, category, show3Columns, onPress, 'aria-label': ariaLabel, }) {
    const { t } = useTranslation();
    const [budgetType = 'envelope'] = useSyncedPref('budgetType');
    const columnWidth = getColumnWidth({
        show3Columns,
    });
    const goal = budgetType === 'tracking'
        ? trackingBudget.catGoal(category.id)
        : envelopeBudget.catGoal(category.id);
    const longGoal = budgetType === 'tracking'
        ? trackingBudget.catLongGoal(category.id)
        : envelopeBudget.catLongGoal(category.id);
    const budgeted = budgetType === 'tracking'
        ? trackingBudget.catBudgeted(category.id)
        : envelopeBudget.catBudgeted(category.id);
    const carryover = budgetType === 'tracking'
        ? trackingBudget.catCarryover(category.id)
        : envelopeBudget.catCarryover(category.id);
    const format = useFormat();
    return (_jsx(BalanceWithCarryover, { "aria-label": t('Balance for {{categoryName}} category', {
            categoryName: category.name,
        }), type: "financial", carryover: carryover, balance: binding, goal: goal, budgeted: budgeted, longGoal: longGoal, CarryoverIndicator: MobileCarryoverIndicator, children: ({ type, value, className: defaultClassName }) => (_jsx(Button, { variant: "bare", style: {
                ...PILL_STYLE,
                maxWidth: columnWidth,
            }, onPress: onPress, "aria-label": ariaLabel, children: _jsx(PrivacyFilter, { children: _jsx(AutoTextSize, { as: Text, minFontSizePx: 6, maxFontSizePx: 12, mode: "oneline", className: cx(defaultClassName, css({
                        maxWidth: columnWidth,
                        textAlign: 'right',
                        fontSize: 12,
                    })), children: format(value, type) }, value) }) })) }));
}
function MobileCarryoverIndicator({ style }) {
    return (_jsx(View, { style: {
            position: 'absolute',
            right: '-3px',
            top: '-5px',
            borderRadius: '50%',
            backgroundColor: style?.color ?? theme.pillText,
        }, children: _jsx(SvgArrowThickRight, { width: 11, height: 11, style: { color: theme.pillBackgroundLight } }) }));
}
