"use strict";
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
exports.Header = Header;
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var select_1 = require("@actual-app/components/select");
var space_between_1 = require("@actual-app/components/space-between");
var view_1 = require("@actual-app/components/view");
var monthUtils = require("loot-core/shared/months");
var getLiveRange_1 = require("./getLiveRange");
var reportRanges_1 = require("./reportRanges");
var AppliedFilters_1 = require("@desktop-client/components/filters/AppliedFilters");
var FiltersMenu_1 = require("@desktop-client/components/filters/FiltersMenu");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
function Header(_a) {
    var start = _a.start, end = _a.end, mode = _a.mode, show1Month = _a.show1Month, allMonths = _a.allMonths, earliestTransaction = _a.earliestTransaction, latestTransaction = _a.latestTransaction, firstDayOfWeekIdx = _a.firstDayOfWeekIdx, onChangeDates = _a.onChangeDates, filters = _a.filters, conditionsOp = _a.conditionsOp, onApply = _a.onApply, onUpdateFilter = _a.onUpdateFilter, onDeleteFilter = _a.onDeleteFilter, onConditionsOpChange = _a.onConditionsOpChange, children = _a.children, inlineContent = _a.inlineContent;
    var locale = (0, useLocale_1.useLocale)();
    var t = (0, react_i18next_1.useTranslation)().t;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    function convertToMonth(start, end, _, mode) {
        return [monthUtils.getMonth(start), monthUtils.getMonth(end), mode];
    }
    return (<view_1.View style={{
            padding: 20,
            paddingTop: 15,
            flexShrink: 0,
        }}>
      <view_1.View style={{
            display: 'grid',
            alignItems: isNarrowWidth ? 'flex-start' : 'center',
        }}>
        <view_1.View style={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
        }}>
          <space_between_1.SpaceBetween gap={isNarrowWidth ? 5 : undefined}>
            {mode && (<button_1.Button variant={mode === 'static' ? 'normal' : 'primary'} onPress={function () {
                var newMode = mode === 'static' ? 'sliding-window' : 'static';
                var _a = (0, reportRanges_1.calculateTimeRange)({
                    start: start,
                    end: end,
                    mode: newMode,
                }), newStart = _a[0], newEnd = _a[1];
                onChangeDates(newStart, newEnd, newMode);
            }}>
                {mode === 'static' ? t('Static') : t('Live')}
              </button_1.Button>)}

            <space_between_1.SpaceBetween gap={5}>
              <select_1.Select onChange={function (newValue) {
            return onChangeDates.apply(void 0, (0, reportRanges_1.validateStart)(allMonths[allMonths.length - 1].name, allMonths[0].name, newValue, end));
        }} value={start} defaultLabel={monthUtils.format(start, 'MMMM, yyyy', locale)} options={allMonths.map(function (_a) {
        var name = _a.name, pretty = _a.pretty;
        return [name, pretty];
    })}/>
              <view_1.View>{t('to')}</view_1.View>
              <select_1.Select onChange={function (newValue) {
            return onChangeDates.apply(void 0, (0, reportRanges_1.validateEnd)(allMonths[allMonths.length - 1].name, allMonths[0].name, start, newValue));
        }} value={end} options={allMonths.map(function (_a) {
        var name = _a.name, pretty = _a.pretty;
        return [name, pretty];
    })} style={{ marginRight: 10 }}/>
            </space_between_1.SpaceBetween>
          </space_between_1.SpaceBetween>

          <space_between_1.SpaceBetween gap={3}>
            {show1Month && (<button_1.Button variant="bare" onPress={function () { return onChangeDates.apply(void 0, (0, reportRanges_1.getLatestRange)(0)); }}>
                <react_i18next_1.Trans>1 month</react_i18next_1.Trans>
              </button_1.Button>)}
            <button_1.Button variant="bare" onPress={function () { return onChangeDates.apply(void 0, (0, reportRanges_1.getLatestRange)(2)); }}>
              <react_i18next_1.Trans>3 months</react_i18next_1.Trans>
            </button_1.Button>
            <button_1.Button variant="bare" onPress={function () { return onChangeDates.apply(void 0, (0, reportRanges_1.getLatestRange)(5)); }}>
              <react_i18next_1.Trans>6 months</react_i18next_1.Trans>
            </button_1.Button>
            <button_1.Button variant="bare" onPress={function () { return onChangeDates.apply(void 0, (0, reportRanges_1.getLatestRange)(11)); }}>
              <react_i18next_1.Trans>1 year</react_i18next_1.Trans>
            </button_1.Button>
            <button_1.Button variant="bare" onPress={function () {
            return onChangeDates.apply(void 0, convertToMonth.apply(void 0, __spreadArray(__spreadArray([], (0, getLiveRange_1.getLiveRange)('Year to date', earliestTransaction, latestTransaction, true, firstDayOfWeekIdx), false), ['yearToDate'], false)));
        }}>
              <react_i18next_1.Trans>Year to date</react_i18next_1.Trans>
            </button_1.Button>
            <button_1.Button variant="bare" onPress={function () {
            return onChangeDates.apply(void 0, convertToMonth.apply(void 0, __spreadArray(__spreadArray([], (0, getLiveRange_1.getLiveRange)('Last year', earliestTransaction, latestTransaction, false, firstDayOfWeekIdx), false), ['lastYear'], false)));
        }}>
              <react_i18next_1.Trans>Last year</react_i18next_1.Trans>
            </button_1.Button>
            <button_1.Button variant="bare" onPress={function () {
            return onChangeDates.apply(void 0, convertToMonth.apply(void 0, __spreadArray(__spreadArray([], (0, getLiveRange_1.getLiveRange)('Prior year to date', earliestTransaction, latestTransaction, false, firstDayOfWeekIdx), false), ['priorYearToDate'], false)));
        }}>
              <react_i18next_1.Trans>Prior year to date</react_i18next_1.Trans>
            </button_1.Button>
            <button_1.Button variant="bare" onPress={function () {
            return onChangeDates.apply(void 0, (0, reportRanges_1.getFullRange)(allMonths[allMonths.length - 1].name, allMonths[0].name));
        }}>
              <react_i18next_1.Trans>All time</react_i18next_1.Trans>
            </button_1.Button>

            {filters && (<FiltersMenu_1.FilterButton compact={isNarrowWidth} onApply={onApply} hover={false} exclude={undefined}/>)}
          </space_between_1.SpaceBetween>
          <space_between_1.SpaceBetween gap={0}>{inlineContent}</space_between_1.SpaceBetween>
        </view_1.View>

        {children && (<view_1.View style={{
                gridColumn: 2,
                flexDirection: 'row',
                justifySelf: 'flex-end',
                alignSelf: 'flex-start',
            }}>
            {children}
          </view_1.View>)}
      </view_1.View>

      {filters && filters.length > 0 && (<view_1.View style={{ marginTop: 5 }}>
          <AppliedFilters_1.AppliedFilters conditions={filters} onUpdate={onUpdateFilter} onDelete={onDeleteFilter} conditionsOp={conditionsOp} onConditionsOpChange={onConditionsOpChange}/>
        </view_1.View>)}
    </view_1.View>);
}
