import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Block } from '@actual-app/components/block';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { TotalsList } from './TotalsList';
import { useEnvelopeSheetName, useEnvelopeSheetValue, } from '@desktop-client/components/budget/envelope/EnvelopeBudgetComponents';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { envelopeBudget } from '@desktop-client/spreadsheet/bindings';
export function ToBudgetAmount({ prevMonthName, style, amountStyle, onClick, isTotalsListTooltipDisabled = false, onContextMenu, }) {
    const { t } = useTranslation();
    const sheetName = useEnvelopeSheetName(envelopeBudget.toBudget);
    const sheetValue = useEnvelopeSheetValue({
        name: envelopeBudget.toBudget,
        value: 0,
    });
    const format = useFormat();
    const availableValue = sheetValue;
    if (typeof availableValue !== 'number' && availableValue !== null) {
        throw new Error('Expected availableValue to be a number but got ' + availableValue);
    }
    const num = availableValue ?? 0;
    const isNegative = num < 0;
    return (_jsxs(View, { style: { alignItems: 'center', ...style }, children: [_jsx(Block, { children: isNegative ? t('Overbudgeted:') : t('To Budget:') }), _jsx(View, { children: _jsx(Tooltip, { content: _jsx(TotalsList, { prevMonthName: prevMonthName, style: {
                            padding: 7,
                        } }), placement: "bottom", offset: 3, triggerProps: { isDisabled: isTotalsListTooltipDisabled }, children: _jsx(PrivacyFilter, { style: {
                            textAlign: 'center',
                        }, children: _jsx(Block, { onClick: onClick, onContextMenu: onContextMenu, "data-cellname": sheetName, className: css([
                                styles.veryLargeText,
                                {
                                    fontWeight: 400,
                                    userSelect: 'none',
                                    cursor: 'pointer',
                                    color: isNegative ? theme.errorText : theme.pageTextPositive,
                                    marginBottom: -1,
                                    borderBottom: '1px solid transparent',
                                    ':hover': {
                                        borderColor: isNegative
                                            ? theme.errorBorder
                                            : theme.pageTextPositive,
                                    },
                                },
                                amountStyle,
                            ]), children: format(num, 'financial') }) }) }) })] }));
}
