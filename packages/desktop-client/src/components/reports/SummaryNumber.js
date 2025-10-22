"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryNumber = SummaryNumber;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var view_1 = require("@actual-app/components/view");
var debounce_1 = require("lodash/debounce");
var chart_theme_1 = require("./chart-theme");
var LoadingIndicator_1 = require("./LoadingIndicator");
var PrivacyFilter_1 = require("@desktop-client/components/PrivacyFilter");
var useFormat_1 = require("@desktop-client/hooks/useFormat");
var useMergedRefs_1 = require("@desktop-client/hooks/useMergedRefs");
var useResizeObserver_1 = require("@desktop-client/hooks/useResizeObserver");
var FONT_SIZE_SCALE_FACTOR = 1.6;
var CONTAINER_MARGIN = 8;
function SummaryNumber(_a) {
    var value = _a.value, contentType = _a.contentType, _b = _a.animate, animate = _b === void 0 ? false : _b, _c = _a.suffix, suffix = _c === void 0 ? '' : _c, _d = _a.loading, loading = _d === void 0 ? true : _d, _e = _a.initialFontSize, initialFontSize = _e === void 0 ? 14 : _e, fontSizeChanged = _a.fontSizeChanged;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _f = (0, react_1.useState)(initialFontSize), fontSize = _f[0], setFontSize = _f[1];
    var refDiv = (0, react_1.useRef)(null);
    var format = (0, useFormat_1.useFormat)();
    var displayAmount = contentType === 'percentage'
        ? format(Math.abs(value), 'number')
        : format(Math.abs(Math.round(value)), 'financial');
    displayAmount += suffix;
    var handleResize = (0, debounce_1.default)(function () {
        if (!refDiv.current)
            return;
        var _a = refDiv.current, clientWidth = _a.clientWidth, clientHeight = _a.clientHeight;
        var width = clientWidth; // no margin required on left and right
        var height = clientHeight - CONTAINER_MARGIN * 2; // account for margin top and bottom
        var calculatedFontSize = Math.min((width * FONT_SIZE_SCALE_FACTOR) / displayAmount.toString().length, height);
        setFontSize(calculatedFontSize);
        if (calculatedFontSize !== initialFontSize && fontSizeChanged) {
            fontSizeChanged(calculatedFontSize);
        }
    }, 100);
    var ref = (0, useResizeObserver_1.useResizeObserver)(handleResize);
    var mergedRef = (0, useMergedRefs_1.useMergedRefs)(ref, refDiv);
    return (<>
      {loading && <LoadingIndicator_1.LoadingIndicator />}
      {!loading && (<view_1.View ref={mergedRef} role="text" aria-label={value < 0
                ? t('Negative amount: {{amount}}', { amount: displayAmount })
                : t('Positive amount: {{amount}}', { amount: displayAmount })} style={{
                alignItems: 'center',
                flexGrow: 1,
                flexShrink: 1,
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                fontSize: fontSize,
                lineHeight: 1,
                margin: "".concat(CONTAINER_MARGIN, "px 0"),
                justifyContent: 'center',
                transition: animate ? 'font-size 0.3s ease' : '',
                color: value < 0 ? chart_theme_1.chartTheme.colors.red : chart_theme_1.chartTheme.colors.blue,
            }}>
          <span aria-hidden="true">
            <PrivacyFilter_1.PrivacyFilter>{displayAmount}</PrivacyFilter_1.PrivacyFilter>
          </span>
        </view_1.View>)}
    </>);
}
