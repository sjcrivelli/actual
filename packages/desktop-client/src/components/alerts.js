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
exports.Error = exports.Warning = exports.Information = void 0;
// @ts-strict-ignore
var react_1 = require("react");
var v1_1 = require("@actual-app/components/icons/v1");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var Alert = function (_a) {
    var Icon = _a.icon, color = _a.color, backgroundColor = _a.backgroundColor, style = _a.style, children = _a.children;
    return (<view_1.View style={__assign(__assign(__assign({ color: color, fontSize: 13 }, styles_1.styles.shadow), { borderRadius: 4, backgroundColor: backgroundColor, padding: 10, flexDirection: 'row', '& a, & a:active, & a:visited': {
                color: theme_1.theme.formLabelText,
            } }), style)}>
      <view_1.View style={{
            paddingLeft: 2,
            paddingTop: '.11em',
            alignSelf: 'stretch',
            flexShrink: 0,
            marginRight: 5,
        }}>
        <Icon width={13} style={{ marginTop: 2 }}/>
      </view_1.View>
      <text_1.Text style={{ zIndex: 1, lineHeight: 1.5 }}>{children}</text_1.Text>
    </view_1.View>);
};
var Information = function (_a) {
    var style = _a.style, children = _a.children;
    return (<Alert icon={v1_1.SvgInformationOutline} color={theme_1.theme.pageTextLight} backgroundColor="transparent" style={__assign({ boxShadow: 'none', padding: 5 }, style)}>
      {children}
    </Alert>);
};
exports.Information = Information;
var Warning = function (_a) {
    var style = _a.style, children = _a.children;
    return (<Alert icon={v1_1.SvgExclamationOutline} color={theme_1.theme.warningText} backgroundColor={theme_1.theme.warningBackground} style={style}>
      {children}
    </Alert>);
};
exports.Warning = Warning;
var Error = function (_a) {
    var style = _a.style, children = _a.children;
    return (<Alert icon={v1_1.SvgExclamationOutline} color={theme_1.theme.errorTextDarker} backgroundColor={theme_1.theme.errorBackground} style={style}>
      {children}
    </Alert>);
};
exports.Error = Error;
