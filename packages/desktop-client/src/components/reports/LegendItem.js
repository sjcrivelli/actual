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
exports.LegendItem = LegendItem;
var react_1 = require("react");
var text_1 = require("@actual-app/components/text");
var view_1 = require("@actual-app/components/view");
function LegendItem(_a) {
    var color = _a.color, label = _a.label, style = _a.style;
    return (<view_1.View style={__assign({ padding: 10, flexDirection: 'row', alignItems: 'center' }, style)}>
      <view_1.View style={{
            marginRight: 5,
            borderRadius: 1000,
            width: 14,
            height: 14,
            backgroundColor: color,
        }}/>
      <text_1.Text style={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            flexShrink: 0,
        }}>
        {label}
      </text_1.Text>
    </view_1.View>);
}
