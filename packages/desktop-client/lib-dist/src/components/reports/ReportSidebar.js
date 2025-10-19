import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Menu } from '@actual-app/components/menu';
import { Popover } from '@actual-app/components/popover';
import { Select } from '@actual-app/components/select';
import { SpaceBetween } from '@actual-app/components/space-between';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';
import * as monthUtils from 'loot-core/shared/months';
import { CategorySelector } from './CategorySelector';
import { defaultsList, disabledList } from './disabledList';
import { getLiveRange } from './getLiveRange';
import { ModeButton } from './ModeButton';
import { ReportOptions } from './ReportOptions';
import { validateEnd, validateStart } from './reportRanges';
import { setSessionReport } from './setSessionReport';
import { Information } from '@desktop-client/components/alerts';
import { useLocale } from '@desktop-client/hooks/useLocale';
export function ReportSidebar({ customReportItems, selectedCategories, categories, dateRangeLine, allIntervals, setDateRange, setGraphType, setGroupBy, setInterval, setBalanceType, setSortBy, setMode, setIsDateStatic, setShowEmpty, setShowOffBudget, setShowHiddenCategories, setIncludeCurrentInterval, setShowUncategorized, setTrimIntervals, setSelectedCategories, onChangeDates, onReportChange, disabledItems, defaultItems, defaultModeItems, earliestTransaction, latestTransaction, firstDayOfWeekIdx, isComplexCategoryCondition = false, }) {
    const { t } = useTranslation();
    const locale = useLocale();
    const [menuOpen, setMenuOpen] = useState(false);
    const triggerRef = useRef(null);
    const onSelectRange = (cond) => {
        setSessionReport('dateRange', cond);
        onReportChange({ type: 'modify' });
        setDateRange(cond);
        onChangeDates(...getLiveRange(cond, earliestTransaction, latestTransaction, customReportItems.includeCurrentInterval, firstDayOfWeekIdx));
    };
    const [includeCurrentIntervalText, includeCurrentIntervalTooltip] = useMemo(() => {
        const rangeType = (ReportOptions.dateRangeType.get(customReportItems.dateRange) || '').toLowerCase();
        let text = t('Include current period');
        let tooltip = t('Include current period in live range');
        if (rangeType === 'month') {
            text = t('Include current Month');
            tooltip = t('Include current Month in live range');
        }
        else if (rangeType === 'year') {
            text = t('Include current Year');
            tooltip = t('Include current Year in live range');
        }
        return [text, tooltip];
    }, [customReportItems.dateRange, t]);
    const onChangeMode = (cond) => {
        setSessionReport('mode', cond);
        onReportChange({ type: 'modify' });
        setMode(cond);
        let graph = '';
        if (cond === 'time') {
            if (customReportItems.graphType === 'BarGraph') {
                setSessionReport('graphType', 'StackedBarGraph');
                setGraphType('StackedBarGraph');
                graph = 'StackedBarGraph';
            }
        }
        else {
            if (customReportItems.graphType === 'StackedBarGraph') {
                setSessionReport('graphType', 'BarGraph');
                setGraphType('BarGraph');
                graph = 'BarGraph';
            }
        }
        defaultModeItems(graph, cond);
    };
    const onChangeSplit = (cond) => {
        setSessionReport('groupBy', cond);
        onReportChange({ type: 'modify' });
        setGroupBy(cond);
        defaultItems(cond);
    };
    const onChangeBalanceType = (cond) => {
        setSessionReport('balanceType', cond);
        onReportChange({ type: 'modify' });
        setBalanceType(cond);
    };
    const onChangeSortBy = (cond) => {
        cond ?? (cond = 'desc');
        setSessionReport('sortBy', cond);
        onReportChange({ type: 'modify' });
        setSortBy(cond);
    };
    const rangeOptions = useMemo(() => {
        const options = ReportOptions.dateRange
            .filter(f => f[customReportItems.interval])
            .map(option => [option.key, option.description]);
        // Append separator if necessary
        if (dateRangeLine > 0) {
            options.splice(dateRangeLine, 0, Menu.line);
        }
        return options;
    }, [customReportItems, dateRangeLine]);
    const disableSort = customReportItems.graphType !== 'TableGraph' &&
        (customReportItems.groupBy === 'Interval' ||
            (disabledList?.mode
                ?.find(m => m.description === customReportItems.mode)
                ?.graphs.find(g => g.description === customReportItems.graphType)
                ?.disableSort ??
                false));
    return (_jsxs(View, { style: {
            minWidth: 225,
            maxWidth: 250,
            paddingTop: 10,
            paddingRight: 10,
            flexShrink: 0,
            overflowY: 'auto',
        }, children: [_jsxs(View, { style: { flexShrink: 0 }, children: [_jsx(View, { style: {
                            flexDirection: 'row',
                            marginBottom: 5,
                            alignItems: 'center',
                        }, children: _jsx(Text, { children: _jsx("strong", { children: _jsx(Trans, { children: "Display" }) }) }) }), _jsxs(SpaceBetween, { gap: 5, style: {
                            padding: 5,
                        }, children: [_jsx(Text, { style: { width: 50, textAlign: 'right' }, children: _jsx(Trans, { children: "Mode:" }) }), _jsx(ModeButton, { selected: customReportItems.mode === 'total', onSelect: () => onChangeMode('total'), children: _jsx(Trans, { children: "Total" }) }), _jsx(ModeButton, { selected: customReportItems.mode === 'time', onSelect: () => onChangeMode('time'), children: _jsx(Trans, { children: "Time" }) })] }), _jsxs(View, { style: {
                            flexDirection: 'row',
                            padding: 5,
                            alignItems: 'center',
                        }, children: [_jsx(Text, { style: { width: 50, textAlign: 'right', marginRight: 5 }, children: _jsx(Trans, { children: "Split:" }) }), _jsx(Select, { value: customReportItems.groupBy, onChange: e => onChangeSplit(e), options: ReportOptions.groupBy.map(option => [
                                    option.key,
                                    option.description,
                                ]), disabledKeys: disabledItems('split') })] }), _jsxs(View, { style: {
                            flexDirection: 'row',
                            padding: 5,
                            alignItems: 'center',
                        }, children: [_jsx(Text, { style: { width: 50, textAlign: 'right', marginRight: 5 }, children: _jsx(Trans, { children: "Type:" }) }), _jsx(Select, { value: customReportItems.balanceType, onChange: e => onChangeBalanceType(e), options: ReportOptions.balanceType.map(option => [
                                    option.key,
                                    option.description,
                                ]), disabledKeys: disabledItems('type') })] }), _jsxs(View, { style: {
                            flexDirection: 'row',
                            padding: 5,
                            alignItems: 'center',
                        }, children: [_jsx(Text, { style: { width: 50, textAlign: 'right', marginRight: 5 }, children: _jsx(Trans, { children: "Interval:" }) }), _jsx(Select, { value: customReportItems.interval, onChange: e => {
                                    setSessionReport('interval', e);
                                    setInterval(e);
                                    onReportChange({ type: 'modify' });
                                    if (ReportOptions.dateRange
                                        .filter(d => !d[e])
                                        .map(int => int.key)
                                        .includes(customReportItems.dateRange)) {
                                        onSelectRange(defaultsList.intervalRange.get(e) || '');
                                    }
                                }, options: ReportOptions.interval.map(option => [
                                    option.key,
                                    option.description,
                                ]), disabledKeys: [] })] }), !disableSort && (_jsxs(View, { style: {
                            flexDirection: 'row',
                            padding: 5,
                            alignItems: 'center',
                        }, children: [_jsx(Text, { style: { width: 50, textAlign: 'right', marginRight: 5 }, children: _jsx(Trans, { children: "Sort:" }) }), _jsx(Select, { value: customReportItems.sortBy, onChange: (e) => onChangeSortBy(e), options: ReportOptions.sortBy.map(option => [
                                    option.format,
                                    option.description,
                                ]), disabledKeys: disabledItems('sort') })] })), _jsxs(View, { style: {
                            flexDirection: 'row',
                            padding: 5,
                            alignItems: 'center',
                        }, children: [_jsx(Text, { style: { width: 50, textAlign: 'right', marginRight: 5 } }), _jsx(Button, { ref: triggerRef, onPress: () => {
                                    setMenuOpen(true);
                                }, style: {
                                    color: 'currentColor',
                                    padding: '5px 10px',
                                }, children: _jsx(Trans, { children: "Options" }) }), _jsx(Popover, { triggerRef: triggerRef, placement: "bottom start", isOpen: menuOpen, onOpenChange: () => setMenuOpen(false), children: _jsx(Menu, { onMenuSelect: type => {
                                        onReportChange({ type: 'modify' });
                                        if (type === 'include-current-interval') {
                                            setSessionReport('includeCurrentInterval', !customReportItems.includeCurrentInterval);
                                            setIncludeCurrentInterval(!customReportItems.includeCurrentInterval);
                                        }
                                        else if (type === 'show-hidden-categories') {
                                            setSessionReport('showHiddenCategories', !customReportItems.showHiddenCategories);
                                            setShowHiddenCategories(!customReportItems.showHiddenCategories);
                                        }
                                        else if (type === 'show-off-budget') {
                                            setSessionReport('showOffBudget', !customReportItems.showOffBudget);
                                            setShowOffBudget(!customReportItems.showOffBudget);
                                        }
                                        else if (type === 'show-empty-items') {
                                            setSessionReport('showEmpty', !customReportItems.showEmpty);
                                            setShowEmpty(!customReportItems.showEmpty);
                                        }
                                        else if (type === 'show-uncategorized') {
                                            setSessionReport('showUncategorized', !customReportItems.showUncategorized);
                                            setShowUncategorized(!customReportItems.showUncategorized);
                                        }
                                        else if (type === 'trim-intervals') {
                                            setSessionReport('trimIntervals', !customReportItems.trimIntervals);
                                            setTrimIntervals(!customReportItems.trimIntervals);
                                        }
                                    }, items: [
                                        {
                                            name: 'include-current-interval',
                                            text: includeCurrentIntervalText,
                                            tooltip: includeCurrentIntervalTooltip,
                                            toggle: customReportItems.includeCurrentInterval,
                                            disabled: customReportItems.isDateStatic ||
                                                disabledList.currentInterval.get(customReportItems.dateRange),
                                        },
                                        {
                                            name: 'show-hidden-categories',
                                            text: t('Show hidden categories'),
                                            tooltip: t('Show hidden categories'),
                                            toggle: customReportItems.showHiddenCategories,
                                        },
                                        {
                                            name: 'show-empty-items',
                                            text: t('Show empty rows'),
                                            tooltip: t('Show rows that are zero or blank'),
                                            toggle: customReportItems.showEmpty,
                                        },
                                        {
                                            name: 'show-off-budget',
                                            text: t('Show off budget'),
                                            tooltip: t('Show off budget accounts'),
                                            toggle: customReportItems.showOffBudget,
                                        },
                                        {
                                            name: 'show-uncategorized',
                                            text: t('Show uncategorized'),
                                            tooltip: t('Show uncategorized transactions'),
                                            toggle: customReportItems.showUncategorized,
                                        },
                                        {
                                            name: 'trim-intervals',
                                            text: t('Trim intervals'),
                                            tooltip: t('Trim empty intervals at the start and end of the report'),
                                            toggle: customReportItems.trimIntervals,
                                        },
                                    ] }) })] }), _jsx(View, { style: {
                            height: 1,
                            backgroundColor: theme.pillBorderDark,
                            marginTop: 10,
                            flexShrink: 0,
                        } }), _jsxs(SpaceBetween, { gap: 5, style: {
                            marginTop: 10,
                            marginBottom: 5,
                        }, children: [_jsx(Text, { children: _jsx("strong", { children: _jsx(Trans, { children: "Date filters" }) }) }), _jsx(View, { style: { flex: 1 } }), _jsx(ModeButton, { selected: !customReportItems.isDateStatic, onSelect: () => {
                                    setSessionReport('isDateStatic', false);
                                    setIsDateStatic(false);
                                    onSelectRange(customReportItems.dateRange);
                                }, children: _jsx(Trans, { children: "Live" }) }), _jsx(ModeButton, { selected: customReportItems.isDateStatic, onSelect: () => {
                                    setSessionReport('isDateStatic', true);
                                    setIsDateStatic(true);
                                    onChangeDates(customReportItems.startDate, customReportItems.endDate, 'static');
                                }, children: _jsx(Trans, { children: "Static" }) })] }), !customReportItems.isDateStatic ? (_jsxs(View, { style: {
                            flexDirection: 'row',
                            padding: 5,
                            alignItems: 'center',
                        }, children: [_jsx(Text, { style: { width: 50, textAlign: 'right', marginRight: 5 }, children: _jsx(Trans, { children: "Range:" }) }), _jsx(Select, { value: customReportItems.dateRange, onChange: onSelectRange, options: rangeOptions }), !disabledList.currentInterval.get(customReportItems.dateRange) &&
                                customReportItems.includeCurrentInterval && (_jsx(Tooltip, { placement: "bottom start", content: _jsx(Text, { children: _jsx(Trans, { children: "Current month" }) }), style: {
                                    ...styles.tooltip,
                                    lineHeight: 1.5,
                                    padding: '6px 10px',
                                    marginTop: 5,
                                }, children: _jsx(Text, { style: { marginLeft: 10 }, children: "+1" }) }))] })) : (_jsxs(_Fragment, { children: [_jsxs(View, { style: {
                                    flexDirection: 'row',
                                    padding: 5,
                                    alignItems: 'center',
                                }, children: [_jsx(Text, { style: { width: 50, textAlign: 'right', marginRight: 5 }, children: _jsx(Trans, { children: "From:" }) }), _jsx(Select, { onChange: newValue => onChangeDates(...validateStart(earliestTransaction, latestTransaction, newValue, customReportItems.endDate, customReportItems.interval, firstDayOfWeekIdx)), value: customReportItems.startDate, defaultLabel: monthUtils.format(customReportItems.startDate, ReportOptions.intervalFormat.get(customReportItems.interval) || '', locale), options: allIntervals.map(({ name, pretty }) => [name, pretty]) })] }), _jsxs(View, { style: {
                                    flexDirection: 'row',
                                    padding: 5,
                                    alignItems: 'center',
                                }, children: [_jsx(Text, { style: { width: 50, textAlign: 'right', marginRight: 5 }, children: _jsx(Trans, { children: "To:" }) }), _jsx(Select, { onChange: newValue => onChangeDates(...validateEnd(earliestTransaction, latestTransaction, customReportItems.startDate, newValue, customReportItems.interval, firstDayOfWeekIdx)), value: customReportItems.endDate, defaultLabel: monthUtils.format(customReportItems.endDate, ReportOptions.intervalFormat.get(customReportItems.interval) || '', locale), options: allIntervals.map(({ name, pretty }) => [name, pretty]) })] })] })), _jsx(View, { style: {
                            height: 1,
                            backgroundColor: theme.pillBorderDark,
                            marginTop: 10,
                            flexShrink: 0,
                        } })] }), _jsx(View, { style: {
                    marginTop: 10,
                    minHeight: 200,
                }, children: isComplexCategoryCondition ? (_jsx(Information, { children: _jsx(Trans, { children: "Remove active category filters to show the category selector." }) })) : (_jsx(CategorySelector, { categoryGroups: categories.grouped.filter(f => {
                        return customReportItems.showHiddenCategories || !f.hidden
                            ? true
                            : false;
                    }), selectedCategories: selectedCategories || [], setSelectedCategories: e => {
                        setSelectedCategories(e);
                        onReportChange({ type: 'modify' });
                    }, showHiddenCategories: customReportItems.showHiddenCategories })) })] }));
}
