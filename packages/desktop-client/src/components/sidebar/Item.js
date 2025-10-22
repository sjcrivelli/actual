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
exports.Item = Item;
// @ts-strict-ignore
var react_1 = require("react");
var block_1 = require("@actual-app/components/block");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var ItemContent_1 = require("./ItemContent");
function Item(_a) {
    var children = _a.children, Icon = _a.Icon, title = _a.title, style = _a.style, to = _a.to, onClick = _a.onClick, _b = _a.indent, indent = _b === void 0 ? 0 : _b, _c = _a.forceHover, forceHover = _c === void 0 ? false : _c, _d = _a.forceActive, forceActive = _d === void 0 ? false : _d;
    var hoverStyle = {
        backgroundColor: theme_1.theme.sidebarItemBackgroundHover,
    };
    var content = (<view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 20,
        }}>
      <Icon width={15} height={15}/>
      <block_1.Block style={{ marginLeft: 8 }}>{title}</block_1.Block>
      <view_1.View style={{ flex: 1 }}/>
    </view_1.View>);
    return (<view_1.View style={__assign({ flexShrink: 0 }, style)}>
      <ItemContent_1.ItemContent style={__assign(__assign(__assign(__assign({}, styles_1.styles.mediumText), { paddingTop: 9, paddingBottom: 9, paddingLeft: 19 + indent, paddingRight: 10, textDecoration: 'none', color: theme_1.theme.sidebarItemText }), (forceHover ? hoverStyle : {})), { ':hover': hoverStyle })} forceActive={forceActive} activeStyle={{
            borderLeft: '4px solid ' + theme_1.theme.sidebarItemTextSelected,
            paddingLeft: 19 + indent - 4,
            color: theme_1.theme.sidebarItemTextSelected,
        }} to={to} onClick={onClick}>
        {content}
      </ItemContent_1.ItemContent>
      {children ? <view_1.View style={{ marginTop: 5 }}>{children}</view_1.View> : null}
    </view_1.View>);
}
