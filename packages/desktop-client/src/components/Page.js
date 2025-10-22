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
exports.PageHeader = PageHeader;
exports.MobilePageHeader = MobilePageHeader;
exports.Page = Page;
var react_1 = require("react");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var HEADER_HEIGHT = 50;
function PageHeader(_a) {
    var title = _a.title, style = _a.style;
    return (<view_1.View style={__assign({ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginLeft: 20 }, style)}>
      <view_1.View style={{
            flexDirection: 'row',
            fontSize: 25,
            fontWeight: 500,
        }}>
        {typeof title === 'string' ? <text_1.Text>{title}</text_1.Text> : title}
      </view_1.View>
    </view_1.View>);
}
function MobilePageHeader(_a) {
    var title = _a.title, style = _a.style, leftContent = _a.leftContent, rightContent = _a.rightContent;
    return (<view_1.View style={__assign({ alignItems: 'center', flexDirection: 'row', flexShrink: 0, height: HEADER_HEIGHT, backgroundColor: theme_1.theme.mobileHeaderBackground, '& *': {
                color: theme_1.theme.mobileHeaderText,
            }, '& button[data-pressed]': {
                backgroundColor: theme_1.theme.mobileHeaderTextHover,
            } }, style)}>
      <view_1.View style={{
            flexBasis: '25%',
            justifyContent: 'flex-start',
            flexDirection: 'row',
        }}>
        {leftContent}
      </view_1.View>
      <view_1.View role="heading" style={{
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            flexBasis: '50%',
            fontSize: 17,
            fontWeight: 500,
            overflowY: 'auto',
        }}>
        {title}
      </view_1.View>
      <view_1.View style={{
            flexBasis: '25%',
            justifyContent: 'flex-end',
            flexDirection: 'row',
        }}>
        {rightContent}
      </view_1.View>
    </view_1.View>);
}
function Page(_a) {
    var header = _a.header, style = _a.style, padding = _a.padding, children = _a.children, footer = _a.footer;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var childrenPadding = padding != null ? padding : isNarrowWidth ? 10 : 20;
    var headerToRender = typeof header === 'string' ? (isNarrowWidth ? (<MobilePageHeader title={header}/>) : (<PageHeader title={header}/>)) : (header);
    return (<view_1.View style={__assign(__assign(__assign({}, (!isNarrowWidth && styles_1.styles.page)), { flex: 1, backgroundColor: isNarrowWidth
                ? theme_1.theme.mobilePageBackground
                : theme_1.theme.pageBackground }), style)}>
      {headerToRender}
      <view_1.View role="main" style={{
            flex: 1,
            overflowY: isNarrowWidth ? 'auto' : undefined,
            padding: "0 ".concat(childrenPadding, "px"),
        }}>
        {children}
      </view_1.View>
      {footer}
    </view_1.View>);
}
