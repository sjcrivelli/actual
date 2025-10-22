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
exports.AdvancedToggle = exports.Setting = void 0;
exports.Column = Column;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var tokens_1 = require("@actual-app/components/tokens");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var Link_1 = require("@desktop-client/components/common/Link");
var Setting = function (_a) {
    var primaryAction = _a.primaryAction, style = _a.style, children = _a.children;
    return (<view_1.View className={(0, css_1.css)([
            {
                backgroundColor: theme_1.theme.pillBackground,
                alignSelf: 'flex-start',
                alignItems: 'flex-start',
                padding: 15,
                borderRadius: 4,
                border: '1px solid ' + theme_1.theme.pillBorderDark,
                width: '100%',
            },
            style,
        ])}>
      <view_1.View style={{
            marginBottom: primaryAction ? 10 : 0,
            lineHeight: 1.5,
            gap: 10,
        }}>
        {children}
      </view_1.View>
      {primaryAction || null}
    </view_1.View>);
};
exports.Setting = Setting;
var AdvancedToggle = function (_a) {
    var _b;
    var children = _a.children;
    var location = (0, react_router_1.useLocation)();
    var _c = (0, react_1.useState)(location.hash === '#advanced'), expanded = _c[0], setExpanded = _c[1];
    return expanded ? (<view_1.View id="advanced" style={{
            gap: 20,
            alignItems: 'flex-start',
            marginBottom: 25,
            width: '100%',
        }} className={(0, css_1.css)((_b = {},
            _b["@media (min-width: ".concat(tokens_1.tokens.breakpoint_small, ")")] = {
                width: 'auto',
            },
            _b))} innerRef={function (el) {
            if (el && location.hash === '#advanced') {
                el.scrollIntoView(true);
            }
        }}>
      <view_1.View style={{ fontSize: 20, fontWeight: 500, flexShrink: 0 }}>
        <react_i18next_1.Trans>Advanced Settings</react_i18next_1.Trans>
      </view_1.View>
      {children}
    </view_1.View>) : (<Link_1.Link variant="text" onClick={function () { return setExpanded(true); }} data-testid="advanced-settings" style={{
            flexShrink: 0,
            alignSelf: 'flex-start',
            color: theme_1.theme.pageTextPositive,
            marginBottom: 25,
        }}>
      <react_i18next_1.Trans>Show advanced settings</react_i18next_1.Trans>
    </Link_1.Link>);
};
exports.AdvancedToggle = AdvancedToggle;
function Column(_a) {
    var title = _a.title, children = _a.children, style = _a.style;
    return (<view_1.View style={__assign({ alignItems: 'flex-start', flexGrow: 1, gap: '0.5em', width: '100%' }, style)}>
      <text_1.Text style={{ fontWeight: 500 }}>{title}</text_1.Text>
      <view_1.View style={{ alignItems: 'flex-start', gap: '1em' }}>{children}</view_1.View>
    </view_1.View>);
}
