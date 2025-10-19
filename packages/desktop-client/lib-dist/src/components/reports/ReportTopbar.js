import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { SvgCalculator, SvgChart, SvgChartBar, SvgChartPie, SvgListBullet, SvgQueue, SvgTag, SvgCamera, SvgChartArea, } from '@actual-app/components/icons/v1';
import { SpaceBetween } from '@actual-app/components/space-between';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { toPng } from 'html-to-image';
import * as monthUtils from 'loot-core/shared/months';
import { GraphButton } from './GraphButton';
import { SaveReport } from './SaveReport';
import { setSessionReport } from './setSessionReport';
import { SnapshotButton } from './SnapshotButton';
import { FilterButton } from '@desktop-client/components/filters/FiltersMenu';
export function ReportTopbar({ customReportItems, report, savedStatus, setGraphType, viewLegend, viewSummary, viewLabels, onApplyFilter, onChangeViews, onReportChange, isItemDisabled, defaultItems, }) {
    const { t } = useTranslation();
    const onChangeGraph = (cond) => {
        setSessionReport('graphType', cond);
        onReportChange({ type: 'modify' });
        setGraphType(cond);
        defaultItems(cond);
    };
    const downloadSnapshot = async () => {
        const reportElement = document.getElementById('custom-report-content');
        const title = report.name;
        if (reportElement) {
            const dataUrl = await toPng(reportElement);
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${monthUtils.currentDay()} - ${title}.png`;
            link.click();
        }
        else {
            console.error('Report container not found.');
        }
    };
    return (_jsxs(View, { style: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            flexShrink: 0,
            overflowY: 'auto',
        }, children: [_jsx(GraphButton, { selected: customReportItems.graphType === 'TableGraph', title: t('Data Table'), onSelect: () => {
                    onChangeGraph('TableGraph');
                }, style: { marginRight: 15 }, disabled: isItemDisabled('TableGraph'), children: _jsx(SvgQueue, { width: 15, height: 15 }) }), _jsx(GraphButton, { title: customReportItems.mode === 'total'
                    ? t('Bar Graph')
                    : t('Stacked Bar Graph'), selected: customReportItems.graphType === 'BarGraph' ||
                    customReportItems.graphType === 'StackedBarGraph', onSelect: () => {
                    onChangeGraph(customReportItems.mode === 'total' ? 'BarGraph' : 'StackedBarGraph');
                }, style: { marginRight: 15 }, disabled: isItemDisabled(customReportItems.mode === 'total' ? 'BarGraph' : 'StackedBarGraph'), children: _jsx(SvgChartBar, { width: 15, height: 15 }) }), _jsx(GraphButton, { title: t('Line Graph'), selected: customReportItems.graphType === 'LineGraph', onSelect: () => {
                    onChangeGraph('LineGraph');
                }, style: { marginRight: 15 }, disabled: isItemDisabled('LineGraph'), children: _jsx(SvgChart, { width: 15, height: 15 }) }), _jsx(GraphButton, { title: t('Area Graph'), selected: customReportItems.graphType === 'AreaGraph', onSelect: () => {
                    onChangeGraph('AreaGraph');
                }, style: { marginRight: 15 }, disabled: isItemDisabled('AreaGraph'), children: _jsx(SvgChartArea, { width: 15, height: 15 }) }), _jsx(GraphButton, { title: t('Donut Graph'), selected: customReportItems.graphType === 'DonutGraph', onSelect: () => {
                    onChangeGraph('DonutGraph');
                }, style: { marginRight: 15 }, disabled: isItemDisabled('DonutGraph'), children: _jsx(SvgChartPie, { width: 15, height: 15 }) }), _jsx(View, { style: {
                    width: 1,
                    height: 30,
                    backgroundColor: theme.pillBorderDark,
                    marginRight: 15,
                    flexShrink: 0,
                } }), _jsx(GraphButton, { selected: viewLegend, onSelect: () => {
                    onChangeViews('viewLegend');
                }, style: { marginRight: 15 }, title: t('Show Legend'), disabled: isItemDisabled('ShowLegend'), children: _jsx(SvgListBullet, { width: 15, height: 15 }) }), _jsx(GraphButton, { selected: viewSummary, onSelect: () => {
                    onChangeViews('viewSummary');
                }, style: { marginRight: 15 }, title: t('Show Summary'), children: _jsx(SvgCalculator, { width: 15, height: 15 }) }), _jsx(GraphButton, { selected: viewLabels, onSelect: () => {
                    onChangeViews('viewLabels');
                }, style: { marginRight: 15 }, title: t('Show Labels'), disabled: isItemDisabled('ShowLabels'), children: _jsx(SvgTag, { width: 15, height: 15 }) }), _jsx(View, { style: {
                    width: 1,
                    height: 30,
                    backgroundColor: theme.pillBorderDark,
                    marginRight: 15,
                    flexShrink: 0,
                } }), _jsx(SnapshotButton, { style: { marginRight: 15 }, title: t('Download Snapshot'), onSelect: downloadSnapshot, children: _jsx(SvgCamera, { width: 15, height: 15 }) }), _jsx(View, { style: {
                    width: 1,
                    height: 30,
                    backgroundColor: theme.pillBorderDark,
                    marginRight: 15,
                    flexShrink: 0,
                } }), _jsxs(SpaceBetween, { style: {
                    flexWrap: 'nowrap',
                    justifyContent: 'space-between',
                    flex: 1,
                }, children: [_jsx(FilterButton, { compact: true, hover: true, onApply: (e) => {
                            setSessionReport('conditions', [
                                ...(customReportItems.conditions ?? []),
                                e,
                            ]);
                            onApplyFilter(e);
                            onReportChange({ type: 'modify' });
                        }, exclude: [] }), _jsx(SaveReport, { customReportItems: customReportItems, report: report, savedStatus: savedStatus, onReportChange: onReportChange })] })] }));
}
