"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportSidebar = ReportSidebar;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var select_1 = require("@actual-app/components/select");
var space_between_1 = require("@actual-app/components/space-between");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var view_1 = require("@actual-app/components/view");
var monthUtils = require("loot-core/shared/months");
var CategorySelector_1 = require("./CategorySelector");
var disabledList_1 = require("./disabledList");
var getLiveRange_1 = require("./getLiveRange");
var ModeButton_1 = require("./ModeButton");
var ReportOptions_1 = require("./ReportOptions");
var reportRanges_1 = require("./reportRanges");
var setSessionReport_1 = require("./setSessionReport");
var alerts_1 = require("@desktop-client/components/alerts");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
function ReportSidebar(_a) {
    var _b, _c, _d, _e;
    var customReportItems = _a.customReportItems, selectedCategories = _a.selectedCategories, categories = _a.categories, dateRangeLine = _a.dateRangeLine, allIntervals = _a.allIntervals, setDateRange = _a.setDateRange, setGraphType = _a.setGraphType, setGroupBy = _a.setGroupBy, setInterval = _a.setInterval, setBalanceType = _a.setBalanceType, setSortBy = _a.setSortBy, setMode = _a.setMode, setIsDateStatic = _a.setIsDateStatic, setShowEmpty = _a.setShowEmpty, setShowOffBudget = _a.setShowOffBudget, setShowHiddenCategories = _a.setShowHiddenCategories, setIncludeCurrentInterval = _a.setIncludeCurrentInterval, setShowUncategorized = _a.setShowUncategorized, setTrimIntervals = _a.setTrimIntervals, setSelectedCategories = _a.setSelectedCategories, onChangeDates = _a.onChangeDates, onReportChange = _a.onReportChange, disabledItems = _a.disabledItems, defaultItems = _a.defaultItems, defaultModeItems = _a.defaultModeItems, earliestTransaction = _a.earliestTransaction, latestTransaction = _a.latestTransaction, firstDayOfWeekIdx = _a.firstDayOfWeekIdx, _f = _a.isComplexCategoryCondition, isComplexCategoryCondition = _f === void 0 ? false : _f;
    var t = (0, react_i18next_1.useTranslation)().t;
    var locale = (0, useLocale_1.useLocale)();
    var _g = (0, react_1.useState)(false), menuOpen = _g[0], setMenuOpen = _g[1];
    var triggerRef = (0, react_1.useRef)(null);
    var onSelectRange = function (cond) {
        (0, setSessionReport_1.setSessionReport)('dateRange', cond);
        onReportChange({ type: 'modify' });
        setDateRange(cond);
        onChangeDates.apply(void 0, (0, getLiveRange_1.getLiveRange)(cond, earliestTransaction, latestTransaction, customReportItems.includeCurrentInterval, firstDayOfWeekIdx));
    };
    var _h = (0, react_1.useMemo)(function () {
        var rangeType = (ReportOptions_1.ReportOptions.dateRangeType.get(customReportItems.dateRange) || '').toLowerCase();
        var text = t('Include current period');
        var tooltip = t('Include current period in live range');
        if (rangeType === 'month') {
            text = t('Include current Month');
            tooltip = t('Include current Month in live range');
        }
        else if (rangeType === 'year') {
            text = t('Include current Year');
            tooltip = t('Include current Year in live range');
        }
        return [text, tooltip];
    }, [customReportItems.dateRange, t]), includeCurrentIntervalText = _h[0], includeCurrentIntervalTooltip = _h[1];
    var onChangeMode = function (cond) {
        (0, setSessionReport_1.setSessionReport)('mode', cond);
        onReportChange({ type: 'modify' });
        setMode(cond);
        var graph = '';
        if (cond === 'time') {
            if (customReportItems.graphType === 'BarGraph') {
                (0, setSessionReport_1.setSessionReport)('graphType', 'StackedBarGraph');
                setGraphType('StackedBarGraph');
                graph = 'StackedBarGraph';
            }
        }
        else {
            if (customReportItems.graphType === 'StackedBarGraph') {
                (0, setSessionReport_1.setSessionReport)('graphType', 'BarGraph');
                setGraphType('BarGraph');
                graph = 'BarGraph';
            }
        }
        defaultModeItems(graph, cond);
    };
    var onChangeSplit = function (cond) {
        (0, setSessionReport_1.setSessionReport)('groupBy', cond);
        onReportChange({ type: 'modify' });
        setGroupBy(cond);
        defaultItems(cond);
    };
    var onChangeBalanceType = function (cond) {
        (0, setSessionReport_1.setSessionReport)('balanceType', cond);
        onReportChange({ type: 'modify' });
        setBalanceType(cond);
    };
    var onChangeSortBy = function (cond) {
        cond !== null && cond !== void 0 ? cond : (cond = 'desc');
        (0, setSessionReport_1.setSessionReport)('sortBy', cond);
        onReportChange({ type: 'modify' });
        setSortBy(cond);
    };
    var rangeOptions = (0, react_1.useMemo)(function () {
        var options = ReportOptions_1.ReportOptions.dateRange
            .filter(function (f) { return f[customReportItems.interval]; })
            .map(function (option) { return [option.key, option.description]; });
        // Append separator if necessary
        if (dateRangeLine > 0) {
            options.splice(dateRangeLine, 0, menu_1.Menu.line);
        }
        return options;
    }, [customReportItems, dateRangeLine]);
    var disableSort = customReportItems.graphType !== 'TableGraph' &&
        (customReportItems.groupBy === 'Interval' ||
            ((_e = (_d = (_c = (_b = disabledList_1.disabledList === null || disabledList_1.disabledList === void 0 ? void 0 : disabledList_1.disabledList.mode) === null || _b === void 0 ? void 0 : _b.find(function (m) { return m.description === customReportItems.mode; })) === null || _c === void 0 ? void 0 : _c.graphs.find(function (g) { return g.description === customReportItems.graphType; })) === null || _d === void 0 ? void 0 : _d.disableSort) !== null && _e !== void 0 ? _e : false));
    return (<view_1.View style={{
            minWidth: 225,
            maxWidth: 250,
            paddingTop: 10,
            paddingRight: 10,
            flexShrink: 0,
            overflowY: 'auto',
        }}>
      <view_1.View style={{ flexShrink: 0 }}>
        <view_1.View style={{
            flexDirection: 'row',
            marginBottom: 5,
            alignItems: 'center',
        }}>
          <text_1.Text>
            <strong>
              <react_i18next_1.Trans>Display</react_i18next_1.Trans>
            </strong>
          </text_1.Text>
        </view_1.View>
        <space_between_1.SpaceBetween gap={5} style={{
            padding: 5,
        }}>
          <text_1.Text style={{ width: 50, textAlign: 'right' }}>
            <react_i18next_1.Trans>Mode:</react_i18next_1.Trans>
          </text_1.Text>
          <ModeButton_1.ModeButton selected={customReportItems.mode === 'total'} onSelect={function () { return onChangeMode('total'); }}>
            <react_i18next_1.Trans>Total</react_i18next_1.Trans>
          </ModeButton_1.ModeButton>
          <ModeButton_1.ModeButton selected={customReportItems.mode === 'time'} onSelect={function () { return onChangeMode('time'); }}>
            <react_i18next_1.Trans>Time</react_i18next_1.Trans>
          </ModeButton_1.ModeButton>
        </space_between_1.SpaceBetween>

        <view_1.View style={{
            flexDirection: 'row',
            padding: 5,
            alignItems: 'center',
        }}>
          <text_1.Text style={{ width: 50, textAlign: 'right', marginRight: 5 }}>
            <react_i18next_1.Trans>Split:</react_i18next_1.Trans>
          </text_1.Text>
          <select_1.Select value={customReportItems.groupBy} onChange={function (e) { return onChangeSplit(e); }} options={ReportOptions_1.ReportOptions.groupBy.map(function (option) { return [
            option.key,
            option.description,
        ]; })} disabledKeys={disabledItems('split')}/>
        </view_1.View>

        <view_1.View style={{
            flexDirection: 'row',
            padding: 5,
            alignItems: 'center',
        }}>
          <text_1.Text style={{ width: 50, textAlign: 'right', marginRight: 5 }}>
            <react_i18next_1.Trans>Type:</react_i18next_1.Trans>
          </text_1.Text>
          <select_1.Select value={customReportItems.balanceType} onChange={function (e) { return onChangeBalanceType(e); }} options={ReportOptions_1.ReportOptions.balanceType.map(function (option) { return [
            option.key,
            option.description,
        ]; })} disabledKeys={disabledItems('type')}/>
        </view_1.View>
        <view_1.View style={{
            flexDirection: 'row',
            padding: 5,
            alignItems: 'center',
        }}>
          <text_1.Text style={{ width: 50, textAlign: 'right', marginRight: 5 }}>
            <react_i18next_1.Trans>Interval:</react_i18next_1.Trans>
          </text_1.Text>
          <select_1.Select value={customReportItems.interval} onChange={function (e) {
            (0, setSessionReport_1.setSessionReport)('interval', e);
            setInterval(e);
            onReportChange({ type: 'modify' });
            if (ReportOptions_1.ReportOptions.dateRange
                .filter(function (d) { return !d[e]; })
                .map(function (int) { return int.key; })
                .includes(customReportItems.dateRange)) {
                onSelectRange(disabledList_1.defaultsList.intervalRange.get(e) || '');
            }
        }} options={ReportOptions_1.ReportOptions.interval.map(function (option) { return [
            option.key,
            option.description,
        ]; })} disabledKeys={[]}/>
        </view_1.View>

        {!disableSort && (<view_1.View style={{
                flexDirection: 'row',
                padding: 5,
                alignItems: 'center',
            }}>
            <text_1.Text style={{ width: 50, textAlign: 'right', marginRight: 5 }}>
              <react_i18next_1.Trans>Sort:</react_i18next_1.Trans>
            </text_1.Text>
            <select_1.Select value={customReportItems.sortBy} onChange={function (e) { return onChangeSortBy(e); }} options={ReportOptions_1.ReportOptions.sortBy.map(function (option) { return [
                option.format,
                option.description,
            ]; })} disabledKeys={disabledItems('sort')}/>
          </view_1.View>)}

        <view_1.View style={{
            flexDirection: 'row',
            padding: 5,
            alignItems: 'center',
        }}>
          <text_1.Text style={{ width: 50, textAlign: 'right', marginRight: 5 }}/>
          <button_1.Button ref={triggerRef} onPress={function () {
            setMenuOpen(true);
        }} style={{
            color: 'currentColor',
            padding: '5px 10px',
        }}>
            <react_i18next_1.Trans>Options</react_i18next_1.Trans>
          </button_1.Button>
          <popover_1.Popover triggerRef={triggerRef} placement="bottom start" isOpen={menuOpen} onOpenChange={function () { return setMenuOpen(false); }}>
            <menu_1.Menu onMenuSelect={function (type) {
            onReportChange({ type: 'modify' });
            if (type === 'include-current-interval') {
                (0, setSessionReport_1.setSessionReport)('includeCurrentInterval', !customReportItems.includeCurrentInterval);
                setIncludeCurrentInterval(!customReportItems.includeCurrentInterval);
            }
            else if (type === 'show-hidden-categories') {
                (0, setSessionReport_1.setSessionReport)('showHiddenCategories', !customReportItems.showHiddenCategories);
                setShowHiddenCategories(!customReportItems.showHiddenCategories);
            }
            else if (type === 'show-off-budget') {
                (0, setSessionReport_1.setSessionReport)('showOffBudget', !customReportItems.showOffBudget);
                setShowOffBudget(!customReportItems.showOffBudget);
            }
            else if (type === 'show-empty-items') {
                (0, setSessionReport_1.setSessionReport)('showEmpty', !customReportItems.showEmpty);
                setShowEmpty(!customReportItems.showEmpty);
            }
            else if (type === 'show-uncategorized') {
                (0, setSessionReport_1.setSessionReport)('showUncategorized', !customReportItems.showUncategorized);
                setShowUncategorized(!customReportItems.showUncategorized);
            }
            else if (type === 'trim-intervals') {
                (0, setSessionReport_1.setSessionReport)('trimIntervals', !customReportItems.trimIntervals);
                setTrimIntervals(!customReportItems.trimIntervals);
            }
        }} items={[
            {
                name: 'include-current-interval',
                text: includeCurrentIntervalText,
                tooltip: includeCurrentIntervalTooltip,
                toggle: customReportItems.includeCurrentInterval,
                disabled: customReportItems.isDateStatic ||
                    disabledList_1.disabledList.currentInterval.get(customReportItems.dateRange),
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
        ]}/>
          </popover_1.Popover>
        </view_1.View>
        <view_1.View style={{
            height: 1,
            backgroundColor: theme_1.theme.pillBorderDark,
            marginTop: 10,
            flexShrink: 0,
        }}/>
        <space_between_1.SpaceBetween gap={5} style={{
            marginTop: 10,
            marginBottom: 5,
        }}>
          <text_1.Text>
            <strong>
              <react_i18next_1.Trans>Date filters</react_i18next_1.Trans>
            </strong>
          </text_1.Text>
          <view_1.View style={{ flex: 1 }}/>
          <ModeButton_1.ModeButton selected={!customReportItems.isDateStatic} onSelect={function () {
            (0, setSessionReport_1.setSessionReport)('isDateStatic', false);
            setIsDateStatic(false);
            onSelectRange(customReportItems.dateRange);
        }}>
            <react_i18next_1.Trans>Live</react_i18next_1.Trans>
          </ModeButton_1.ModeButton>
          <ModeButton_1.ModeButton selected={customReportItems.isDateStatic} onSelect={function () {
            (0, setSessionReport_1.setSessionReport)('isDateStatic', true);
            setIsDateStatic(true);
            onChangeDates(customReportItems.startDate, customReportItems.endDate, 'static');
        }}>
            <react_i18next_1.Trans>Static</react_i18next_1.Trans>
          </ModeButton_1.ModeButton>
        </space_between_1.SpaceBetween>
        {!customReportItems.isDateStatic ? (<view_1.View style={{
                flexDirection: 'row',
                padding: 5,
                alignItems: 'center',
            }}>
            <text_1.Text style={{ width: 50, textAlign: 'right', marginRight: 5 }}>
              <react_i18next_1.Trans>Range:</react_i18next_1.Trans>
            </text_1.Text>
            <select_1.Select value={customReportItems.dateRange} onChange={onSelectRange} options={rangeOptions}/>
            {!disabledList_1.disabledList.currentInterval.get(customReportItems.dateRange) &&
                customReportItems.includeCurrentInterval && (<tooltip_1.Tooltip placement="bottom start" content={<text_1.Text>
                      <react_i18next_1.Trans>Current month</react_i18next_1.Trans>
                    </text_1.Text>} style={__assign(__assign({}, styles_1.styles.tooltip), { lineHeight: 1.5, padding: '6px 10px', marginTop: 5 })}>
                  <text_1.Text style={{ marginLeft: 10 }}>+1</text_1.Text>
                </tooltip_1.Tooltip>)}
          </view_1.View>) : (<>
            <view_1.View style={{
                flexDirection: 'row',
                padding: 5,
                alignItems: 'center',
            }}>
              <text_1.Text style={{ width: 50, textAlign: 'right', marginRight: 5 }}>
                <react_i18next_1.Trans>From:</react_i18next_1.Trans>
              </text_1.Text>
              <select_1.Select onChange={function (newValue) {
                return onChangeDates.apply(void 0, (0, reportRanges_1.validateStart)(earliestTransaction, latestTransaction, newValue, customReportItems.endDate, customReportItems.interval, firstDayOfWeekIdx));
            }} value={customReportItems.startDate} defaultLabel={monthUtils.format(customReportItems.startDate, ReportOptions_1.ReportOptions.intervalFormat.get(customReportItems.interval) || '', locale)} options={allIntervals.map(function (_a) {
            var name = _a.name, pretty = _a.pretty;
            return [name, pretty];
        })}/>
            </view_1.View>
            <view_1.View style={{
                flexDirection: 'row',
                padding: 5,
                alignItems: 'center',
            }}>
              <text_1.Text style={{ width: 50, textAlign: 'right', marginRight: 5 }}>
                <react_i18next_1.Trans>To:</react_i18next_1.Trans>
              </text_1.Text>
              <select_1.Select onChange={function (newValue) {
                return onChangeDates.apply(void 0, (0, reportRanges_1.validateEnd)(earliestTransaction, latestTransaction, customReportItems.startDate, newValue, customReportItems.interval, firstDayOfWeekIdx));
            }} value={customReportItems.endDate} defaultLabel={monthUtils.format(customReportItems.endDate, ReportOptions_1.ReportOptions.intervalFormat.get(customReportItems.interval) || '', locale)} options={allIntervals.map(function (_a) {
            var name = _a.name, pretty = _a.pretty;
            return [name, pretty];
        })}/>
            </view_1.View>
          </>)}
        <view_1.View style={{
            height: 1,
            backgroundColor: theme_1.theme.pillBorderDark,
            marginTop: 10,
            flexShrink: 0,
        }}/>
      </view_1.View>
      <view_1.View style={{
            marginTop: 10,
            minHeight: 200,
        }}>
        {isComplexCategoryCondition ? (<alerts_1.Information>
            <react_i18next_1.Trans>
              Remove active category filters to show the category selector.
            </react_i18next_1.Trans>
          </alerts_1.Information>) : (<CategorySelector_1.CategorySelector categoryGroups={categories.grouped.filter(function (f) {
                return customReportItems.showHiddenCategories || !f.hidden
                    ? true
                    : false;
            })} selectedCategories={selectedCategories || []} setSelectedCategories={function (e) {
                setSelectedCategories(e);
                onReportChange({ type: 'modify' });
            }} showHiddenCategories={customReportItems.showHiddenCategories}/>)}
      </view_1.View>
    </view_1.View>);
}
