import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useLocation, useParams } from 'react-router';
import { AlignedText } from '@actual-app/components/aligned-text';
import { Block } from '@actual-app/components/block';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as d from 'date-fns';
import { send } from 'loot-core/platform/client/fetch';
import * as monthUtils from 'loot-core/shared/months';
import { Warning } from '@desktop-client/components/alerts';
import { AppliedFilters } from '@desktop-client/components/filters/AppliedFilters';
import { MobileBackButton } from '@desktop-client/components/mobile/MobileBackButton';
import { MobilePageHeader, Page, PageHeader, } from '@desktop-client/components/Page';
import { PrivacyFilter } from '@desktop-client/components/PrivacyFilter';
import { ChooseGraph } from '@desktop-client/components/reports/ChooseGraph';
import { defaultsGraphList, defaultsList, disabledGraphList, disabledLegendLabel, disabledList, } from '@desktop-client/components/reports/disabledList';
import { getLiveRange } from '@desktop-client/components/reports/getLiveRange';
import { LoadingIndicator } from '@desktop-client/components/reports/LoadingIndicator';
import { ReportLegend } from '@desktop-client/components/reports/ReportLegend';
import { ReportOptions, defaultReport, } from '@desktop-client/components/reports/ReportOptions';
import { ReportSidebar } from '@desktop-client/components/reports/ReportSidebar';
import { ReportSummary } from '@desktop-client/components/reports/ReportSummary';
import { ReportTopbar } from '@desktop-client/components/reports/ReportTopbar';
import { setSessionReport } from '@desktop-client/components/reports/setSessionReport';
import { createCustomSpreadsheet } from '@desktop-client/components/reports/spreadsheets/custom-spreadsheet';
import { createGroupedSpreadsheet } from '@desktop-client/components/reports/spreadsheets/grouped-spreadsheet';
import { useReport } from '@desktop-client/components/reports/useReport';
import { calculateHasWarning, fromDateRepr, } from '@desktop-client/components/reports/util';
import { useAccounts } from '@desktop-client/hooks/useAccounts';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { useLocale } from '@desktop-client/hooks/useLocale';
import { useLocalPref } from '@desktop-client/hooks/useLocalPref';
import { useNavigate } from '@desktop-client/hooks/useNavigate';
import { usePayees } from '@desktop-client/hooks/usePayees';
import { useReport as useCustomReport } from '@desktop-client/hooks/useReport';
import { useRuleConditionFilters } from '@desktop-client/hooks/useRuleConditionFilters';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
/**
 * Transform `selectedCategories` into `conditions`.
 */
function useSelectedCategories(conditions, categories) {
    const existingCategoryCondition = useMemo(() => conditions.find(({ field }) => field === 'category'), [conditions]);
    return useMemo(() => {
        if (!existingCategoryCondition) {
            return categories;
        }
        switch (existingCategoryCondition.op) {
            case 'is':
                return categories.filter(({ id }) => id === existingCategoryCondition.value);
            case 'isNot':
                return categories.filter(({ id }) => existingCategoryCondition.value !== id);
            case 'oneOf':
                return categories.filter(({ id }) => existingCategoryCondition.value.includes(id));
            case 'notOneOf':
                return categories.filter(({ id }) => !existingCategoryCondition.value.includes(id));
        }
        return categories;
    }, [existingCategoryCondition, categories]);
}
export function CustomReport() {
    const params = useParams();
    const { data: report, isLoading } = useCustomReport(params.id ?? '');
    if (isLoading) {
        return _jsx(LoadingIndicator, {});
    }
    return _jsx(CustomReportInner, { report: report }, report?.id);
}
function CustomReportInner({ report: initialReport }) {
    const locale = useLocale();
    const { t } = useTranslation();
    const format = useFormat();
    const categories = useCategories();
    const { isNarrowWidth } = useResponsive();
    const [_firstDayOfWeekIdx] = useSyncedPref('firstDayOfWeekIdx');
    const firstDayOfWeekIdx = _firstDayOfWeekIdx || '0';
    const [viewLegend = false, setViewLegendPref] = useLocalPref('reportsViewLegend');
    const [viewSummary = false, setViewSummaryPref] = useLocalPref('reportsViewSummary');
    const [viewLabels = false, setViewLabelsPref] = useLocalPref('reportsViewLabel');
    const { conditions, conditionsOp, onApply: onApplyFilter, onDelete: onDeleteFilter, onUpdate: onUpdateFilter, onConditionsOpChange, } = useRuleConditionFilters();
    const location = useLocation();
    const prevUrl = sessionStorage.getItem('url') || '';
    sessionStorage.setItem('prevUrl', prevUrl);
    sessionStorage.setItem('url', location.pathname);
    if (['/reports'].includes(prevUrl))
        sessionStorage.clear();
    const reportFromSessionStorage = sessionStorage.getItem('report');
    const session = reportFromSessionStorage
        ? JSON.parse(reportFromSessionStorage)
        : {};
    const combine = initialReport ?? defaultReport;
    const loadReport = { ...combine, ...session };
    const [allIntervals, setAllIntervals] = useState([]);
    // Complex category conditions are:
    // - conditions with multiple "category" fields
    // - conditions with "category" field that use "contains", "doesNotContain" or "matches" operations
    const isComplexCategoryCondition = !!conditions.find(({ field, op }) => field === 'category' &&
        ['contains', 'doesNotContain', 'matches', 'hasTags'].includes(op)) || conditions.filter(({ field }) => field === 'category').length >= 2;
    const setSelectedCategories = (newCategories) => {
        const newCategoryIdSet = new Set(newCategories.map(({ id }) => id));
        const allCategoryIds = categories.list.map(({ id }) => id);
        const allCategoriesSelected = !allCategoryIds.find(id => !newCategoryIdSet.has(id));
        const newCondition = {
            field: 'category',
            op: 'oneOf',
            value: newCategories.map(({ id }) => id),
            type: 'id',
        };
        const existingCategoryCondition = conditions.find(({ field }) => field === 'category');
        // If the existing conditions already have one for "category" - replace it
        if (existingCategoryCondition) {
            // If we selected all categories - remove the filter (default state)
            if (allCategoriesSelected) {
                onDeleteFilter(existingCategoryCondition);
                return;
            }
            // Update the "notOneOf" condition if it's already set
            if (existingCategoryCondition.op === 'notOneOf') {
                onUpdateFilter(existingCategoryCondition, {
                    ...existingCategoryCondition,
                    value: allCategoryIds.filter(id => !newCategoryIdSet.has(id)),
                });
                return;
            }
            // Otherwise use `oneOf` condition
            onUpdateFilter(existingCategoryCondition, newCondition);
            return;
        }
        // Don't add a new filter if all categories are selected (default state)
        if (allCategoriesSelected) {
            return;
        }
        // If the existing conditions does not have a "category" - append a new one
        onApplyFilter(newCondition);
    };
    const selectedCategories = useSelectedCategories(conditions, categories.list);
    const [startDate, setStartDate] = useState(loadReport.startDate);
    const [endDate, setEndDate] = useState(loadReport.endDate);
    const [mode, setMode] = useState(loadReport.mode);
    const [isDateStatic, setIsDateStatic] = useState(loadReport.isDateStatic);
    const [groupBy, setGroupBy] = useState(loadReport.groupBy);
    const [interval, setInterval] = useState(loadReport.interval);
    const [balanceType, setBalanceType] = useState(loadReport.balanceType);
    const [sortBy, setSortBy] = useState(loadReport.sortBy);
    const [showEmpty, setShowEmpty] = useState(loadReport.showEmpty);
    const [showOffBudget, setShowOffBudget] = useState(loadReport.showOffBudget);
    const [includeCurrentInterval, setIncludeCurrentInterval] = useState(loadReport.includeCurrentInterval);
    const [showHiddenCategories, setShowHiddenCategories] = useState(loadReport.showHiddenCategories);
    const [showUncategorized, setShowUncategorized] = useState(loadReport.showUncategorized);
    const [trimIntervals, setTrimIntervals] = useState(loadReport.trimIntervals);
    const [graphType, setGraphType] = useState(loadReport.graphType);
    const [dateRange, setDateRange] = useState(loadReport.dateRange);
    const [dataCheck, setDataCheck] = useState(false);
    const dateRangeLine = interval === 'Daily'
        ? 0
        : ReportOptions.dateRange.filter(f => f[interval])
            .length - 3;
    const [intervals, setIntervals] = useState(monthUtils.rangeInclusive(startDate, endDate));
    const [earliestTransaction, setEarliestTransaction] = useState('');
    const [latestTransaction, setLatestTransaction] = useState('');
    const [report, setReport] = useState(loadReport);
    const [savedStatus, setSavedStatus] = useState(session.savedStatus ?? (initialReport ? 'saved' : 'new'));
    useEffect(() => {
        async function run() {
            onApplyFilter(null);
            const filtersToApply = savedStatus !== 'saved' ? conditions : report.conditions;
            const conditionsOpToApply = savedStatus !== 'saved' ? conditionsOp : report.conditionsOp;
            filtersToApply?.forEach((condition) => onApplyFilter(condition));
            onConditionsOpChange(conditionsOpToApply);
            const earliestTransaction = await send('get-earliest-transaction');
            setEarliestTransaction(earliestTransaction
                ? earliestTransaction.date
                : monthUtils.currentDay());
            const latestTransaction = await send('get-latest-transaction');
            setLatestTransaction(latestTransaction ? latestTransaction.date : monthUtils.currentDay());
            const fromDate = interval === 'Weekly'
                ? 'dayFromDate'
                : ((ReportOptions.intervalMap.get(interval) || 'Day').toLowerCase() +
                    'FromDate');
            const earliestInterval = interval === 'Weekly'
                ? monthUtils.weekFromDate(d.parseISO(fromDateRepr(earliestTransaction.date || monthUtils.currentDay())), firstDayOfWeekIdx)
                : monthUtils[fromDate](d.parseISO(fromDateRepr(earliestTransaction.date || monthUtils.currentDay())));
            const latestInterval = interval === 'Weekly'
                ? monthUtils.weekFromDate(d.parseISO(fromDateRepr(latestTransaction.date || monthUtils.currentDay())), firstDayOfWeekIdx)
                : monthUtils[fromDate](d.parseISO(fromDateRepr(latestTransaction.date || monthUtils.currentDay())));
            const allIntervals = interval === 'Weekly'
                ? monthUtils.weekRangeInclusive(earliestInterval, latestInterval, firstDayOfWeekIdx)
                : monthUtils[ReportOptions.intervalRange.get(interval) || 'rangeInclusive'](earliestInterval, latestInterval);
            const allIntervalsMap = allIntervals
                .map((inter) => ({
                name: inter,
                pretty: monthUtils.format(inter, ReportOptions.intervalFormat.get(interval) || '', locale),
            }))
                .reverse();
            setAllIntervals(allIntervalsMap);
            if (!isDateStatic) {
                const [dateStart, dateEnd] = getLiveRange(dateRange, earliestTransaction
                    ? earliestTransaction.date
                    : monthUtils.currentDay(), latestTransaction ? latestTransaction.date : monthUtils.currentDay(), includeCurrentInterval, firstDayOfWeekIdx);
                setStartDate(dateStart);
                setEndDate(dateEnd);
            }
        }
        run();
        // omitted `conditions` and `conditionsOp` from dependencies to avoid infinite loops
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        interval,
        dateRange,
        firstDayOfWeekIdx,
        isDateStatic,
        onApplyFilter,
        onConditionsOpChange,
        report.conditions,
        report.conditionsOp,
        includeCurrentInterval,
        locale,
        savedStatus,
    ]);
    useEffect(() => {
        const [start, end] = [startDate, endDate];
        if (interval === 'Weekly') {
            setIntervals(monthUtils.weekRangeInclusive(start, end, firstDayOfWeekIdx));
        }
        else {
            setIntervals(monthUtils[ReportOptions.intervalRange.get(interval) || 'rangeInclusive'](start, end));
        }
    }, [interval, startDate, endDate, firstDayOfWeekIdx]);
    const balanceTypeOp = ReportOptions.balanceTypeMap.get(balanceType) || 'totalDebts';
    const sortByOp = sortBy || 'desc';
    const payees = usePayees();
    const accounts = useAccounts();
    const hasWarning = calculateHasWarning(conditions, {
        categories: categories.list,
        payees,
        accounts,
    });
    const getGroupData = useMemo(() => {
        return createGroupedSpreadsheet({
            startDate,
            endDate,
            interval,
            categories,
            conditions,
            conditionsOp,
            showEmpty,
            showOffBudget,
            showHiddenCategories,
            showUncategorized,
            trimIntervals,
            balanceTypeOp,
            sortByOp,
            firstDayOfWeekIdx,
        });
    }, [
        startDate,
        endDate,
        interval,
        balanceTypeOp,
        categories,
        conditions,
        conditionsOp,
        showEmpty,
        showOffBudget,
        showHiddenCategories,
        showUncategorized,
        trimIntervals,
        sortByOp,
        firstDayOfWeekIdx,
    ]);
    const getGraphData = useMemo(() => {
        // TODO: fix me - state mutations should not happen inside `useMemo`
        setDataCheck(false);
        return createCustomSpreadsheet({
            startDate,
            endDate,
            interval,
            categories,
            conditions,
            conditionsOp,
            showEmpty,
            showOffBudget,
            showHiddenCategories,
            showUncategorized,
            trimIntervals,
            groupBy,
            balanceTypeOp,
            sortByOp,
            payees,
            accounts,
            graphType,
            firstDayOfWeekIdx,
            setDataCheck,
        });
    }, [
        startDate,
        endDate,
        interval,
        groupBy,
        balanceTypeOp,
        categories,
        payees,
        accounts,
        conditions,
        conditionsOp,
        showEmpty,
        showOffBudget,
        showHiddenCategories,
        showUncategorized,
        trimIntervals,
        sortByOp,
        graphType,
        firstDayOfWeekIdx,
    ]);
    const graphData = useReport('default', getGraphData);
    const groupedData = useReport('grouped', getGroupData);
    const data = { ...graphData, groupedData };
    const customReportItems = {
        id: '',
        name: '',
        startDate,
        endDate,
        isDateStatic,
        dateRange,
        mode,
        groupBy,
        interval,
        balanceType,
        sortBy,
        showEmpty,
        showOffBudget,
        showHiddenCategories,
        includeCurrentInterval,
        showUncategorized,
        trimIntervals,
        graphType,
        conditions,
        conditionsOp,
    };
    const navigate = useNavigate();
    const [, setScrollWidth] = useState(0);
    useEffect(() => {
        if (disabledLegendLabel(mode, graphType, 'disableLegend')) {
            setViewLegendPref(false);
        }
        if (disabledLegendLabel(mode, graphType, 'disableLabel')) {
            setViewLabelsPref(false);
        }
    }, [setViewLegendPref, setViewLabelsPref, mode, graphType]);
    if (!allIntervals || !data) {
        return null;
    }
    const defaultModeItems = (graph, item) => {
        const chooseGraph = graph || graphType;
        const newGraph = ((disabledList.modeGraphsMap.get(item) || []).includes(chooseGraph)
            ? defaultsList.modeGraphsMap.get(item)
            : chooseGraph) ?? chooseGraph;
        if ((disabledList.modeGraphsMap.get(item) || []).includes(graphType)) {
            setSessionReport('graphType', newGraph);
            setGraphType(newGraph);
        }
        if ((disabledGraphList(item, newGraph, 'disabledSplit') || []).includes(groupBy)) {
            const cond = defaultsGraphList(item, newGraph, 'defaultSplit');
            setSessionReport('groupBy', cond);
            setGroupBy(cond);
        }
        if ((disabledGraphList(item, newGraph, 'disabledType') || []).includes(balanceType)) {
            const cond = defaultsGraphList(item, newGraph, 'defaultType');
            setSessionReport('balanceType', cond);
            setBalanceType(cond);
        }
    };
    const defaultItems = (item) => {
        const chooseGraph = ReportOptions.groupByItems.has(item) ? graphType : item;
        if ((disabledGraphList(mode, chooseGraph, 'disabledSplit') || []).includes(groupBy)) {
            const cond = defaultsGraphList(mode, chooseGraph, 'defaultSplit');
            setSessionReport('groupBy', cond);
            setGroupBy(cond);
        }
        if ((disabledGraphList(mode, chooseGraph, 'disabledType') || []).includes(balanceType)) {
            const cond = defaultsGraphList(mode, chooseGraph, 'defaultType');
            setSessionReport('balanceType', cond);
            setBalanceType(cond);
        }
        const defaultSort = defaultsGraphList(mode, chooseGraph, 'defaultSort');
        if (defaultSort) {
            setSessionReport('sortBy', defaultSort);
            setSortBy(defaultSort);
        }
    };
    const isItemDisabled = (type) => {
        switch (type) {
            case 'ShowLegend': {
                return disabledLegendLabel(mode, graphType, 'disableLegend') || false;
            }
            case 'ShowLabels': {
                return disabledLegendLabel(mode, graphType, 'disableLabel') || false;
            }
            default:
                return ((disabledList.modeGraphsMap.get(mode) || []).includes(type) || false);
        }
    };
    const disabledItems = (type) => {
        switch (type) {
            case 'split':
                return disabledGraphList(mode, graphType, 'disabledSplit') || [];
            case 'type':
                return graphType === 'BarGraph' && groupBy === 'Interval'
                    ? []
                    : disabledGraphList(mode, graphType, 'disabledType') || [];
            default:
                return [];
        }
    };
    const onChangeDates = (dateStart, dateEnd) => {
        setSessionReport('startDate', dateStart);
        setSessionReport('endDate', dateEnd);
        setStartDate(dateStart);
        setEndDate(dateEnd);
        onReportChange({ type: 'modify' });
    };
    const onChangeViews = (viewType) => {
        if (viewType === 'viewLegend') {
            setViewLegendPref(!viewLegend);
        }
        if (viewType === 'viewSummary') {
            setViewSummaryPref(!viewSummary);
        }
        if (viewType === 'viewLabels') {
            setViewLabelsPref(!viewLabels);
        }
    };
    const setReportData = (input) => {
        setStartDate(input.startDate);
        setEndDate(input.endDate);
        setIsDateStatic(input.isDateStatic);
        setDateRange(input.dateRange);
        setMode(input.mode);
        setGroupBy(input.groupBy);
        setInterval(input.interval);
        setBalanceType(input.balanceType);
        setSortBy(input.sortBy);
        setShowEmpty(input.showEmpty);
        setShowOffBudget(input.showOffBudget);
        setShowHiddenCategories(input.showHiddenCategories);
        setIncludeCurrentInterval(input.includeCurrentInterval);
        setShowUncategorized(input.showUncategorized);
        setTrimIntervals(input.trimIntervals);
        setGraphType(input.graphType);
        onApplyFilter(null);
        (input.conditions || []).forEach(condition => onApplyFilter(condition));
        onConditionsOpChange(input.conditionsOp);
    };
    const onReportChange = (params) => {
        switch (params.type) {
            case 'add-update':
                sessionStorage.clear();
                setSessionReport('savedStatus', 'saved');
                setSavedStatus('saved');
                setReport(params.savedReport);
                if (params.savedReport.id !== initialReport?.id) {
                    navigate(`/reports/custom/${params.savedReport.id}`);
                }
                break;
            case 'rename':
                setReport({ ...report, name: params.savedReport?.name || '' });
                break;
            case 'modify':
                if (report.name) {
                    setSessionReport('savedStatus', 'modified');
                    setSavedStatus('modified');
                }
                break;
            case 'reload':
                sessionStorage.clear();
                setSessionReport('savedStatus', 'saved');
                setSavedStatus('saved');
                setReportData(initialReport ?? defaultReport);
                break;
            case 'reset':
                sessionStorage.clear();
                setSavedStatus('new');
                setReport(defaultReport);
                setReportData(defaultReport);
                break;
            case 'choose':
                sessionStorage.clear();
                const newReport = params.savedReport || report;
                setSessionReport('savedStatus', 'saved');
                setSavedStatus('saved');
                setReport(newReport);
                setReportData(newReport);
                navigate(`/reports/custom/${newReport.id}`);
                break;
            default:
        }
    };
    const onBackClick = () => {
        navigate('/reports');
    };
    return (_jsx(Page, { header: isNarrowWidth ? (_jsx(MobilePageHeader, { title: t('Custom Report: {{name}}', {
                name: report.name ?? t('Unsaved report'),
            }), leftContent: _jsx(MobileBackButton, { onPress: onBackClick }) })) : (_jsx(PageHeader, { title: _jsxs(Trans, { children: [_jsx(Text, { children: _jsx(Trans, { children: "Custom Report:" }) }), ' ', _jsx(Text, { style: { marginLeft: 5, color: theme.pageTextPositive }, children: {
                            name: report.name?.length > 0
                                ? report.name
                                : t('Unsaved report'),
                        } })] }) })), padding: 0, children: _jsxs(View, { style: {
                flexDirection: 'row',
                paddingLeft: !isNarrowWidth ? 20 : undefined,
                flex: 1,
            }, children: [!isNarrowWidth && (_jsx(ReportSidebar, { customReportItems: customReportItems, selectedCategories: selectedCategories, categories: categories, dateRangeLine: dateRangeLine, allIntervals: allIntervals, setDateRange: setDateRange, setGraphType: setGraphType, setGroupBy: setGroupBy, setInterval: setInterval, setBalanceType: setBalanceType, setSortBy: setSortBy, setMode: setMode, setIsDateStatic: setIsDateStatic, setShowEmpty: setShowEmpty, setShowOffBudget: setShowOffBudget, setShowHiddenCategories: setShowHiddenCategories, setIncludeCurrentInterval: setIncludeCurrentInterval, setShowUncategorized: setShowUncategorized, setTrimIntervals: setTrimIntervals, setSelectedCategories: setSelectedCategories, onChangeDates: onChangeDates, onReportChange: onReportChange, disabledItems: disabledItems, defaultItems: defaultItems, defaultModeItems: defaultModeItems, earliestTransaction: earliestTransaction, latestTransaction: latestTransaction, firstDayOfWeekIdx: firstDayOfWeekIdx, isComplexCategoryCondition: isComplexCategoryCondition })), _jsxs(View, { style: {
                        flex: 1,
                    }, children: [!isNarrowWidth && (_jsx(ReportTopbar, { customReportItems: customReportItems, report: report, savedStatus: savedStatus, setGraphType: setGraphType, viewLegend: viewLegend, viewSummary: viewSummary, viewLabels: viewLabels, onApplyFilter: onApplyFilter, onChangeViews: onChangeViews, onReportChange: onReportChange, isItemDisabled: isItemDisabled, defaultItems: defaultItems })), conditions && conditions.length > 0 && (_jsxs(View, { style: {
                                marginBottom: 10,
                                marginLeft: 5,
                                marginRight: 5,
                                gap: 10,
                                flexShrink: 0,
                            }, children: [_jsx(View, { style: {
                                        flexShrink: 0,
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        justifyContent: 'flex-start',
                                    }, children: _jsx(AppliedFilters, { conditions: conditions, onUpdate: (oldFilter, newFilter) => {
                                            setSessionReport('conditions', conditions.map(f => (f === oldFilter ? newFilter : f)));
                                            onReportChange({ type: 'modify' });
                                            onUpdateFilter(oldFilter, newFilter);
                                        }, onDelete: deletedFilter => {
                                            setSessionReport('conditions', conditions.filter(f => f !== deletedFilter));
                                            onDeleteFilter(deletedFilter);
                                            onReportChange({ type: 'modify' });
                                        }, conditionsOp: conditionsOp, onConditionsOpChange: co => {
                                            onConditionsOpChange(co);
                                            onReportChange({ type: 'modify' });
                                        } }) }), hasWarning && (_jsx(Warning, { style: { paddingTop: 5, paddingBottom: 5 }, children: t('This report is configured to use a non-existing filter value (i.e. category/account/payee).') }))] })), _jsxs(View, { id: "custom-report-content", style: {
                                backgroundColor: theme.tableBackground,
                                flexDirection: 'row',
                                flex: '1 0 auto',
                            }, children: [_jsxs(View, { style: {
                                        flex: 1,
                                        padding: 10,
                                    }, children: [graphType !== 'TableGraph' && (_jsx(View, { style: {
                                                alignItems: 'flex-end',
                                                paddingTop: 10,
                                            }, children: _jsx(View, { style: {
                                                    ...styles.mediumText,
                                                    fontWeight: 500,
                                                    marginBottom: 5,
                                                }, children: _jsx(AlignedText, { left: _jsxs(Block, { children: [balanceType, ":"] }), right: _jsx(Text, { children: _jsx(PrivacyFilter, { children: format(data[balanceTypeOp], 'financial') }) }) }) }) })), _jsx(View, { style: { flex: 1, overflow: 'auto' }, children: dataCheck ? (_jsx(ChooseGraph, { data: data, filters: conditions, mode: mode, graphType: graphType, balanceType: balanceType, groupBy: groupBy, interval: interval, setScrollWidth: setScrollWidth, viewLabels: viewLabels, compact: false, showHiddenCategories: showHiddenCategories, showOffBudget: showOffBudget, intervalsCount: intervals.length })) : (_jsx(LoadingIndicator, { message: t('Loading report...') })) })] }), (viewLegend || viewSummary) && data && !isNarrowWidth && (_jsxs(View, { style: {
                                        padding: 10,
                                        minWidth: 300,
                                        textAlign: 'center',
                                    }, children: [viewSummary && (_jsx(ReportSummary, { startDate: startDate, endDate: endDate, balanceTypeOp: balanceTypeOp, data: data, interval: interval, intervalsCount: intervals.length })), viewLegend && (_jsx(ReportLegend, { legend: data.legend, groupBy: groupBy, interval: interval }))] }))] })] })] }) }));
}
