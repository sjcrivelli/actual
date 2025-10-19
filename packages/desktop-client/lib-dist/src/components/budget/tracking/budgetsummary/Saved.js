import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { AlignedText } from '@actual-app/components/aligned-text';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { useTrackingSheetValue } from '@desktop-client/components/budget/tracking/TrackingBudgetComponents';
import { makeAmountFullStyle } from '@desktop-client/components/budget/util';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { trackingBudget } from '@desktop-client/spreadsheet/bindings';
export function Saved({ projected, style }) {
    const { t } = useTranslation();
    const budgetedSaved = useTrackingSheetValue(trackingBudget.totalBudgetedSaved) || 0;
    const totalSaved = useTrackingSheetValue(trackingBudget.totalSaved) || 0;
    const format = useFormat();
    const saved = projected ? budgetedSaved : totalSaved;
    const isNegative = saved < 0;
    const diff = totalSaved - budgetedSaved;
    return (_jsxs(View, { style: { alignItems: 'center', fontSize: 14, ...style }, children: [projected ? (_jsx(Text, { style: { color: theme.pageTextLight }, children: _jsx(Trans, { children: "Projected savings:" }) })) : (_jsx(View, { style: { color: theme.pageTextLight }, children: isNegative ? t('Overspent:') : t('Saved:') })), _jsx(Tooltip, { style: { ...styles.tooltip, fontSize: 14, padding: 10 }, content: _jsxs(_Fragment, { children: [_jsx(AlignedText, { left: t('Projected savings:'), right: _jsx(Text, { style: {
                                    ...makeAmountFullStyle(budgetedSaved),
                                    ...styles.tnum,
                                }, children: format(budgetedSaved, 'financial-with-sign') }) }), _jsx(AlignedText, { left: t('Difference:'), right: _jsx(Text, { style: { ...makeAmountFullStyle(diff), ...styles.tnum }, children: format(diff, 'financial-with-sign') }) })] }), placement: "bottom", triggerProps: {
                    isDisabled: Boolean(projected),
                }, children: _jsx(View, { className: css({
                        fontSize: 25,
                        color: projected
                            ? theme.warningText
                            : isNegative
                                ? theme.errorTextDark
                                : theme.upcomingText,
                    }), children: _jsx(PrivacyFilter, { children: format(saved, 'financial') }) }) })] }));
}
