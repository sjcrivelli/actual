import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useRef, useEffect, useCallback, } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Block } from '@actual-app/components/block';
import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { SvgArrowThickDown, SvgArrowThickUp, } from '@actual-app/components/icons/v1';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';
import { format as formatDate } from 'date-fns';
import debounce from 'lodash/debounce';
import { send } from 'loot-core/platform/client/fetch';
import * as monthUtils from 'loot-core/shared/months';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { chartTheme } from '@desktop-client/components/reports/chart-theme';
import { DateRange } from '@desktop-client/components/reports/DateRange';
import { CalendarGraph } from '@desktop-client/components/reports/graphs/CalendarGraph';
import { LoadingIndicator } from '@desktop-client/components/reports/LoadingIndicator';
import { ReportCard } from '@desktop-client/components/reports/ReportCard';
import { ReportCardName } from '@desktop-client/components/reports/ReportCardName';
import { calculateTimeRange } from '@desktop-client/components/reports/reportRanges';
import { calendarSpreadsheet, } from '@desktop-client/components/reports/spreadsheets/calendar-spreadsheet';
import { useReport } from '@desktop-client/components/reports/useReport';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useMergedRefs } from '@desktop-client/hooks/useMergedRefs';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { useResizeObserver } from '@desktop-client/hooks/useResizeObserver';
export function CalendarCard({ widgetId, isEditing, meta = {}, onMetaChange, onRemove, firstDayOfWeekIdx, }) {
    const { t } = useTranslation();
    const format = useFormat();
    const [latestTransaction, setLatestTransaction] = useState('');
    useEffect(() => {
        async function fetchLatestTransaction() {
            const latestTrans = await send('get-latest-transaction');
            setLatestTransaction(latestTrans ? latestTrans.date : monthUtils.currentDay());
        }
        fetchLatestTransaction();
    }, []);
    const [start, end] = calculateTimeRange(meta?.timeFrame, {
        start: monthUtils.dayFromDate(monthUtils.currentMonth()),
        end: monthUtils.currentDay(),
        mode: 'full',
    }, latestTransaction);
    const params = useMemo(() => calendarSpreadsheet(start, end, meta?.conditions, meta?.conditionsOp, firstDayOfWeekIdx), [start, end, meta?.conditions, meta?.conditionsOp, firstDayOfWeekIdx]);
    const [cardOrientation, setCardOrientation] = useState('row');
    const { isNarrowWidth } = useResponsive();
    const cardRef = useResizeObserver(rect => {
        if (rect.height > rect.width) {
            setCardOrientation('column');
        }
        else {
            setCardOrientation('row');
        }
    });
    const data = useReport('calendar', params);
    const [nameMenuOpen, setNameMenuOpen] = useState(false);
    const { totalIncome, totalExpense } = useMemo(() => {
        if (!data) {
            return { totalIncome: 0, totalExpense: 0 };
        }
        return {
            totalIncome: data.calendarData.reduce((prev, cur) => prev + cur.totalIncome, 0),
            totalExpense: data.calendarData.reduce((prev, cur) => prev + cur.totalExpense, 0),
        };
    }, [data]);
    const [monthNameFormats, setMonthNameFormats] = useState([]);
    const [selectedMonthNameFormat, setSelectedMonthNameFormat] = useState('MMMM yyyy');
    useEffect(() => {
        if (data) {
            setMonthNameFormats(Array(data.calendarData.length).map(() => 'MMMM yyyy'));
        }
        else {
            setMonthNameFormats([]);
        }
    }, [data]);
    useEffect(() => {
        if (monthNameFormats.length) {
            setSelectedMonthNameFormat(monthNameFormats.reduce((a, b) => ((a?.length ?? 0) <= (b?.length ?? 0) ? a : b), 'MMMM yyyy'));
        }
        else {
            setSelectedMonthNameFormat('MMMM yyyy');
        }
    }, [monthNameFormats]);
    const calendarLenSize = useMemo(() => {
        if (!data) {
            return 0;
        }
        return data?.calendarData.length;
    }, [data]);
    return (_jsx(ReportCard, { isEditing: isEditing, to: `/reports/calendar/${widgetId}`, menuItems: [
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
        }, children: _jsxs(View, { ref: el => (el ? cardRef(el) : undefined), style: { flex: 1, margin: 2, overflow: 'hidden', width: '100%' }, children: [_jsxs(View, { style: { flexDirection: 'row', padding: 20, paddingBottom: 0 }, children: [_jsx(View, { style: { flex: 1, marginBottom: -5 }, children: _jsx(ReportCardName, { name: meta?.name || t('Calendar'), isEditing: nameMenuOpen, onChange: newName => {
                                    onMetaChange({
                                        ...meta,
                                        name: newName,
                                    });
                                    setNameMenuOpen(false);
                                }, onClose: () => setNameMenuOpen(false) }) }), _jsx(View, { style: { textAlign: 'right' }, children: _jsx(Block, { style: {
                                    ...styles.mediumText,
                                    fontWeight: 500,
                                }, children: _jsx(Tooltip, { content: _jsx(View, { style: { lineHeight: 1.5 }, children: _jsxs(View, { style: {
                                                display: 'grid',
                                                gridTemplateColumns: '70px 1fr',
                                                gridAutoRows: '1fr',
                                            }, children: [totalIncome !== 0 && (_jsxs(_Fragment, { children: [_jsx(View, { style: {
                                                                textAlign: 'right',
                                                                marginRight: 4,
                                                            }, children: _jsx(Trans, { children: "Income:" }) }), _jsx(View, { style: { color: chartTheme.colors.blue }, children: totalIncome !== 0 ? (_jsx(PrivacyFilter, { children: format(totalIncome, 'financial') })) : ('') })] })), totalExpense !== 0 && (_jsxs(_Fragment, { children: [_jsx(View, { style: {
                                                                textAlign: 'right',
                                                                marginRight: 4,
                                                            }, children: _jsx(Trans, { children: "Expenses:" }) }), _jsx(View, { style: { color: chartTheme.colors.red }, children: totalExpense !== 0 ? (_jsx(PrivacyFilter, { children: format(totalExpense, 'financial') })) : ('') })] }))] }) }), children: _jsx(DateRange, { start: start, end: end }) }) }) })] }), _jsx(View, { style: {
                        height: '100%',
                        margin: 6,
                        overflowX: cardOrientation === 'row'
                            ? isNarrowWidth
                                ? 'auto'
                                : calendarLenSize > 4
                                    ? 'auto'
                                    : 'hidden'
                            : 'hidden',
                        ...styles.horizontalScrollbar,
                    }, children: _jsx(View, { style: {
                            flex: 1,
                            flexDirection: cardOrientation,
                            gap: 16,
                            marginTop: 10,
                            textAlign: 'left',
                            marginBottom: isNarrowWidth ? 4 : 0,
                            width: cardOrientation === 'row'
                                ? isNarrowWidth
                                    ? `${calendarLenSize * 100}%`
                                    : calendarLenSize > 4
                                        ? `${100 + ((calendarLenSize - 4) % 4) * 25}%`
                                        : 'auto'
                                : 'auto',
                        }, children: data ? (data.calendarData.map((calendar, index) => (_jsx(CalendarCardInner, { calendar: calendar, firstDayOfWeekIdx: firstDayOfWeekIdx ?? '0', setMonthNameFormats: setMonthNameFormats, selectedMonthNameFormat: selectedMonthNameFormat, index: index, widgetId: widgetId, isEditing: isEditing, format: format }, index)))) : (_jsx(LoadingIndicator, {})) }) })] }) }));
}
function CalendarCardInner({ calendar, firstDayOfWeekIdx, setMonthNameFormats, selectedMonthNameFormat, index, widgetId, isEditing, format, }) {
    const { t } = useTranslation();
    const [monthNameVisible, setMonthNameVisible] = useState(true);
    const monthFormatSizeContainers = useRef(new Array(5));
    const monthNameContainerRef = useRef(null);
    const measureMonthFormats = useCallback(() => {
        const measurements = monthFormatSizeContainers.current.map(container => ({
            width: container?.clientWidth ?? 0,
            format: container?.getAttribute('data-format') ?? '',
        }));
        return measurements;
    }, []);
    const debouncedResizeCallback = useMemo(() => debounce(() => {
        const measurements = measureMonthFormats();
        const containerWidth = monthNameContainerRef.current?.clientWidth ?? 0;
        const suitableFormat = measurements.find(m => containerWidth > m.width);
        if (suitableFormat) {
            if (monthNameContainerRef.current &&
                containerWidth > suitableFormat.width) {
                setMonthNameFormats(prev => {
                    if (prev[index] === suitableFormat.format)
                        return prev;
                    const newArray = [...prev];
                    newArray[index] = suitableFormat.format;
                    return newArray;
                });
                setMonthNameVisible(true);
                return;
            }
        }
        if (monthNameContainerRef.current &&
            monthNameContainerRef.current.scrollWidth >
                monthNameContainerRef.current.clientWidth) {
            setMonthNameVisible(false);
        }
        else {
            setMonthNameVisible(true);
        }
    }, 20), [measureMonthFormats, monthNameContainerRef, index, setMonthNameFormats]);
    const monthNameResizeRef = useResizeObserver(debouncedResizeCallback);
    useEffect(() => {
        const toCancel = debouncedResizeCallback;
        return () => {
            toCancel.cancel();
        };
    }, [debouncedResizeCallback]);
    const mergedRef = useMergedRefs(monthNameContainerRef, monthNameResizeRef);
    const navigate = useNavigate();
    const monthFormats = [
        { format: 'MMMM yyyy', text: formatDate(calendar.start, 'MMMM yyyy') },
        { format: 'MMM yyyy', text: formatDate(calendar.start, 'MMM yyyy') },
        { format: 'MMM yy', text: formatDate(calendar.start, 'MMM yy') },
        { format: 'MMM', text: formatDate(calendar.start, 'MMM') },
        { format: '', text: '' },
    ];
    return (_jsxs(View, { style: { flex: 1, overflow: 'visible' }, children: [_jsxs(View, { style: {
                    flexDirection: 'row',
                    marginLeft: 5,
                    marginRight: 5,
                }, children: [_jsx(View, { ref: mergedRef, style: {
                            color: theme.pageTextSubdued,
                            fontWeight: 'bold',
                            flex: 1,
                            overflow: 'hidden',
                            display: 'block',
                            width: '100%',
                        }, children: _jsx(Button, { variant: "bare", style: {
                                visibility: monthNameVisible ? 'visible' : 'hidden',
                                overflow: 'visible',
                                whiteSpace: 'nowrap',
                                display: 'inline-block',
                                width: 'max-content',
                                margin: 0,
                                padding: 0,
                                color: theme.pageTextSubdued,
                                fontWeight: 'bold',
                                fontSize: '12px',
                                marginBottom: 6,
                            }, onPress: () => {
                                navigate(`/reports/calendar/${widgetId}?month=${formatDate(calendar.start, 'yyyy-MM')}`);
                            }, children: selectedMonthNameFormat &&
                                formatDate(calendar.start, selectedMonthNameFormat) }) }), _jsxs(View, { style: {
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                        }, children: [_jsx(View, { style: {
                                    color: chartTheme.colors.blue,
                                    flexDirection: 'row',
                                    fontSize: '10px',
                                    marginRight: 10,
                                }, "aria-label": t('Income'), children: calendar.totalIncome !== 0 ? (_jsxs(_Fragment, { children: [_jsx(SvgArrowThickUp, { width: 16, height: 16, style: { flexShrink: 0 } }), _jsx(PrivacyFilter, { children: format(calendar.totalIncome, 'financial') })] })) : ('') }), _jsx(View, { style: {
                                    color: chartTheme.colors.red,
                                    flexDirection: 'row',
                                    fontSize: '10px',
                                }, "aria-label": t('Expenses'), children: calendar.totalExpense !== 0 ? (_jsxs(_Fragment, { children: [_jsx(SvgArrowThickDown, { width: 16, height: 16, style: { flexShrink: 0 } }), _jsx(PrivacyFilter, { children: format(calendar.totalExpense, 'financial') })] })) : ('') })] })] }), _jsx(CalendarGraph, { data: calendar.data, start: calendar.start, firstDayOfWeekIdx: firstDayOfWeekIdx, isEditing: isEditing, onDayClick: date => {
                    if (date) {
                        navigate(`/reports/calendar/${widgetId}?day=${formatDate(date, 'yyyy-MM-dd')}`);
                    }
                    else {
                        navigate(`/reports/calendar/${widgetId}`);
                    }
                } }), _jsx(View, { style: { fontWeight: 'bold', fontSize: '12px' }, children: monthFormats.map((item, idx) => (_jsxs("span", { ref: node => {
                        if (node)
                            monthFormatSizeContainers.current[idx] = node;
                    }, style: { position: 'fixed', top: -9999, left: -9999 }, "data-format": item.format, children: [item.text, item.text && ':'] }, item.format))) })] }));
}
