import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Block } from '@actual-app/components/block';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { styles } from '@actual-app/components/styles';
import { View } from '@actual-app/components/view';
import { send } from 'loot-core/platform/client/fetch';
import * as monthUtils from 'loot-core/shared/months';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { Change } from '@desktop-client/components/reports/Change';
import { DateRange } from '@desktop-client/components/reports/DateRange';
import { NetWorthGraph } from '@desktop-client/components/reports/graphs/NetWorthGraph';
import { LoadingIndicator } from '@desktop-client/components/reports/LoadingIndicator';
import { ReportCard } from '@desktop-client/components/reports/ReportCard';
import { ReportCardName } from '@desktop-client/components/reports/ReportCardName';
import { calculateTimeRange } from '@desktop-client/components/reports/reportRanges';
import { createSpreadsheet as netWorthSpreadsheet } from '@desktop-client/components/reports/spreadsheets/net-worth-spreadsheet';
import { useReport } from '@desktop-client/components/reports/useReport';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useLocale } from '@desktop-client/hooks/useLocale';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
export function NetWorthCard({ widgetId, isEditing, accounts, meta = {}, onMetaChange, onRemove, }) {
    const locale = useLocale();
    const { t } = useTranslation();
    const { isNarrowWidth } = useResponsive();
    const [_firstDayOfWeekIdx] = useSyncedPref('firstDayOfWeekIdx');
    const firstDayOfWeekIdx = _firstDayOfWeekIdx || '0';
    const format = useFormat();
    const [latestTransaction, setLatestTransaction] = useState('');
    const [nameMenuOpen, setNameMenuOpen] = useState(false);
    const [isCardHovered, setIsCardHovered] = useState(false);
    useEffect(() => {
        async function fetchLatestTransaction() {
            const latestTrans = await send('get-latest-transaction');
            setLatestTransaction(latestTrans ? latestTrans.date : monthUtils.currentDay());
        }
        fetchLatestTransaction();
    }, []);
    const [start, end] = calculateTimeRange(meta?.timeFrame, undefined, latestTransaction);
    const onCardHover = useCallback(() => setIsCardHovered(true), []);
    const onCardHoverEnd = useCallback(() => setIsCardHovered(false), []);
    const params = useMemo(() => netWorthSpreadsheet(start, end, accounts, meta?.conditions, meta?.conditionsOp, locale, meta?.interval || 'Monthly', firstDayOfWeekIdx, format), [
        start,
        end,
        accounts,
        meta?.conditions,
        meta?.conditionsOp,
        locale,
        meta?.interval,
        firstDayOfWeekIdx,
        format,
    ]);
    const data = useReport('net_worth', params);
    return (_jsx(ReportCard, { isEditing: isEditing, disableClick: nameMenuOpen, to: `/reports/net-worth/${widgetId}`, menuItems: [
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
        }, children: _jsxs(View, { style: { flex: 1 }, onPointerEnter: onCardHover, onPointerLeave: onCardHoverEnd, children: [_jsxs(View, { style: { flexDirection: 'row', padding: 20 }, children: [_jsxs(View, { style: { flex: 1 }, children: [_jsx(ReportCardName, { name: meta?.name || t('Net Worth'), isEditing: nameMenuOpen, onChange: newName => {
                                        onMetaChange({
                                            ...meta,
                                            name: newName,
                                        });
                                        setNameMenuOpen(false);
                                    }, onClose: () => setNameMenuOpen(false) }), _jsx(DateRange, { start: start, end: end })] }), data && (_jsxs(View, { style: { textAlign: 'right' }, children: [_jsx(Block, { style: {
                                        ...styles.mediumText,
                                        fontWeight: 500,
                                        marginBottom: 5,
                                    }, children: _jsx(PrivacyFilter, { activationFilters: [!isCardHovered], children: format(data.netWorth, 'financial') }) }), _jsx(PrivacyFilter, { activationFilters: [!isCardHovered], children: _jsx(Change, { amount: data.totalChange }) })] }))] }), data ? (_jsx(NetWorthGraph, { graphData: data.graphData, compact: true, showTooltip: !isEditing && !isNarrowWidth, interval: meta?.interval || 'Monthly', style: { height: 'auto', flex: 1 } })) : (_jsx(LoadingIndicator, {}))] }) }));
}
