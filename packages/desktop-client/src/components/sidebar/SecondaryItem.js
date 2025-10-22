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
exports.SecondaryItem = SecondaryItem;
// @ts-strict-ignore
var react_1 = require("react");
var block_1 = require("@actual-app/components/block");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var Account_1 = require("./Account");
var ItemContent_1 = require("./ItemContent");
var fontWeight = 600;
function SecondaryItem(_a) {
    var Icon = _a.Icon, title = _a.title, style = _a.style, to = _a.to, onClick = _a.onClick, bold = _a.bold, _b = _a.indent, indent = _b === void 0 ? 0 : _b;
    var content = (<view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 16,
        }}>
      {Icon && <Icon width={12} height={12}/>}
      <block_1.Block style={{ marginLeft: Icon ? 8 : 0, color: 'inherit' }}>
        {title}
      </block_1.Block>
    </view_1.View>);
    return (<view_1.View style={__assign({ flexShrink: 0 }, style)}>
      <ItemContent_1.ItemContent style={__assign(__assign({}, Account_1.accountNameStyle), { color: theme_1.theme.sidebarItemText, paddingLeft: 14 + indent, fontWeight: bold ? fontWeight : null, ':hover': { backgroundColor: theme_1.theme.sidebarItemBackgroundHover } })} to={to} onClick={onClick} activeStyle={{
            borderLeft: '4px solid ' + theme_1.theme.sidebarItemTextSelected,
            paddingLeft: 14 - 4 + indent,
            color: theme_1.theme.sidebarItemTextSelected,
            fontWeight: bold ? fontWeight : null,
        }}>
        {content}
      </ItemContent_1.ItemContent>
    </view_1.View>);
}
