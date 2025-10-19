import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from 'loot-core/shared/months';
import { ReportOptions } from './ReportOptions';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useLocale } from '@desktop-client/hooks/useLocale';
export function ReportSummary({ startDate, endDate, data, balanceTypeOp, interval, intervalsCount, }) {
    const locale = useLocale();
    const { t } = useTranslation();
    const format = useFormat();
    const net = balanceTypeOp === 'netAssets'
        ? t('DEPOSIT')
        : balanceTypeOp === 'netDebts'
            ? t('PAYMENT')
            : Math.abs(data.totalDebts) > Math.abs(data.totalAssets)
                ? t('PAYMENT')
                : t('DEPOSIT');
    const average = Math.round(data[balanceTypeOp] / intervalsCount);
    return (_jsxs(View, { style: {
            flexDirection: 'column',
            marginBottom: 10,
        }, children: [_jsx(View, { style: {
                    backgroundColor: theme.pageBackground,
                    padding: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                }, children: _jsxs(Text, { style: {
                        ...styles.largeText,
                        alignItems: 'center',
                        marginBottom: 2,
                        fontWeight: 600,
                    }, children: [monthUtils.format(startDate, ReportOptions.intervalFormat.get(interval) || '', locale), monthUtils.format(startDate, ReportOptions.intervalFormat.get(interval) || '', locale) !==
                            monthUtils.format(endDate, ReportOptions.intervalFormat.get(interval) || '', locale) &&
                            ` ${t('to')} ` +
                                monthUtils.format(endDate, ReportOptions.intervalFormat.get(interval) || '', locale)] }) }), _jsxs(View, { style: {
                    backgroundColor: theme.pageBackground,
                    padding: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                }, children: [_jsx(Text, { style: {
                            ...styles.mediumText,
                            alignItems: 'center',
                            marginBottom: 2,
                            fontWeight: 400,
                        }, children: balanceTypeOp === 'totalDebts'
                            ? t('TOTAL SPENDING')
                            : balanceTypeOp === 'totalAssets'
                                ? t('TOTAL DEPOSITS')
                                : t('NET {{net}}', { net }) }), _jsx(Text, { style: {
                            ...styles.veryLargeText,
                            alignItems: 'center',
                            marginBottom: 2,
                            fontWeight: 800,
                        }, children: _jsx(PrivacyFilter, { children: format(data[balanceTypeOp], 'financial') }) }), _jsx(Text, { style: { fontWeight: 600 }, children: _jsx(Trans, { children: "For this time period" }) })] }), _jsxs(View, { style: {
                    backgroundColor: theme.pageBackground,
                    padding: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                }, children: [_jsx(Text, { style: {
                            ...styles.mediumText,
                            alignItems: 'center',
                            marginBottom: 2,
                            fontWeight: 400,
                        }, children: balanceTypeOp === 'totalDebts'
                            ? t('AVERAGE SPENDING')
                            : balanceTypeOp === 'totalAssets'
                                ? t('AVERAGE DEPOSIT')
                                : t('AVERAGE NET') }), _jsx(Text, { style: {
                            ...styles.veryLargeText,
                            alignItems: 'center',
                            marginBottom: 2,
                            fontWeight: 800,
                        }, children: _jsx(PrivacyFilter, { children: !isNaN(average) && format(average, 'financial') }) }), _jsx(Text, { style: { fontWeight: 600 }, children: _jsxs(Trans, { children: ["Per", ' ', {
                                    interval: (ReportOptions.intervalMap.get(interval) || '').toLowerCase(),
                                }] }) })] })] }));
}
