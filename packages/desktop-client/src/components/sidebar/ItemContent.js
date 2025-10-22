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
exports.ItemContent = ItemContent;
var react_1 = require("react");
var view_1 = require("@actual-app/components/view");
var Link_1 = require("@desktop-client/components/common/Link");
function ItemContent(_a) {
    var style = _a.style, to = _a.to, onClick = _a.onClick, activeStyle = _a.activeStyle, forceActive = _a.forceActive, children = _a.children;
    return onClick ? (<view_1.View role="button" tabIndex={0} style={__assign(__assign(__assign({}, style), { touchAction: 'auto', userSelect: 'none', userDrag: 'none', cursor: 'pointer' }), (forceActive ? activeStyle : {}))} onClick={onClick}>
      {children}
    </view_1.View>) : (<Link_1.Link variant="internal" to={to} style={style} activeStyle={activeStyle}>
      {children}
    </Link_1.Link>);
}
