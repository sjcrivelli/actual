import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
import { AlignedText } from '@actual-app/components/aligned-text';
import { Block } from '@actual-app/components/block';
import { styles } from '@actual-app/components/styles';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';
import { EnvelopeCellValue } from '@desktop-client/components/budget/envelope/EnvelopeBudgetComponents';
import { CellValueText } from '@desktop-client/components/spreadsheet/CellValue';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { envelopeBudget } from '@desktop-client/spreadsheet/bindings';
export function TotalsList({ prevMonthName, style }) {
    const format = useFormat();
    return (_jsxs(View, { style: {
            flexDirection: 'row',
            lineHeight: 1.5,
            justifyContent: 'center',
            ...styles.smallText,
            ...style,
        }, children: [_jsxs(View, { style: {
                    textAlign: 'right',
                    marginRight: 10,
                    minWidth: 50,
                }, children: [_jsx(Tooltip, { style: { ...styles.tooltip, lineHeight: 1.5, padding: '6px 10px' }, content: _jsxs(_Fragment, { children: [_jsx(AlignedText, { left: "Income:", right: _jsx(EnvelopeCellValue, { binding: envelopeBudget.totalIncome, type: "financial" }) }), _jsx(AlignedText, { left: "From Last Month:", right: _jsx(EnvelopeCellValue, { binding: envelopeBudget.fromLastMonth, type: "financial" }) })] }), placement: "bottom end", children: _jsx(EnvelopeCellValue, { binding: envelopeBudget.incomeAvailable, type: "financial", children: props => _jsx(CellValueText, { ...props, style: { fontWeight: 600 } }) }) }), _jsx(EnvelopeCellValue, { binding: envelopeBudget.lastMonthOverspent, type: "financial", children: props => (_jsx(CellValueText, { ...props, style: { fontWeight: 600 }, formatter: (value, type) => {
                                const v = format(value, type);
                                return value > 0 ? '+' + v : value === 0 ? '-' + v : v;
                            } })) }), _jsx(EnvelopeCellValue, { binding: envelopeBudget.totalBudgeted, type: "financial", children: props => (_jsx(CellValueText, { ...props, style: { fontWeight: 600 }, formatter: (value, type) => {
                                const v = format(value, type);
                                return value > 0 ? '+' + v : value === 0 ? '-' + v : v;
                            } })) }), _jsx(EnvelopeCellValue, { binding: envelopeBudget.forNextMonth, type: "financial", children: props => (_jsx(CellValueText, { ...props, style: { fontWeight: 600 }, formatter: (value, type) => {
                                const v = format(Math.abs(value), type);
                                return value >= 0 ? '-' + v : '+' + v;
                            } })) })] }), _jsxs(View, { children: [_jsx(Block, { children: _jsx(Trans, { children: "Available funds" }) }), _jsx(Block, { children: _jsxs(Trans, { children: ["Overspent in ", { prevMonthName }] }) }), _jsx(Block, { children: _jsx(Trans, { children: "Budgeted" }) }), _jsx(Block, { children: _jsx(Trans, { children: "For next month" }) })] })] }));
}
