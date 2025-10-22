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
exports.CalendarGraph = CalendarGraph;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var view_1 = require("@actual-app/components/view");
var date_fns_1 = require("date-fns");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var chart_theme_1 = require("@desktop-client/components/reports/chart-theme");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useResizeObserver_1 = require("@desktop-client/hooks/useResizeObserver");
function CalendarGraph(_a) {
    var data = _a.data, start = _a.start, firstDayOfWeekIdx = _a.firstDayOfWeekIdx, isEditing = _a.isEditing, onDayClick = _a.onDayClick;
    var format = (0, useFormat_1.useFormat)();
    var startingDate = (0, date_fns_1.startOfWeek)(new Date(), {
        weekStartsOn: firstDayOfWeekIdx !== undefined &&
            !Number.isNaN(parseInt(firstDayOfWeekIdx)) &&
            parseInt(firstDayOfWeekIdx) >= 0 &&
            parseInt(firstDayOfWeekIdx) <= 6
            ? parseInt(firstDayOfWeekIdx)
            : 0,
    });
    var _b = (0, react_1.useState)(14), fontSize = _b[0], setFontSize = _b[1];
    var buttonRef = (0, useResizeObserver_1.useResizeObserver)(function (rect) {
        var newValue = Math.floor(rect.height / 2);
        if (newValue > 14) {
            setFontSize(14);
        }
        else {
            setFontSize(newValue);
        }
    });
    return (<>
      <view_1.View style={{
            color: theme_1.theme.pageTextSubdued,
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridAutoRows: '1fr',
            gap: 2,
        }} onClick={function () { return onDayClick(null); }}>
        {Array.from({ length: 7 }, function (_, index) { return (<view_1.View key={index} style={{
                textAlign: 'center',
                fontSize: 14,
                fontWeight: 500,
                padding: '3px 0',
                height: '100%',
                width: '100%',
                position: 'relative',
                marginBottom: 4,
            }}>
            {(0, date_fns_1.format)((0, date_fns_1.addDays)(startingDate, index), 'EEEEE')}
          </view_1.View>); })}
      </view_1.View>
      <view_1.View style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridAutoRows: '1fr',
            gap: 2,
            width: '100%',
            height: '100%',
            zIndex: isEditing ? -1 : 'auto', // Prevents interaction with calendar buttons when editing dashboard.
        }}>
        {data.map(function (day, index) {
            return !(0, date_fns_1.isSameMonth)(day.date, (0, date_fns_1.startOfMonth)(start)) ? (<view_1.View key={"empty-".concat(day.date.getTime())} onClick={function () { return onDayClick(null); }}/>) : day.incomeValue !== 0 || day.expenseValue !== 0 ? (<tooltip_1.Tooltip key={day.date.getTime()} content={<view_1.View>
                  <view_1.View style={{ marginBottom: 10 }}>
                    <strong>{(0, date_fns_1.format)(day.date, 'MMM dd')}</strong>
                  </view_1.View>
                  <view_1.View style={{ lineHeight: 1.5 }}>
                    <view_1.View style={{
                        display: 'grid',
                        gridTemplateColumns: '70px 1fr 60px',
                        gridAutoRows: '1fr',
                    }}>
                      <view_1.View style={{
                        textAlign: 'right',
                        marginRight: 4,
                    }}>
                        <react_i18next_1.Trans>Income:</react_i18next_1.Trans>
                      </view_1.View>
                      <view_1.View style={{
                        color: chart_theme_1.chartTheme.colors.blue,
                        flexDirection: 'row',
                    }}>
                        {day.incomeValue !== 0 ? (<PrivacyFilter_1.PrivacyFilter>
                            {format(day.incomeValue, 'financial')}
                          </PrivacyFilter_1.PrivacyFilter>) : ('')}
                      </view_1.View>
                      <view_1.View style={{ marginLeft: 4, flexDirection: 'row' }}>
                        (
                        <PrivacyFilter_1.PrivacyFilter>
                          {Math.round(day.incomeSize * 100) / 100 + '%'}
                        </PrivacyFilter_1.PrivacyFilter>
                        )
                      </view_1.View>
                      <view_1.View style={{
                        textAlign: 'right',
                        marginRight: 4,
                    }}>
                        <react_i18next_1.Trans>Expenses:</react_i18next_1.Trans>
                      </view_1.View>
                      <view_1.View style={{
                        color: chart_theme_1.chartTheme.colors.red,
                        flexDirection: 'row',
                    }}>
                        {day.expenseValue !== 0 ? (<PrivacyFilter_1.PrivacyFilter>
                            {format(day.expenseValue, 'financial')}
                          </PrivacyFilter_1.PrivacyFilter>) : ('')}
                      </view_1.View>
                      <view_1.View style={{ marginLeft: 4, flexDirection: 'row' }}>
                        (
                        <PrivacyFilter_1.PrivacyFilter>
                          {Math.round(day.expenseSize * 100) / 100 + '%'}
                        </PrivacyFilter_1.PrivacyFilter>
                        )
                      </view_1.View>
                    </view_1.View>
                  </view_1.View>
                </view_1.View>} placement="bottom end" style={__assign(__assign({}, styles_1.styles.tooltip), { lineHeight: 1.5, padding: '6px 10px' })}>
              <DayButton key={day.date.getTime()} resizeRef={function (el) {
                    if (index === 15 && el) {
                        buttonRef(el);
                    }
                }} fontSize={fontSize} day={day} onPress={function () { return onDayClick(day.date); }}/>
            </tooltip_1.Tooltip>) : (<DayButton key={day.date.getTime()} resizeRef={function (el) {
                    if (index === 15 && el) {
                        buttonRef(el);
                    }
                }} fontSize={fontSize} day={day} onPress={function () { return onDayClick(day.date); }}/>);
        })}
      </view_1.View>
    </>);
}
function DayButton(_a) {
    var day = _a.day, onPress = _a.onPress, fontSize = _a.fontSize, resizeRef = _a.resizeRef;
    var _b = (0, react_1.useState)(fontSize), currentFontSize = _b[0], setCurrentFontSize = _b[1];
    (0, react_1.useEffect)(function () {
        setCurrentFontSize(fontSize);
    }, [fontSize]);
    return (<button_1.Button ref={resizeRef} aria-label={(0, date_fns_1.format)(day.date, 'MMMM d, yyyy')} style={{
            borderColor: 'transparent',
            backgroundColor: theme_1.theme.calendarCellBackground,
            position: 'relative',
            padding: 'unset',
            height: '100%',
            minWidth: 0,
            minHeight: 0,
            margin: 0,
        }} onPress={function () { return onPress(); }}>
      {day.expenseSize !== 0 && (<view_1.View style={{
                position: 'absolute',
                width: '50%',
                height: '100%',
                background: chart_theme_1.chartTheme.colors.red,
                opacity: 0.2,
                right: 0,
            }}/>)}
      {day.incomeSize !== 0 && (<view_1.View style={{
                position: 'absolute',
                width: '50%',
                height: '100%',
                background: chart_theme_1.chartTheme.colors.blue,
                opacity: 0.2,
                left: 0,
            }}/>)}
      <view_1.View style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            opacity: 0.9,
            height: "".concat(Math.ceil(day.incomeSize), "%"),
            backgroundColor: chart_theme_1.chartTheme.colors.blue,
            width: '50%',
            transition: 'height 0.5s ease-out',
        }}/>

      <view_1.View style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            opacity: 0.9,
            height: "".concat(Math.ceil(day.expenseSize), "%"),
            backgroundColor: chart_theme_1.chartTheme.colors.red,
            width: '50%',
            transition: 'height 0.5s ease-out',
        }}/>
      <span style={{
            fontSize: "".concat(currentFontSize, "px"),
            fontWeight: 500,
            position: 'relative',
        }}>
        {(0, date_fns_1.getDate)(day.date)}
      </span>
    </button_1.Button>);
}
