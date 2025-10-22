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
exports.Container = Container;
var react_1 = require("react");
var react_virtualized_auto_sizer_1 = require("react-virtualized-auto-sizer");
var view_1 = require("@actual-app/components/view");
function Container(_a) {
    var style = _a.style, children = _a.children;
    var portalHost = (0, react_1.useRef)(null);
    return (<view_1.View style={__assign({ height: 300, position: 'relative', flexShrink: 0 }, style)}>
      <div ref={portalHost}/>
      <react_virtualized_auto_sizer_1.default>
        {function (_a) {
            var width = _a.width, height = _a.height;
            return (<div style={{ width: width, height: height }}>
            {children(width, height, portalHost.current)}
          </div>);
        }}
      </react_virtualized_auto_sizer_1.default>
    </view_1.View>);
}
