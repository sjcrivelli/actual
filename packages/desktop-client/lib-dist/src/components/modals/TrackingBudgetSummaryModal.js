import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Stack } from '@actual-app/components/stack';
import { styles } from '@actual-app/components/styles';
import { sheetForMonth } from 'loot-core/shared/months';
import * as monthUtils from 'loot-core/shared/months';
import { ExpenseTotal } from '@desktop-client/components/budget/tracking/budgetsummary/ExpenseTotal';
import { IncomeTotal } from '@desktop-client/components/budget/tracking/budgetsummary/IncomeTotal';
import { Saved } from '@desktop-client/components/budget/tracking/budgetsummary/Saved';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { SheetNameProvider } from '@desktop-client/hooks/useSheetName';
export function TrackingBudgetSummaryModal({ month, }) {
    const { t } = useTranslation();
    const currentMonth = monthUtils.currentMonth();
    return (_jsx(Modal, { name: "tracking-budget-summary", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Budget Summary'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(SheetNameProvider, { name: sheetForMonth(month), children: [_jsxs(Stack, { spacing: 2, style: {
                                alignSelf: 'center',
                                backgroundColor: 'transparent',
                                borderRadius: 4,
                            }, children: [_jsx(IncomeTotal, { style: { ...styles.mediumText } }), _jsx(ExpenseTotal, { style: { ...styles.mediumText } })] }), _jsx(Saved, { projected: month >= currentMonth, style: { ...styles.mediumText, marginTop: 20 } })] })] })) }));
}
