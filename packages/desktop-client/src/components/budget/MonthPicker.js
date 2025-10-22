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
exports.MonthPicker = void 0;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var monthUtils = require("loot-core/shared/months");
var Link_1 = require("@desktop-client/components/common/Link");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useResizeObserver_1 = require("@desktop-client/hooks/useResizeObserver");
var MonthPicker = function (_a) {
    var startMonth = _a.startMonth, numDisplayed = _a.numDisplayed, monthBounds = _a.monthBounds, style = _a.style, onSelect = _a.onSelect;
    var locale = (0, useLocale_1.useLocale)();
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, react_1.useState)(null), hoverId = _b[0], setHoverId = _b[1];
    var _c = (0, react_1.useState)(12), targetMonthCount = _c[0], setTargetMonthCount = _c[1];
    var currentMonth = monthUtils.currentMonth();
    var firstSelectedMonth = startMonth;
    var lastSelectedMonth = monthUtils.addMonths(firstSelectedMonth, numDisplayed - 1);
    var range = monthUtils.rangeInclusive(monthUtils.subMonths(firstSelectedMonth, Math.floor(targetMonthCount / 2 - numDisplayed / 2)), monthUtils.addMonths(lastSelectedMonth, Math.floor(targetMonthCount / 2 - numDisplayed / 2)));
    var firstSelectedIndex = Math.floor(range.length / 2) - Math.floor(numDisplayed / 2);
    var lastSelectedIndex = firstSelectedIndex + numDisplayed - 1;
    var _d = (0, react_1.useState)('small'), size = _d[0], setSize = _d[1];
    var containerRef = (0, useResizeObserver_1.useResizeObserver)(function (rect) {
        setSize(rect.width <= 400 ? 'small' : 'big');
        setTargetMonthCount(Math.min(Math.max(Math.floor(rect.width / 50), 12), 24));
    });
    var yearHeadersShown = [];
    return (<view_1.View style={__assign({ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, style)}>
      <view_1.View innerRef={containerRef} style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
        <Link_1.Link variant="button" buttonVariant="bare" onPress={function () { return onSelect(currentMonth); }} style={{
            padding: '3px 3px',
            marginRight: '12px',
        }}>
          <view_1.View title={t('Today')}>
            <v2_1.SvgCalendar style={{
            width: 16,
            height: 16,
        }}/>
          </view_1.View>
        </Link_1.Link>
        <Link_1.Link variant="button" buttonVariant="bare" onPress={function () { return onSelect(monthUtils.prevMonth(startMonth)); }} style={{
            padding: '3px 3px',
            marginRight: '12px',
        }}>
          <view_1.View title={t('Previous month')}>
            <v1_1.SvgCheveronLeft style={{
            width: 16,
            height: 16,
        }}/>
          </view_1.View>
        </Link_1.Link>
        {range.map(function (month, idx) {
            var monthName = monthUtils.format(month, 'MMM', locale);
            var selected = idx >= firstSelectedIndex && idx <= lastSelectedIndex;
            var lastHoverId = hoverId + numDisplayed - 1;
            var hovered = hoverId === null ? false : idx >= hoverId && idx <= lastHoverId;
            var current = currentMonth === month;
            var year = monthUtils.getYear(month);
            var showYearHeader = false;
            if (!yearHeadersShown.includes(year)) {
                yearHeadersShown.push(year);
                showYearHeader = true;
            }
            var isMonthBudgeted = month >= monthBounds.start && month <= monthBounds.end;
            return (<view_1.View key={month} style={__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({ alignItems: 'center', padding: '3px 3px', width: size === 'big' ? '35px' : '20px', textAlign: 'center', userSelect: 'none', cursor: 'default', borderRadius: 2, border: 'none' }, (!isMonthBudgeted && {
                    textDecoration: 'line-through',
                    color: theme_1.theme.pageTextSubdued,
                })), styles_1.styles.smallText), (selected && {
                    backgroundColor: theme_1.theme.tableBorderHover,
                    color: theme_1.theme.buttonPrimaryText,
                })), ((hovered || selected) && {
                    borderRadius: 0,
                    cursor: 'pointer',
                })), (hoverId !== null &&
                    !hovered &&
                    selected && {
                    filter: 'brightness(65%)',
                })), (hovered &&
                    !selected && {
                    backgroundColor: theme_1.theme.buttonBareBackgroundHover,
                })), (!hovered &&
                    !selected &&
                    current && {
                    backgroundColor: theme_1.theme.buttonBareBackgroundHover,
                    filter: 'brightness(120%)',
                })), (hovered &&
                    selected &&
                    current && {
                    filter: 'brightness(120%)',
                })), (hovered &&
                    selected && {
                    backgroundColor: theme_1.theme.tableBorderHover,
                })), ((idx === firstSelectedIndex ||
                    (idx === hoverId && !selected)) && {
                    borderTopLeftRadius: 2,
                    borderBottomLeftRadius: 2,
                })), ((idx === lastSelectedIndex ||
                    (idx === lastHoverId && !selected)) && {
                    borderTopRightRadius: 2,
                    borderBottomRightRadius: 2,
                })), (current && { fontWeight: 'bold' }))} onClick={function () { return onSelect(month); }} onMouseEnter={function () { return setHoverId(idx); }} onMouseLeave={function () { return setHoverId(null); }}>
              <view_1.View>
                {size === 'small' ? monthName[0] : monthName}
                {showYearHeader && (<view_1.View style={{
                        position: 'absolute',
                        top: -16,
                        left: 0,
                        fontSize: 10,
                        fontWeight: 'bold',
                        color: isMonthBudgeted
                            ? theme_1.theme.pageText
                            : theme_1.theme.pageTextSubdued,
                    }}>
                    {year}
                  </view_1.View>)}
              </view_1.View>
            </view_1.View>);
        })}
        <Link_1.Link variant="button" buttonVariant="bare" onPress={function () { return onSelect(monthUtils.nextMonth(startMonth)); }} style={{
            padding: '3px 3px',
            marginLeft: '12px',
        }}>
          <view_1.View title={t('Next month')}>
            <v1_1.SvgCheveronRight style={{
            width: 16,
            height: 16,
        }}/>
          </view_1.View>
        </Link_1.Link>
        {/*Keep range centered*/}
        <span style={{
            width: '22px',
            marginLeft: '12px',
        }}/>
      </view_1.View>
    </view_1.View>);
};
exports.MonthPicker = MonthPicker;
