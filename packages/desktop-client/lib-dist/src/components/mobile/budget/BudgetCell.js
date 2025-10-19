import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Text } from '@actual-app/components/text';
import { AutoTextSize } from 'auto-text-size';
import { integerToCurrency } from 'loot-core/shared/util';
import { getColumnWidth, PILL_STYLE } from './BudgetTable';
import { makeAmountGrey } from '@desktop-client/components/budget/util';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { CellValue } from '@desktop-client/components/spreadsheet/CellValue';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useNotes } from '@desktop-client/hooks/useNotes';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
import { useUndo } from '@desktop-client/hooks/useUndo';
import { pushModal } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
export function BudgetCell({ binding, category, month, onBudgetAction, style, children, ...props }) {
    const { t } = useTranslation();
    const columnWidth = getColumnWidth();
    const dispatch = useDispatch();
    const format = useFormat();
    const { showUndoNotification } = useUndo();
    const [budgetType = 'envelope'] = useSyncedPref('budgetType');
    const categoryNotes = useNotes(category.id);
    const onOpenCategoryBudgetMenu = useCallback(() => {
        const modalBudgetType = budgetType === 'envelope' ? 'envelope' : 'tracking';
        const categoryBudgetMenuModal = `${modalBudgetType}-budget-menu`;
        dispatch(pushModal({
            modal: {
                name: categoryBudgetMenuModal,
                options: {
                    categoryId: category.id,
                    month,
                    onUpdateBudget: amount => {
                        onBudgetAction(month, 'budget-amount', {
                            category: category.id,
                            amount,
                        });
                        showUndoNotification({
                            message: `${category.name} budget has been updated to ${integerToCurrency(amount)}.`,
                        });
                    },
                    onCopyLastMonthAverage: () => {
                        onBudgetAction(month, 'copy-single-last', {
                            category: category.id,
                        });
                        showUndoNotification({
                            message: `${category.name} budget has been set last to month’s budgeted amount.`,
                        });
                    },
                    onSetMonthsAverage: numberOfMonths => {
                        if (numberOfMonths !== 3 &&
                            numberOfMonths !== 6 &&
                            numberOfMonths !== 12) {
                            return;
                        }
                        onBudgetAction(month, `set-single-${numberOfMonths}-avg`, {
                            category: category.id,
                        });
                        showUndoNotification({
                            message: `${category.name} budget has been set to ${numberOfMonths === 12 ? 'yearly' : `${numberOfMonths} month`} average.`,
                        });
                    },
                    onApplyBudgetTemplate: () => {
                        onBudgetAction(month, 'apply-single-category-template', {
                            category: category.id,
                        });
                        showUndoNotification({
                            message: `${category.name} budget templates have been applied.`,
                            pre: categoryNotes ?? undefined,
                        });
                    },
                },
            },
        }));
    }, [
        budgetType,
        category.id,
        category.name,
        categoryNotes,
        dispatch,
        month,
        onBudgetAction,
        showUndoNotification,
    ]);
    return (_jsx(CellValue, { binding: binding, type: "financial", "aria-label": t('Budgeted amount for {{categoryName}} category', {
            categoryName: category.name,
        }), ...props, children: ({ type, name, value }) => children?.({
            type,
            name,
            value,
        }) || (_jsx(Button, { variant: "bare", style: {
                ...PILL_STYLE,
                maxWidth: columnWidth,
                ...makeAmountGrey(value),
            }, onPress: onOpenCategoryBudgetMenu, "aria-label": t('Open budget menu for {{categoryName}} category', {
                categoryName: category.name,
            }), children: _jsx(PrivacyFilter, { children: _jsx(AutoTextSize, { as: Text, minFontSizePx: 6, maxFontSizePx: 12, mode: "oneline", style: {
                        maxWidth: columnWidth,
                        textAlign: 'right',
                        fontSize: 12,
                    }, children: format(value, type) }, value) }) })) }));
}
