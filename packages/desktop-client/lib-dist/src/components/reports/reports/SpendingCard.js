import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Block } from '@actual-app/components/block';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from 'loot-core/shared/months';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { DateRange } from '@desktop-client/components/reports/DateRange';
import { SpendingGraph } from '@desktop-client/components/reports/graphs/SpendingGraph';
import { LoadingIndicator } from '@desktop-client/components/reports/LoadingIndicator';
import { ReportCard } from '@desktop-client/components/reports/ReportCard';
import { ReportCardName } from '@desktop-client/components/reports/ReportCardName';
import { calculateSpendingReportTimeRange } from '@desktop-client/components/reports/reportRanges';
import { createSpendingSpreadsheet } from '@desktop-client/components/reports/spreadsheets/spending-spreadsheet';
import { useReport } from '@desktop-client/components/reports/useReport';
import { useFormat } from '@desktop-client/hooks/useFormat';
export function SpendingCard({ widgetId, isEditing, meta = {}, onMetaChange, onRemove, }) {
    const { t } = useTranslation();
    const format = useFormat();
    const [isCardHovered, setIsCardHovered] = useState(false);
    const [nameMenuOpen, setNameMenuOpen] = useState(false);
    const spendingReportMode = meta?.mode ?? 'single-month';
    const [compare, compareTo] = calculateSpendingReportTimeRange(meta ?? {});
    const selection = spendingReportMode === 'single-month' ? 'compareTo' : spendingReportMode;
    const getGraphData = useMemo(() => {
        return createSpendingSpreadsheet({
            conditions: meta?.conditions,
            conditionsOp: meta?.conditionsOp,
            compare,
            compareTo,
        });
    }, [meta?.conditions, meta?.conditionsOp, compare, compareTo]);
    const data = useReport('default', getGraphData);
    const todayDay = compare !== monthUtils.currentMonth()
        ? 27
        : monthUtils.getDay(monthUtils.currentDay()) - 1 >= 28
            ? 27
            : monthUtils.getDay(monthUtils.currentDay()) - 1;
    const difference = data &&
        Math.round(data.intervalData[todayDay][selection] -
            data.intervalData[todayDay].compare);
    return (_jsx(ReportCard, { isEditing: isEditing, disableClick: nameMenuOpen, to: `/reports/spending/${widgetId}`, menuItems: [
            {
                name: 'rename',
                text: t('Rename'),
            },
            {
                name: 'remove',
                text: t('Remove'),
            },
        ], onMenuSelect: item => {
            switch (item) {
                case 'rename':
                    setNameMenuOpen(true);
                    break;
                case 'remove':
                    onRemove();
                    break;
                default:
                    throw new Error(`Unrecognized selection: ${item}`);
            }
        }, children: _jsxs(View, { style: { flex: 1 }, onPointerEnter: () => setIsCardHovered(true), onPointerLeave: () => setIsCardHovered(false), children: [_jsxs(View, { style: { flexDirection: 'row', padding: 20 }, children: [_jsxs(View, { style: { flex: 1 }, children: [_jsx(ReportCardName, { name: meta?.name || t('Monthly Spending'), isEditing: nameMenuOpen, onChange: newName => {
                                        onMetaChange({
                                            ...meta,
                                            name: newName,
                                        });
                                        setNameMenuOpen(false);
                                    }, onClose: () => setNameMenuOpen(false) }), _jsx(DateRange, { start: compare, end: compareTo, type: spendingReportMode })] }), data && (_jsx(View, { style: { textAlign: 'right' }, children: _jsx(Block, { style: {
                                    ...styles.mediumText,
                                    fontWeight: 500,
                                    marginBottom: 5,
                                    color: !difference
                                        ? 'inherit'
                                        : difference <= 0
                                            ? theme.noticeTextLight
                                            : theme.errorText,
                                }, children: _jsx(PrivacyFilter, { activationFilters: [!isCardHovered], children: data &&
                                        (difference && difference > 0 ? '+' : '') +
                                            format(difference || 0, 'financial') }) }) }))] }), data ? (_jsx(SpendingGraph, { style: { flex: 1 }, compact: true, data: data, mode: spendingReportMode, compare: compare, compareTo: compareTo })) : (_jsx(LoadingIndicator, {}))] }) }));
}
