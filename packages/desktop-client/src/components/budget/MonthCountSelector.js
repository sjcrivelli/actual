"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthCountSelector = MonthCountSelector;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var v2_1 = require("@actual-app/components/icons/v2");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var BudgetMonthCountContext_1 = require("./BudgetMonthCountContext");
function Calendar(_a) {
    var color = _a.color, onClick = _a.onClick;
    return (<v2_1.SvgCalendar style={{ width: 13, height: 13, color: color, marginRight: 5 }} onClick={onClick}/>);
}
function MonthCountSelector(_a) {
    var maxMonths = _a.maxMonths, onChange = _a.onChange;
    var t = (0, react_i18next_1.useTranslation)().t;
    var displayMax = (0, BudgetMonthCountContext_1.useBudgetMonthCount)().displayMax;
    // It doesn't make sense to show anything if we can only fit one
    // month
    if (displayMax <= 1) {
        return null;
    }
    var calendars = [];
    var _loop_1 = function (i) {
        calendars.push(<Calendar key={i} color={maxMonths >= i ? theme_1.theme.pageTextLight : theme_1.theme.pageTextSubdued} onClick={function () { return onChange(i); }}/>);
    };
    for (var i = 1; i <= displayMax; i++) {
        _loop_1(i);
    }
    return (<view_1.View style={{
            flexDirection: 'row',
            marginRight: 20,
            marginTop: -1,
            WebkitAppRegion: 'no-drag',
            '& svg': {
                transition: 'transform .15s',
            },
            '& svg:hover': {
                transform: 'scale(1.2)',
            },
        }} title={t('Choose the number of months shown at a time')}>
      {calendars}
    </view_1.View>);
}
