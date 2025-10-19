import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgCheveronDown, SvgCheveronUp, } from '@actual-app/components/icons/v1';
import { SvgNotesPaper } from '@actual-app/components/icons/v2';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import * as monthUtils from 'loot-core/shared/months';
import { BudgetMonthMenu } from '@desktop-client/components/budget/envelope/budgetsummary/BudgetMonthMenu';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { Notes } from '@desktop-client/components/Notes';
import { useLocale } from '@desktop-client/hooks/useLocale';
import { useNotes } from '@desktop-client/hooks/useNotes';
import { useUndo } from '@desktop-client/hooks/useUndo';
export function EnvelopeBudgetMonthMenuModal({ month, onBudgetAction, onEditNotes, }) {
    const locale = useLocale();
    const originalNotes = useNotes(`budget-${month}`);
    const { showUndoNotification } = useUndo();
    const _onEditNotes = () => {
        onEditNotes?.(month);
    };
    const defaultMenuItemStyle = {
        ...styles.mobileMenuItem,
        color: theme.menuItemText,
        borderRadius: 0,
        borderTop: `1px solid ${theme.pillBorder}`,
    };
    const buttonStyle = {
        ...styles.mediumText,
        height: styles.mobileMinHeight,
        color: theme.formLabelText,
        // Adjust based on desired number of buttons per row.
        flexBasis: '100%',
    };
    const [showMore, setShowMore] = useState(false);
    const onShowMore = () => {
        setShowMore(!showMore);
    };
    const displayMonth = monthUtils.format(month, 'MMMM ‘yy', locale);
    const { t } = useTranslation();
    return (_jsx(Modal, { name: "envelope-budget-month-menu", containerProps: {
            style: { height: '50vh' },
        }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: displayMonth, rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: {
                        flex: 1,
                        flexDirection: 'column',
                    }, children: [_jsx(View, { style: {
                                display: showMore ? 'none' : undefined,
                                overflowY: 'auto',
                                flex: 1,
                            }, children: _jsx(Notes, { notes: originalNotes?.length > 0 ? originalNotes : t('No notes'), editable: false, focused: false, getStyle: () => ({
                                    borderRadius: 6,
                                    ...((!originalNotes || originalNotes.length === 0) && {
                                        justifySelf: 'center',
                                        alignSelf: 'center',
                                        color: theme.pageTextSubdued,
                                    }),
                                }) }) }), _jsxs(View, { style: { paddingTop: 10, gap: 5 }, children: [_jsx(View, { style: {
                                        display: showMore ? 'none' : undefined,
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-between',
                                        alignContent: 'space-between',
                                    }, children: _jsxs(Button, { style: buttonStyle, onPress: _onEditNotes, children: [_jsx(SvgNotesPaper, { width: 20, height: 20, style: { paddingRight: 5 } }), _jsx(Trans, { children: "Edit notes" })] }) }), _jsx(View, { children: _jsxs(Button, { variant: "bare", className: css([
                                            buttonStyle,
                                            {
                                                '&[data-pressed], &[data-hovered]': {
                                                    backgroundColor: 'transparent',
                                                    color: buttonStyle.color,
                                                },
                                            },
                                        ]), onPress: onShowMore, children: [!showMore ? (_jsx(SvgCheveronUp, { width: 30, height: 30, style: { paddingRight: 5 } })) : (_jsx(SvgCheveronDown, { width: 30, height: 30, style: { paddingRight: 5 } })), _jsx(Trans, { children: "Actions" })] }) })] }), showMore && (_jsx(BudgetMonthMenu, { style: { overflowY: 'auto', paddingTop: 10 }, getItemStyle: () => defaultMenuItemStyle, onCopyLastMonthBudget: () => {
                                onBudgetAction(month, 'copy-last');
                                close();
                                showUndoNotification({
                                    message: t('{{displayMonth}} budgets have all been set to last month’s budgeted amounts.', { displayMonth }),
                                });
                            }, onSetBudgetsToZero: () => {
                                onBudgetAction(month, 'set-zero');
                                close();
                                showUndoNotification({
                                    message: t('{{displayMonth}} budgets have all been set to zero.', { displayMonth }),
                                });
                            }, onSetMonthsAverage: numberOfMonths => {
                                onBudgetAction(month, `set-${numberOfMonths}-avg`);
                                close();
                                showUndoNotification({
                                    message: `${displayMonth} budgets have all been set to ${numberOfMonths === 12 ? 'yearly' : `${numberOfMonths} month`} average.`,
                                });
                            }, onCheckTemplates: () => {
                                onBudgetAction(month, 'check-templates');
                                close();
                            }, onApplyBudgetTemplates: () => {
                                onBudgetAction(month, 'apply-goal-template');
                                close();
                                showUndoNotification({
                                    message: t('{{displayMonth}} budget templates have been applied.', { displayMonth }),
                                });
                            }, onOverwriteWithBudgetTemplates: () => {
                                onBudgetAction(month, 'overwrite-goal-template');
                                close();
                                showUndoNotification({
                                    message: t('{{displayMonth}} budget templates have been overwritten.', { displayMonth }),
                                });
                            }, onEndOfMonthCleanup: () => {
                                onBudgetAction(month, 'cleanup-goal-template');
                                close();
                                showUndoNotification({
                                    message: t('{{displayMonth}} end-of-month cleanup templates have been applied.', { displayMonth }),
                                });
                            } }))] })] })) }));
}
