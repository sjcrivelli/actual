"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportTopbar = ReportTopbar;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var v1_1 = require("@actual-app/components/icons/v1");
var space_between_1 = require("@actual-app/components/space-between");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var html_to_image_1 = require("html-to-image");
var monthUtils = require("loot-core/shared/months");
var GraphButton_1 = require("./GraphButton");
var SaveReport_1 = require("./SaveReport");
var setSessionReport_1 = require("./setSessionReport");
var SnapshotButton_1 = require("./SnapshotButton");
var FiltersMenu_1 = require("@desktop-client/components/filters/FiltersMenu");
function ReportTopbar(_a) {
    var _this = this;
    var customReportItems = _a.customReportItems, report = _a.report, savedStatus = _a.savedStatus, setGraphType = _a.setGraphType, viewLegend = _a.viewLegend, viewSummary = _a.viewSummary, viewLabels = _a.viewLabels, onApplyFilter = _a.onApplyFilter, onChangeViews = _a.onChangeViews, onReportChange = _a.onReportChange, isItemDisabled = _a.isItemDisabled, defaultItems = _a.defaultItems;
    var t = (0, react_i18next_1.useTranslation)().t;
    var onChangeGraph = function (cond) {
        (0, setSessionReport_1.setSessionReport)('graphType', cond);
        onReportChange({ type: 'modify' });
        setGraphType(cond);
        defaultItems(cond);
    };
    var downloadSnapshot = function () { return __awaiter(_this, void 0, void 0, function () {
        var reportElement, title, dataUrl, link;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    reportElement = document.getElementById('custom-report-content');
                    title = report.name;
                    if (!reportElement) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, html_to_image_1.toPng)(reportElement)];
                case 1:
                    dataUrl = _a.sent();
                    link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = "".concat(monthUtils.currentDay(), " - ").concat(title, ".png");
                    link.click();
                    return [3 /*break*/, 3];
                case 2:
                    console.error('Report container not found.');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (<view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            flexShrink: 0,
            overflowY: 'auto',
        }}>
      <GraphButton_1.GraphButton selected={customReportItems.graphType === 'TableGraph'} title={t('Data Table')} onSelect={function () {
            onChangeGraph('TableGraph');
        }} style={{ marginRight: 15 }} disabled={isItemDisabled('TableGraph')}>
        <v1_1.SvgQueue width={15} height={15}/>
      </GraphButton_1.GraphButton>
      <GraphButton_1.GraphButton title={customReportItems.mode === 'total'
            ? t('Bar Graph')
            : t('Stacked Bar Graph')} selected={customReportItems.graphType === 'BarGraph' ||
            customReportItems.graphType === 'StackedBarGraph'} onSelect={function () {
            onChangeGraph(customReportItems.mode === 'total' ? 'BarGraph' : 'StackedBarGraph');
        }} style={{ marginRight: 15 }} disabled={isItemDisabled(customReportItems.mode === 'total' ? 'BarGraph' : 'StackedBarGraph')}>
        <v1_1.SvgChartBar width={15} height={15}/>
      </GraphButton_1.GraphButton>
      <GraphButton_1.GraphButton title={t('Line Graph')} selected={customReportItems.graphType === 'LineGraph'} onSelect={function () {
            onChangeGraph('LineGraph');
        }} style={{ marginRight: 15 }} disabled={isItemDisabled('LineGraph')}>
        <v1_1.SvgChart width={15} height={15}/>
      </GraphButton_1.GraphButton>
      <GraphButton_1.GraphButton title={t('Area Graph')} selected={customReportItems.graphType === 'AreaGraph'} onSelect={function () {
            onChangeGraph('AreaGraph');
        }} style={{ marginRight: 15 }} disabled={isItemDisabled('AreaGraph')}>
        <v1_1.SvgChartArea width={15} height={15}/>
      </GraphButton_1.GraphButton>
      <GraphButton_1.GraphButton title={t('Donut Graph')} selected={customReportItems.graphType === 'DonutGraph'} onSelect={function () {
            onChangeGraph('DonutGraph');
        }} style={{ marginRight: 15 }} disabled={isItemDisabled('DonutGraph')}>
        <v1_1.SvgChartPie width={15} height={15}/>
      </GraphButton_1.GraphButton>
      <view_1.View style={{
            width: 1,
            height: 30,
            backgroundColor: theme_1.theme.pillBorderDark,
            marginRight: 15,
            flexShrink: 0,
        }}/>
      <GraphButton_1.GraphButton selected={viewLegend} onSelect={function () {
            onChangeViews('viewLegend');
        }} style={{ marginRight: 15 }} title={t('Show Legend')} disabled={isItemDisabled('ShowLegend')}>
        <v1_1.SvgListBullet width={15} height={15}/>
      </GraphButton_1.GraphButton>
      <GraphButton_1.GraphButton selected={viewSummary} onSelect={function () {
            onChangeViews('viewSummary');
        }} style={{ marginRight: 15 }} title={t('Show Summary')}>
        <v1_1.SvgCalculator width={15} height={15}/>
      </GraphButton_1.GraphButton>
      <GraphButton_1.GraphButton selected={viewLabels} onSelect={function () {
            onChangeViews('viewLabels');
        }} style={{ marginRight: 15 }} title={t('Show Labels')} disabled={isItemDisabled('ShowLabels')}>
        <v1_1.SvgTag width={15} height={15}/>
      </GraphButton_1.GraphButton>
      <view_1.View style={{
            width: 1,
            height: 30,
            backgroundColor: theme_1.theme.pillBorderDark,
            marginRight: 15,
            flexShrink: 0,
        }}/>
      <SnapshotButton_1.SnapshotButton style={{ marginRight: 15 }} title={t('Download Snapshot')} onSelect={downloadSnapshot}>
        <v1_1.SvgCamera width={15} height={15}/>
      </SnapshotButton_1.SnapshotButton>
      <view_1.View style={{
            width: 1,
            height: 30,
            backgroundColor: theme_1.theme.pillBorderDark,
            marginRight: 15,
            flexShrink: 0,
        }}/>
      <space_between_1.SpaceBetween style={{
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            flex: 1,
        }}>
        <FiltersMenu_1.FilterButton compact hover onApply={function (e) {
            var _a;
            (0, setSessionReport_1.setSessionReport)('conditions', __spreadArray(__spreadArray([], ((_a = customReportItems.conditions) !== null && _a !== void 0 ? _a : []), true), [
                e,
            ], false));
            onApplyFilter(e);
            onReportChange({ type: 'modify' });
        }} exclude={[]}/>
        <SaveReport_1.SaveReport customReportItems={customReportItems} report={report} savedStatus={savedStatus} onReportChange={onReportChange}/>
      </space_between_1.SpaceBetween>
    </view_1.View>);
}
